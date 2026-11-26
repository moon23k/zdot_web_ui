import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Button } from "../../components/button";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { StarRow } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing, textLink } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, BlankStars, Lines } from "../kit";
import type { FooterLink } from "../shop/types";
import { DateInput, DateText, GuestSelect, NightsText, SelectedDot, StayForm } from "./booking";
import { AmenityIcon } from "./icons";
import { StayNavLinks } from "./nav";
import { roomNotes, ROOMS_HREF, roomView, STAY_TITLE, stayDates } from "./shared";
import type { RoomView, StayFooterProps, StayHeaderProps, StayListProps } from "./types";
import { MAP_LABEL, SampleMap } from "./map";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const bleed = "ez:mx-[calc(50%-50vw)]";

const line = "ez:border-0 ez:border-solid ez:border-site-line";

const link = cn(textLink, "ez:font-normal ez:text-site-body");

const strongLink = cn(textLink, "ez:text-site-body");

const subLink = cn(textLink, "ez:border-site-line ez:font-normal ez:text-site-body ez:text-muted");

const select = cn("ez:m-0 ez:cursor-pointer ez:appearance-none ez:border-0 ez:bg-transparent ez:p-0 ez:font-body", focusRing);

function Head({ title }: { title: string }) {
  return (
    <div className="ez:grid ez:justify-items-center ez:text-center">
      <h2 data-script={scriptOf(title)} className="ez:m-0 ez:font-display ez:text-site-heading ez:lg:text-site-title">{title}</h2>
    </div>
  );
}

function Foot({ href, label = STAY_TITLE.more }: { href: string; label?: string }) {
  return (
    <div className="ez:mt-12 ez:flex ez:justify-center ez:lg:mt-16">
      <NextLink href={href} className={cn(link, focusRing)}>
        {label}
      </NextLink>
    </div>
  );
}

const body = "ez:mt-8 ez:lg:mt-14";

