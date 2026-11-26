import { clsx } from "clsx";
import NextLink from "next/link";
import type { ReactNode } from "react";
import type { FormAction } from "../../types";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { reviewWord } from "../../utils/words";
import { LogoutButton } from "./logout-button";

const TABS = [
  { href: "/orders", label: "주문 내역" },
  { href: "/me/likes", label: "찜" },
  { href: "/me/coupons", label: "쿠폰" },
  { href: "/me/reviews", label: "후기" },
  { href: "/inquiries", label: "문의" },
  { href: "/me/addresses", label: "배송지" },
  { href: "/me", label: "내 정보" },
];

export type AccountSummary = { label: string; value: string };

export function AccountShell({
  current,
  name,
  summary = [],
  counts = {},
  logoutAction,
  main,
  children,
}: {
  current: string;
  name?: string | null;
  summary?: AccountSummary[];
  counts?: Partial<Record<string, number>>;
  logoutAction?: FormAction;
  main?: string;
  children: ReactNode;
}) {
  const tabs = TABS.map((t) => (t.href === "/me/reviews" ? { ...t, label: reviewWord(main) } : t));
  const head = Boolean(name || summary.length);
  return (
    <div
      data-slot="account-shell"
      className={cn(
        "ez:grid ez:gap-6 ez:text-fg ez:lg:grid-cols-[240px_minmax(0,1fr)] ez:lg:items-start ez:lg:gap-x-24 ez:lg:gap-y-10 ez:lg:pt-10",
        head ? "ez:lg:grid-rows-[auto_auto_1fr]" : "ez:lg:grid-rows-[auto_1fr]",
      )}
    >
      {head && (
        <div className="ez:grid ez:gap-1.5 ez:lg:col-start-1 ez:lg:row-start-1">
          {name && <span className="ez:text-site-section">{name} 님</span>}
          {summary.length > 0 && (
            <span className="ez:flex ez:flex-wrap ez:gap-x-3.5 ez:text-site-small">
              {summary.map((s) => (
                <span key={s.label}>
                  {s.label} <span className="ez:font-normal ez:text-primary">{s.value}</span>
                </span>
              ))}
            </span>
          )}
        </div>
      )}
      <nav
        aria-label="내 계정"
        className={cn(
          "ez:flex ez:gap-5 ez:overflow-x-auto ez:border-0 ez:border-b ez:border-solid ez:border-site-line",
          "ez:lg:col-start-1 ez:lg:flex-col ez:lg:gap-0 ez:lg:overflow-visible ez:lg:border-b-0",
          head ? "ez:lg:row-start-2" : "ez:lg:row-start-1",
        )}
      >
        {tabs.map((t) => {
          const on = t.href === current;
          const count = counts[t.href];
          return (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={on ? "page" : undefined}
              className={clsx(
                "ez:-mb-px ez:flex ez:shrink-0 ez:items-center ez:justify-between ez:gap-2.5 ez:whitespace-nowrap ez:border-0 ez:border-b ez:border-solid ez:border-transparent ez:py-3 ez:text-site-lead ez:text-muted ez:no-underline ez:hover:text-fg",
                "ez:aria-[current=page]:border-primary ez:aria-[current=page]:font-medium ez:aria-[current=page]:text-fg",
                "ez:lg:mb-0 ez:lg:border-b-0 ez:lg:border-t ez:lg:border-site-line ez:lg:py-3.5 ez:lg:aria-[current=page]:border-site-line",
                focusRing,
              )}
            >
              <span className="ez:flex ez:items-center ez:gap-2.5">
                <span aria-hidden="true" className={cn("ez:hidden ez:size-1.25 ez:rounded-full ez:bg-primary ez:lg:inline-block", !on && "ez:opacity-0")} />
                {t.label}
              </span>
              {count ? <span className="ez:text-site-small ez:font-normal ez:text-primary">{count}</span> : null}
            </NextLink>
          );
        })}
      </nav>
      <div className={cn("ez:min-w-0 ez:lg:col-start-2 ez:lg:row-start-1", head ? "ez:lg:row-span-3" : "ez:lg:row-span-2")}>{children}</div>
      {logoutAction && (
        <div className={cn("ez:lg:col-start-1", head ? "ez:lg:row-start-3" : "ez:lg:row-start-2")}>
          <LogoutButton action={logoutAction} />
        </div>
      )}
    </div>
  );
}
