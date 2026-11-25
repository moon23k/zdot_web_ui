import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { BookingFrame, CardPrice, CardTotal, OrderSummary, Quantity, stayCharges, won, type StayBreakdown } from "../src";

function Harness() {
  const [qty, setQty] = useState(1);
  return (
    <BookingFrame
      action="/checkout"
      bar={{ title: "물레 원데이", label: "예약하기", amount: "48,000원", unit: "1인" }}
      main={<input type="hidden" name="item" value="v1" />}
      card={
        <>
          <CardPrice amount="48,000원" unit="1인" tag="1실 남음" />
          <input type="hidden" name="slot" value="s1" />
          <Quantity name="qty" label="인원" value={qty} onChange={setQty} min={1} max={5} size="sm" />
          <button type="submit">제출</button>
        </>
      }
    />
  );
}

describe("BookingFrame 모바일 시트", () => {
  it("시트 안에서 고른 값이 예약 폼 제출에 그대로 들어간다", async () => {
    const { container } = render(<Harness />);
    const form = container.querySelector("form")!;
    expect(container.querySelectorAll("input[name=slot]")).toHaveLength(1);
    await userEvent.click(screen.getByRole("button", { name: "예약하기" }));
    const sheet = screen.getByRole("dialog");
    expect(sheet).toHaveAccessibleName("물레 원데이");
    expect(form.contains(sheet)).toBe(true);
    expect(sheet.className).toContain("ez:max-h-[calc(100dvh-2rem)]");
    expect(container.querySelector("aside[data-slot=booking-card]")).toBeNull();
    expect(sheet).toHaveTextContent("1실 남음");
    expect(sheet).not.toHaveTextContent("48,000원");
    await userEvent.click(screen.getByRole("button", { name: "인원 수량 늘리기" }));
    const data = new FormData(form);
    expect(data.getAll("slot")).toEqual(["s1"]);
    expect(data.getAll("qty")).toEqual(["2"]);
    expect(data.getAll("item")).toEqual(["v1"]);
    expect(form.contains(screen.getByRole("button", { name: "제출" }))).toBe(true);
  });

  it("막대가 없으면 시트 · 막대 없이 예약 상자만", () => {
    const { container } = render(<BookingFrame action="/checkout" main={null} card={<CardPrice amount="95,000원" unit="1박" />} />);
    expect(container.querySelector("[data-slot=booking-bar]")).toBeNull();
    expect(container.querySelector("aside[data-slot=booking-card]")).toHaveTextContent("95,000원");
  });
});

const STAY: StayBreakdown = {
  nights: 2,
  night_prices: [95000, 95000],
  room_total: 190000,
  extra_adults: 1,
  extra_children: 0,
  extra_total: 40000,
  add_ons: [],
  add_on_total: 0,
  onsite: [{ name: "바비큐 그릴", qty: 1, amount: 30000 }],
  onsite_total: 30000,
};

describe("숙박 요금 내역", () => {
  it("객실 요금 · 추가 인원 줄과 합계 아래 현장 결제", () => {
    const { rows, onsite } = stayCharges(STAY);
    expect(rows).toEqual([
      { label: "객실 요금 95,000원 × 2박", value: 190000 },
      { label: "추가 인원 성인 1명 × 2박", value: 40000 },
    ]);
    render(<CardTotal label="합계" value={won(230000)} rows={rows.map((r) => ({ label: r.label, value: won(r.value) }))} after={[{ label: "현장 결제", value: won(onsite) }]} />);
    expect(screen.getByText("객실 요금 95,000원 × 2박").nextElementSibling).toHaveTextContent("190,000원");
    expect(screen.getByText("현장 결제").nextElementSibling).toHaveTextContent("30,000원");
    expect(screen.getByText("합계").parentElement?.nextElementSibling).toHaveTextContent("현장 결제");
  });

  it("박별 요금이 다르면 박 수만, 0원 줄은 빼고 온라인 옵션은 줄로", () => {
    const { rows } = stayCharges({ ...STAY, night_prices: [100000, 150000], room_total: 250000, extra_adults: 0, extra_total: 0, add_ons: [{ name: "조식", qty: 2, amount: 30000 }], add_on_total: 30000 });
    expect(rows).toEqual([
      { label: "객실 요금 2박", value: 250000 },
      { label: "조식", value: 30000 },
    ]);
  });

  it("주문서 요약은 숙박 한 줄이면 상품 금액 대신 내역, 현장 결제는 최종 결제 금액 아래", () => {
    const quote = { items_total: 230000, product_discount: 0, coupon_discount: 0, delivery_fee: 0, region_fee: 0, shipping_discount: 0, point_used: 0, total: 230000, fulfillment: "visit", lines: [{ stay: STAY }] };
    render(<OrderSummary quote={quote} />);
    expect(screen.queryByText("상품 금액")).toBeNull();
    expect(screen.getByText("추가 인원 성인 1명 × 2박").nextElementSibling).toHaveTextContent("40,000원");
    expect(screen.getByText("최종 결제 금액").parentElement?.nextElementSibling).toHaveTextContent("현장 결제30,000원");
  });

  it("숙박이 아닌 주문서 요약은 그대로", () => {
    const quote = { items_total: 20000, product_discount: 0, coupon_discount: 0, delivery_fee: 3000, region_fee: 0, shipping_discount: 0, point_used: 0, total: 23000, fulfillment: "ship", lines: [{ stay: null }] };
    render(<OrderSummary quote={quote} />);
    expect(screen.getByText("상품 금액").nextElementSibling).toHaveTextContent("20,000원");
    expect(screen.queryByText("현장 결제")).toBeNull();
  });
});
