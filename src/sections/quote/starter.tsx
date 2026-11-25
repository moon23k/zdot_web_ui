import type { ReactNode } from "react";
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

export const OPTION_GRID = "ez:grid ez:grid-cols-2 ez:sm:grid-cols-5";

export function OptionCell({ name, value, className, labelClassName }: { name: string; value: string; className?: string; labelClassName?: string }) {
  return (
    <label
      className={cn(
        "ez:relative ez:flex ez:min-w-0 ez:cursor-pointer ez:items-center ez:justify-center ez:rounded-button ez:border ez:border-solid ez:px-2 ez:text-center ez:break-keep ez:has-checked:border-primary ez:has-focus-visible:outline-2 ez:has-focus-visible:outline-offset-2 ez:has-focus-visible:outline-primary",
        className,
      )}
    >
      <input type="radio" name={name} value={value} className="ez:sr-only" />
      <span className={labelClassName}>{value}</span>
    </label>
  );
}
