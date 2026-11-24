import NextLink from "next/link";
import type { ReactNode } from "react";
import { DotLine } from "../../components/dot-line";
import { Photo } from "../../components/photo";
import { cn } from "../../utils/cn";
import { pointTag } from "../../utils/styles";
import { STAR_PATH } from "../../components/star-row";

export function BookingFrame({ action, main, card }: { action: string; main: ReactNode; card: ReactNode }) {
  return (
    <form action={action} method="get" data-slot="booking-frame" className="ez:grid ez:gap-10 ez:text-fg ez:lg:grid-cols-[minmax(0,1fr)_420px] ez:lg:items-start ez:lg:gap-x-24">
      <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-12 ez:lg:gap-16">{main}</div>
      <aside data-slot="booking-card" className="ez:grid ez:gap-6 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-6 ez:lg:sticky ez:lg:top-8 ez:lg:p-8">
        {card}
      </aside>
    </form>
  );
}

export function PhotoCollage({ images, name, kind = "stay" }: { images: (string | null)[]; name: string; kind?: "stay" | "class" }) {
  const full = kind === "stay" ? 5 : 3;
  const filled = images.filter(Boolean) as string[];
  const count = filled.length === 0 || filled.length >= full ? full : Math.min(filled.length, 3);
  const shown = Array.from({ length: count }, (_, i) => filled[i] ?? null);
  return (
    <div
      data-slot="photo-collage"
      data-count={count}
      className={cn(
        "ez:grid ez:gap-3",
        kind === "class" ? "ez:lg:h-120" : "ez:lg:h-140",
        count === 1 && "ez:grid-cols-1",
        count === 2 && "ez:grid-cols-1 ez:lg:grid-cols-[2fr_1fr]",
        count === 3 && "ez:grid-cols-2 ez:lg:grid-cols-[2fr_1fr] ez:lg:grid-rows-2",
        count === 5 && "ez:grid-cols-2 ez:lg:grid-cols-[2fr_1fr_1fr] ez:lg:grid-rows-2",
      )}
    >
      {shown.map((src, i) => (
        <Photo
          key={i}
          src={src}
          alt={i === 0 ? name : ""}
          preload={i === 0}
          tone={i}
          sizes={i === 0 ? "(max-width: 1024px) 100vw, 640px" : "320px"}
          className={cn("ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-full", i === 0 && count > 2 && "ez:col-span-2 ez:lg:col-span-1 ez:lg:row-span-2", i > 2 && "ez:max-lg:hidden")}
        />
      ))}
    </div>
  );
}

const FACT_COLS = ["ez:md:grid-cols-1", "ez:md:grid-cols-2", "ez:md:grid-cols-3", "ez:md:grid-cols-4"];

