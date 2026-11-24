import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export function DotLine({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <span data-slot="dot-line" className={cn("ez:block ez:overflow-hidden", className)}>
      <span className="ez:-ml-3 ez:flex ez:flex-wrap">
        {items.map((item, i) => (
          <span key={i} data-slot="dot-item" className="ez:min-w-0 ez:wrap-break-word">
            <span aria-hidden="true" className="ez:inline-block ez:w-3 ez:text-center">
              {" · "}
            </span>
            {item}
          </span>
        ))}
      </span>
    </span>
  );
}
