"use client";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { useMemo, useState } from "react";
import { Button, ButtonLink } from "../../components/button";
import { EmptyState } from "../../components/empty-state";
import type { CartLineData as Line } from "../../types";
import { Icon } from "../../components/icon";
import { Steps } from "../site-header/path-switch";
import { cn, won } from "../../utils/cn";
import { countSup, focusRing, textLink } from "../../utils/styles";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { CartLine } from "../cart-line";
import { BagIcon, emptyAction } from "../parts/empty-icons";
import { lineList } from "../parts/line-item";
import { SummaryRows } from "../parts/summary-rows";

const boxClass = cn(
  "ez:size-5 ez:shrink-0 ez:box-border ez:p-0 ez:rounded-[6px] ez:border ez:border-solid ez:border-site-faint ez:bg-surface ez:text-primary ez:cursor-pointer",
  "ez:data-[state=checked]:border-primary ez:data-[state=checked]:bg-point-soft",
  "ez:disabled:cursor-not-allowed ez:disabled:border-primary-border ez:disabled:bg-surface-alt",
  focusRing,
);

function Box(props: { checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void; label: string }) {
  return (
    <CheckboxPrimitive.Root
      checked={props.checked}
      disabled={props.disabled}
      onCheckedChange={(v) => props.onChange?.(v === true)}
      aria-label={props.label}
      className={boxClass}
    >
      <CheckboxPrimitive.Indicator className="ez:flex ez:items-center ez:justify-center">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

function RemoveMany({ ids, action, children }: { ids: string[]; action: (data: FormData) => void | Promise<void>; children: string }) {
  return (
    <form action={action}>
      {ids.map((id) => (
        <input key={id} type="hidden" name="variant_id" value={id} />
      ))}
      <button
        type="submit"
        disabled={!ids.length}
        className={cn(
          "ez:-mr-2 ez:h-11 ez:border-0 ez:bg-transparent ez:px-2 ez:font-body ez:text-site-small ez:text-muted ez:cursor-pointer ez:disabled:cursor-not-allowed ez:disabled:opacity-45",
          focusRing,
        )}
      >
        {children}
      </button>
    </form>
  );
}

export function CartView({
  lines,
  updateAction,
  removeAction,
  checkoutHref = "/checkout",
  imageSrc,
  freeThreshold,
  after,
}: {
  lines: Line[];
  itemsTotal?: number;
  updateAction: (data: FormData) => void | Promise<void>;
  removeAction: (data: FormData) => void | Promise<void>;
  checkoutHref?: string;
  imageSrc?: Record<string, string | null>;
  freeThreshold?: number | null;
  after?: ReactNode;
}) {
  const [unchecked, setUnchecked] = useState<Set<string>>(new Set());
  const [buyable, blocked] = useMemo(() => {
    const ok = lines.filter((l) => l.sellable && l.enough_stock);
    return [ok, lines.filter((l) => !ok.includes(l))];
  }, [lines]);
  const head = (
    <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-6 ez:pb-10 ez:lg:pb-14">
      <h1 className="ez:m-0 ez:text-site-page ez:font-light ez:tracking-[-0.035em]">
        장바구니
        {lines.length > 0 && <span className={countSup}>{lines.length}</span>}
      </h1>
      <Steps at={0} className="ez:max-md:hidden" />
    </div>
  );
  if (!lines.length) {
    return (
      <div data-slot="cart-view" className="ez:text-fg">
        {head}
        <EmptyState icon={<BagIcon />} title="장바구니가 비어 있어요">
          <ButtonLink href="/products" className={emptyAction}>
            쇼핑하기
          </ButtonLink>
        </EmptyState>
        {after}
      </div>
    );
  }
  const picked = buyable.filter((l) => !unchecked.has(l.variant_id));
  const ids = picked.map((l) => l.variant_id);
  const list = picked.reduce((sum, l) => sum + l.list_price * l.quantity, 0);
  const total = picked.reduce((sum, l) => sum + l.line_total, 0);
  const allChecked = picked.length > 0 && picked.length === buyable.length;
  const toggle = (id: string, on: boolean) =>
    setUnchecked((prev) => {
      const next = new Set(prev);
      if (on) next.delete(id);
      else next.add(id);
      return next;
    });
  const row = (line: Line, available: boolean) => (
    <CartLine
      key={line.variant_id}
      line={line}
      updateAction={updateAction}
      removeAction={removeAction}
      imageSrc={imageSrc?.[line.variant_id] ?? null}
      selector={
        available ? (
          <Box checked={!unchecked.has(line.variant_id)} onChange={(on) => toggle(line.variant_id, on)} label={`${line.name} 선택`} />
        ) : (
          <span className="ez:w-5 ez:shrink-0" />
        )
      }
    />
  );
  const left = freeThreshold != null ? Math.max(0, freeThreshold - total) : null;
  return (
    <div data-slot="cart-view" className="ez:grid ez:text-fg">
      {head}
      <div className="ez:grid ez:gap-10 ez:lg:grid-cols-[minmax(0,1fr)_396px] ez:lg:items-start ez:lg:gap-20">
        <div>
          <div className="ez:flex ez:h-13 ez:items-center ez:justify-between ez:border-0 ez:border-b ez:border-solid ez:border-fg">
            <label className="ez:flex ez:cursor-pointer ez:items-center ez:gap-3 ez:text-site-lead">
              <Box
                checked={allChecked}
                disabled={!buyable.length}
                onChange={(on) => setUnchecked(on ? new Set() : new Set(buyable.map((l) => l.variant_id)))}
                label="전체 선택"
              />
              전체 선택
              <span className="ez:tabular-nums ez:text-muted">
                {picked.length}/{buyable.length}
              </span>
            </label>
            <RemoveMany ids={ids} action={removeAction}>
              선택 삭제
            </RemoveMany>
          </div>
          <ul className={lineList}>{buyable.map((line) => row(line, true))}</ul>
          {blocked.length > 0 && (
            <>
              <div className="ez:flex ez:h-11 ez:items-center ez:justify-between ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:text-site-small ez:text-muted">
                <span>구매할 수 없는 상품 {blocked.length}개</span>
                <RemoveMany ids={blocked.map((l) => l.variant_id)} action={removeAction}>
                  모두 삭제
                </RemoveMany>
              </div>
              <ul className={lineList}>{blocked.map((line) => row(line, false))}</ul>
            </>
          )}
          {left !== null && freeThreshold && (
            <div data-slot="free-shipping" className="ez:mt-6 ez:grid ez:gap-3">
              <div className="ez:flex ez:items-center ez:justify-between ez:text-site-small">
                <span className="ez:flex ez:items-center ez:gap-2">
                  <Icon name="truck" size="sm" />
                  무료 배송
                </span>
                <span>
                  <span className="ez:font-medium ez:text-primary ez:tabular-nums">{won(left)}</span> 남음
                </span>
              </div>
              <span aria-hidden="true" className="ez:relative ez:block ez:h-0.5 ez:bg-site-line">
                <span className="ez:absolute ez:inset-y-0 ez:left-0 ez:bg-primary" style={{ width: `${Math.min(100, (total / freeThreshold) * 100)}%` }} />
              </span>
            </div>
          )}
        </div>
        <div className="ez:grid ez:gap-6 ez:rounded-md ez:bg-surface-alt ez:p-8">
          <h2 className="ez:m-0 ez:text-site-item">결제 예정 금액</h2>
          <SummaryRows
            rows={[
              { label: "상품 금액", value: list },
              { label: "배송비", value: "주문서에서 계산" },
              ...(list > total ? [{ label: "할인", value: list - total, minus: true }] : []),
            ]}
            total={{ label: "합계", value: total }}
          />
          <div className="ez:grid ez:justify-items-center ez:gap-4">
            {picked.length ? (
              <ButtonLink href={`${checkoutHref}?items=${ids.map(encodeURIComponent).join(",")}`} block className="ez:bg-surface">
                주문하기
                <Icon name="right" size="sm" />
              </ButtonLink>
            ) : (
              <Button block disabled className="ez:bg-surface">
                주문하기
              </Button>
            )}
            <NextLink href="/products" className={cn(textLink, "ez:text-site-small")}>
              쇼핑 계속하기
            </NextLink>
          </div>
        </div>
      </div>
      {after}
    </div>
  );
}
