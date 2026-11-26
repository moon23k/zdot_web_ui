import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { numeralStep } from "../../utils/styles";

export function CheckoutLayout({ title, main, aside }: { title?: string; main: ReactNode; aside: ReactNode }) {
  return (
    <div data-slot="checkout-layout" className="ez:grid ez:gap-10 ez:pt-4 ez:lg:grid-cols-[minmax(0,1fr)_440px] ez:lg:items-start ez:lg:gap-24 ez:lg:pt-10">
      <div className="ez:grid ez:min-w-0 ez:gap-10 ez:lg:gap-16">
        {title && <h1 className="ez:m-0 ez:text-site-page">{title}</h1>}
        {main}
      </div>
      <aside className="ez:grid ez:gap-6 ez:rounded-md ez:bg-deep ez:p-6 ez:lg:sticky ez:lg:top-8 ez:lg:p-8">{aside}</aside>
    </div>
  );
}

export function CheckoutSection({
  n,
  title,
  action,
  children,
  last,
  fold,
}: {
  n: number;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  last?: boolean;
  fold?: boolean;
}) {
  const heading = (
    <h2 className="ez:m-0 ez:flex ez:items-baseline ez:gap-3.5 ez:text-site-heading">
      <span className={cn(numeralStep, "ez:text-site-heading ez:leading-none ez:text-primary")}>{n}</span>
      {title}
    </h2>
  );
  const body = <div className="ez:grid ez:gap-6 ez:md:grid-cols-2 ez:md:pl-7">{children}</div>;
  const line = cn("ez:border-0 ez:border-solid ez:border-site-line", !last && "ez:border-b ez:pb-10 ez:lg:pb-16");
  if (fold) {
    return (
      <section data-slot="checkout-section" data-fold="" className={line}>
        <details className="ez:group">
          <summary className="ez:flex ez:cursor-pointer ez:list-none ez:items-center ez:justify-between ez:gap-3 ez:[&::-webkit-details-marker]:hidden">
            {heading}
            <span className="ez:flex ez:items-center ez:gap-3">
              {action}
              <svg
                viewBox="0 0 16 16"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
                className="ez:text-muted ez:transition-transform ez:group-open:rotate-180"
              >
                <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </summary>
          <div className="ez:pt-6">{body}</div>
        </details>
      </section>
    );
  }
  return (
    <section data-slot="checkout-section" className={cn("ez:grid ez:gap-6", line)}>
      <div className="ez:flex ez:items-center ez:justify-between ez:gap-3">
        {heading}
        {action}
      </div>
      {body}
    </section>
  );
}

export function CheckoutLines({ lines }: { lines: { id: string; name: string; option?: string | null; quantity: number; amount: string }[] }) {
  return (
    <ul className="ez:m-0 ez:grid ez:list-none ez:gap-5 ez:border-0 ez:border-b ez:border-solid ez:border-site-field ez:p-0 ez:pb-7">
      {lines.map((l) => (
        <li key={l.id} className="ez:flex ez:items-start ez:justify-between ez:gap-4">
          <span className="ez:grid ez:gap-0.5">
            <span>{l.name}</span>
            <span className="ez:text-site-small ez:text-muted">{[l.option, `${l.quantity}개`].filter(Boolean).join(" · ")}</span>
          </span>
          <span className="ez:font-normal ez:tabular-nums ez:whitespace-nowrap">{l.amount}</span>
        </li>
      ))}
    </ul>
  );
}
