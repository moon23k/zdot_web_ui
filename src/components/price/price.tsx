import { cn } from "../../utils/cn";
import { discountRate, won } from "../../utils/format";
import { Won } from "./won";

export function Price({ value, list, rate = true, className }: { value: number; list?: number; rate?: boolean; className?: string }) {
  const discounted = list !== undefined && list > value;
  return (
    <span data-slot="price" className={cn("ez:inline-flex ez:flex-wrap ez:items-baseline ez:gap-2", className)}>
      {discounted && rate && <span className="ez:font-normal ez:text-primary">{discountRate(list, value)}%</span>}
      <strong className="ez:font-medium ez:text-fg"><Won amount={value} /></strong>
      {discounted && <s className="ez:text-site-small ez:font-normal ez:text-muted">{won(list)}</s>}
    </span>
  );
}
