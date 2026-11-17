import { clsx } from "clsx";
import NextLink from "next/link";
import { ButtonLink } from "../../components/button";
import { EmptyState } from "../../components/empty-state";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { OrderStatus, Schemas } from "../../types";
import { cn, won } from "../../utils/cn";
import { figure, focusRing, pointTag } from "../../utils/styles";
import { STATUS_LABEL, STEPS } from "../order-detail/order-detail";
import { emptyAction, ReceiptIcon } from "../parts/empty-icons";
import { lineList } from "../parts/line-item";

export type OrderRow = {
  number: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  first_item?: string | null;
  item_count?: number;
  quantity?: number;
  image_url?: string | null;
  fulfillment?: Schemas["Fulfillment"];
};

const TRACKED = new Set(["ship", "local"]);

const COUNTS: { label: string; statuses: OrderStatus[]; active: boolean }[] = [
  { label: "결제 완료", statuses: ["paid"], active: true },
  { label: "상품 준비", statuses: ["preparing"], active: true },
  { label: "배송 중", statuses: ["shipped"], active: true },
  { label: "배송 완료", statuses: ["delivered", "completed"], active: false },
];

const tracked = (o: OrderRow) => TRACKED.has(o.fulfillment ?? "ship");

const dotDate = (value: string) => {
  const parts = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(
    new Date(value),
  );
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}.${part("month")}.${part("day")}`;
};

function progress(o: OrderRow) {
  if (!tracked(o)) return null;
  const steps = STEPS[o.fulfillment ?? "ship"] ?? STEPS.ship;
  const at = steps.findIndex(([status]) => status === (o.status === "completed" ? "delivered" : o.status));
  return at < 0 ? null : { steps, at };
}

function Counts({ orders }: { orders: OrderRow[] }) {
  const rows = orders.filter(tracked);
  return (
    <dl data-slot="order-counts" className="ez:m-0 ez:grid ez:grid-cols-4 ez:border-0 ez:border-y ez:border-solid ez:border-site-line">
      {COUNTS.map((c, i) => {
        const n = rows.filter((o) => c.statuses.includes(o.status)).length;
        return (
          <div
            key={c.label}
            className={cn(
              "ez:flex ez:min-w-0 ez:flex-col-reverse ez:justify-end ez:gap-1.5 ez:py-5 ez:pl-3 ez:lg:py-6 ez:lg:pl-6",
              i > 0 && "ez:border-0 ez:border-l ez:border-solid ez:border-site-line",
            )}
          >
            <dt className="ez:text-site-small ez:text-muted">{c.label}</dt>
            <dd
              className={cn(
                figure,
                "ez:m-0 ez:text-site-section ez:leading-none ez:lg:text-site-page",
                n === 0 ? "ez:text-site-off" : c.active ? "ez:text-primary" : "ez:text-fg",
              )}
            >
              {n}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function OrderList({
  orders,
  labels = STATUS_LABEL,
  orderHref = (number) => `/orders/${number}`,
  reviewHref = "/me/reviews",
  counts = false,
}: {
  orders: OrderRow[];
  labels?: Record<OrderStatus, string>;
  orderHref?: (number: string) => string;
  reviewHref?: string;
  counts?: boolean;
}) {
  if (!orders.length) {
    return (
      <EmptyState icon={<ReceiptIcon />} title="주문 내역이 없어요">
        <ButtonLink href="/products" variant="outline" className={emptyAction}>
          쇼핑하기
        </ButtonLink>
      </EmptyState>
    );
  }
  return (
    <div data-slot="order-list" className="ez:grid ez:gap-10 ez:text-fg ez:lg:gap-14">
      {counts && orders.some(tracked) && <Counts orders={orders} />}
      <ul className={cn(lineList, "ez:grid ez:gap-5")}>
        {orders.map((o) => {
          const canceled = o.status === "canceled";
          const more = (o.item_count ?? 1) - 1;
          const href = orderHref(o.number);
          const bar = progress(o);
          return (
            <li key={o.number}>
              <article className="ez:grid ez:gap-6 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:p-5 ez:md:px-8 ez:md:py-7">
                <header className="ez:flex ez:items-center ez:justify-between ez:gap-4">
                  <span className="ez:flex ez:min-w-0 ez:flex-wrap ez:items-baseline ez:gap-x-4 ez:gap-y-1">
                    <span className="ez:text-site-item ez:font-medium ez:tabular-nums">{dotDate(o.created_at)}</span>
                    <span className="ez:text-site-small ez:tabular-nums ez:text-muted">주문번호 {o.number}</span>
                    {!bar && (
                      <span className={canceled || o.status === "completed" ? "ez:text-site-caption ez:text-muted" : pointTag}>{labels[o.status]}</span>
                    )}
                  </span>
                  <NextLink
                    href={href}
                    className={clsx("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1.5 ez:text-site-small ez:text-fg ez:no-underline ez:hover:text-muted", focusRing)}
                  >
                    주문 상세
                    <Icon name="next" size="sm" />
                  </NextLink>
                </header>
                {bar && (
                  <ol aria-label="배송 단계" className={cn("ez:m-0 ez:grid ez:list-none ez:gap-1 ez:p-0", bar.steps.length === 3 ? "ez:grid-cols-3" : "ez:grid-cols-4")}>
                    {bar.steps.map(([status, label], i) => (
                      <li
                        key={status}
                        aria-current={i === bar.at ? "step" : undefined}
                        className={clsx(
                          "ez:grid ez:gap-2.5 ez:text-site-small",
                          i === bar.at ? "ez:font-medium ez:text-primary" : i < bar.at ? "ez:text-fg" : "ez:text-muted",
                        )}
                      >
                        <span aria-hidden="true" className={cn("ez:block ez:h-0.5", i <= bar.at ? "ez:bg-primary" : "ez:bg-site-line")} />
                        {label}
                      </li>
                    ))}
                  </ol>
                )}
                <div className="ez:grid ez:grid-cols-[auto_minmax(0,1fr)] ez:items-center ez:gap-x-5 ez:gap-y-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-6 ez:md:grid-cols-[auto_minmax(0,1fr)_auto]">
                  <NextLink href={href} tabIndex={-1} aria-hidden="true" className="ez:block">
                    <Photo src={o.image_url} alt="" sizes="88px" className={cn("ez:w-18 ez:aspect-[4/5] ez:md:w-22", canceled && "ez:opacity-45")} />
                  </NextLink>
                  <span className="ez:grid ez:min-w-0 ez:gap-1">
                    <NextLink
                      href={href}
                      className={cn("ez:line-clamp-2 ez:text-site-item ez:text-fg ez:no-underline ez:hover:underline", canceled && "ez:text-muted", focusRing)}
                    >
                      {o.first_item ?? o.number}
                    </NextLink>
                    {(more > 0 || (o.quantity ?? 0) > 0) && (
                      <span className="ez:text-site-small ez:text-muted">{more > 0 ? `외 ${more}건` : `${o.quantity}개`}</span>
                    )}
                    {canceled ? (
                      <s className="ez:mt-1.5 ez:tabular-nums ez:text-muted">{won(o.total)}</s>
                    ) : (
                      <span className="ez:mt-1.5 ez:font-medium ez:tabular-nums">{won(o.total)}</span>
                    )}
                  </span>
                  {o.status === "completed" && (
                    <span className="ez:col-span-2 ez:flex ez:justify-end ez:gap-2 ez:md:col-span-1">
                      <ButtonLink href={reviewHref} size="sm">
                        후기 쓰기
                      </ButtonLink>
                    </span>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
