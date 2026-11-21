import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "./a11y";
import { AccountShell, AddressForm, BuyBox, Button, Calendar, CartView, Checkbox, ClaimForm, Dialog, Field, OrderSummary, PhotoAttach, Quantity, resolveTemplate, ReviewForm, reviewWord, Select, SiteRenderer, type ProductDetail } from "../src";


const product: ProductDetail = {
  id: "p1",
  name: "린넨 셔츠",
  list_price: 58000,
  sale_price: 52000,
  cover_url: null,
  sold_out: false,
  sample: false,
  slot_scope: "none",
  option_name: "사이즈",
  variants: [
    { id: "v1", label: "S", price: 42000, in_stock: true, arrivals: 1 },
    { id: "v2", label: "M", price: 52000, in_stock: true, arrivals: 1 },
    { id: "v3", label: "L", price: 68000, in_stock: false, arrivals: 0 },
  ],
  images: [],
};

describe("Quantity", () => {
  it("stays within min and max", async () => {
    const { container } = render(<Quantity min={1} max={3} />);
    const plus = screen.getByRole("button", { name: "수량 늘리기" });
    for (let i = 0; i < 5; i++) await userEvent.click(plus);
    expect(screen.getByLabelText("수량")).toHaveValue("3");
    expect(plus).toBeDisabled();
    expect(screen.getByRole("button", { name: "수량 줄이기" })).toBeEnabled();
    await expectNoA11yViolations(container);
  });
});

describe("Checkbox", () => {
  it("toggles from its label", async () => {
    const { container } = render(<Checkbox name="agree" label="주문 내용을 확인했어요" />);
    await userEvent.click(screen.getByText("주문 내용을 확인했어요"));
    expect(screen.getByRole("checkbox")).toBeChecked();
    await expectNoA11yViolations(container);
  });
});

describe("Select", () => {
  it("is named by its field label and changes value", async () => {
    const { container } = render(
      <Field label="상태">
        <Select name="status" defaultValue="all">
          <option value="all">전체</option>
          <option value="past_due">연체</option>
        </Select>
      </Field>,
    );
    const select = screen.getByRole("combobox", { name: "상태" });
    await userEvent.selectOptions(select, "past_due");
    expect(select).toHaveProperty("value", "past_due");
    await expectNoA11yViolations(container);
  });
});

describe("Dialog", () => {
  function Harness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>주문 취소</Button>
        <Dialog open={open} title="주문을 취소할까요?" onOpenChange={setOpen} />
      </>
    );
  }

  it("opens with its title and closes on Escape", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "주문 취소" }));
    expect(screen.getByRole("dialog")).toHaveAccessibleName("주문을 취소할까요?");
    await expectNoA11yViolations(document.body);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("BuyBox", () => {
  it("updates the total for the chosen option and opens the sheet after adding", async () => {
    const { container } = render(<BuyBox product={product} addAction={async () => ({ ok: true, message: "담았어요" })} />);
    await userEvent.click(screen.getByLabelText(/^M/));
    expect(screen.getByText("부터").parentElement).toHaveTextContent("42,000원 부터");
    expect(screen.queryByText(/%$/)).toBeNull();
    expect(screen.getByText("총 상품 금액").parentElement?.querySelector("strong")).toHaveTextContent("52,000원");
    expect(screen.getByRole("link", { name: "바로 구매" })).toHaveAttribute("href", "/checkout?item=v2&qty=1");
    await expectNoA11yViolations(container);
    await userEvent.click(screen.getByRole("button", { name: "장바구니" }));
    expect(await screen.findByRole("dialog", { name: "장바구니에 담았어요" })).toBeInTheDocument();
  });

  it("shows a sample product without any way to buy", () => {
    render(<BuyBox product={{ ...product, sample: true }} addAction={async () => ({})} />);
    expect(screen.getByText("예시")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "예시 상품은 구매할 수 없어요" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "장바구니" })).toBeNull();
    expect(screen.queryByText("바로 구매")).toBeNull();
  });

  it("offers only a restock alert when sold out", () => {
    render(<BuyBox product={{ ...product, sold_out: true }} addAction={async () => ({})} restockAction={async () => {}} />);
    expect(screen.getByRole("button", { name: "재입고 알림" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "장바구니" })).toBeNull();
    expect(screen.queryByText("바로 구매")).toBeNull();
  });
});

