import type { Quote } from "../../types";
import { SummaryRows, type SummaryRow } from "../parts/summary-rows";

const NO_DELIVERY = new Set(["visit"]);

export function OrderSummary({ quote }: { quote: Quote & { fulfillment?: string | null } }) {
  const shipped = !NO_DELIVERY.has(quote.fulfillment ?? "");
  const rows: SummaryRow[] = [
    { label: "상품 금액", value: quote.items_total + quote.product_discount },
    { label: "상품 할인", value: quote.product_discount, minus: true },
    { label: "쿠폰 할인", value: quote.coupon_discount, minus: true },
    { label: "배송비", value: quote.delivery_fee },
    { label: "지역 추가 배송비", value: quote.region_fee },
    { label: "배송비 할인", value: quote.shipping_discount, minus: true },
    { label: "적립금 사용", value: quote.point_used, minus: true },
  ];
  return (
    <SummaryRows
      rows={rows.filter((row) => Number(row.value) > 0 || (shipped && row.label === "배송비"))}
      total={{ label: "최종 결제 금액", value: quote.total }}
    />
  );
}
