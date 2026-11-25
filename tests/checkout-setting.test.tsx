import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CheckoutSection, checkoutOf, Field, Input, RequestNote } from "../src";
import { cn } from "../src/utils/cn";
import { numeralStep } from "../src/utils/styles";
import { expectNoA11yViolations } from "./a11y";

function Before({ n, title, children, last }: { n: number; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section
      data-slot="checkout-section"
      className={cn("ez:grid ez:gap-6 ez:border-0 ez:border-solid ez:border-site-line", !last && "ez:border-b ez:pb-10 ez:lg:pb-16")}
    >
      <div className="ez:flex ez:items-center ez:justify-between ez:gap-3">
        <h2 className="ez:m-0 ez:flex ez:items-baseline ez:gap-3.5 ez:text-site-heading">
          <span className={cn(numeralStep, "ez:text-site-heading ez:leading-none ez:text-primary")}>{n}</span>
          {title}
        </h2>
        {undefined}
      </div>
      <div className="ez:grid ez:gap-6 ez:md:grid-cols-2 ez:md:pl-7">{children}</div>
    </section>
  );
}

const formData = (form: HTMLFormElement) => new FormData(form).getAll("request_note");

describe("checkoutOf", () => {
  it("fills the current form when nothing is saved", () => {
    expect(checkoutOf(null)).toEqual({ show_email: true, notes: [], note_custom: true, fold_coupon: false, button_amount: true });
  });

  it("keeps saved values and the fixed note order", () => {
    expect(checkoutOf({ notes: ["box", "door"], button_amount: false, show_email: null })).toEqual({
      show_email: true,
      notes: ["door", "box"],
      note_custom: true,
      fold_coupon: false,
      button_amount: false,
    });
  });
});

describe("CheckoutSection", () => {
  it("renders the same markup as before without fold", () => {
    for (const last of [false, true]) {
      const now = renderToStaticMarkup(
        <CheckoutSection n={3} title="쿠폰 · 적립금" last={last}>
          <Field label="주문 쿠폰">
            <Input name="x" />
          </Field>
        </CheckoutSection>,
      );
      const before = renderToStaticMarkup(
        <Before n={3} title="쿠폰 · 적립금" last={last}>
          <Field label="주문 쿠폰">
            <Input name="x" />
          </Field>
        </Before>,
      );
      expect(now).toBe(before);
    }
  });

  it("folds to the title row and opens on click", async () => {
    const { container } = render(
      <CheckoutSection n={3} title="쿠폰 · 적립금" last fold>
        <Field label="주문 쿠폰">
          <Input name="x" />
        </Field>
      </CheckoutSection>,
    );
    const details = container.querySelector("details")!;
    expect(details.open).toBe(false);
    expect(screen.getByRole("heading", { name: "3 쿠폰 · 적립금" })).toBeTruthy();
    await userEvent.click(container.querySelector("summary")!);
    expect(details.open).toBe(true);
    await expectNoA11yViolations(container);
  });
});

describe("RequestNote", () => {
  it("is the single free input when no note is on", () => {
    const now = renderToStaticMarkup(<RequestNote label="배송 요청 사항(선택)" />);
    const before = renderToStaticMarkup(
      <Field label="배송 요청 사항(선택)" wide>
        <Input name="request_note" maxLength={200} />
      </Field>,
    );
    expect(now).toBe(before);
  });

  it("renders nothing when notes and custom input are both off", () => {
    const { container } = render(<RequestNote label="배송 요청 사항(선택)" custom={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("sends the picked note text or the typed text as request_note", async () => {
    const { container } = render(
      <form>
        <RequestNote label="배송 요청 사항(선택)" notes={["door", "call"]} />
      </form>,
    );
    const form = container.querySelector("form")!;
    expect(screen.getAllByRole("radio").map((r) => (r as HTMLInputElement).value)).toEqual(["door", "call", "custom"]);
    expect(formData(form)).toEqual([]);
    await userEvent.click(screen.getByRole("radio", { name: "배송 전 연락 주세요" }));
    expect(formData(form)).toEqual(["배송 전 연락 주세요"]);
    await userEvent.click(screen.getByRole("radio", { name: "직접 입력" }));
    await userEvent.type(screen.getByRole("textbox", { name: "직접 입력" }), "벨 누르지 마세요");
    expect(formData(form)).toEqual(["벨 누르지 마세요"]);
    await expectNoA11yViolations(container);
  });

  it("has no 직접 입력 row when custom input is off", () => {
    render(<RequestNote label="배송 요청 사항(선택)" notes={["guard"]} custom={false} />);
    expect(screen.getAllByRole("radio")).toHaveLength(1);
  });
});
