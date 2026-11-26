import { clsx } from "clsx";
import NextLink from "next/link";
import { ButtonLink } from "../../components/button";
import { EmptyState } from "../../components/empty-state";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { OrderStatus, Schemas } from "../../types";
import { cn } from "../../utils/cn";
import { won, kstDotDate } from "../../utils/format";
import { focusRing, numeralStep } from "../../utils/styles";
import { STATUS_LABEL } from "../order-detail/order-detail";
import { emptyAction, ReceiptIcon } from "../parts/empty-icons";
import { lineList } from "../parts/line-item";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

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

const settled = (status: OrderStatus) => status === "canceled" || status === "completed";

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
                numeralStep,
                "ez:m-0 ez:text-site-heading ez:leading-none",
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
  word = "후기",
}: {
  orders: OrderRow[];
  labels?: Record<OrderStatus, string>;
  orderHref?: (number: string) => string;
  reviewHref?: string;
  counts?: boolean;
  word?: string;
}) {
  if (!orders.length) {
    return (
      <EmptyState icon={<ReceiptIcon />} title="주문 내역이 없어요" align="start">
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
          return (
            <li key={o.number}>
              <article className="ez:grid ez:gap-6 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:p-5 ez:md:px-8 ez:md:py-7">
                <header className="ez:flex ez:items-center ez:justify-between ez:gap-4">
                  <span className="ez:flex ez:min-w-0 ez:flex-wrap ez:items-baseline ez:gap-x-4 ez:gap-y-1">
                    <span className="ez:text-site-item ez:font-normal">{kstDotDate(o.created_at)}</span>
                    <span className="ez:text-site-small ez:text-muted">주문번호 {o.number}</span>
                    <span
                      data-slot="order-state"
                      className={cn("ez:inline-flex ez:items-center ez:gap-2 ez:self-center ez:text-site-small", settled(o.status) ? "ez:text-muted" : "ez:text-fg")}
                    >
                      <span aria-hidden="true" className={cn("ez:size-1.5 ez:shrink-0 ez:rounded-full", settled(o.status) ? "ez:bg-site-off" : "ez:bg-primary")} />
                      {labels[o.status]}
                    </span>
                  </span>
                  <NextLink
                    href={href}
                    className={clsx("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1.5 ez:text-site-small ez:text-fg ez:no-underline ez:hover:text-muted", focusRing)}
                  >
                    주문 상세
                    <Icon name="next" size="sm" />
                  </NextLink>
                </header>
                <div className="ez:grid ez:grid-cols-[auto_minmax(0,1fr)] ez:items-center ez:gap-x-5 ez:gap-y-3 ez:md:grid-cols-[auto_minmax(0,1fr)_auto]">
                  <NextLink href={href} tabIndex={-1} aria-hidden="true" className="ez:block">
                    <Photo src={o.image_url} alt="" sizes="88px" className={cn("ez:w-18 ez:aspect-[4/5] ez:md:w-22", canceled && "ez:opacity-45")} />
                  </NextLink>
                  <span className="ez:grid ez:min-w-0 ez:gap-1">
                    <NextLink
                      data-script={scriptOf(o.first_item ?? o.number)}
                      href={href}
                      className={cn("ez:line-clamp-2 ez:text-site-item ez:text-fg ez:no-underline ez:hover:underline", canceled && "ez:text-muted", focusRing)}
                    >
                      {o.first_item ?? o.number}
                    </NextLink>
                    {(more > 0 || (o.quantity ?? 0) > 0) && (
                      <span className="ez:text-site-small ez:text-muted">{more > 0 ? `외 ${more}건` : `${o.quantity}개`}</span>
                    )}
                    {canceled ? (
                      <s className="ez:mt-1.5 ez:text-muted">{won(o.total)}</s>
                    ) : (
                      <span className="ez:mt-1.5 ez:font-normal"><Won amount={o.total} /></span>
                    )}
                  </span>
                  {o.status === "completed" && (
                    <span className="ez:col-span-2 ez:flex ez:justify-end ez:gap-2 ez:md:col-span-1">
                      <ButtonLink href={reviewHref} size="sm" variant="outline">
                        {word} 쓰기
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