describe("AddressForm", () => {
  it("fills the postal code from the (mock) search", async () => {
    const { container } = render(<AddressForm mock />);
    await userEvent.click(screen.getByRole("button", { name: "주소 검색" }));
    const group = within(container);
    expect(group.getByRole("textbox", { name: "주소" })).toHaveValue("(06236) 서울 강남구 테헤란로 152");
    expect(container.querySelector<HTMLInputElement>('input[name="postal_code"]')?.value).toBe("06236");
    await expectNoA11yViolations(container);
  });
});

describe("CartView", () => {
  const base = { product_id: "p", option_label: null, image_url: null, list_price: 10000, sellable: true, enough_stock: true, inputs: [] };
  const lines = [
    { ...base, variant_id: "a", name: "머그컵", unit_price: 10000, quantity: 1, line_total: 10000 },
    { ...base, variant_id: "b", name: "쿠션", unit_price: 20000, quantity: 1, line_total: 20000 },
    { ...base, variant_id: "c", name: "액자", unit_price: 30000, quantity: 2, line_total: 60000, enough_stock: false, inputs: [] },
  ];
  const noop = async () => {};

  it("leaves out lines that cannot be bought and follows the selection", async () => {
    render(<CartView lines={lines} updateAction={noop} removeAction={noop} />);
    const order = screen.getByRole("link", { name: "주문하기" });
    expect(order).toHaveAttribute("href", "/checkout?items=a,b");
    expect(screen.getByText("2/2")).toBeInTheDocument();
    expect(screen.getByText("합계").nextElementSibling).toHaveTextContent("30,000원");
    expect(screen.getByText("구매할 수 없는 상품 1개")).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "액자 선택" })).toBeNull();
    expect(screen.getByRole("button", { name: "모두 삭제" })).toBeEnabled();
    await userEvent.click(screen.getByRole("checkbox", { name: "머그컵 선택" }));
    expect(screen.getByRole("link", { name: "주문하기" })).toHaveAttribute("href", "/checkout?items=b");
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "액자 수량 늘리기" })).toBeNull();
  });
});

describe("OrderSummary", () => {
  it("adds up from the list-price sum to the total", () => {
    const quote = { items_total: 136000, product_discount: 6000, coupon_discount: 5000, delivery_fee: 3500, region_fee: 3000, shipping_discount: 0, point_used: 1000, total: 136500 };
    render(<OrderSummary quote={quote} />);
    expect(screen.getByText("상품 금액").nextElementSibling).toHaveTextContent("142,000원");
    expect(142000 - 6000 - 5000 + 3500 + 3000 - 1000).toBe(quote.total);
  });
});

describe("ReviewForm", () => {
  it("starts with no rating and waits for one", async () => {
    const { container } = render(<ReviewForm orderItemId="i1" productName="머그컵" action={async () => ({})} />);
    for (const n of [1, 2, 3, 4, 5]) expect(screen.getByRole("radio", { name: `${n}점` })).not.toBeChecked();
    await userEvent.type(screen.getByRole("textbox", { name: "후기" }), "향이 좋아요");
    expect(screen.getByRole("button", { name: "후기 등록" })).toBeDisabled();
    await userEvent.click(screen.getByRole("radio", { name: "4점" }));
    expect(screen.getByRole("button", { name: "후기 등록" })).toBeEnabled();
    await expectNoA11yViolations(container);
  });
});

describe("review word", () => {
  it("uses 리뷰 for shops and 후기 elsewhere, in the menu and the form", async () => {
    expect([reviewWord("shop"), reviewWord("stay"), reviewWord("class"), reviewWord("quote"), reviewWord(undefined)]).toEqual(["리뷰", "후기", "후기", "후기", "후기"]);
    render(
      <AccountShell current="/me/reviews" main="shop">
        <ReviewForm orderItemId="i1" productName="머그컵" word={reviewWord("shop")} action={async () => ({})} />
      </AccountShell>,
    );
    expect(screen.getByRole("link", { name: "리뷰" })).toHaveAttribute("href", "/me/reviews");
    expect(screen.getByRole("textbox", { name: "리뷰" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "리뷰 등록" })).toBeInTheDocument();
    expect(screen.queryByText(/후기/)).toBeNull();
  });
});

