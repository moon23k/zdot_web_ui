import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { scriptOf } from "../utils/writing";

export function DetailSplit({
  id,
  title,
  action,
  className,
  children,
}: {
  id?: string;
  title: string;
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} aria-label={title} data-slot="detail-split" className={cn("ez:grid ez:gap-5 ez:text-fg ez:md:grid-cols-[180px_minmax(0,1fr)] ez:md:gap-x-6 ez:md:gap-y-0", className)}>
      <h2 data-script={scriptOf(title)} className="ez:m-0 ez:text-site-heading">{title}</h2>
      <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-6">
        {children}
        {action && <div className="ez:justify-self-start">{action}</div>}
      </div>
    </section>
  );
}
