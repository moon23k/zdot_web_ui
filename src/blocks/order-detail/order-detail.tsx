import type { ReactNode } from "react";
import { Photo } from "../../components/photo";
import type { OrderStatus, Schemas } from "../../types";
import { cn } from "../../utils/cn";
import { kstDate, kstSchedule } from "../../utils/format";
import { focusRing } from "../../utils/styles";
import { DepositInfo } from "../parts/deposit-info";
import { LineItem, lineList } from "../parts/line-item";
import { Status } from "../parts/status";
import { SummaryRows, type SummaryRow } from "../parts/summary-rows";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "결제 대기",
  paid: "결제 완료",
  preparing: "상품 준비 중",
  shipped: "배송 중",
  delivered: "배송 완료",
  completed: "구매 확정",
  canceled: "주문 취소",
};

export type OrderAction = "pay" | "cancel" | "request_cancel" | "return" | "exchange" | "complete" | "review";

export const ORDER_ACTIONS: Record<string, OrderAction[]> = {
  pending_payment: ["pay", "cancel"],
  paid: ["cancel"],
  preparing: ["request_cancel"],
  shipped: [],
  delivered: ["return", "exchange", "complete"],
  completed: ["return", "exchange", "review"],
  canceled: [],
} satisfies Record<OrderStatus, OrderAction[]>;

export function orderActions(order: { status: string; delivered_at?: string | null }): OrderAction[] {
  const listed = ORDER_ACTIONS[order.status] ?? [];
  return order.delivered_at ? listed : listed.filter((a) => a !== "return" && a !== "exchange");
}

export type OrderItemView = Pick<
  Schemas["OrderItemOut"],
  | "id"
  | "product_name"
  | "option_label"
  | "quantity"
  | "line_total"
  | "paid_amount"
  | "refunded_amount"
  | "returned_quantity"
  | "non_returnable"
> & { inputs?: { label: string; value: string }[] | null; slot_starts_at?: string | null };

export type OrderView = Pick<
  Schemas["OrderOut"],
  | "number"
  | "status"
  | "created_at"
  | "items_total"
  | "product_discount"
  | "coupon_discount"
  | "delivery_fee"
  | "region_fee"
  | "shipping_discount"
  | "point_used"
  | "total"
  | "ship_recipient"
  | "ship_postal_code"
  | "ship_address"
  | "ship_address_detail"
> & {
  ship_phone?: string | null;
  fulfillment?: Schemas["OrderOut"]["fulfillment"];
  pickup?: Schemas["PickupOut"] | null;
  ready_at?: string | null;
  deposit?: Schemas["DepositOut"] | null;
  items: OrderItemView[];
  shipments: Pick<Schemas["ShipmentOut"], "carrier" | "carrier_name" | "tracking_no">[];
};

type Shipment = OrderView["shipments"][number];

const TRACKING: Record<string, string> = {
  CJ대한통운: "https://trace.cjlogistics.com/next/tracking.html?wblNo=",
  우체국택배: "https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1=",
  한진택배: "https://www.hanjin.com/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&schLang=KR&wblnumText2=",
  롯데택배: "https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=",
  로젠택배: "https://www.ilogen.com/web/personal/trace/",
};

export function trackingUrl(s: Shipment): string | undefined {
  const base = TRACKING[(s.carrier_name ?? s.carrier).replace(/\s/g, "")];
  return base && `${base}${s.tracking_no.replace(/\D/g, "")}`;
}

export function statusTone(status: OrderStatus): string {
  return status === "completed" || status === "canceled" ? "ez:text-muted" : "ez:text-primary";
}

type Step = OrderStatus | "ready";

export const STEPS: Record<string, [Step, string][]> = {
  ship: [
    ["paid", "결제 완료"],
    ["preparing", "상품 준비"],
    ["shipped", "배송 중"],
    ["delivered", "배송 완료"],
  ],
  pickup: [
    ["paid", "결제 완료"],
    ["preparing", "상품 준비"],
    ["ready", "픽업 준비 완료"],
    ["delivered", "수령 완료"],
  ],
  local: [
    ["paid", "결제 완료"],
    ["preparing", "상품 준비"],
    ["delivered", "배송 완료"],
  ],
};

function currentStep(order: OrderView): Step {
  return order.fulfillment === "pickup" && order.status === "preparing" && order.ready_at ? "ready" : order.status;
}