describe("PhotoAttach", () => {
  it("opens the picker from a labelled button and removes a picked photo", async () => {
    const picked: File[][] = [];
    function Example() {
      const [photos, setPhotos] = useState([{ key: "a", src: "/a.jpg" }]);
      return <PhotoAttach count={photos.length} max={3} previews={photos} onPick={(files) => picked.push(files)} onRemove={(key) => setPhotos((list) => list.filter((p) => p.key !== key))} />;
    }
    const { container } = render(<Example />);
    expect(container.querySelector("img")).toHaveAttribute("src", "/a.jpg");
    const input = screen.getByLabelText(/사진 첨부/);
    expect(input).toHaveAttribute("type", "file");
    await userEvent.upload(input, new File(["x"], "a.png", { type: "image/png" }));
    expect(picked[0]?.[0]?.name).toBe("a.png");
    await expectNoA11yViolations(container);
    await userEvent.click(screen.getByRole("button", { name: "사진 1 지우기" }));
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByLabelText(/사진 첨부/).closest("label")).toHaveTextContent("0/3");
  });
});

describe("ClaimForm", () => {
  const item = { option_label: null, line_total: 0, paid_amount: 0, refunded_amount: 0 };
  const items = [
    { ...item, id: "t", product_name: "머그컵", quantity: 2, returned_quantity: 1, non_returnable: false },
    { ...item, id: "r", product_name: "린넨 셔츠", quantity: 1, returned_quantity: 0, non_returnable: true },
  ];

  it("locks non-returnable items unless the seller is at fault", async () => {
    render(<ClaimForm kind="return" items={items} action={async () => ({})} />);
    expect(screen.getByText(/반품 가능 1개/)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /린넨 셔츠/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "반품 신청" })).toBeDisabled();
    await userEvent.click(screen.getByRole("radio", { name: /상품 문제/ }));
    expect(screen.getByRole("checkbox", { name: /린넨 셔츠/ })).toBeEnabled();
  });

  it("shows the server refund preview with the refund total and returned points apart", async () => {
    const vase = { ...item, id: "v", product_name: "꽃병", quantity: 3, returned_quantity: 1, paid_amount: 10000, refunded_amount: 3333, non_returnable: false };
    const preview = vi.fn(async ({ fault }: { fault: string }) =>
      fault === "customer"
        ? { item_amount: 6667, delivery_fee: 0, withheld_back: 0, return_fee: 3000, coupon_clawback: 1000, shipping_charge: 0, cash: 2667, points: 500, point_clawback: 0 }
        : { item_amount: 6667, delivery_fee: 0, withheld_back: 0, return_fee: 0, coupon_clawback: 0, shipping_charge: 0, cash: 6667, points: 0, point_clawback: 0 },
    );
    render(<ClaimForm kind="return" items={[vase]} preview={preview} action={async () => ({})} />);
    await userEvent.click(screen.getByRole("radio", { name: "단순 변심" }));
    await userEvent.click(screen.getByRole("checkbox", { name: /꽃병/ }));
    const total = await screen.findByText("환불 예정 금액");
    expect(preview).toHaveBeenLastCalledWith({ kind: "return", fault: "customer", items: [{ order_item_id: "v", quantity: 2 }] });
    const summary = total.closest("dl") as HTMLElement;
    expect(within(summary).getByText("6,667원")).toBeInTheDocument();
    expect(within(summary).getByText("− 3,000원")).toBeInTheDocument();
    expect(within(summary).getByText("− 1,000원")).toBeInTheDocument();
    expect(within(summary).getByText("2,667원")).toBeInTheDocument();
    expect(within(summary).queryByText("최초 배송비")).toBeNull();
    expect(screen.getByText("적립금 복원").closest("dl")).not.toBe(summary);
    await userEvent.click(screen.getByRole("radio", { name: /상품 문제/ }));
    await screen.findByText("환불 예정 금액");
    expect(preview).toHaveBeenLastCalledWith({ kind: "return", fault: "seller", items: [{ order_item_id: "v", quantity: 2 }] });
    expect(screen.queryByText(/반품 배송비/)).toBeNull();
    expect(screen.queryByText("적립금 복원")).toBeNull();
  });

  it("hides the amounts but keeps the request open when the preview fails", async () => {
    const one = { ...item, id: "o", product_name: "접시", quantity: 1, returned_quantity: 0, paid_amount: 5000, non_returnable: false };
    const preview = vi.fn(async () => null);
    render(<ClaimForm kind="return" items={[one]} preview={preview} action={async () => ({})} />);
    await userEvent.click(screen.getByRole("radio", { name: "단순 변심" }));
    await userEvent.click(screen.getByRole("checkbox", { name: /접시/ }));
    await userEvent.type(screen.getByRole("textbox"), "마음이 바뀌었어요");
    await waitFor(() => expect(preview).toHaveBeenCalledTimes(1));
    expect(screen.queryByText("환불 예정 금액")).toBeNull();
    expect(screen.getByRole("button", { name: "반품 신청" })).toBeEnabled();
  });
});

