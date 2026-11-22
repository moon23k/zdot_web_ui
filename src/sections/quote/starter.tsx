import type { ReactNode } from "react";
import { Icon } from "../../components/icon";
import { cn } from "../../utils/cn";
import type { QuoteStarter } from "../template/data";
import { QUOTE_HREF, QUOTE_TITLE } from "./shared";

export type StarterState = "blank" | "closed" | "open";

export function starterState(data: QuoteStarter | undefined): StarterState {
  if (!data?.questions) return "blank";
  return data.open === false || !data.questions.length ? "closed" : "open";
}

export function StarterForm({ data, className, children }: { data: QuoteStarter; className?: string; children: ReactNode }) {
  return (
    <form method="get" action={data.href ?? QUOTE_HREF} aria-label={QUOTE_TITLE.request} data-slot="quote-starter-form" className={className}>
      {children}
    </form>
  );
}

export function OptionCell({ name, value, className, labelClassName }: { name: string; value: string; className?: string; labelClassName?: string }) {
  return (
    <label className={cn("ez:relative ez:inline-flex ez:cursor-pointer ez:items-center ez:gap-1.5 ez:has-focus-visible:outline-2 ez:has-focus-visible:outline-offset-2 ez:has-focus-visible:outline-primary", className)}>
      <input type="radio" name={name} value={value} className="ez:peer ez:sr-only" />
      <Icon name="check" size="sm" className="ez:hidden ez:shrink-0 ez:text-primary ez:peer-checked:inline-block" />
      <span className={labelClassName}>{value}</span>
    </label>
  );
}
