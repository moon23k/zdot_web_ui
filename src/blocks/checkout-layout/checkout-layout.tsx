import type { ReactNode } from "react";
import { buttonVariants } from "../../components/button";
import { Icon } from "../../components/icon";
import { cn } from "../../utils/cn";
import { figure } from "../../utils/styles";

export function CheckoutLayout({ title, main, aside }: { title?: string; main: ReactNode; aside: ReactNode }) {
  return (
    <div data-slot="checkout-layout" className="ez:grid ez:gap-10 ez:pt-4 ez:lg:grid-cols-[minmax(0,1fr)_440px] ez:lg:items-start ez:lg:gap-24 ez:lg:pt-10">
      <div className="ez:grid ez:min-w-0 ez:gap-10 ez:lg:gap-16">
        {title && <h1 className="ez:m-0 ez:text-site-page ez:font-light ez:tracking-[-0.035em]">{title}</h1>}
        {main}
      </div>
      <aside className="ez:grid ez:gap-6 ez:rounded-md ez:bg-surface-alt ez:p-6 ez:lg:sticky ez:lg:top-8 ez:lg:p-8">{aside}</aside>
    </div>
  );
}

export function CheckoutSection({ n, title, action, children, last }: { n: number; title: string; action?: ReactNode; children: ReactNode; last?: boolean }) {
  return (
    <section
      data-slot="checkout-section"
      className={cn("ez:grid ez:gap-6 ez:border-0 ez:border-solid ez:border-site-line", !last && "ez:border-b ez:pb-10 ez:lg:pb-16")}
    >
      <div className="ez:flex ez:items-center ez:justify-between ez:gap-3">
        <h2 className="ez:m-0 ez:flex ez:items-baseline ez:gap-3.5 ez:text-site-heading">
          <span className={cn(figure, "ez:text-site-heading ez:leading-none ez:text-primary")}>{n}</span>
          {title}
        </h2>
        {action}
      </div>
      <div className="ez:grid ez:gap-6 ez:md:grid-cols-2 ez:md:pl-7">{children}</div>
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
          <span className="ez:font-medium ez:tabular-nums ez:whitespace-nowrap">{l.amount}</span>
        </li>
      ))}
    </ul>
  );
}

export function FormLayout({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div data-slot="form-layout" className="ez:grid ez:gap-10 ez:pt-4 ez:text-fg ez:lg:grid-cols-[420px_minmax(0,1fr)] ez:lg:items-start ez:lg:gap-24 ez:lg:pt-10">
      <div className="ez:grid ez:gap-10 ez:lg:sticky ez:lg:top-8">
        <h1 className="ez:m-0 ez:text-site-page ez:font-light ez:tracking-[-0.035em]">{title}</h1>
        {aside}
      </div>
      <div className="ez:grid ez:min-w-0 ez:gap-10 ez:lg:gap-14">{children}</div>
    </div>
  );
}

export function StepList({ items }: { items: { label: string; value?: string | null }[] }) {
  return (
    <ol className="ez:m-0 ez:list-none ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:p-0 ez:max-lg:hidden">
      {items.map((it, i) => (
        <li key={`${it.label}-${i}`} className="ez:flex ez:items-baseline ez:justify-between ez:gap-4 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:py-4.5">
          <span className="ez:flex ez:items-baseline ez:gap-3.5">
            <span className={cn(figure, "ez:text-site-item ez:leading-none ez:text-primary")}>{i + 1}</span>
            <span className={it.value ? "ez:font-medium" : undefined}>{it.label}</span>
          </span>
          {it.value && <span className="ez:truncate ez:text-site-small">{it.value}</span>}
        </li>
      ))}
    </ol>
  );
}

export function ChipChoice({
  name,
  label,
  options,
  required,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="ez:flex ez:flex-wrap ez:gap-2 ez:md:col-span-2">
      {options.map((o, i) => (
        <label
          key={o}
          className="ez:inline-flex ez:h-9.5 ez:cursor-pointer ez:items-center ez:rounded-full ez:border ez:border-solid ez:border-site-line ez:px-4 ez:text-site-note ez:has-checked:border-primary ez:has-checked:font-medium ez:has-checked:text-primary ez:has-focus-visible:outline-2 ez:has-focus-visible:outline-primary"
        >
          <input type="radio" name={name} value={o} required={required && i === 0} checked={value === undefined ? undefined : value === o} onChange={() => onChange?.(o)} className="ez:sr-only" />
          {o}
        </label>
      ))}
    </div>
  );
}

export function DropZone({
  label,
  previews,
  disabled,
  onPick,
}: {
  label: string;
  previews: string[];
  disabled?: boolean;
  onPick: (files: File[]) => void;
}) {
  return (
    <div className="ez:flex ez:flex-wrap ez:items-stretch ez:gap-3 ez:md:col-span-2">
      {previews.map((src) => (
        <img key={src} src={src} alt="" className="ez:size-24 ez:rounded-sm ez:object-cover" />
      ))}
      <label
        className={cn(
          "ez:flex ez:min-h-24 ez:min-w-60 ez:flex-1 ez:cursor-pointer ez:items-center ez:justify-center ez:gap-2.5 ez:rounded-md ez:border ez:border-dashed ez:border-site-faint ez:p-7 ez:text-site-note ez:text-muted ez:has-focus-visible:outline-2 ez:has-focus-visible:outline-primary",
          disabled && "ez:cursor-not-allowed ez:opacity-45",
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled}
          aria-label={label}
          className="ez:sr-only"
          onChange={(e) => {
            const files = [...(e.target.files ?? [])];
            e.target.value = "";
            onPick(files);
          }}
        />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="ez:size-5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="M21 16l-5-5-9 9" />
        </svg>
        {label}
      </label>
    </div>
  );
}

export function PhotoAttach({
  label = "사진 첨부",
  count,
  max,
  previews,
  disabled,
  onPick,
  onRemove,
}: {
  label?: string;
  count: number;
  max: number;
  previews: { key: string; src: string }[];
  disabled?: boolean;
  onPick: (files: File[]) => void;
  onRemove: (key: string) => void;
}) {
  return (
    <div data-slot="photo-attach" className="ez:grid ez:justify-items-start ez:gap-3">
      {previews.length > 0 && (
        <ul className="ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-3 ez:p-0">
          {previews.map((p, i) => (
            <li key={p.key} className="ez:relative">
              <img src={p.src} alt="" className="ez:block ez:size-16 ez:rounded-sm ez:object-cover" />
              <button
                type="button"
                aria-label={`사진 ${i + 1} 지우기`}
                onClick={() => onRemove(p.key)}
                className="ez:absolute ez:-top-2 ez:-right-2 ez:inline-flex ez:size-6 ez:cursor-pointer ez:items-center ez:justify-center ez:rounded-full ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-0 ez:text-fg ez:hover:border-muted"
              >
                <Icon name="x" size="sm" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <label
        className={cn(
          buttonVariants({ variant: "primary", size: "sm" }),
          "ez:has-focus-visible:outline-2 ez:has-focus-visible:outline-offset-2 ez:has-focus-visible:outline-primary",
          disabled && "ez:cursor-not-allowed ez:opacity-45",
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled}
          className="ez:sr-only"
          onChange={(e) => {
            const files = [...(e.target.files ?? [])];
            e.target.value = "";
            onPick(files);
          }}
        />
        <Icon name="plus" size="sm" />
        {label}
        <span className="ez:tabular-nums">
          {count}/{max}
        </span>
      </label>
    </div>
  );
}
