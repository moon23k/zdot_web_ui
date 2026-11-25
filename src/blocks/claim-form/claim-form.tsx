"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "../../components/button";
import { Field, TextArea } from "../../components/field";
import { Photo } from "../../components/photo";
import { Quantity } from "../../components/quantity";
import type { FormAction, FormState, Schemas } from "../../types";
import { cn } from "../../utils/cn";
import { won } from "../../utils/format";
import { focusRing } from "../../utils/styles";
import type { OrderItemView } from "../order-detail/order-detail";
import { Choice, fieldset, legend } from "../parts/choice";
import { form } from "../parts/form";
import { Notice } from "../parts/notice";
import { Status } from "../parts/status";
import { SummaryRows, type SummaryRow } from "../parts/summary-rows";

const LABEL = { return: "반품", exchange: "교환", cancel: "취소" } as const;

export type ClaimPreview = Schemas["ClaimPreviewOut"];

export type ClaimPreviewInput = {
  kind: keyof typeof LABEL;
  fault: string;
  items: { order_item_id: string; quantity: number }[];
};

const shown = (rows: SummaryRow[]) => rows.filter((row) => row.value !== 0);

export function ClaimForm({
  kind,
  items,
  action,
  preview,
  imageSrc,
}: {
  kind: keyof typeof LABEL;
  items: OrderItemView[];
  action: FormAction;
  preview?: (input: ClaimPreviewInput) => Promise<ClaimPreview | null>;
  imageSrc?: Record<string, string | null>;
}) {
  const [state, submit, pending] = useActionState<FormState, FormData>(action, {});
  const [fault, setFault] = useState<string | null>(null);
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [reason, setReason] = useState("");
  const [quote, setQuote] = useState<{ key: string; value: ClaimPreview | null } | null>(null);
  const open = items.map((item) => ({ item, left: item.quantity - item.returned_quantity })).filter((x) => x.left > 0);
  const locked = (item: OrderItemView) => kind !== "cancel" && item.non_returnable && fault !== "seller";
  const chosen = open.filter(({ item }) => picked[item.id] && !locked(item));
  const key =
    kind !== "exchange" && fault && chosen.length
      ? JSON.stringify({ kind, fault, items: chosen.map(({ item }) => ({ order_item_id: item.id, quantity: picked[item.id] })) })
      : "";
  useEffect(() => {
    if (!preview || !key) return;
    let live = true;
    const timer = setTimeout(() => {
      const done = (value: ClaimPreview | null) => {
        if (live) setQuote({ key, value });
      };
      preview(JSON.parse(key) as ClaimPreviewInput).then(done, () => done(null));
    }, 300);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [key, preview]);
  if (state.ok) return <Notice>{state.message ?? "요청을 접수했어요."}</Notice>;
  const label = LABEL[kind];
  const unit = (item: OrderItemView) => Math.round(item.paid_amount / item.quantity);
  const refund = key && quote?.key === key ? quote.value : null;
  const row = "ez:py-2.5";
  return (
    <form data-slot="claim-form" action={submit} className={form}>
      <input type="hidden" name="kind" value={kind} />
      <fieldset className={cn(fieldset, "ez:gap-0")}>
        <legend className={legend}>사유</legend>
        <Choice type="radio" name="fault" value="customer" required checked={fault === "customer"} onChange={() => setFault("customer")} label="단순 변심" className={row} />
        {kind !== "cancel" && (
          <Choice type="radio" name="fault" value="seller" checked={fault === "seller"} onChange={() => setFault("seller")} label="상품 문제 (파손·오배송)" className={row} />
        )}
      </fieldset>
      <fieldset className={cn(fieldset, "ez:gap-0")}>
        <legend className={legend}>{label}할 상품</legend>
        {open.map(({ item, left }) => {
          const off = locked(item);
          return (
            <div key={item.id} className={cn("ez:flex ez:min-h-16 ez:items-center ez:gap-3", off && "ez:text-muted")}>
              <label className={cn("ez:flex ez:min-w-0 ez:flex-1 ez:items-center ez:gap-3 ez:py-2", off ? "ez:cursor-not-allowed" : "ez:cursor-pointer")}>
                <input
                  type="checkbox"
                  disabled={off}
                  checked={Boolean(picked[item.id]) && !off}
                  onChange={(e) => setPicked((p) => ({ ...p, [item.id]: e.target.checked ? left : 0 }))}
                  className={cn("ez:m-0 ez:size-5 ez:shrink-0 ez:accent-primary", focusRing)}
                />
                {imageSrc && (
                  <Photo src={imageSrc[item.id]} alt="" sizes="44px" className={cn("ez:w-11 ez:shrink-0 ez:aspect-[4/5]", off && "ez:opacity-45")} />
                )}
                <span className="ez:grid ez:min-w-0">
                  <span>
                    {item.product_name}
                    {item.option_label && <span className="ez:text-muted"> {item.option_label}</span>}
                  </span>
                  {off ? (
                    <Status icon="ban">교환·반품 불가</Status>
                  ) : (
                    <span className="ez:text-site-small ez:tabular-nums ez:text-muted">
                      {won(unit(item))} · {label} 가능 {left}개
                    </span>
                  )}
                </span>
              </label>
              {!off && left > 1 && (
                <Quantity
                  name={`qty_${item.id}`}
                  label={item.product_name}
                  size="sm"
                  min={1}
                  max={left}
                  value={picked[item.id] || left}
                  onChange={(n) => setPicked((p) => ({ ...p, [item.id]: n }))}
                />
              )}
            </div>
          );
        })}
      </fieldset>
      {chosen.map(({ item }) => (
        <input key={item.id} type="hidden" name="item" value={`${item.id}:${picked[item.id]}`} />
      ))}
      <Field label="자세한 사유">
        <TextArea name="reason" required minLength={2} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} />
      </Field>
      {refund && (
        <div className="ez:grid ez:gap-3 ez:rounded-md ez:bg-surface-alt ez:p-4">
          <SummaryRows
            rows={shown([
              { label: "상품 금액", value: refund.item_amount },
              { label: "배송비", value: refund.delivery_fee + refund.withheld_back },
              { label: "반품 배송비 (단순 변심)", value: refund.return_fee, minus: true },
              { label: "쿠폰 할인 차감", value: refund.coupon_clawback, minus: true },
              { label: "최초 배송비", value: refund.shipping_charge, minus: true },
            ])}
            total={{ label: "환불 예정 금액", value: refund.cash }}
          />
          {(refund.points > 0 || refund.point_clawback > 0) && (
            <SummaryRows
              rows={shown([
                { label: "적립금 복원", value: refund.points },
                { label: "반품 적립 회수", value: refund.point_clawback, minus: true },
              ])}
            />
          )}
        </div>
      )}
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Button type="submit" block disabled={pending || !fault || !chosen.length}>
        {label} 신청
      </Button>
    </form>
  );
}
