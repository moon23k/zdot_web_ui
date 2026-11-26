"use client";

import NextLink from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { Badge } from "../../components/badge";
import { Button, ButtonLink } from "../../components/button";
import { Photo } from "../../components/photo";
import { Quantity } from "../../components/quantity";
import { Sheet } from "../../components/sheet";
import type { FormAction, FormState, ProductDetail } from "../../types";
import { StarRow } from "../../components/star-row";
import { cn } from "../../utils/cn";
import { discountRate, won } from "../../utils/format";
import { chip, pointTag } from "../../utils/styles";
import { Notice } from "../parts/notice";
import { Status } from "../parts/status";

const bell = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export function BuyBox({
  product,
  addAction,
  restockAction,
  selling = true,
  checkoutPath = "/checkout",
  rating,
  aside,
  lead,
}: {
  product: ProductDetail;
  addAction: FormAction;
  restockAction?: (data: FormData) => void | Promise<void>;
  selling?: boolean;
  checkoutPath?: string;
  rating?: { average: number; count: number } | null;
  aside?: ReactNode;
  lead?: string[];
}) {
  const first = product.variants.find((v) => v.in_stock) ?? product.variants[0];
  const [variantId, setVariantId] = useState(first?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [state, add, pending] = useActionState<FormState, FormData>(async (prev, data) => {
    const next = await addAction(prev, data);
    if (next.ok) setSheetOpen(true);
    return next;
  }, {});
  const sample = product.sample;
  const soldOut = product.sold_out || (product.variants.length > 0 && !product.variants.some((v) => v.in_stock));
  const variant = product.variants.find((v) => v.id === variantId);
  const blocked = !selling || soldOut || !variant?.in_stock;
  const unit = variant?.price ?? product.sale_price;
  const prices = product.variants.map((v) => v.price);
  const from = new Set(prices).size > 1 ? Math.min(...prices) : null;
  const options = product.variants.length > 1;
  const base = Math.min(...(prices.length ? prices : [unit]));
  const sale = from === null ? discountRate(product.list_price, unit) : 0;
  return (
    <form data-slot="buy-box" action={add} className="ez:grid ez:gap-7 ez:text-fg">
      <div className="ez:grid ez:gap-3">
        {sample && <Badge className="ez:justify-self-start">예시</Badge>}
        {soldOut && (
          <span className={cn(pointTag, "ez:text-muted")}>
            <span aria-hidden="true" className="ez:size-1.25 ez:rounded-full ez:bg-muted" />
            품절
          </span>
        )}
        <h1 className="ez:m-0 ez:text-site-page-sm ez:lg:text-site-page">{product.name}</h1>
        {rating && rating.count > 0 && (
          <NextLink href="#reviews" className="ez:flex ez:items-center ez:gap-2 ez:text-site-small ez:text-fg ez:no-underline">
            <StarRow rating={rating.average} />
            <span className="ez:tabular-nums">{rating.average.toFixed(1)}</span>
            <span className="ez:text-muted">리뷰 {rating.count}</span>
          </NextLink>
        )}
      </div>
      <p className="ez:m-0 ez:flex ez:flex-wrap ez:items-baseline ez:gap-2 ez:text-site-heading ez:tabular-nums">
        {sale > 0 && !soldOut && <span className="ez:text-primary">{sale}%</span>}
        <span className={soldOut ? "ez:text-muted" : undefined}>
          {won(from ?? unit)}
          {from !== null && <span className="ez:text-site-lead ez:font-normal ez:text-muted"> 부터</span>}
        </span>
        {sale > 0 && !soldOut && <s className="ez:text-site-small ez:font-normal ez:text-muted">{won(product.list_price)}</s>}
      </p>
      {lead && lead.length > 0 && (
        <div data-slot="buy-lead" className="ez:grid ez:gap-2 ez:text-site-body">
          {lead.map((line, i) => (
            <p key={i} className={cn("ez:m-0 ez:whitespace-pre-line", i > 0 && "ez:text-muted")}>
              {line}
            </p>
          ))}
        </div>
      )}
      {options && <hr className="ez:m-0 ez:h-px ez:border-0 ez:bg-site-line" />}
      {!selling && !soldOut && (
        <p className="ez:m-0 ez:flex ez:items-center ez:gap-2 ez:rounded-md ez:bg-deep ez:p-3 ez:text-site-small">
          <Status icon="alert">지금은 주문을 받지 않는 스토어예요</Status>
        </p>
      )}
      {options ? (
        <fieldset disabled={!selling || sample} className={cn("ez:m-0 ez:grid ez:gap-3 ez:border-0 ez:p-0", (!selling || sample) && "ez:opacity-50")}>
          <legend className="ez:mb-3 ez:flex ez:w-full ez:justify-between ez:p-0 ez:text-site-small">
            <span className="ez:text-muted">{product.option_name ?? "옵션"}</span>
            <span>{variant?.label}</span>
          </legend>
          <div className="ez:flex ez:flex-wrap ez:gap-2">
            {product.variants.map((v) => (
              <label
                key={v.id}
                data-choice=""
                className={cn(
                  chip,
                  "ez:has-checked:border-primary ez:has-checked:text-primary ez:has-checked:font-medium ez:has-focus-visible:outline-2 ez:has-focus-visible:outline-offset-2 ez:has-focus-visible:outline-primary",
                  "ez:has-disabled:cursor-not-allowed ez:has-disabled:text-site-off ez:has-disabled:line-through",
                )}
              >
                <input
                  type="radio"
                  name="variant_id"
                  value={v.id}
                  checked={selling && !soldOut && variantId === v.id}
                  disabled={!v.in_stock}
                  onChange={() => setVariantId(v.id)}
                  className="ez:sr-only"
                />
                {v.label ?? "기본"}
                {v.price > base && <span className="ez:tabular-nums">+{won(v.price - base)}</span>}
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <input type="hidden" name="variant_id" value={variantId} />
      )}
      {sample ? (
        <Button variant="outline" disabled block>
          예시 상품은 구매할 수 없어요
        </Button>
      ) : soldOut ? (
        <div className="ez:flex ez:gap-2">
          {restockAction ? (
            <Button type="submit" variant="outline" formAction={restockAction} className="ez:flex-1">
              {bell}
              재입고 알림
            </Button>
          ) : (
            <Button variant="outline" disabled className="ez:flex-1">
              품절
            </Button>
          )}
          {aside}
        </div>
      ) : selling ? (
        <>
          <div className="ez:grid ez:gap-2 ez:border-0 ez:border-y ez:border-solid ez:border-site-line ez:py-4.5">
            <div className="ez:flex ez:flex-wrap ez:items-center ez:justify-between ez:gap-3">
              <Quantity value={quantity} onChange={setQuantity} />
              {quantity > 1 && (
                <p className="ez:m-0 ez:flex ez:items-baseline ez:gap-3.5">
                  <span className="ez:text-site-small ez:text-muted">총 상품 금액</span>
                  <strong className="ez:text-site-heading ez:font-medium ez:tabular-nums ez:whitespace-nowrap">{won(unit * quantity)}</strong>
                </p>
              )}
            </div>
            {product.non_returnable && <Status icon="ban">교환·반품 불가</Status>}
          </div>
          {state.error && <Notice tone="error">{state.error}</Notice>}
          <div className="ez:flex ez:gap-2">
            <Button type="submit" variant="outline" disabled={blocked || pending} className="ez:flex-1">
              장바구니
            </Button>
            {blocked ? (
              <Button disabled className="ez:flex-1">
                바로 구매
              </Button>
            ) : (
              <ButtonLink href={`${checkoutPath}?item=${encodeURIComponent(variantId)}&qty=${quantity}`} className="ez:flex-1">
                바로 구매
              </ButtonLink>
            )}
            {aside}
          </div>
        </>
      ) : null}
      <Sheet open={sheetOpen} title="장바구니에 담았어요" onOpenChange={setSheetOpen}>
        <div className="ez:flex ez:items-center ez:gap-3">
          <Photo src={product.cover_url} alt="" sizes="64px" className="ez:w-16 ez:shrink-0 ez:aspect-[4/5]" />
          <div className="ez:grid ez:gap-0.5">
            <span>{product.name}</span>
            <span className="ez:text-site-small ez:text-muted">
              {[options ? variant?.label : null, `${quantity}개`].filter(Boolean).join(" · ")}
            </span>
            <strong className="ez:font-medium ez:tabular-nums">{won(unit * quantity)}</strong>
          </div>
        </div>
        <div className="ez:grid ez:grid-cols-2 ez:gap-2">
          <Button variant="secondary" onClick={() => setSheetOpen(false)}>
            쇼핑 계속하기
          </Button>
          <ButtonLink href="/cart">장바구니 보기</ButtonLink>
        </div>
      </Sheet>
    </form>
  );
}