function orderLabel(order: OrderView, labels: Record<OrderStatus, string> = STATUS_LABEL): string {
  if (order.fulfillment === "pickup") {
    if (currentStep(order) === "ready") return "픽업 준비 완료";
    if (order.status === "delivered") return "수령 완료";
  }
  return labels[order.status];
}

function ShipRow({ label, end, children }: { label: string; end?: ReactNode; children: ReactNode }) {
  return (
    <div className={row}>
      <dt className="ez:text-site-small ez:text-muted">{label}</dt>
      <dd className="ez:m-0 ez:flex ez:min-w-0 ez:items-center ez:justify-between ez:gap-3 ez:py-3 ez:text-site-body ez:tabular-nums ez:text-fg">
        <span className="ez:min-w-0">{children}</span>
        {end}
      </dd>
    </div>
  );
}

const SLOT_LABEL: Record<string, string> = { pickup: "픽업 날짜 · 시간", visit: "수업 일시" };

const smallButton = "ez:inline-flex ez:h-8 ez:shrink-0 ez:items-center ez:rounded-md ez:border ez:border-solid ez:border-primary-border ez:px-3 ez:text-site-small ez:text-fg ez:no-underline ez:hover:bg-primary-tint";

const row = "ez:grid ez:min-h-13 ez:grid-cols-[calc(var(--ez-spacing)*40)_minmax(0,1fr)] ez:items-center ez:gap-x-3 ez:border-0 ez:border-b ez:border-solid ez:border-primary-border";