export function BookingHead({ tag, title, rating, chips, facts }: { tag?: string | null; title: string; rating?: { average: number; count: number; label?: string } | null; chips?: string[]; facts?: { label: string; value: string }[] }) {
  return (
    <div data-slot="booking-head" className="ez:grid ez:gap-6">
      <div className="ez:grid ez:gap-3">
        {tag && (
          <span className={pointTag}>
            <span aria-hidden="true" className="ez:size-1.25 ez:rounded-full ez:bg-primary" />
            {tag}
          </span>
        )}
        <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-4">
          <h1 className="ez:m-0 ez:text-site-page ez:font-light ez:tracking-[-0.04em] ez:lg:text-site-display-md">{title}</h1>
          {rating && rating.count > 0 && (
            <a href="#reviews" className="ez:flex ez:items-center ez:gap-2 ez:pb-2 ez:text-site-small ez:text-fg ez:no-underline">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="ez:size-3.25 ez:text-primary">
                <path fill="currentColor" d={STAR_PATH} />
              </svg>
              <span className="ez:font-medium ez:tabular-nums">{rating.average.toFixed(1)}</span>
              <span className="ez:text-muted">
                {rating.label ?? "후기"} {rating.count}
              </span>
            </a>
          )}
        </div>
      </div>
      {chips && chips.length > 0 && (
        <ul className="ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-2 ez:p-0">
          {chips.map((c) => (
            <li key={c} className="ez:inline-flex ez:h-9.5 ez:items-center ez:rounded-full ez:border ez:border-solid ez:border-site-line ez:px-4 ez:text-site-small">
              {c}
            </li>
          ))}
        </ul>
      )}
      {facts && facts.length > 0 && (
        <dl className={cn("ez:m-0 ez:grid ez:grid-cols-2 ez:border-0 ez:border-y ez:border-solid ez:border-site-line", FACT_COLS[Math.min(facts.length, FACT_COLS.length) - 1])}>
          {facts.map((f, i) => (
            <div key={f.label} className={cn("ez:grid ez:gap-1 ez:py-4", i > 0 && "ez:md:border-0 ez:md:border-l ez:md:border-solid ez:md:border-site-line ez:md:pl-6")}>
              <dt className="ez:text-site-caption ez:text-muted">{f.label}</dt>
              <dd className="ez:m-0 ez:font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export function CardPrice({ amount, unit, tag }: { amount: string; unit: string; tag?: string | null }) {
  return (
    <div className="ez:flex ez:items-baseline ez:justify-between ez:gap-3">
      <p className="ez:m-0 ez:text-site-heading ez:font-medium ez:tabular-nums">
        {amount}
        <span className="ez:text-site-small ez:font-normal ez:text-muted"> / {unit}</span>
      </p>
      {tag && (
        <span className={pointTag}>
          <span aria-hidden="true" className="ez:size-1.25 ez:rounded-full ez:bg-primary" />
          {tag}
        </span>
      )}
    </div>
  );
}

export function CardCells({ cells, children }: { cells: { label: string; value: ReactNode }[]; children?: ReactNode }) {
  return (
    <div className="ez:grid ez:overflow-hidden ez:rounded-sm ez:border ez:border-solid ez:border-site-line">
      <div className="ez:grid ez:grid-cols-2">
        {cells.map((c, i) => (
          <div key={c.label} className={cn("ez:grid ez:gap-0.5 ez:px-4 ez:py-3", i > 0 && "ez:border-0 ez:border-l ez:border-solid ez:border-site-line")}>
            <span className="ez:text-site-caption ez:text-muted">{c.label}</span>
            <span className="ez:font-medium">{c.value}</span>
          </div>
        ))}
      </div>
      {children && <div className="ez:grid ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:px-4 ez:py-3">{children}</div>}
    </div>
  );
}

export function CardRow({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="ez:flex ez:items-center ez:justify-between ez:gap-4 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-5">
      <span className="ez:text-site-lead">{typeof label === "string" && label.includes(" · ") ? <DotLine items={label.split(" · ")} /> : label}</span>
      {children}
    </div>
  );
}

export function CardTotal({ label, value, rows }: { label: string; value: string; rows?: { label: string; value: string; minus?: boolean }[] }) {
  return (
    <div className="ez:grid ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-5">
      {rows?.map((r) => (
        <div key={r.label} className="ez:flex ez:justify-between ez:gap-3 ez:text-site-small">
          <span className="ez:text-muted">{r.label}</span>
          <span className={cn("ez:tabular-nums", r.minus && "ez:text-primary")}>{r.value}</span>
        </div>
      ))}
      <div className="ez:flex ez:items-baseline ez:justify-between ez:gap-3">
        <span>{label}</span>
        <span className="ez:text-site-section ez:font-medium ez:tabular-nums">{value}</span>
      </div>
    </div>
  );
}

export function TimeTiles({ items, value, onChange, name }: { items: { id: string; time: string; note: string; off?: boolean }[]; value: string; onChange: (id: string) => void; name: string }) {
  return (
    <div role="radiogroup" aria-label="시간" className="ez:grid ez:grid-cols-3 ez:gap-2">
      {items.map((t) => (
        <label
          key={t.id}
          className={cn(
            "ez:grid ez:cursor-pointer ez:gap-0.5 ez:rounded-sm ez:border ez:border-solid ez:border-site-line ez:px-3.5 ez:py-3 ez:text-site-small",
            "ez:has-checked:border-primary ez:has-checked:text-primary ez:has-focus-visible:outline-2 ez:has-focus-visible:outline-primary",
            t.off && "ez:cursor-not-allowed ez:text-site-off",
          )}
        >
          <input type="radio" name={name} value={t.id} checked={value === t.id} disabled={t.off} onChange={() => onChange(t.id)} className="ez:sr-only" />
          <span className={cn("ez:text-site-lead ez:tabular-nums", t.off && "ez:line-through")}>{t.time}</span>
          <span className="ez:text-site-caption">{t.note}</span>
        </label>
      ))}
    </div>
  );
}

export function SectionSplit({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="ez:grid ez:gap-5 ez:text-fg ez:md:grid-cols-[180px_minmax(0,1fr)] ez:md:gap-6">
      <h2 className="ez:m-0 ez:text-site-heading">{title}</h2>
      <div className="ez:min-w-0">{children}</div>
    </section>
  );
}

export function RoomShelf({ title, rooms }: { title: string; rooms: { id: string; name: string; image?: string | null; price: string; unit: string }[] }) {
  if (!rooms.length) return null;
  return (
    <section data-slot="room-shelf" className="ez:mx-[calc(50%-50vw)] ez:bg-surface-alt ez:text-fg">
      <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:gap-8 ez:px-page ez:py-16 ez:lg:py-24">
        <h2 className="ez:m-0 ez:text-site-section">{title}</h2>
        <div className="ez:grid ez:gap-gutter ez:md:grid-cols-2">
          {rooms.slice(0, 2).map((r, i) => (
            <NextLink key={r.id} href={`/products/${r.id}`} className="ez:grid ez:gap-4 ez:text-fg ez:no-underline">
              <Photo src={r.image} alt={r.name} tone={i} sizes="(max-width: 768px) 100vw, 640px" className="ez:aspect-[16/9]" />
              <span className="ez:flex ez:items-baseline ez:justify-between ez:gap-4">
                <span className="ez:text-site-heading">{r.name}</span>
                <span className="ez:font-medium ez:tabular-nums">
                  {r.price}
                  <span className="ez:text-site-small ez:font-normal ez:text-muted"> / {r.unit}</span>
                </span>
              </span>
            </NextLink>
          ))}
        </div>
      </div>
    </section>
  );
}
