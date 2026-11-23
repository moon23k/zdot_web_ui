import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PayWidget, payOf, type PayRequest } from "../src";

const request: PayRequest = {
  clientKey: "test_ck",
  orderId: "20261123-00001",
  orderName: "린넨 셔츠 외 1건",
  amount: 136500,
  successUrl: "/checkout/result?order=20261123-00001",
  failUrl: "/checkout/result?order=20261123-00001&fail=1",
};

describe("payOf", () => {
  it("fills the current pay page when nothing is saved", () => {
    expect(payOf(null)).toEqual({ show_summary: true, button_amount: true });
    expect(payOf({ show_summary: null, button_amount: null })).toEqual({ show_summary: true, button_amount: true });
  });

  it("keeps saved values", () => {
    expect(payOf({ show_summary: false })).toEqual({ show_summary: false, button_amount: true });
    expect(payOf({ button_amount: false })).toEqual({ show_summary: true, button_amount: false });
  });

  it("keeps the summary when the pay button hides the amount", () => {
    expect(payOf({ show_summary: false, button_amount: false })).toEqual({ show_summary: true, button_amount: false });
  });
});

describe("PayWidget button", () => {
  it("renders the same markup as before when the amount is shown", () => {
    const before = renderToStaticMarkup(<PayWidget mock request={request} />);
    expect(renderToStaticMarkup(<PayWidget mock request={request} buttonAmount />)).toBe(before);
    expect(before).toContain(">136,500원 결제하기</button>");
  });

  it("hides the amount on the pay button", () => {
    render(<PayWidget mock request={request} buttonAmount={false} />);
    expect(screen.getByRole("button", { name: "결제하기" })).toBeTruthy();
    expect(screen.queryByText(/136,500원/)).toBeNull();
    expect(screen.getByRole("button", { name: "가상계좌로 결제(테스트)" })).toBeTruthy();
  });
});
