"use client";

import { useState } from "react";
import { Icon } from "../../components/icon";
import type { Schemas } from "../../types";
import { cn } from "../../utils/cn";
import { kstDueTime } from "../../utils/format";
import { focusRing, numeralStep } from "../../utils/styles";
import { Won } from "../../components/price";

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return [copied, copy] as const;
}

export function OrderNumber({ number, className }: { number: string; className?: string }) {
  const [copied, copy] = useCopy(number);
  return (
    <dl data-slot="order-number" className={cn("ez:m-0 ez:grid ez:justify-items-center ez:gap-1", className)}>
      <dt className="ez:text-site-small ez:text-muted">주문번호</dt>
      <dd className={cn(numeralStep, "ez:m-0 ez:flex ez:items-center ez:justify-center ez:gap-1 ez:text-site-heading ez:text-fg")}>
        {number}
        <button
          type="button"
          onClick={copy}
          aria-label="주문번호 복사"
          className={cn("ez:-mr-3 ez:inline-flex ez:size-11 ez:items-center ez:justify-center ez:border-0 ez:bg-transparent ez:p-0 ez:text-muted ez:cursor-pointer", focusRing)}
        >
          <Icon name={copied ? "check" : "copy"} />
        </button>
        <span role="status" className="ez:sr-only">
          {copied ? "복사됨" : ""}
        </span>
      </dd>
    </dl>
  );
}

export function DepositInfo({ deposit }: { deposit: Schemas["DepositOut"] }) {
  const [copied, copy] = useCopy(deposit.account_number);
  return (
    <section
      aria-label="입금 정보"
      data-slot="deposit-info"
      className="ez:grid ez:gap-2 ez:rounded-md ez:border ez:border-solid ez:border-primary-border ez:p-4 ez:text-site-small"
    >
      <strong className="ez:text-site-small">{kstDueTime(deposit.due_at)}까지 입금해 주세요</strong>
      <dl className="ez:m-0 ez:grid ez:grid-cols-[auto_1fr] ez:gap-x-4 ez:gap-y-1.5">
        <dt className="ez:text-muted">은행</dt>
        <dd className="ez:m-0">{deposit.bank_name}</dd>
        <dt className="ez:text-muted">계좌번호</dt>
        <dd className="ez:m-0 ez:flex ez:items-center ez:gap-2">
          {deposit.account_number}
          <button
            type="button"
            onClick={copy}
            className="ez:cursor-pointer ez:rounded-md ez:border ez:border-solid ez:border-primary-border ez:bg-transparent ez:px-2 ez:py-0.5 ez:text-site-small ez:text-fg"
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </dd>
        {deposit.holder && (
          <>
            <dt className="ez:text-muted">예금주</dt>
            <dd className="ez:m-0">{deposit.holder}</dd>
          </>
        )}
        <dt className="ez:text-muted">입금 금액</dt>
        <dd className="ez:m-0 ez:font-medium"><Won amount={deposit.amount} /></dd>
      </dl>
      <span className="ez:text-muted">기한이 지나면 주문이 자동으로 취소돼요.</span>
    </section>
  );
}