export function OrderDetail({
  order,
  actions,
  labels = STATUS_LABEL,
  imageSrc,
  trackingHref = trackingUrl,
}: {
  order: OrderView;
  actions?: ReactNode;
  labels?: Record<OrderStatus, string>;
  imageSrc?: Record<string, string | null>;
  trackingHref?: (shipment: Shipment) => string | undefined;
}) {
  const refunded = order.items.reduce((sum, i) => sum + i.refunded_amount, 0);
  const partial = refunded > 0 && order.status !== "canceled";
  const rows: SummaryRow[] = [
    { label: "상품 금액", value: order.items_total + order.product_discount },
    { label: "할인", value: order.product_discount + order.coupon_discount, minus: true },
    { label: "배송비", value: order.delivery_fee + order.region_fee - order.shipping_discount },
    { label: "적립금 사용", value: order.point_used, minus: true },
  ].filter((row) => row.value > 0 || row.label === "배송비");
  if (partial) rows.push({ label: "결제 금액", value: order.total, strong: true }, { label: "환불 금액", value: refunded, minus: true });
  const steps = STEPS[order.fulfillment ?? "ship"] ?? STEPS.ship;
  const step = steps.findIndex(([status]) => status === currentStep(order));
  const slotAt = order.items.find((i) => i.slot_starts_at)?.slot_starts_at;
  return (
    <article
      data-slot="order-detail"
      className="ez:grid ez:gap-5 ez:text-fg ez:lg:grid-cols-[minmax(0,1fr)_320px] ez:lg:items-start ez:lg:gap-x-10"
    >
      <div className="ez:contents ez:lg:grid ez:lg:min-w-0 ez:lg:gap-5">
        <header className="ez:grid ez:gap-0.5">
          <div className="ez:flex ez:items-baseline ez:justify-between ez:gap-3">
            <h1 className="ez:m-0 ez:font-body ez:text-site-body ez:font-normal">{kstDate(order.created_at)} 주문</h1>
            <span className={cn("ez:text-site-small", partial ? "ez:text-primary" : statusTone(order.status))}>
              {partial ? "부분 환불" : order.deposit ? "입금 대기" : orderLabel(order, labels)}
            </span>
          </div>
          <span className="ez:text-site-small ez:tabular-nums ez:text-muted">주문번호 {order.number}</span>
        </header>
        {order.deposit && <DepositInfo deposit={order.deposit} />}
        {step >= 0 && order.fulfillment !== "none" && order.fulfillment !== "visit" && (
          <ol
            aria-label="배송 단계"
            className="ez:relative ez:m-0 ez:grid ez:list-none ez:p-0"
            style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
          >
            <span
              aria-hidden="true"
              className="ez:absolute ez:top-1 ez:h-0.5 ez:bg-primary-border"
              style={{ left: `${50 / steps.length}%`, right: `${50 / steps.length}%` }}
            />
            <span
              aria-hidden="true"
              className="ez:absolute ez:top-1 ez:h-0.5 ez:bg-primary"
              style={{ left: `${50 / steps.length}%`, width: `${(step * 100) / steps.length}%` }}
            />
            {steps.map(([status, label], i) => (
              <li
                key={status}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "ez:relative ez:grid ez:justify-items-center ez:gap-1.5 ez:text-site-small",
                  i === step ? "ez:text-primary" : "ez:text-muted",
                )}
              >
                <span
                  className={cn(
                    "ez:size-2.5 ez:box-border ez:rounded-full",
                    i <= step ? "ez:bg-primary" : "ez:border-2 ez:border-solid ez:border-muted/50 ez:bg-surface",
                    i === step && "ez:shadow-[0_0_0_4px_var(--ezd-primary-tint)]",
                  )}
                />
                {label}
              </li>
            ))}
          </ol>
        )}
        <ul className={cn(lineList, "ez:border-0 ez:border-t ez:border-solid ez:border-primary-border")}>
          {order.items.map((item) => (
            <LineItem
              key={item.id}
              name={item.product_name}
              amount={<Won amount={item.line_total} />}
              media={
                imageSrc && <Photo src={imageSrc[item.id]} alt={item.product_name} sizes="56px" className="ez:w-14 ez:aspect-[4/5]" />
              }
              meta={
                <>
                  <span className="ez:text-site-small ez:text-muted">
                    {[
                      item.option_label,
                      ...(item.inputs ?? []).map((i) => `${i.label}: ${i.value}`),
                      `${item.quantity}개`,
                      item.returned_quantity > 0 && `${item.returned_quantity}개 환불`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                  {item.non_returnable && <Status icon="ban">교환·반품 불가</Status>}
                </>
              }
            />
          ))}
        </ul>
        <section aria-label="배송" className="ez:grid ez:gap-3 ez:max-lg:order-2">
          {slotAt && (
            <p className="ez:m-0 ez:text-site-small">
              <span className="ez:text-muted">{SLOT_LABEL[order.fulfillment ?? "ship"] ?? "희망 배송일"}</span> {kstSchedule(slotAt)}
            </p>
          )}
          {order.pickup && (
            <div data-slot="pickup-place" className="ez:grid ez:gap-0.5">
              <span className="ez:text-site-small ez:text-muted">픽업 장소</span>
              <span>{order.pickup.name}</span>
              <span data-script={scriptOf(order.pickup.address)} className="ez:text-site-small">{order.pickup.address}</span>
              {order.pickup.hours && <span data-script={scriptOf(order.pickup.hours)} className="ez:text-site-small ez:text-muted">{order.pickup.hours}</span>}
            </div>
          )}
          {(order.ship_address || order.shipments.length > 0) && (
            <dl data-slot="ship-rows" className="ez:m-0 ez:grid">
              {order.ship_address && (
                <>
                  {order.ship_recipient && <ShipRow label="받는 분">{order.ship_recipient}</ShipRow>}
                  {order.ship_phone && <ShipRow label="휴대폰 번호">{order.ship_phone}</ShipRow>}
                  <ShipRow label="주소">
                    {order.ship_postal_code && <span className="ez:text-muted">({order.ship_postal_code}) </span>}
                    {order.ship_address} {order.ship_address_detail ?? ""}
                  </ShipRow>
                </>
              )}
              {order.shipments.map((s) => {
                const href = trackingHref(s);
                return (
                  <ShipRow
                    key={s.tracking_no}
                    label="운송장"
                    end={
                      href && (
                        <a href={href} target="_blank" rel="noreferrer" className={cn(smallButton, focusRing)}>
                          배송 조회
                        </a>
                      )
                    }
                  >
                    {s.carrier_name ?? s.carrier} {s.tracking_no}
                  </ShipRow>
                );
              })}
            </dl>
          )}
        </section>
        {actions && <div className="ez:grid ez:gap-3 ez:max-lg:order-2">{actions}</div>}
      </div>
      <div className="ez:rounded-md ez:bg-deep ez:p-4 ez:max-lg:order-1 ez:lg:col-start-2 ez:lg:row-start-1 ez:lg:p-5">
        <SummaryRows
          rows={rows}
          total={partial ? { label: "최종 결제 금액", value: order.total - refunded } : { label: "결제 금액", value: order.total }}
        />
      </div>
    </article>
  );
}
