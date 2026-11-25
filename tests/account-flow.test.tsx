import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChipChoice, InquiryList, InquiryThread, OrderDetail, OrderList, StepList, type OrderRow, type OrderView } from "../src";

const row = (status: OrderRow["status"], number: string): OrderRow => ({
  number,
  status,
  total: 35000,
  created_at: "2026-11-24T01:00:00Z",
  first_item: "빙렬 유약 볼",
  quantity: 1,
  fulfillment: "ship",
});

describe("A1 order list", () => {
  const orders = [row("paid", "1"), row("canceled", "2"), row("completed", "3")];

  it("shows one state line per card instead of the step bar", () => {
    const { container } = render(<OrderList orders={orders} counts />);
    expect(screen.queryByRole("list", { name: "배송 단계" })).toBeNull();
    const states = [...container.querySelectorAll('[data-slot="order-state"]')];
    expect(states.map((s) => s.textContent)).toEqual(["결제 완료", "주문 취소", "구매 확정"]);
    expect(states[0].className).toContain("ez:text-fg");
    expect(states[0].querySelector("span")?.className).toContain("ez:bg-primary");
    expect(states[1].className).toContain("ez:text-muted");
    expect(states[2].querySelector("span")?.className).toContain("ez:bg-site-off");
  });

  it("draws counts in the body numerals with zero kept off", () => {
    const { container } = render(<OrderList orders={orders} counts />);
    const counts = [...container.querySelectorAll('[data-slot="order-counts"] dd')];
    expect(counts.map((d) => d.textContent)).toEqual(["1", "0", "0", "1"]);
    expect(counts[0].className).toContain("ez:text-site-heading");
    expect(counts[0].className).toContain("ez:not-italic");
    expect(counts[1].className).toContain("ez:text-site-off");
  });

  it("keeps the review link secondary", () => {
    render(<OrderList orders={orders} />);
    const link = screen.getByRole("link", { name: "후기 쓰기" });
    expect(link.className).toContain("ez:border-site-edge");
    expect(link.className).not.toContain("ez:bg-primary");
  });

  it("aligns the empty state to the start", () => {
    const { container } = render(<OrderList orders={[]} />);
    expect(container.querySelector('[data-slot="empty-state"]')?.getAttribute("data-align")).toBe("start");
  });
});

const order: OrderView = {
  number: "20261124-00016",
  status: "delivered",
  created_at: "2026-11-24T01:00:00Z",
  items_total: 32000,
  product_discount: 0,
  coupon_discount: 0,
  delivery_fee: 3000,
  region_fee: 0,
  shipping_discount: 0,
  point_used: 0,
  total: 35000,
  ship_recipient: "김민지",
  ship_phone: "01020000001",
  ship_postal_code: "06236",
  ship_address: "서울 강남구 테헤란로 152",
  ship_address_detail: null,
  fulfillment: "ship",
  items: [],
  shipments: [{ carrier: "CJ대한통운", carrier_name: "CJ대한통운", tracking_no: "640012345678" }],
};

describe("A2 order detail", () => {
  it("lists shipping facts as label and value rows", () => {
    const { container } = render(<OrderDetail order={order} />);
    const rows = [...container.querySelectorAll('[data-slot="ship-rows"] > div')];
    expect(rows.map((r) => r.querySelector("dt")?.textContent)).toEqual(["받는 분", "휴대폰 번호", "주소", "운송장"]);
    expect(rows.map((r) => r.querySelector("dd > span")?.textContent)).toEqual(["김민지", "01020000001", "(06236) 서울 강남구 테헤란로 152 ", "CJ대한통운 640012345678"]);
    expect(within(rows[3] as HTMLElement).getByRole("link", { name: "배송 조회" })).toBeTruthy();
  });

  it("drops rows without values", () => {
    const { container } = render(<OrderDetail order={{ ...order, ship_phone: null, shipments: [] }} />);
    const labels = [...container.querySelectorAll('[data-slot="ship-rows"] dt')].map((d) => d.textContent);
    expect(labels).toEqual(["받는 분", "주소"]);
  });

  it("keeps the step progress on the detail", () => {
    render(<OrderDetail order={order} />);
    expect(screen.getByRole("list", { name: "배송 단계" })).toBeTruthy();
  });
});

describe("Q1 quote form parts", () => {
  it("draws options as square cells in a five column grid", () => {
    render(<ChipChoice name="budget" label="예산" options={["상담 후 결정", "50만 원 이하"]} />);
    const group = screen.getByRole("radiogroup", { name: "예산" });
    expect(group.className).toContain("ez:md:grid-cols-5");
    const cell = group.querySelector("label")!;
    expect(cell.className).toContain("ez:rounded-button");
    expect(cell.className).toContain("ez:min-h-13");
    expect(cell.className).not.toContain("rounded-full");
  });

  it("numbers steps in body numerals and shows the value larger than the label", () => {
    const { container } = render(<StepList items={[{ label: "제품 수", value: "1~5개" }, { label: "사진 · 연락처" }]} />);
    const first = container.querySelector("li")!;
    const [head, value] = [...first.children];
    expect(head.className).toContain("ez:text-site-small");
    expect(head.firstElementChild?.className).toContain("ez:not-italic");
    expect(value.className).toContain("ez:text-site-body");
  });
});

describe("Q2 message column", () => {
  it("puts the label in its own column and the reply under the thread", () => {
    const { container } = render(
      <InquiryThread store="한컷 스튜디오" messages={[]} label="메시지" footer={<form className="ez-form" />} />,
    );
    const thread = container.querySelector('[data-slot="inquiry-thread"]')!;
    expect(thread.className).toContain("ez:md:grid-cols-[32%_minmax(0,1fr)]");
    expect(within(thread as HTMLElement).getByText("메시지")).toBeTruthy();
    expect(thread.querySelector('[data-slot="inquiry-reply"] form')).toBeTruthy();
  });

  it("keeps the plain thread without a label", () => {
    const { container } = render(<InquiryThread store="s" messages={[]} footer={<form />} />);
    expect(container.querySelector('[data-slot="inquiry-thread"]')?.className).toContain("ez:max-w-180");
    expect(container.querySelector('[data-slot="inquiry-reply"]')).toBeNull();
  });
});

describe("A3 inquiry empty state", () => {
  it("aligns to the start below the button", () => {
    const { container } = render(<InquiryList inquiries={[]} />);
    const empty = container.querySelector('[data-slot="empty-state"]')!;
    expect(empty.getAttribute("data-align")).toBe("start");
    expect(empty.className).toContain("ez:pt-10");
  });
});
