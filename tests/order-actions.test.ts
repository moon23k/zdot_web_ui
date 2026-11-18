import { describe, expect, it } from "vitest";
import { ORDER_ACTIONS, orderActions } from "../src";

const delivered_at = "2026-11-10T03:00:00Z";

describe("ORDER_ACTIONS는 ZDOT_API 주문 규칙을 손으로 옮긴 표다", () => {
  it.each([
    ["pending_payment", ["pay", "cancel"], "결제 대기: cancel_unpaid"],
    ["paid", ["cancel"], "결제 완료: cancel_paid(allowed=PAID)"],
    ["preparing", ["request_cancel"], "상품 준비 중: claims.CANCELABLE, cancel_paid는 PAID만"],
    ["shipped", [], "배송 중: claims.RETURNABLE 밖, status.TRANSITIONS[SHIPPED]에 COMPLETED 없음"],
    ["delivered", ["return", "exchange", "complete"], "배송 완료: claims.RETURNABLE, DELIVERED → COMPLETED"],
    ["completed", ["return", "exchange", "review"], "구매 확정: claims.RETURNABLE, review.create는 COMPLETED만"],
    ["canceled", [], "주문 취소"],
  ])("%s → %j (%s)", (status, expected) => {
    expect(ORDER_ACTIONS[status]).toEqual(expected);
    expect(orderActions({ status, delivered_at })).toEqual(expected);
  });

  it("배송 완료 시각이 없는 주문은 반품 · 교환을 띄우지 않는다(claims._check_window delivered_at 검사)", () => {
    expect(orderActions({ status: "completed", delivered_at: null })).toEqual(["review"]);
    expect(orderActions({ status: "delivered" })).toEqual(["complete"]);
  });

  it("모르는 상태는 버튼이 없다", () => {
    expect(orderActions({ status: "unknown", delivered_at })).toEqual([]);
  });
});