export function Header({ name, logoUrl, nav, links }: StayHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="float" className="ez:bg-surface">
      <div className={cn(line, "ez:border-b")}>
        <div className="ez:mx-auto ez:grid ez:min-h-16 ez:max-w-wrap ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-6 ez:px-page ez:lg:min-h-22 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:gap-8 ez:overflow-hidden ez:whitespace-nowrap ez:text-site-body ez:max-lg:hidden">
            <StayNavLinks items={nav} className="ez:py-1.5 ez:text-fg ez:no-underline" currentClassName="ez:font-medium" />
          </nav>
          <NextLink
            data-script={scriptOf(name)}
            href="/"
            className={cn(
              "ez:min-w-0 ez:font-display ez:text-site-heading ez:leading-none ez:text-fg ez:no-underline ez:lg:justify-self-center ez:lg:text-center ez:lg:text-site-logo",
              focusRing,
            )}
          >
            <SiteLogo name={name} src={logoUrl} />
          </NextLink>
          <div className="ez:flex ez:items-center ez:justify-end ez:gap-5 ez:whitespace-nowrap ez:lg:gap-9">
            <NextLink href={links.account.href} className={cn("ez:py-1.5 ez:text-site-body ez:text-fg ez:no-underline", focusRing)}>
              {links.account.label}
            </NextLink>
            <NextLink href={links.book.href} className={cn(strongLink, focusRing)}>
              {links.book.label}
            </NextLink>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Hero({ data }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const image = data.image ?? data.images?.[0] ?? null;
  const sub = title ? data.sub?.trim() || null : null;
  const blank = !title && !image;
  const over = Boolean(image);
  return (
    <section
      data-slot="hero"
      data-variant={over ? "full" : "plain"}
      data-blank={blank ? "" : undefined}
      data-bleed=""
      className={cn("ez:relative ez:h-130 ez:overflow-hidden ez:lg:h-195", bleed)}
    >
      <Photo src={image} alt="" preload sizes="100vw" tone={0} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
      {over && <span aria-hidden="true" className="ez:absolute ez:inset-x-0 ez:top-0 ez:h-32 ez:bg-linear-to-b ez:from-surface/85 ez:to-transparent ez:lg:h-40" />}
      {title && over && <span aria-hidden="true" className="ez:absolute ez:inset-x-0 ez:bottom-0 ez:h-3/5 ez:bg-linear-to-t ez:from-surface/90 ez:via-surface/60 ez:to-transparent" />}
      {title && (
        <div className="ez:absolute ez:inset-x-0 ez:bottom-12 ez:mx-auto ez:max-w-wrap ez:px-page ez:lg:bottom-28">
          <div className="ez:flex ez:flex-col ez:items-start ez:gap-5 ez:text-fg">
            <h1 data-script={scriptOf(title)} className="ez:m-0 ez:max-w-4xl ez:font-display ez:text-site-page ez:text-balance ez:lg:text-site-display-lg">{title}</h1>
            {sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:max-w-xl ez:text-site-body">
                {sub}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

const strip = "ez:relative ez:z-1 ez:text-fg ez:lg:[[data-slot=hero][data-variant=full]+&]:-mt-[calc(var(--ezd-section-gap)+48px)]";

const stripGrid = cn(line, "ez:grid ez:grid-cols-2 ez:border ez:bg-surface ez:md:min-h-24 ez:md:grid-cols-[1fr_1fr_1fr_auto]");

const CELLS = [
  "ez:border-r",
  "ez:md:border-r",
  "ez:col-span-2 ez:border-t ez:md:col-span-1 ez:md:border-t-0 ez:md:border-r",
];

function cell(i: number) {
  return cn(line, "ez:relative ez:flex ez:min-w-0 ez:flex-col ez:justify-center ez:gap-1.5 ez:px-5 ez:py-4 ez:md:px-8 ez:md:py-0", CELLS[i]);
}

const cellLabel = "ez:text-site-small ez:text-muted";

const cellValue = "ez:flex ez:items-center ez:gap-2.5 ez:text-site-item ez:font-normal";

const go = "ez:col-span-2 ez:flex ez:h-auto ez:min-h-14 ez:items-center ez:justify-center ez:gap-3.5 ez:rounded-none ez:px-11 ez:font-body ez:text-site-body ez:md:col-span-1 ez:md:min-h-0";

export function Booking({ data }: SectionProps<"booking_strip">) {
  const labels = [STAY_TITLE.dateIn, STAY_TITLE.dateOut, STAY_TITLE.guests];
  if (!data?.max) {
    return (
      <section data-slot="booking-strip" data-blank="" className={strip}>
        <div className={stripGrid}>
          {labels.map((label, i) => (
            <div key={label} className={cell(i)}>
              <span className={cellLabel}>{label}</span>
              <span className={cellValue}>
                <Bar size="short" />
              </span>
            </div>
          ))}
          <BlankButton variant="outline" className={cn(go, "ez:border-0 ez:bg-surface-alt")}>
            {STAY_TITLE.find}
          </BlankButton>
        </div>
      </section>
    );
  }
  return (
    <section data-slot="booking-strip" className={strip}>
      <StayForm max={data.max} action={data.href ?? undefined} className={stripGrid}>
        <label className={cell(0)}>
          <span className={cellLabel}>{labels[0]}</span>
          <span className={cellValue}>
            <DateText which="check_in" emptyClassName="ez:text-muted" />
            <SelectedDot className="ez:ml-0.5" />
          </span>
          <DateInput which="check_in" />
        </label>
        <label className={cell(1)}>
          <span className={cellLabel}>{labels[1]}</span>
          <span className={cellValue}>
            <DateText which="check_out" emptyClassName="ez:text-muted" />
          </span>
          <DateInput which="check_out" />
        </label>
        <div className={cell(2)}>
          <span className={cellLabel}>{labels[2]}</span>
          <span className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-2.5">
            <span className="ez:inline-flex ez:items-baseline ez:gap-1 ez:text-site-item ez:font-normal">
              {STAY_TITLE.adults}
              <GuestSelect who="adults" className={cn(select, "ez:text-site-item ez:font-normal ez:text-fg")} />
            </span>
            <span aria-hidden="true" className="ez:text-muted">
              ·
            </span>
            <span className="ez:inline-flex ez:items-baseline ez:gap-1 ez:text-site-body ez:text-muted">
              {STAY_TITLE.children}
              <GuestSelect who="children" className={cn(select, "ez:text-site-body ez:text-muted")} />
            </span>
          </span>
        </div>
        <Button type="submit" className={go}>
          {STAY_TITLE.find}
          <Icon name="right" />
        </Button>
      </StayForm>
    </section>
  );
}

export function Story({ data }: SectionProps<"testimonial">) {
  const first = data.items?.[0];
  const quote = data.quote?.trim();
  const review = quote
    ? { body: quote, name: data.name ?? null, rating: null, date: null }
    : first
      ? { body: first.body, name: first.name, rating: first.rating, date: first.date ?? null }
      : null;
  return (
    <section data-slot="testimonial" data-blank={review ? undefined : ""} data-bleed="" className={cn("ez:grid ez:bg-surface-alt ez:text-fg ez:lg:grid-cols-2", bleed)}>
      <Photo src={data.image} alt="" sizes="(max-width: 1024px) 100vw, 50vw" tone={1} className="ez:aspect-[4/5] ez:rounded-none ez:lg:aspect-auto ez:lg:h-225" />
      <div className="ez:flex ez:flex-col ez:items-start ez:justify-center ez:gap-6 ez:px-page ez:py-14 ez:lg:gap-7 ez:lg:px-30 ez:lg:py-20">
        {review ? (
          <figure className="ez:m-0 ez:grid ez:max-w-130 ez:gap-6 ez:lg:gap-7">
            {review.rating != null && <StarRow rating={review.rating} className="ez:text-muted" />}
            <blockquote data-script={scriptOf(review.body)} className="ez:m-0 ez:line-clamp-6 ez:font-display ez:text-site-heading ez:lg:text-site-name">{review.body}</blockquote>
            {(review.name || review.date) && (
              <figcaption className="ez:flex ez:flex-wrap ez:gap-x-3 ez:text-site-body ez:text-muted">
                {review.name && <span>{review.name}</span>}
                {review.date && <span>{review.date}</span>}
              </figcaption>
            )}
          </figure>
        ) : (
          <div aria-hidden="true" className="ez:grid ez:w-full ez:max-w-100 ez:gap-6">
            <BlankStars />
            <Lines strong className="ez:text-site-name" />
            <span className="ez:text-site-body">
              <Bar size="short" />
            </span>
          </div>
        )}
        {review && (
          <NextLink href={ROOMS_HREF} className={cn(link, focusRing, "ez:mt-2")}>
            {STAY_TITLE.view}
          </NextLink>
        )}
      </div>
    </section>
  );
}

type Fact = { label: string; value: ReactNode };

function Facts({ rows }: { rows: Fact[] }) {
  return (
    <dl className={cn(line, "ez:m-0 ez:border-t")}>
      {rows.map((r) => (
        <div key={r.label} className={cn(line, "ez:grid ez:grid-cols-[1fr_3fr] ez:gap-4 ez:border-b ez:py-3 ez:text-site-body")}>
          <dt className="ez:text-muted">{r.label}</dt>
          <dd className="ez:m-0 ez:text-fg">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function rowGrid(flip: boolean) {
  return cn("ez:grid ez:items-center ez:gap-7 ez:lg:gap-0", flip ? "ez:lg:grid-cols-[2fr_3fr]" : "ez:lg:grid-cols-[3fr_2fr]");
}

function rowText(flip: boolean) {
  return cn("ez:min-w-0 ez:max-w-130", flip ? "ez:lg:pr-24" : "ez:lg:pl-24");
}

const rowName = "ez:m-0 ez:mb-6 ez:font-display ez:text-site-counter ez:md:text-site-name";

function Small({ items, className }: { items: (string | null | undefined)[]; className?: string }) {
  const shown = items.filter((t): t is string => Boolean(t));
  if (!shown.length) return null;
  return (
    <p className={cn("ez:m-0 ez:flex ez:flex-wrap ez:items-center ez:text-site-note ez:text-muted", className)}>
      {shown.map((t, i) => (
        <span key={`${t}-${i}`} className={cn(i > 0 && cn(line, "ez:ml-3 ez:border-l ez:pl-3"))}>
          {t}
        </span>
      ))}
    </p>
  );
}

function RoomRow({ v, index, list, dates }: { v: RoomView; index: number; list?: boolean; dates?: string | null }) {
  const flip = index % 2 === 1;
  const q = v.quote;
  const full = q?.state === "full";
  const Name = list ? "h2" : "h3";
  const state = full ? [] : roomNotes(v);
  return (
    <article data-slot="room-card" data-state={q?.state} data-sample={v.sample || undefined} className={rowGrid(flip)}>
      <NextLink href={v.href} className={cn("ez:block ez:min-w-0", flip && "ez:lg:order-2", focusRing)}>
        <Photo src={v.image} alt={v.name} tone={index} sizes="(max-width: 1024px) 100vw, 800px" className={cn("ez:aspect-[3/2]", full && "ez:opacity-45")} />
      </NextLink>
      <div className={rowText(flip)}>
        {v.sample && <span className="ez:mb-3 ez:block ez:text-site-small ez:text-muted">{STAY_TITLE.sample}</span>}
        <Name data-script={scriptOf(v.name)} className={cn(rowName, full ? "ez:text-muted" : "ez:text-fg")}>{v.name}</Name>
        {list ? (
          <>
            <Facts
              rows={[
                ...(v.guests ? [{ label: STAY_TITLE.guests, value: v.guests }] : []),
                ...(v.times ? [{ label: STAY_TITLE.times, value: v.times }] : []),
              ]}
            />
            <div className="ez:mt-7 ez:mb-1.5 ez:flex ez:flex-col">
              {q && <span className="ez:text-site-note ez:text-muted">{[dates, q.nights].filter(Boolean).join(" · ")}</span>}
              <span className={cn("ez:text-site-heading", q ? "ez:font-medium" : "ez:font-normal", full ? "ez:text-muted" : "ez:text-fg")}><Won value={q ? q.price : v.from} /></span>
            </div>
            <div className="ez:mb-8 ez:min-h-5">
              {full ? <p data-script={scriptOf(q?.note)} className="ez:m-0 ez:text-site-note ez:font-normal ez:text-fg">{q?.note}</p> : <Small items={state} />}
            </div>
            <div className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-8">
              {v.book && (
                <NextLink href={v.book} className={cn(strongLink, focusRing)}>
                  {STAY_TITLE.book}
                </NextLink>
              )}
              <NextLink href={v.href} className={cn(v.book ? subLink : link, focusRing)}>
                {STAY_TITLE.view}
              </NextLink>
            </div>
          </>
        ) : (
          <>
            <Facts rows={[...(v.guests ? [{ label: STAY_TITLE.guests, value: v.guests }] : []), { label: STAY_TITLE.price, value: v.from }]} />
            <Small items={state} className="ez:mt-3" />
            <div className="ez:mt-9 ez:flex ez:flex-wrap ez:items-baseline ez:gap-8">
              <NextLink href={v.href} className={cn(link, focusRing)}>
                {STAY_TITLE.view}
              </NextLink>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function BlankRow({ index }: { index: number }) {
  const flip = index % 2 === 1;
  return (
    <div className={rowGrid(flip)}>
      <div className={cn("ez:min-w-0", flip && "ez:lg:order-2")}>
        <Photo src={null} alt="" tone={index} className="ez:aspect-[3/2]" />
      </div>
      <div className={rowText(flip)}>
        <span className={cn(rowName, "ez:block")}>
          <Bar size="short" strong />
        </span>
        <Facts
          rows={[
            { label: STAY_TITLE.guests, value: <Bar /> },
            { label: STAY_TITLE.price, value: <BlankPrice className="ez:font-normal" /> },
          ]}
        />
      </div>
    </div>
  );
}

const rows = "ez:flex ez:flex-col ez:gap-20 ez:lg:gap-30";

export function Rooms({ data }: SectionProps<"room_list">) {
  const views = (data.rooms ?? []).slice(0, 2).map(roomView);
  return (
    <section data-slot="room-list" id="rooms" data-blank={views.length ? undefined : ""} className="ez:grid ez:text-fg">
      <Head title={STAY_TITLE.rooms} />
      <div className={cn(body, rows)}>
        {views.length ? views.map((v, i) => <RoomRow key={v.id} v={v} index={i} />) : [0, 1].map((i) => <BlankRow key={i} index={i} />)}
      </div>
      {views.length > 0 && <Foot href={ROOMS_HREF} />}
    </section>
  );
}

const MOSAIC = ["ez:col-span-2 ez:aspect-[4/3] ez:md:row-span-2 ez:md:aspect-auto", "", "", "", ""];

const EVEN: Record<number, string> = {
  1: "ez:grid-cols-1",
  2: "ez:grid-cols-2",
  3: "ez:grid-cols-2 ez:md:grid-cols-3",
  4: "ez:grid-cols-2 ez:lg:grid-cols-4",
};

export function Gallery({ data }: SectionProps<"gallery">) {
  const images = (data.images ?? []).slice(0, 5);
  const mosaic = images.length === 0 || images.length === 5;
  const tiles = images.length ? images : [null, null, null, null, null];
  return (
    <section data-slot="gallery" id="gallery" data-blank={images.length ? undefined : ""} className="ez:grid ez:text-fg">
      <Head title={STAY_TITLE.gallery} />
      {mosaic ? (
        <div className={cn(body, "ez:grid ez:grid-cols-2 ez:gap-2 ez:md:h-100 ez:md:grid-cols-4 ez:md:grid-rows-2 ez:lg:h-132")}>
          {tiles.map((src, i) => (
            <Photo
              key={src ?? i}
              src={src}
              alt=""
              tone={i}
              sizes={i === 0 ? "(max-width: 768px) 100vw, 660px" : "(max-width: 768px) 50vw, 330px"}
              className={cn("ez:aspect-square ez:md:aspect-auto ez:md:h-full", MOSAIC[i])}
            />
          ))}
        </div>
      ) : (
        <div className={cn(body, "ez:grid ez:gap-2", EVEN[images.length])}>
          {images.map((src, i) => (
            <Photo key={src} src={src} alt="" tone={i} sizes="(max-width: 768px) 50vw, 440px" className={cn("ez:aspect-[4/3]", images.length === 3 && i === 0 && "ez:col-span-2 ez:md:col-span-1")} />
          ))}
        </div>
      )}
    </section>
  );
}

const AMENITY_COLS: Record<number, string> = {
  1: "ez:grid-cols-1",
  2: "ez:grid-cols-2",
  3: "ez:grid-cols-3",
  4: "ez:grid-cols-2 ez:md:grid-cols-4",
};

export function Amenities({ data }: SectionProps<"amenities">) {
  const items = data.items ?? [];
  const cols = AMENITY_COLS[items.length] ?? "ez:grid-cols-2 ez:md:grid-cols-3 ez:lg:grid-cols-5";
  return (
    <section data-slot="amenities" id="amenities" data-blank={items.length ? undefined : ""} className="ez:grid ez:text-fg">
      <Head title={STAY_TITLE.amenities} />
      <ul className={cn("ez:m-0", body, line, "ez:grid ez:list-none ez:border-t ez:p-0", items.length ? cols : "ez:grid-cols-2 ez:md:grid-cols-5")}>
        {items.length
          ? items.map((it, i) => (
              <li key={`${it.name}-${i}`} className={cn(line, "ez:flex ez:flex-col ez:items-center ez:gap-3.5 ez:border-b ez:px-2 ez:pt-10 ez:pb-9 ez:text-center ez:text-site-body")}>
                <AmenityIcon name={it.name} size="lg" className="ez:text-muted" />
                <span className="ez:break-keep">{it.name}</span>
              </li>
            ))
          : [0, 1, 2, 3, 4].map((i) => (
              <li key={i} className={cn(line, "ez:flex ez:flex-col ez:items-center ez:border-b ez:pt-10 ez:pb-9 ez:text-site-body")}>
                <Bar size="short" />
              </li>
            ))}
      </ul>
    </section>
  );
}

const infoCol = cn(line, "ez:grid ez:content-start ez:gap-7 ez:py-10 ez:md:px-8 ez:md:pt-12 ez:md:pb-14 ez:lg:px-12");

const infoHead = "ez:m-0 ez:text-site-body ez:font-normal ez:text-fg";

function Clock({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="ez:grid ez:gap-1.5">
      <span className="ez:text-site-note ez:text-muted">{label}</span>
      <span className="ez:font-body ez:text-site-figure-lg ez:lg:text-site-page">{value || <Bar size="short" />}</span>
    </div>
  );
}

type CancelLine = { group: string } | { label: ReactNode; value?: ReactNode };

export function Info({ data }: SectionProps<"house_rules">) {
  const rules = data.rules ?? [];
  const cancel: CancelLine[] = [...(data.cancel?.rows ?? []), ...(data.cancel?.groups ?? []).flatMap((g) => [{ group: g.title }, ...g.rows])];
  const blank = !data.check_in && !data.check_out && !rules.length && !cancel.length;
  return (
    <section data-slot="house-rules" id="rules" data-blank={blank ? "" : undefined} className="ez:grid ez:text-fg">
      <Head title={STAY_TITLE.info} />
      <div className={cn(body, line, "ez:grid ez:border-y ez:md:grid-cols-3")}>
        <div className={cn(infoCol, "ez:md:pl-0 ez:lg:pl-0")}>
          <h3 className={infoHead}>{STAY_TITLE.times}</h3>
          <div className="ez:flex ez:flex-wrap ez:gap-x-14 ez:gap-y-6">
            <Clock label={STAY_TITLE.checkIn} value={data.check_in} />
            <Clock label={STAY_TITLE.checkOut} value={data.check_out} />
          </div>
        </div>
        <div className={cn(infoCol, "ez:border-t ez:md:border-t-0 ez:md:border-l")}>
          <h3 className={infoHead}>{STAY_TITLE.rules}</h3>
          <ul className="ez:m-0 ez:grid ez:list-none ez:p-0">
            {rules.length ? (
              rules.map((r, i) => (
                <li data-script={scriptOf(r)} key={`${r}-${i}`} className={cn(line, "ez:border-b ez:py-2.5 ez:text-site-body ez:text-muted ez:first:pt-0 ez:last:border-b-0")}>
                  {r}
                </li>
              ))
            ) : (
              <li className="ez:text-site-body">
                <Bar />
              </li>
            )}
          </ul>
        </div>
        <div className={cn(infoCol, "ez:border-t ez:md:border-t-0 ez:md:border-l ez:md:pr-0 ez:lg:pr-0")}>
          <h3 className={infoHead}>{STAY_TITLE.cancel}</h3>
          {cancel.length ? (
            <table className="ez:w-full ez:border-collapse ez:text-site-body">
              <tbody>
                {cancel.map((r, i) =>
                  "group" in r ? (
                    <tr key={i} className={cn(line, "ez:border-b")}>
                      <th scope="colgroup" colSpan={2} className="ez:w-auto ez:border-0 ez:pt-5 ez:pb-2.5 ez:text-left ez:font-normal ez:text-fg">
                        {r.group}
                      </th>
                    </tr>
                  ) : (
                    <tr key={i} className={cn(line, "ez:border-b ez:last:border-b-0")}>
                      <th scope="row" className="ez:w-auto ez:border-0 ez:py-2.5 ez:pr-4 ez:text-left ez:font-normal ez:text-muted">
                        {r.label}
                      </th>
                      <td className="ez:border-0 ez:py-2.5 ez:text-right ez:text-fg">{r.value}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          ) : (
            <span className="ez:text-site-body">
              <Bar />
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export function Wide({ data }: SectionProps<"photo_band">) {
  const image = data.image ?? data.images?.[0] ?? null;
  return (
    <section data-slot="photo-band" data-blank={image ? undefined : ""} data-bleed="" className={cn("ez:grid", bleed)}>
      <Photo src={image} alt="" sizes="100vw" tone={2} className="ez:aspect-auto ez:h-75 ez:rounded-none ez:md:h-105 ez:lg:h-135" />
    </section>
  );
}

export function Location({ data }: SectionProps<"location">) {
  const address = data.address?.trim() || null;
  const map = "ez:flex ez:h-75 ez:w-full ez:items-center ez:justify-center ez:bg-surface-alt ez:text-muted ez:lg:h-120";
  const pin = <Icon name="pin" className="ez:size-10" />;
  return (
    <section data-slot="location" id="location" data-blank={address ? undefined : ""} className="ez:grid ez:text-fg">
      <Head title={STAY_TITLE.location} />
      <div className={cn(body, "ez:grid ez:items-start ez:gap-x-18 ez:gap-y-8 ez:lg:grid-cols-[2fr_1fr]")}>
        {address && data.href ? (
          <a href={data.href} target="_blank" rel="noopener" aria-label={MAP_LABEL} className={cn(map, "ez:relative ez:overflow-hidden ez:text-fg ez:no-underline", focusRing)}>
            <SampleMap />
            <span className="ez:relative">{pin}</span>
          </a>
        ) : (
          <div className={map}>{pin}</div>
        )}
        <dl className={cn(line, "ez:m-0 ez:border-t")}>
          <div className={cn(line, "ez:grid ez:gap-1.5 ez:border-b ez:py-5")}>
            <dt className="ez:text-site-note ez:text-muted">{STAY_TITLE.address}</dt>
            <dd data-script={scriptOf(address)} className="ez:m-0 ez:text-site-item ez:font-normal ez:leading-relaxed">{address ?? <Bar size="long" />}</dd>
          </div>
          <div className={cn(line, "ez:grid ez:gap-1.5 ez:border-b ez:py-5")}>
            <dt className="ez:text-site-note ez:text-muted">{STAY_TITLE.phone}</dt>
            <dd className="ez:m-0 ez:text-site-item ez:font-normal">
              {data.phone ? (
                <a href={`tel:${data.phone}`} className={cn("ez:text-fg ez:no-underline ez:underline-offset-4 ez:hover:underline", focusRing)}>
                  {data.phone}
                </a>
              ) : (
                <Bar />
              )}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  const room = (id?: string | null) => (id ? context.products.find((p) => p.id === id)?.name : undefined);
  return (
    <section data-slot="reviews" id="reviews" data-blank={items.length ? undefined : ""} className="ez:grid ez:text-fg">
      <Head title={STAY_TITLE.reviews} />
      <div className="ez:mt-6 ez:flex ez:flex-wrap ez:items-center ez:justify-center ez:gap-x-4.5 ez:gap-y-2 ez:lg:mt-10">
        {items.length ? (
          <>
            {data.average != null && <span className="ez:font-body ez:text-site-figure-lg ez:lg:text-site-page">{data.average.toFixed(1)}</span>}
            {data.average != null && <StarRow rating={data.average} className="ez:text-muted" />}
            {data.count != null && <span className="ez:text-site-body ez:text-muted">{`${STAY_TITLE.reviews} ${data.count}`}</span>}
          </>
        ) : (
          <>
            <span className="ez:text-site-figure-lg">
              <Bar size="short" strong />
            </span>
            <BlankStars />
          </>
        )}
      </div>
      <div className="ez:mt-10 ez:-mx-3 ez:flex ez:flex-wrap ez:justify-center ez:gap-y-10 ez:lg:mt-14">
        {items.length
          ? items.map((r, i) => {
              const meta = [room(r.product) ?? r.name, r.date].filter((t): t is string => Boolean(t));
              return (
                <div key={`${r.name}-${i}`} className="ez:w-full ez:px-3 ez:md:w-1/3">
                  <article className={cn(line, "ez:grid ez:content-start ez:gap-5 ez:border-t ez:pt-8")}>
                    <StarRow rating={r.rating} className="ez:text-muted" />
                    <p data-script={scriptOf(r.body)} className="ez:m-0 ez:line-clamp-4 ez:text-site-item ez:font-normal ez:leading-relaxed">{r.body}</p>
                    {meta.length > 0 && <Small items={meta} className="ez:mt-1" />}
                  </article>
                </div>
              );
            })
          : [0, 1, 2].map((i) => (
              <div key={i} className="ez:w-full ez:px-3 ez:md:w-1/3">
                <div aria-hidden="true" className={cn(line, "ez:grid ez:content-start ez:gap-5 ez:border-t ez:pt-8")}>
                  <BlankStars />
                  <Lines className="ez:text-site-item" />
                  <span className="ez:text-site-note">
                    <Bar size="short" />
                  </span>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}

function FooterNav({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:grid ez:content-start ez:gap-4 ez:lg:gap-5">
      <span data-script={scriptOf(title)} className="ez:text-site-note ez:text-muted">{title}</span>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-1 ez:p-0">
        {items.map((l) => (
          <li key={l.href} className="ez:text-site-body ez:leading-loose">
            <NextLink href={l.href} className={cn("ez:text-fg ez:no-underline ez:underline-offset-4 ez:hover:underline", l.strong && "ez:font-medium", focusRing)}>
              {l.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer({ storeName, phone, hours, legal, stay, guide, account, terms }: StayFooterProps) {
  return (
    <footer data-slot="site-footer" data-variant="editorial" className={cn(line, "ez:border-t ez:text-fg")}>
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-16 ez:pb-10 ez:lg:pt-28 ez:lg:pb-14">
        <p data-script={scriptOf(storeName)} className="ez:m-0 ez:mb-12 ez:font-display ez:text-site-name ez:wrap-break-word ez:md:text-site-display ez:lg:mb-22 ez:lg:text-site-hero">{storeName}</p>
        <div className="ez:grid ez:grid-cols-2 ez:gap-x-gutter ez:gap-y-10 ez:pb-12 ez:md:grid-cols-[7fr_5fr_5fr_5fr] ez:lg:pb-18">
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-4 ez:md:col-span-1 ez:lg:gap-5">
            <span className="ez:text-site-note ez:text-muted">{STAY_TITLE.center}</span>
            {(phone || hours) && (
              <div className="ez:grid ez:gap-2.5">
                {phone && (
                  <a href={`tel:${phone}`} className={cn("ez:font-body ez:text-site-counter ez:text-fg ez:no-underline ez:lg:text-site-name", focusRing)}>
                    {phone}
                  </a>
                )}
                {hours && <span data-script={scriptOf(hours)} className="ez:text-site-body ez:text-muted">{hours}</span>}
              </div>
            )}
          </div>
          <FooterNav title={STAY_TITLE.rooms} items={stay} />
          <FooterNav title={STAY_TITLE.guide} items={guide} />
          <FooterNav title={STAY_TITLE.booking} items={account} />
        </div>
        <div className={cn(line, "ez:grid ez:gap-6 ez:border-t ez:pt-7 ez:md:grid-cols-[minmax(0,1fr)_auto]")}>
          <div className="ez:grid ez:gap-3.5">
            {terms.length > 0 && (
              <nav aria-label={STAY_TITLE.terms} className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2 ez:text-site-body">
                {terms.map((l) => (
                  <NextLink key={l.href} href={l.href} className={cn("ez:text-fg ez:no-underline ez:underline-offset-4 ez:hover:underline", l.strong && "ez:font-medium", focusRing)}>
                    {l.label}
                  </NextLink>
                ))}
              </nav>
            )}
            <p data-script={scriptOf(legal)} className="ez:m-0 ez:max-w-225 ez:text-site-note ez:leading-relaxed ez:text-muted">{legal}</p>
          </div>
          <span className="ez:text-site-note ez:text-muted">© {storeName}</span>
        </div>
      </div>
    </footer>
  );
}

function Crumbs({ items }: { items: StayListProps["crumbs"] }) {
  return (
    <nav aria-label="현재 위치" className="ez:flex ez:flex-wrap ez:items-center ez:justify-center ez:gap-x-2.5 ez:text-site-note ez:text-muted">
      {items.map((c, i) => (
        <span key={c.href} className="ez:flex ez:items-center ez:gap-x-2.5">
          {i > 0 && <span aria-hidden="true">/</span>}
          {i === items.length - 1 ? (
            <span aria-current="page">{c.label}</span>
          ) : (
            <NextLink href={c.href} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}>
              {c.label}
            </NextLink>
          )}
        </span>
      ))}
    </nav>
  );
}

const sep = cn(line, "ez:border-l ez:pl-5");

function Condition({ search }: { search: StayListProps["search"] }) {
  return (
    <StayForm
      initial={search}
      max={search.max}
      className="ez:mt-8 ez:flex ez:flex-wrap ez:items-center ez:justify-center ez:gap-x-5 ez:gap-y-2 ez:text-site-body ez:text-fg ez:lg:mt-10"
    >
      <span className="ez:inline-flex ez:items-center ez:gap-3">
        <Icon name="calendar" className="ez:text-muted" />
        <span className="ez:inline-flex ez:items-center ez:gap-2">
          <label className="ez:relative ez:inline-flex ez:min-h-11 ez:items-center">
            <DateText which="check_in" placeholder={STAY_TITLE.dateIn} emptyClassName="ez:text-muted" />
            <DateInput which="check_in" />
          </label>
          <span aria-hidden="true">–</span>
          <label className="ez:relative ez:inline-flex ez:min-h-11 ez:items-center">
            <DateText which="check_out" placeholder={STAY_TITLE.dateOut} emptyClassName="ez:text-muted" />
            <DateInput which="check_out" />
          </label>
          <SelectedDot className="ez:ml-1" />
        </span>
      </span>
      <NightsText className={sep} />
      <span className={cn(sep, "ez:inline-flex ez:items-center ez:gap-3")}>
        <span className="ez:inline-flex ez:items-center ez:gap-1">
          {STAY_TITLE.adults}
          <GuestSelect who="adults" className={cn(select, "ez:text-site-body ez:text-fg")} />
        </span>
        <span aria-hidden="true" className="ez:text-muted">
          ·
        </span>
        <span className="ez:inline-flex ez:items-center ez:gap-1">
          {STAY_TITLE.children}
          <GuestSelect who="children" className={cn(select, "ez:text-site-body ez:text-fg")} />
        </span>
      </span>
      <button type="submit" className={cn(textLink, "ez:m-0 ez:ml-3 ez:cursor-pointer ez:bg-transparent ez:px-0 ez:pt-0 ez:font-body ez:text-site-body", focusRing)}>
        {STAY_TITLE.change}
      </button>
    </StayForm>
  );
}

function Rates({ views, peak }: { views: RoomView[]; peak: boolean }) {
  const cols = [STAY_TITLE.weekday, STAY_TITLE.weekend, ...(peak ? [STAY_TITLE.peak, STAY_TITLE.peakWeekend] : [])];
  const th = "ez:w-auto ez:py-5 ez:pl-4 ez:text-right ez:font-normal";
  return (
    <section id="rates" className="ez:mt-24 ez:grid ez:lg:mt-32">
      <Head title={STAY_TITLE.rates} />
      <div className={cn(body, "ez:overflow-x-auto")}>
        <table className={cn(line, "ez:w-full ez:min-w-160 ez:table-fixed ez:border-collapse ez:border-t ez:text-site-body")}>
          <thead>
            <tr className={cn(line, "ez:border-b ez:text-site-note ez:text-muted")}>
              <th scope="col" className={cn(th, "ez:w-1/5 ez:pl-0 ez:text-left")}>
                {STAY_TITLE.rooms}
              </th>
              {cols.map((c) => (
                <th key={c} scope="col" className={th}>
                  {c}
                </th>
              ))}
              <th scope="col" className={cn(th, "ez:w-1/4")}>
                {STAY_TITLE.extra}
              </th>
            </tr>
          </thead>
          <tbody>
            {views.map((r) => {
              const values = r.rates ? [r.rates.weekday, r.rates.weekend, ...(peak ? [r.rates.peak, r.rates.peakWeekend] : [])] : cols.map(() => null);
              return (
                <tr key={r.id} className={cn(line, "ez:border-b")}>
                  <th scope="row" className="ez:w-auto ez:py-5 ez:pr-4 ez:text-left ez:font-normal ez:text-fg">
                    {r.name}
                  </th>
                  {values.map((v, i) => (
                    <td key={i} className="ez:py-5 ez:pl-4 ez:text-right ez:text-fg">
                      {v ?? "–"}
                    </td>
                  ))}
                  <td className="ez:py-5 ez:pl-4 ez:text-right ez:text-muted">{r.extra ?? "–"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function List({ title, count, crumbs, search, rooms, peak }: StayListProps) {
  const views = rooms.map(roomView);
  const dates = stayDates(search.check_in, search.check_out);
  return (
    <div data-slot="stay-rooms" className="ez:grid ez:grid-cols-1 ez:pb-8 ez:text-fg ez:lg:pb-16">
      <div className="ez:grid ez:justify-items-center ez:pt-8 ez:text-center ez:lg:pt-18">
        <Crumbs items={crumbs} />
        <h1 className="ez:m-0 ez:mt-5 ez:font-display ez:text-site-page-sm ez:lg:mt-7 ez:lg:text-site-display-md">
          {title}
          <span className="ez:ml-3 ez:align-super ez:font-body ez:text-site-body ez:font-normal ez:text-muted">{count}</span>
        </h1>
        <Condition search={search} />
      </div>
      <div className={cn(line, rows, "ez:mt-12 ez:border-t ez:pt-12 ez:lg:mt-20 ez:lg:pt-20")}>
        {views.map((v, i) => (
          <RoomRow key={v.id} v={v} index={i} list dates={dates} />
        ))}
      </div>
      <Rates views={views} peak={peak} />
    </div>
  );
}
