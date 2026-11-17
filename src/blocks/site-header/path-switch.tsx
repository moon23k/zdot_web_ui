"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PathSwitch({ prefix, match, rest }: { prefix: string; match: ReactNode; rest: ReactNode }) {
  const path = usePathname();
  return path === prefix || path.startsWith(`${prefix}/`) ? match : rest;
}

export function CheckoutSteps({ className }: { className?: string }) {
  const path = usePathname();
  const at = path.startsWith("/checkout/result") ? 2 : path.startsWith("/checkout") ? 1 : 0;
  return <Steps at={at} className={className} />;
}

export function Steps({ at, className }: { at: number; className?: string }) {
  return (
    <ol aria-label="주문 단계" className={["ez:m-0 ez:flex ez:list-none ez:items-center ez:gap-3.5 ez:p-0 ez:text-site-small ez:text-muted", className].filter(Boolean).join(" ")}>
      {["장바구니", "주문/결제", "주문 완료"].map((label, i) => (
        <li key={label} className="ez:flex ez:items-center ez:gap-3.5">
          {i > 0 && <i aria-hidden="true" className="ez:block ez:h-px ez:w-7 ez:bg-site-field" />}
          <span aria-current={i === at ? "step" : undefined} className={i === at ? "ez:font-medium ez:text-primary" : undefined}>
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}