describe("Calendar", () => {
  const days = ["2026-11-06", "2026-11-07", "2026-11-08", "2026-11-09", "2026-11-10"].map((date, i) => ({
    date,
    label: "12만",
    disabled: i === 2,
  }));

  it("picks a range only across open nights and posts both dates", async () => {
    const { container } = render(<Calendar days={days} mode="range" />);
    await userEvent.click(screen.getByRole("button", { name: /11월 6일/ }));
    await userEvent.click(screen.getByRole("button", { name: /11월 8일/ }));
    expect(screen.getByText("11월 6일 ~ 11월 8일 · 2박")).toBeTruthy();
    expect((container.querySelector("input[name=out]") as HTMLInputElement).value).toBe("2026-11-08");
    await userEvent.click(screen.getByRole("button", { name: /11월 9일/ }));
    expect((container.querySelector("input[name=in]") as HTMLInputElement).value).toBe("2026-11-09");
    expect((screen.getByRole("button", { name: /11월 8일/ }) as HTMLButtonElement).disabled).toBe(true);
    await expectNoA11yViolations(container);
  });
});

describe("SiteRenderer", () => {
  const context = { products: [], categories: [], faqs: [{ id: "f1", question: "주차되나요?", answer: "네" }], shipping: null };
  const sections = [
    { kind: "process_steps", data: { steps: ["문의", "작업"] } },
    { kind: "price_tiers", data: { items: [{ label: "기본", value: "10만원" }] } },
  ];
  const headings = () => screen.getAllByRole("heading").map((h) => h.textContent);

  it("follows the template order unless the partner arranged the page", () => {
    const template = resolveTemplate("quote", "a");
    const { unmount } = render(<SiteRenderer page={{ sections }} context={context} template={template} />);
    expect(headings()).toEqual(["작업", "서비스", "진행 과정", "후기", "자주 묻는 질문"]);
    unmount();
    render(<SiteRenderer page={{ sections, arranged: true }} context={context} template={template} />);
    expect(headings()).toEqual(["진행 과정", "서비스"]);
  });

  it("draws nothing for removed section kinds left in a saved page", () => {
    const removed = [
      { kind: "notice_bar", data: { text: "오늘 휴무" } },
      { kind: "free_shipping_bar", when: "conditional_free_shipping", data: {} },
      { kind: "maker_profile", data: { line: "만드는 사람 한 줄" } },
      { kind: "next_session", data: { session: { id: "s1", date: "5/1", time: "10:00", name: "다음 수업 이름", status: "open" } } },
      { kind: "spec_icons", data: { items: ["침실 3"] } },
      { kind: "review_keywords", data: {} },
    ];
    const shipping = { base_fee: 3000, free_threshold: 50000, return_fee: 3000, exchange_fee: 6000, return_days: 7 };
    for (const template of [resolveTemplate("shop", "a"), resolveTemplate("class", "a"), resolveTemplate("stay", "a")]) {
      for (const arranged of [false, true]) {
        const { container, unmount } = render(<SiteRenderer page={{ sections: [...removed, ...sections], arranged }} context={{ ...context, shipping }} template={template} />);
        expect(container.querySelector('[data-slot="notice-bar"], [data-slot="free-shipping-bar"], [data-slot="maker"], [data-slot="next-session"], [data-slot="spec-icons"]')).toBeNull();
        for (const text of ["오늘 휴무", "만드는 사람 한 줄", "다음 수업 이름", "침실 3"]) expect(container.textContent).not.toContain(text);
        unmount();
      }
    }
  });
});
