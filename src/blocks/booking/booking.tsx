import NextLink from "next/link";
import type { ReactNode } from "react";
import { DotLine } from "../../components/dot-line";
import { Photo } from "../../components/photo";
import { cn } from "../../utils/cn";
import { infoRows, pointTag } from "../../utils/styles";
import { STAR_PATH } from "../../components/star-row";
import type { StayBreakdown } from "../../types";
import { won } from "../../utils/format";

export function PhotoCollage({ images, name, kind = "stay" }: { images: (string | null)[]; name: string; kind?: "stay" | "class" }) {
  const full = kind === "stay" ? 5 : 3;
  const filled = images.filter(Boolean) as string[];
  const count = filled.length === 0 || filled.length >= full ? full : Math.min(filled.length, 3);
  const shown = Array.from({ length: count }, (_, i) => filled[i] ?? null);
  const collage = (
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
  if (kind !== "stay" || filled.length < 2) return collage;
  return (
    <div className="ez:grid ez:gap-3">
      {collage}
      <p data-slot="photo-count" aria-hidden="true" className="ez:m-0 ez:text-right ez:text-site-small ez:text-muted ez:tabular-nums">
        1 / {filled.length}
      </p>
    </div>
  );
}

export function BookingRows({ rows, ruled = false }: { rows: { label: string; value: ReactNode }[]; ruled?: boolean }) {
  return (
    <table data-slot="booking-rows" className={infoRows.table}>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className={cn("ez:border-0 ez:border-b ez:border-solid ez:border-site-line", ruled && "ez:first:border-t")}>
            <th scope="row" className={infoRows.label}>
              {r.label}
            </th>
            <td className={infoRows.value}>{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function BookingHead({ tag, title, rating, facts }: { tag?: string | null; title: string; rating?: { average: number; count: number; label?: string } | null; facts?: { label: string; value: string }[] }) {
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
          <h1 className="ez:m-0 ez:text-site-page ez:lg:text-site-display-md">{title}</h1>
          {rating && rating.count > 0 && (
            <a href="#reviews" className="ez:flex ez:items-center ez:gap-2 ez:pb-2 ez:text-site-small ez:text-fg ez:no-underline">
              <svg viewBox="0 0 24 24" aria-hidden="true" data-star="on" className="ez:size-3.25 ez:text-primary">
                <path fill="currentColor" d={STAR_PATH} />
              </svg>
              <span className="ez:font-normal ez:tabular-nums">{rating.average.toFixed(1)}</span>
              <span className="ez:text-muted">
                {rating.label ?? "후기"} {rating.count}
              </span>
            </a>
          )}
        </div>
      </div>
      {facts && facts.length > 0 && <BookingRows rows={facts} ruled />}
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
            <span className="ez:font-normal">{c.value}</span>
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

export function stayCharges(stay: StayBreakdown): { rows: { label: string; value: number }[]; onsite: number } {
  const same = stay.night_prices.length > 0 && stay.night_prices.every((p) => p === stay.night_prices[0]);
  const guests = [stay.extra_adults > 0 && `성인 ${stay.extra_adults}명`, stay.extra_children > 0 && `아동 ${stay.extra_children}명`].filter(Boolean).join(" · ");
  const rows = [
    { label: same ? `객실 요금 ${won(stay.night_prices[0])} × ${stay.nights}박` : `객실 요금 ${stay.nights}박`, value: stay.room_total },
    { label: guests ? `추가 인원 ${guests} × ${stay.nights}박` : "추가 인원", value: stay.extra_total },
    ...stay.add_ons.map((a) => ({ label: a.name, value: a.amount })),
  ];
  return { rows: rows.filter((r) => r.value > 0), onsite: stay.onsite_total };
}

export function CardTotal({ label, value, rows, after }: { label: string; value: string; rows?: { label: string; value: string; minus?: boolean }[]; after?: { label: string; value: string }[] }) {
  return (
    <div className="ez:grid ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-5">
      {rows?.map((r, i) => (
        <div key={`${i}-${r.label}`} data-slot="card-total-row" className="ez:flex ez:items-baseline ez:justify-between ez:gap-3">
          <span className="ez:text-site-small ez:text-muted">{r.label}</span>
          <span className={cn("ez:text-site-body ez:tabular-nums", r.minus && "ez:text-primary")}>{r.value}</span>
        </div>
      ))}
      <div className="ez:flex ez:items-baseline ez:justify-between ez:gap-3">
        <span>{label}</span>
        <span className="ez:text-site-section ez:tabular-nums">{value}</span>
      </div>
      {after?.map((r, i) => (
        <div key={`${i}-${r.label}`} data-slot="card-total-after" className="ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:text-site-small ez:text-muted">
          <span>{r.label}</span>
          <span className="ez:tabular-nums">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function TimeTiles({ items, value, onChange, name }: { items: { id: string; time: string; note: string; off?: boolean }[]; value: string; onChange: (id: string) => void; name: string }) {
  return (
    <div role="radiogroup" aria-label="시간" className="ez:grid ez:grid-cols-3 ez:gap-2">
      {items.map((t) => (
        <label
          key={t.id}
          data-choice=""
          className={cn(
            "ez:grid ez:cursor-pointer ez:gap-0.5 ez:rounded-button ez:border ez:border-solid ez:border-site-line ez:px-3.5 ez:py-3 ez:text-site-small",
            "ez:has-checked:border-primary ez:has-focus-visible:outline-2 ez:has-focus-visible:outline-primary",
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
    <section id={id} className="ez:grid ez:gap-5 ez:text-fg">
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
                <span className="ez:font-normal ez:tabular-nums">
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
