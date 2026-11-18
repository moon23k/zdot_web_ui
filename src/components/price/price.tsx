import { cn } from "../../utils/cn";
import { won } from "../../utils/format";

export function Price({ value, list, rate = true, className }: { value: number; list?: number; rate?: boolean; className?: string }) {
  const discounted = list !== undefined && list > value;
  return (
    <span data-slot="price" className={cn("ez:inline-flex ez:flex-wrap ez:items-baseline ez:gap-2 ez:tabular-nums", className)}>
      {discounted && rate && <span className="ez:font-medium ez:text-primary">{Math.floor(((list - value) / list) * 100)}%</span>}
      <strong className="ez:font-medium ez:text-fg">{won(value)}</strong>
      {discounted && <s className="ez:text-[0.85em] ez:font-normal ez:text-muted">{won(list)}</s>}
    </span>
  );
}
