import NextLink from "next/link";
import type { ReactNode } from "react";
import { Photo } from "../../components/photo";
import type { CartLineData as Line } from "../../types";
import { cn, won } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Status } from "../parts/status";

const LOW_STOCK = 5;

const stepButton = cn(
  "ez:size-11 ez:m-0 ez:p-0 ez:border-0 ez:bg-transparent ez:text-base ez:text-fg ez:cursor-pointer",
  "ez:disabled:cursor-not-allowed ez:disabled:text-muted/50",
  focusRing,
);

export function CartLine({
  line,
  updateAction,
  removeAction,
  selector,
}: {
  line: Line;
  updateAction: (data: FormData) => void | Promise<void>;
  removeAction: (data: FormData) => void | Promise<void>;
  selector?: ReactNode;
}) {
  const available = line.sellable && line.enough_stock;
  const listTotal = line.list_price * line.quantity;
  const discount = listTotal > line.line_total ? Math.floor(((listTotal - line.line_total) / listTotal) * 100) : 0;
  return (
    <li
      data-slot="cart-line"
      data-available={available || undefined}
      className="ez:flex ez:gap-4 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:py-7 ez:lg:gap-6"
    >
      {selector}
      <NextLink
        href={`/products/${line.product_id}`}
        tabIndex={-1}
        aria-hidden="true"
        className={cn("ez:w-20 ez:shrink-0 ez:lg:w-30", focusRing, !available && "ez:opacity-45")}
      >
        <Photo src={line.image_url} alt={line.name} sizes="120px" className="ez:aspect-[4/5]" />
      </NextLink>
      <div className="ez:flex ez:min-w-0 ez:flex-1 ez:flex-col">
        <div className="ez:flex ez:items-start ez:gap-1">
          <NextLink
            href={`/products/${line.product_id}`}
            className={cn(
              "ez:flex-1 ez:text-site-item ez:font-normal ez:no-underline ez:hover:underline ez:underline-offset-4",
              available ? "ez:text-fg" : "ez:text-muted",
            )}
          >
            {line.name}
          </NextLink>
          {available && (
            <form action={removeAction}>
              <input type="hidden" name="variant_id" value={line.variant_id} />
              <button
                type="submit"
                aria-label={`${line.name} 삭제`}
                className={cn("ez:-my-[11px] ez:-mr-3.5 ez:flex ez:size-11 ez:items-center ez:justify-center ez:border-0 ez:bg-transparent ez:p-0 ez:text-muted ez:cursor-pointer", focusRing)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </form>
          )}
        </div>
        <div className="ez:mt-1.5 ez:flex ez:items-baseline ez:justify-between ez:gap-2 ez:text-site-small ez:whitespace-nowrap">
          {!line.sellable ? (
            <Status icon="alert" tone="danger">판매 중지</Status>
          ) : !line.enough_stock ? (
            <Status icon="alert" tone="danger">재고 부족</Status>
          ) : line.stock_left != null && line.stock_left <= LOW_STOCK ? (
            <Status icon="alert" tone="danger">{`${line.stock_left}개 남음`}</Status>
          ) : (
            <span className="ez:truncate ez:text-muted">{line.option_label}</span>
          )}
          {discount > 0 && available && (
            <span className="ez:flex ez:items-baseline ez:gap-1.5">
              <span className="ez:font-medium ez:text-primary">{discount}%</span>
              <s className="ez:tabular-nums ez:text-muted">
                <span className="ez:sr-only">정가 </span>
                {won(listTotal)}
              </s>
            </span>
          )}
        </div>
        <div className="ez:mt-auto ez:flex ez:items-center ez:justify-between ez:pt-4">
          {available ? (
            <form action={updateAction} className="ez:inline-flex ez:h-11 ez:items-center ez:rounded-full ez:border ez:border-solid ez:border-site-line">
              <input type="hidden" name="variant_id" value={line.variant_id} />
              <button type="submit" name="quantity" value={line.quantity - 1} disabled={line.quantity <= 1} aria-label={`${line.name} 수량 줄이기`} className={stepButton}>
                −
              </button>
              <span
                aria-label={`수량 ${line.quantity}개`}
                className={cn("ez:w-7 ez:text-center ez:font-medium ez:tabular-nums", line.enough_stock ? "ez:text-fg" : "ez:text-danger")}
              >
                {line.quantity}
              </span>
              <button type="submit" name="quantity" value={line.quantity + 1} disabled={!available} aria-label={`${line.name} 수량 늘리기`} className={stepButton}>
                +
              </button>
            </form>
          ) : (
            <span className="ez:text-site-small ez:tabular-nums ez:text-muted">{line.quantity}개</span>
          )}
          <strong className={cn("ez:text-site-item ez:font-medium ez:tabular-nums", available ? "ez:text-fg" : "ez:text-muted")}>
            {discount > 0 && available && <span className="ez:sr-only">할인가 </span>}
            {won(line.line_total)}
          </strong>
        </div>
      </div>
    </li>
  );
}
