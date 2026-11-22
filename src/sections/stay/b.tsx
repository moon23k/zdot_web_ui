import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Icon, type IconName } from "../../components/icon";
import { Photo } from "../../components/photo";
import { StarRow } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { won } from "../../utils/format";
import { focusRing } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, BlankStars, Lines } from "../kit";
import { fillCols, ROW_ITEM } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import type { Room } from "../template/data";
import { DateInput, DateText, GuestSelect, NightsText, SelectedDot, StayForm } from "./booking";
import { AmenityIcon } from "./icons";
import { StayNavLinks } from "./nav";
import { addOnView, roomNotes, ROOMS_HREF, roomView, sameExtra, STAY_TITLE, stayDates } from "./shared";
import type { RoomView, StayFooterProps, StayHeaderProps, StayListProps, StaySearch } from "./types";
import { SampleMap } from "./map";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:box-border ez:px-page";

const heading = "ez:m-0 ez:font-body ez:text-site-heading ez:font-medium ez:text-fg";

const line = "ez:border-0 ez:border-solid ez:border-site-line";

const tlink = "ez:inline-flex ez:self-start ez:border-0 ez:border-b ez:border-solid ez:border-site-edge ez:pb-0.5 ez:text-site-lead ez:text-muted";

const moreLink = cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-0.5 ez:text-site-note ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const navLink = cn("ez:flex ez:h-full ez:items-center ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const navOn = "ez:font-medium ez:text-fg";

const soft = cn(
  "ez:inline-flex ez:items-center ez:justify-center ez:rounded-sm ez:border ez:border-solid ez:border-site-line ez:bg-surface-alt ez:font-body ez:text-site-body ez:font-medium ez:text-fg ez:no-underline ez:hover:border-site-edge",
  focusRing,
);

const cols4 = "ez:grid ez:grid-cols-2 ez:gap-x-4 ez:gap-y-10 ez:md:grid-cols-3 ez:md:gap-x-5 ez:lg:grid-cols-4";
const colsFew = "ez:grid ez:gap-x-4 ez:gap-y-10 ez:md:gap-x-5";

const galleryRow = "ez:-mx-2 ez:flex ez:flex-wrap ez:justify-center ez:gap-y-4 ez:md:-mx-2.5 ez:md:gap-y-5";

const GALLERY_HIDE = ["", "", "", "ez:md:max-lg:hidden", "ez:max-lg:hidden"];

export function Header({ name, logoUrl, nav, links }: StayHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="catalog" className="ez:bg-surface ez:text-fg">
      <div className={cn(wrap, "ez:grid ez:h-16 ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-4 ez:lg:h-19 ez:lg:gap-10")}>
        <NextLink href="/" className={cn("ez:min-w-0 ez:text-site-heading ez:font-medium ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <div className="ez:flex ez:items-center ez:justify-end ez:gap-2 ez:lg:gap-3">
          <NextLink
            href={links.account.href}
            className={cn("ez:inline-flex ez:h-10 ez:min-w-10 ez:items-center ez:justify-center ez:gap-1.5 ez:px-2 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}
          >
            <Icon name="user" size="lg" />
            <span className="ez:max-sm:sr-only">{links.account.label}</span>
          </NextLink>
          <NextLink href={links.book.href} className={cn(soft, "ez:h-10 ez:px-5")}>
            {links.book.label}
          </NextLink>
        </div>
      </div>
      <div className={cn(line, "ez:border-y ez:max-lg:hidden")}>
        <nav aria-label="주요 메뉴" className={cn(wrap, "ez:flex ez:h-13 ez:items-center ez:gap-9 ez:overflow-hidden ez:whitespace-nowrap")}>
          <StayNavLinks items={nav} className={navLink} currentClassName={navOn} />
        </nav>
      </div>
    </header>
  );
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:flex ez:flex-col">
      <span className="ez:mb-3.5 ez:text-site-note ez:font-medium ez:text-fg">{title}</span>
      {items.map((l) => (
        <NextLink
          key={l.href}
          href={l.href}
          className={cn("ez:self-start ez:text-site-note ez:leading-loose ez:no-underline ez:hover:text-fg", l.strong ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}
        >
          {l.label}
        </NextLink>
      ))}
    </nav>
  );
}

export function Footer({ storeName, phone, hours, legal, stay, guide, account, terms }: StayFooterProps) {
  return (
    <footer data-slot="site-footer" data-variant="catalog" className={cn(line, "ez:border-t ez:text-fg")}>
      <div className={cn(wrap, "ez:grid ez:grid-cols-2 ez:gap-x-8 ez:gap-y-10 ez:pt-13 ez:pb-10 ez:md:grid-cols-4 ez:lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]")}>
        <div className="ez:col-span-2 ez:flex ez:flex-col ez:md:col-span-4 ez:lg:col-span-1">
          <span className="ez:mb-3.5 ez:text-site-note ez:font-medium ez:text-fg">{STAY_TITLE.center}</span>
          {phone && (
            <a href={`tel:${phone}`} className={cn("ez:mb-2 ez:self-start ez:text-site-rank ez:font-medium ez:text-fg ez:tabular-nums ez:no-underline", focusRing)}>
              {phone}
            </a>
          )}
          {hours && <span className="ez:text-site-note ez:text-muted">{hours}</span>}
        </div>
        <FooterColumn title={STAY_TITLE.bookingGuide} items={stay} />
        <FooterColumn title={STAY_TITLE.account} items={account} />
        <FooterColumn title={STAY_TITLE.support} items={guide} />
        {terms.length > 0 && <FooterColumn title={STAY_TITLE.terms} items={terms} />}
      </div>
      <div className={wrap}>
        <div className={cn(line, "ez:grid ez:gap-x-8 ez:gap-y-1.5 ez:border-t ez:pt-7 ez:pb-10 ez:lg:grid-cols-[1.6fr_4fr]")}>
          <p className="ez:m-0 ez:text-site-item ez:font-medium ez:text-fg ez:lg:row-span-2">{storeName}</p>
          <p className="ez:m-0 ez:text-site-small ez:text-muted">{legal}</p>
          <p className="ez:m-0 ez:text-site-small ez:text-muted">© {storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function Head({ title, href, aside }: { title: string; href?: string; aside?: ReactNode }) {
  return (
    <div className="ez:mb-6 ez:flex ez:items-end ez:justify-between ez:gap-3">
      <div className="ez:flex ez:min-w-0 ez:flex-wrap ez:items-baseline ez:gap-x-3.5 ez:gap-y-1">
        <h2 className={heading}>{title}</h2>
        {aside}
      </div>
      {href && (
        <NextLink href={href} className={moreLink}>
          {STAY_TITLE.more}
          <Icon name="next" size="sm" />
        </NextLink>
      )}
    </div>
  );
}

type HeroRoom = NonNullable<SectionProps<"hero">["data"]["products"]>[number];

const sideTile = "ez:grid ez:min-h-0 ez:overflow-hidden ez:rounded-md ez:bg-surface-alt ez:text-fg ez:no-underline ez:grid-rows-[auto_minmax(0,1fr)] ez:md:grid-rows-none ez:md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]";

function SideTile({ room, index }: { room: HeroRoom; index: number }) {
  return (
    <NextLink href={room.href ?? `/products/${room.id}`} data-slot="hero-product" className={cn("ez:group", sideTile, focusRing)}>
      <span className="ez:relative ez:block ez:aspect-square ez:md:order-2 ez:md:aspect-auto">
        <Photo src={room.cover_url} alt={room.name} tone={index + 1} sizes="(max-width: 1024px) 50vw, 210px" className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
      </span>
      <span className="ez:grid ez:content-end ez:gap-2.5 ez:p-4 ez:md:p-6">
        <span className="ez:line-clamp-2 ez:text-site-body ez:underline-offset-4 ez:group-hover:underline ez:md:text-site-item">{room.name}</span>
        <span className={tlink}>{STAY_TITLE.view}</span>
      </span>
    </NextLink>
  );
}

function BlankSide({ index }: { index: number }) {
  return (
    <div className={sideTile}>
      <span className="ez:relative ez:block ez:aspect-square ez:md:order-2 ez:md:aspect-auto">
        <Photo src={null} alt="" tone={index + 1} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
      </span>
      <span className="ez:grid ez:content-end ez:gap-2 ez:p-4 ez:md:p-6">
        <span className="ez:text-site-item">
          <Bar />
        </span>
        <span className="ez:text-site-lead">
          <Bar size="short" />
        </span>
      </span>
    </div>
  );
}

export function Hero({ data }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const blank = !title && !data.image;
  const side = (data.products ?? []).filter((p) => p.cover_url).slice(0, 2);
  const split = blank || side.length === 2;
  return (
    <section data-slot="hero" data-variant="catalog" data-blank={blank ? "" : undefined} className={cn("ez:grid ez:gap-4 ez:text-fg ez:lg:h-120", split && "ez:lg:grid-cols-[2fr_1fr]")}>
      <div className={cn("ez:grid ez:overflow-hidden ez:rounded-md ez:lg:h-full", title && "ez:bg-surface-alt ez:md:min-h-80 ez:md:grid-cols-[2fr_3fr]")}>
        <div className={cn("ez:relative ez:aspect-4/3 ez:md:aspect-video ez:lg:aspect-auto ez:lg:h-full", title && "ez:md:order-2 ez:md:aspect-auto")}>
          <Photo
            src={data.image}
            alt={title ?? ""}
            preload
            tone={0}
            sizes="(max-width: 1024px) 100vw, 860px"
            className={cn("ez:absolute ez:inset-0 ez:aspect-auto ez:h-full", title ? "ez:rounded-none" : "ez:rounded-md")}
          />
          {blank && (
            <div aria-hidden="true" className="ez:absolute ez:bottom-6 ez:left-5 ez:grid ez:w-2/5 ez:max-w-56 ez:gap-2 ez:text-site-heading ez:md:bottom-14 ez:md:left-12 ez:md:text-site-name">
              <Bar size="full" block />
              <Bar size="mid" block />
            </div>
          )}
        </div>
        {title && (
          <div className="ez:grid ez:content-end ez:gap-2 ez:p-6 ez:md:p-10">
            <h1 className="ez:m-0 ez:font-body ez:text-site-heading ez:font-normal ez:whitespace-pre-line ez:text-fg ez:md:text-site-name ez:md:font-normal">{title}</h1>
            {data.sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:text-site-lead ez:text-muted">
                {data.sub}
              </p>
            )}
            <NextLink href={data.href ?? ROOMS_HREF} className={cn(tlink, "ez:mt-3 ez:no-underline ez:hover:border-fg ez:hover:text-fg", focusRing)}>
              {STAY_TITLE.view}
            </NextLink>
          </div>
        )}
      </div>
      {split && (
        <div className="ez:grid ez:grid-cols-2 ez:gap-4 ez:lg:grid-cols-1 ez:lg:grid-rows-2">
          {blank ? [0, 1].map((i) => <BlankSide key={i} index={i} />) : side.map((p, i) => <SideTile key={p.id} room={p} index={i} />)}
        </div>
      )}
    </section>
  );
}

const barGrid = "ez:grid ez:overflow-hidden ez:rounded-md ez:border ez:border-solid ez:border-site-edge ez:bg-surface ez:md:grid-cols-3 ez:lg:min-h-19 ez:lg:grid-cols-[1fr_1fr_1fr_17rem]";

const barCell = cn(line, "ez:relative ez:flex ez:min-h-17 ez:min-w-0 ez:items-center ez:gap-3.5 ez:border-b ez:px-6 ez:text-muted ez:md:border-r ez:md:border-b-0");

const barLast = "ez:md:max-lg:border-r-0";

const barGo = "ez:min-h-14 ez:md:col-span-3 ez:lg:col-span-1";

function CellIcon({ name, dot }: { name: IconName; dot?: boolean }) {
  return (
    <span className="ez:relative ez:flex ez:shrink-0">
      <Icon name={name} size="lg" />
      {dot && <SelectedDot className="ez:absolute ez:-top-0.5 ez:-right-0.5" />}
    </span>
  );
}

function CellText({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="ez:grid ez:min-w-0 ez:gap-0.5">
      <span className="ez:text-site-small ez:text-muted">{label}</span>
      <span className="ez:flex ez:min-w-0 ez:items-baseline ez:gap-2 ez:text-site-body ez:font-medium ez:whitespace-nowrap ez:text-fg">{children}</span>
    </span>
  );
}

const pick = "ez:cursor-pointer ez:appearance-none ez:border-0 ez:bg-transparent ez:px-0.5 ez:font-body ez:text-site-body ez:font-medium ez:text-fg";

function BarForm({ max, initial, action }: { max: number; initial?: StaySearch | null; action?: string | null }) {
  return (
    <StayForm max={max} initial={initial} action={action ?? undefined} className={barGrid}>
      <div className={cn(barCell, "ez:focus-within:bg-surface-alt")}>
        <CellIcon name="calendar" dot />
        <CellText label={STAY_TITLE.dateIn}>
          <DateText which="check_in" emptyClassName="ez:font-normal ez:text-muted" />
        </CellText>
        <Icon name="down" size="sm" className="ez:ml-auto" />
        <DateInput which="check_in" />
      </div>
      <div className={cn(barCell, "ez:focus-within:bg-surface-alt")}>
        <CellIcon name="calendar" />
        <CellText label={STAY_TITLE.dateOut}>
          <DateText which="check_out" emptyClassName="ez:font-normal ez:text-muted" />
          <NightsText className="ez:text-site-small ez:font-normal ez:text-muted" />
        </CellText>
        <Icon name="down" size="sm" className="ez:ml-auto" />
        <DateInput which="check_out" />
      </div>
      <div className={cn(barCell, barLast)}>
        <CellIcon name="users" />
        <CellText label={STAY_TITLE.guests}>
          <span className="ez:inline-flex ez:items-baseline">
            {STAY_TITLE.adults}
            <GuestSelect who="adults" className={cn(pick, "ez:ml-1", focusRing)} />
          </span>
          <span aria-hidden="true">·</span>
          <span className="ez:inline-flex ez:items-baseline">
            {STAY_TITLE.children}
            <GuestSelect who="children" className={cn(pick, "ez:ml-1", focusRing)} />
          </span>
        </CellText>
        <Icon name="down" size="sm" className="ez:ml-auto" />
      </div>
      <button
        type="submit"
        className={cn(
          barGo,
          "ez:m-0 ez:inline-flex ez:cursor-pointer ez:items-center ez:justify-center ez:gap-1 ez:border-0 ez:bg-surface-alt ez:px-6 ez:font-body ez:text-site-body ez:font-medium ez:text-fg",
          focusRing,
          "ez:focus-visible:-outline-offset-4",
        )}
      >
        {STAY_TITLE.find}
        <Icon name="next" size="sm" />
      </button>
    </StayForm>
  );
}

function BlankBar() {
  const cells: { label: string; icon: IconName }[] = [
    { label: STAY_TITLE.dateIn, icon: "calendar" },
    { label: STAY_TITLE.dateOut, icon: "calendar" },
    { label: STAY_TITLE.guests, icon: "users" },
  ];
  return (
    <div className={barGrid}>
      {cells.map((c, i) => (
        <div key={c.label} className={cn(barCell, i === 2 && barLast)}>
          <CellIcon name={c.icon} />
          <CellText label={c.label}>
            <Bar />
          </CellText>
        </div>
      ))}
      <BlankButton variant="outline" className={cn(barGo, "ez:h-auto ez:rounded-none ez:border-0 ez:bg-surface-alt ez:px-6 ez:text-site-body ez:text-muted")}>
        {STAY_TITLE.find}
      </BlankButton>
    </div>
  );
}

export function Booking({ data }: SectionProps<"booking_strip">) {
  const max = data?.max ?? null;
  return (
    <section
      data-slot="booking-strip"
      data-variant="catalog"
      data-blank={max ? undefined : ""}
      className="ez:relative ez:text-fg ez:[[data-slot=hero]+&]:-mt-[calc(var(--ezd-section-gap)-16px)]"
    >
      {max ? <BarForm max={max} action={data.href} /> : <BlankBar />}
    </section>
  );
}

function priceParts(from: string): [string | null, string] {
  return from.startsWith("1박 ") ? ["1박", from.slice(3)] : [null, from];
}

function RoomCard({ room, tone, few }: { room: Room; tone: number; few?: boolean }) {
  const v = roomView(room);
  const [unit, amount] = priceParts(v.from);
  const tag = [...(v.sample ? [STAY_TITLE.sample] : []), ...roomNotes(v)].join(" · ") || null;
  return (
    <NextLink
      href={v.href}
      data-slot="room-card"
      data-state={v.quote?.state}
      data-sample={v.sample || undefined}
      className={cn("ez:group ez:grid ez:min-w-0 ez:content-start ez:gap-3.5 ez:text-fg ez:no-underline", focusRing)}
    >
      <Photo src={v.image} alt={v.name} tone={tone} sizes={few ? "(max-width: 768px) 100vw, 640px" : "(max-width: 768px) 50vw, 305px"} className={cn("ez:aspect-4/3 ez:rounded-sm", v.today && "ez:opacity-45")} />
      <span className="ez:grid ez:min-w-0 ez:gap-0.5">
        <span className="ez:flex ez:items-baseline ez:justify-between ez:gap-2 ez:text-site-small ez:text-muted">
          <span className="ez:min-w-0 ez:truncate">{v.guests}</span>
          {tag && <span className="ez:shrink-0 ez:font-medium">{tag}</span>}
        </span>
        <span className="ez:truncate ez:text-site-body ez:underline-offset-4 ez:group-hover:underline">{v.name}</span>
        <span className="ez:mt-1.5 ez:flex ez:items-baseline ez:gap-1.5 ez:tabular-nums">
          {unit && <span className="ez:text-site-small ez:text-muted">{unit}</span>}
          <span className={cn("ez:min-w-0 ez:truncate ez:text-site-figure ez:font-medium", v.today ? "ez:text-muted" : "ez:text-fg")}>{amount}</span>
          <span className="ez:ml-auto ez:inline-flex ez:shrink-0 ez:items-center ez:gap-0.5 ez:text-site-note ez:text-muted ez:max-md:hidden">
            {STAY_TITLE.view}
            <Icon name="next" size="sm" />
          </span>
        </span>
      </span>
    </NextLink>
  );
}

function BlankRoom({ tone }: { tone: number }) {
  return (
    <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-3.5">
      <Photo src={null} alt="" tone={tone} className="ez:aspect-4/3 ez:rounded-sm" />
      <span className="ez:grid ez:gap-1.5">
        <span className="ez:text-site-small">
          <Bar />
        </span>
        <span className="ez:text-site-body">
          <Bar size="short" />
        </span>
        <BlankPrice className="ez:text-site-figure" />
      </span>
    </div>
  );
}

export function Rooms({ data }: SectionProps<"room_list">) {
  const rooms = (data.rooms ?? []).slice(0, 8);
  return (
    <section data-slot="room-list" id="rooms" data-variant="catalog" data-blank={rooms.length ? undefined : ""} className="ez:text-fg">
      <Head title={STAY_TITLE.rooms} href={rooms.length ? ROOMS_HREF : undefined} />
      <div className={rooms.length && rooms.length < 4 ? cn(colsFew, fillCols(Math.max(2, rooms.length))) : cols4}>
        {rooms.length ? rooms.map((r, i) => <RoomCard key={r.id} room={r} tone={i} few={rooms.length < 4} />) : [0, 1, 2, 3].map((i) => <BlankRoom key={i} tone={i} />)}
      </div>
    </section>
  );
}

export function Amenities({ data }: SectionProps<"amenities">) {
  const items = (data.items ?? []).slice(0, 20);
  return (
    <section data-slot="amenities" id="amenities" data-variant="catalog" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={STAY_TITLE.amenities} />
      <ul className="ez:m-0 ez:grid ez:list-none ez:grid-cols-2 ez:gap-x-4 ez:gap-y-6 ez:rounded-md ez:bg-surface-alt ez:p-6 ez:md:grid-cols-3 ez:md:gap-y-7 ez:md:px-12 ez:md:py-9 ez:lg:grid-cols-5">
        {items.length
          ? items.map((it, i) => (
              <li key={`${it.name}-${i}`} className="ez:flex ez:min-w-0 ez:items-center ez:gap-3 ez:text-site-body ez:text-muted">
                <AmenityIcon name={it.name} size="lg" />
                <span className="ez:min-w-0 ez:truncate">{it.name}</span>
              </li>
            ))
          : [0, 1, 2, 3, 4].map((i) => (
              <li key={i} className="ez:flex ez:items-center ez:text-site-body">
                <Bar />
              </li>
            ))}
      </ul>
    </section>
  );
}

export function Gallery({ data }: SectionProps<"gallery">) {
  const images = (data.images ?? []).slice(0, 5);
  const full = images.length >= 5;
  const cells: (string | null)[] = images.length ? images : [null, null, null, null, null];
  return (
    <section data-slot="gallery" id="gallery" data-variant="catalog" data-blank={images.length ? undefined : ""} className="ez:text-fg">
      <Head title={STAY_TITLE.gallery} />
      <div className={galleryRow}>
        {cells.map((src, i) => (
          <div key={src ?? i} className={cn(ROW_ITEM[5], "ez:px-2 ez:md:px-2.5", (full || !images.length) && GALLERY_HIDE[i])}>
            <Photo src={src} alt="" tone={i} sizes="(max-width: 768px) 50vw, 240px" className="ez:aspect-square ez:rounded-sm" />
          </div>
        ))}
      </div>
    </section>
  );
}

const ADDON_COLS = { 1: "", 2: "ez:md:grid-cols-2", 3: "ez:md:grid-cols-3" } as const;

function addOnEdge(i: number, cols: number): string {
  return cn(i > 0 && "ez:border-t", "ez:md:border-t-0", i >= cols && "ez:md:border-t", i % cols !== 0 && "ez:md:border-l");
}

export function AddOns({ data }: SectionProps<"add_ons">) {
  const items = (data.items ?? []).map(addOnView);
  const cols = Math.max(1, Math.min(3, items.length || 3)) as 1 | 2 | 3;
  return (
    <section data-slot="add-ons" id="add-ons" data-variant="catalog" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={STAY_TITLE.addOns} />
      <ul className={cn("ez:m-0 ez:grid ez:list-none ez:overflow-hidden ez:rounded-md ez:bg-surface-alt ez:p-0", ADDON_COLS[cols])}>
        {items.length
          ? items.map((a, i) => (
              <li key={`${a.name}-${i}`} className={cn(line, "ez:grid ez:content-center ez:gap-1 ez:px-6 ez:py-6 ez:md:min-h-30 ez:md:px-8", addOnEdge(i, cols))}>
                <span className="ez:text-site-body ez:font-medium ez:text-fg">{a.name}</span>
                <span className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-1 ez:tabular-nums">
                  <span className="ez:text-site-body ez:text-fg">{a.price}</span>
                  <span className="ez:text-site-small ez:text-muted">/ {a.unit}</span>
                </span>
                <span className="ez:text-site-small ez:text-muted">{a.pay}</span>
              </li>
            ))
          : [0, 1, 2].map((i) => (
              <li key={i} className={cn(line, "ez:grid ez:content-center ez:gap-2 ez:px-6 ez:py-6 ez:md:min-h-30 ez:md:px-8", addOnEdge(i, 3))}>
                <span className="ez:text-site-body">
                  <Bar />
                </span>
                <BlankPrice className="ez:text-site-body ez:font-normal ez:text-muted" />
              </li>
            ))}
      </ul>
    </section>
  );
}

const infoCol = cn(line, "ez:grid ez:min-w-0 ez:content-start ez:gap-5 ez:px-6 ez:py-7 ez:md:px-9 ez:md:pt-8 ez:md:pb-9");

const infoTitle = "ez:m-0 ez:font-body ez:text-site-body ez:font-medium ez:text-fg";

export function Info({ data }: SectionProps<"house_rules">) {
  const rules = data.rules ?? [];
  const rows = data.cancel?.rows ?? [];
  const groups = (data.cancel?.groups ?? []).filter((g) => g.rows.length);
  const times = [
    { label: STAY_TITLE.checkIn, value: data.check_in },
    { label: STAY_TITLE.checkOut, value: data.check_out },
  ].filter((t) => t.value);
  const hasCancel = rows.length > 0 || groups.length > 0;
  const blank = !data.check_in && !rules.length && !hasCancel;
  const cancelRows = (list: typeof rows) =>
    list.map((r, i) => (
      <tr key={i} className={cn(line, "ez:border-b ez:last:border-b-0")}>
        <th scope="row" className="ez:py-2.5 ez:pr-4 ez:text-left ez:font-normal ez:text-muted">
          {r.label}
        </th>
        <td className="ez:py-2.5 ez:text-right ez:text-fg ez:tabular-nums">{r.value}</td>
      </tr>
    ));
  return (
    <section data-slot="house-rules" id="rules" data-variant="catalog" data-blank={blank ? "" : undefined} className="ez:text-fg">
      <Head title={STAY_TITLE.info} />
      <div className="ez:grid ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:lg:grid-cols-[1fr_1fr_1.2fr]">
        <div className={infoCol}>
          <h3 className={infoTitle}>{STAY_TITLE.times}</h3>
          {times.length ? (
            <dl className="ez:m-0 ez:flex ez:flex-wrap ez:gap-x-12 ez:gap-y-4">
              {times.map((t) => (
                <div key={t.label} className="ez:grid ez:gap-1">
                  <dt className="ez:text-site-small ez:text-muted">{t.label}</dt>
                  <dd className="ez:m-0 ez:text-site-rank ez:font-normal ez:text-fg ez:tabular-nums">{t.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <span className="ez:text-site-rank">
              <Bar size="short" />
            </span>
          )}
        </div>
        <div className={cn(infoCol, "ez:border-t ez:lg:border-t-0 ez:lg:border-l")}>
          <h3 className={infoTitle}>{STAY_TITLE.rules}</h3>
          {rules.length ? (
            <ul className="ez:m-0 ez:grid ez:list-none ez:p-0">
              {rules.map((r, i) => (
                <li key={`${r}-${i}`} className="ez:text-site-body ez:leading-loose ez:text-muted">
                  {r}
                </li>
              ))}
            </ul>
          ) : (
            <span className="ez:grid ez:gap-3 ez:text-site-body">
              <Bar size="long" block />
              <Bar block />
            </span>
          )}
        </div>
        <div className={cn(infoCol, "ez:border-t ez:lg:border-t-0 ez:lg:border-l")}>
          <h3 className={infoTitle}>{STAY_TITLE.cancel}</h3>
          {hasCancel ? (
            <div className="ez:grid ez:gap-5">
              {rows.length > 0 && (
                <table className="ez:w-full ez:border-collapse ez:text-site-body">
                  <tbody>{cancelRows(rows)}</tbody>
                </table>
              )}
              {groups.map((g) => (
                <table key={g.title} className="ez:w-full ez:border-collapse ez:text-site-body">
                  <caption className="ez:pb-1 ez:text-left ez:text-site-small ez:text-muted">{g.title}</caption>
                  <tbody>{cancelRows(g.rows)}</tbody>
                </table>
              ))}
            </div>
          ) : (
            <span className="ez:grid ez:gap-3 ez:text-site-body">
              <Bar size="full" block />
              <Bar size="full" block />
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

type ReviewItem = NonNullable<SectionProps<"reviews">["data"]["items"]>[number];

type ReviewRoom = SectionProps<"reviews">["context"]["products"][number];

function ReviewCard({ item, room, tone }: { item: ReviewItem; room?: ReviewRoom; tone: number }) {
  return (
    <article className="ez:flex ez:min-w-0 ez:gap-4 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-5">
      {room && <Photo src={room.cover_url} alt={room.name} tone={tone} sizes="80px" className="ez:aspect-square ez:size-20 ez:shrink-0 ez:rounded-sm" />}
      <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-1.5">
        <StarRow rating={item.rating} className="ez:text-muted" />
        <p className="ez:m-0 ez:line-clamp-2 ez:text-site-body ez:text-muted">{item.body}</p>
        <p className="ez:m-0 ez:truncate ez:text-site-small ez:text-muted">{[room?.name ?? item.name, item.date].filter(Boolean).join(" · ")}</p>
      </div>
    </article>
  );
}

function BlankReview({ tone }: { tone: number }) {
  return (
    <div className="ez:flex ez:min-w-0 ez:gap-4 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-5">
      <Photo src={null} alt="" tone={tone} className="ez:aspect-square ez:size-20 ez:shrink-0 ez:rounded-sm" />
      <div className="ez:grid ez:min-w-0 ez:flex-1 ez:content-start ez:gap-2">
        <BlankStars />
        <Lines />
        <span className="ez:text-site-small">
          <Bar size="short" />
        </span>
      </div>
    </div>
  );
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  const average = items.length && data.average != null ? data.average : null;
  const aside =
    average != null ? (
      <span className="ez:inline-flex ez:items-center ez:gap-1 ez:tabular-nums">
        <Icon name="star" size="sm" className="ez:fill-current ez:text-muted" />
        <span className="ez:text-site-item ez:font-medium ez:text-fg">{average.toFixed(1)}</span>
        {data.count != null && <span className="ez:ml-1 ez:text-site-body ez:text-muted">{data.count}</span>}
      </span>
    ) : null;
  return (
    <section
      data-slot="reviews"
      id="reviews"
      data-variant="catalog"
      data-blank={items.length ? undefined : ""}
      data-bleed=""
      className="ez:mx-[calc(50%-50vw)] ez:bg-surface-alt ez:py-16 ez:text-fg"
    >
      <div className={wrap}>
        <Head title={STAY_TITLE.reviews} aside={aside} />
        <div className={cn("ez:grid ez:gap-4 ez:lg:gap-5", fillCols(items.length || 3))}>
          {items.length
            ? items.map((r, i) => <ReviewCard key={`${r.name}-${r.date ?? ""}-${i}`} item={r} tone={i} room={r.product ? context.products.find((p) => p.id === r.product) : undefined} />)
            : [0, 1, 2].map((i) => <BlankReview key={i} tone={i} />)}
        </div>
      </div>
    </section>
  );
}

const mapBox = "ez:flex ez:min-h-56 ez:items-center ez:justify-center ez:rounded-md ez:bg-surface-alt ez:text-muted ez:lg:min-h-0";

export function Location({ data }: SectionProps<"location">) {
  const address = data.address?.trim() || null;
  const pin = <Icon name="pin" className="ez:size-8" />;
  return (
    <section data-slot="location" id="location" data-variant="catalog" data-blank={address ? undefined : ""} className="ez:text-fg">
      <Head title={STAY_TITLE.location} />
      <div className="ez:grid ez:gap-5 ez:lg:h-70 ez:lg:grid-cols-[minmax(0,1fr)_23.75rem]">
        {address && data.href ? (
          <a href={data.href} target="_blank" rel="noopener" aria-label={STAY_TITLE.map} className={cn(mapBox, "ez:relative ez:overflow-hidden ez:text-fg ez:no-underline", focusRing)}>
            <SampleMap />
            <span className="ez:relative">{pin}</span>
          </a>
        ) : (
          <div className={mapBox}>{pin}</div>
        )}
        <dl className={cn(line, "ez:m-0 ez:flex ez:flex-col ez:self-start ez:border-t")}>
          <div className={cn(line, "ez:grid ez:gap-1 ez:border-b ez:py-5")}>
            <dt className="ez:text-site-small ez:text-muted">{STAY_TITLE.address}</dt>
            <dd className="ez:m-0 ez:text-site-body ez:text-fg">{address ?? <Bar size="long" />}</dd>
          </div>
          {address && data.phone && (
            <div className={cn(line, "ez:grid ez:gap-1 ez:border-b ez:py-5")}>
              <dt className="ez:text-site-small ez:text-muted">{STAY_TITLE.phone}</dt>
              <dd className="ez:m-0">
                <a href={`tel:${data.phone}`} className={cn("ez:text-site-body ez:text-fg ez:tabular-nums ez:no-underline ez:hover:underline", focusRing)}>
                  {data.phone}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}

function RoomRow({ room, search, tone }: { room: Room; search: StaySearch; tone: number }) {
  const v: RoomView = roomView(room);
  const q = v.quote;
  const full = q?.state === "full";
  const [unit, amount] = priceParts(v.from);
  const stayTimes = [room.check_in && `${STAY_TITLE.checkIn} ${room.check_in}`, room.check_out && `${STAY_TITLE.checkOut} ${room.check_out}`].filter(Boolean).join(" · ");
  const note = roomNotes(v).join(" · ");
  return (
    <article
      data-slot="room-card"
      data-state={q?.state}
      data-sample={v.sample || undefined}
      className={cn(line, "ez:grid ez:gap-5 ez:border-b ez:py-8 ez:md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] ez:md:gap-x-8 ez:lg:grid-cols-[21.25rem_minmax(0,1fr)_16.5rem] ez:lg:gap-10")}
    >
      <NextLink href={v.href} tabIndex={-1} aria-hidden="true" className="ez:block ez:self-start">
        <Photo src={v.image} alt="" tone={tone} preload={tone < 2} sizes="(max-width: 768px) 100vw, 340px" className={cn("ez:aspect-4/3 ez:rounded-sm", full && "ez:opacity-45")} />
      </NextLink>
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:items-start ez:gap-1 ez:lg:pt-1">
        {(v.guests || v.sample) && (
          <p className="ez:m-0 ez:flex ez:gap-2 ez:text-site-small ez:text-muted">
            {v.guests && <span>{v.guests}</span>}
            {v.sample && <span className="ez:font-medium">{STAY_TITLE.sample}</span>}
          </p>
        )}
        <h2 className={cn("ez:m-0 ez:mb-2.5 ez:font-body ez:text-site-heading ez:font-medium", full ? "ez:text-muted" : "ez:text-fg")}>{v.name}</h2>
        {stayTimes && (
          <p className="ez:m-0 ez:flex ez:items-center ez:gap-2 ez:text-site-body ez:text-muted">
            <Icon name="clock" size="sm" />
            {stayTimes}
          </p>
        )}
        <NextLink href={v.href} className={cn(moreLink, "ez:mt-4 ez:md:mt-auto ez:md:pt-4")}>
          {STAY_TITLE.view}
          <Icon name="next" size="sm" />
        </NextLink>
      </div>
      <div className={cn(line, "ez:flex ez:min-w-0 ez:flex-col ez:border-t ez:pt-5 ez:md:col-span-2 ez:lg:col-span-1 ez:lg:border-t-0 ez:lg:border-l ez:lg:pt-0 ez:lg:pl-10")}>
        {v.rates && (
          <dl className="ez:m-0 ez:grid ez:text-site-note ez:leading-relaxed ez:tabular-nums">
            {[
              { label: STAY_TITLE.weekday, value: v.rates.weekday },
              { label: STAY_TITLE.weekend, value: v.rates.weekend },
            ].map((r) => (
              <div key={r.label} className="ez:flex ez:justify-between ez:gap-4">
                <dt className="ez:text-muted">{r.label}</dt>
                <dd className="ez:m-0 ez:text-muted">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className={cn("ez:grid ez:justify-items-end ez:text-right", v.rates && cn(line, "ez:mt-3.5 ez:border-t ez:pt-3.5"))}>
          {q && search.check_in && (
            <p className="ez:m-0 ez:text-site-small ez:text-muted ez:tabular-nums">
              {[stayDates(search.check_in, search.check_out), q.nights].filter(Boolean).join(" · ")}
            </p>
          )}
          <p className="ez:m-0 ez:flex ez:items-baseline ez:gap-1.5 ez:tabular-nums">
            {!q && unit && <span className="ez:text-site-small ez:text-muted">{unit}</span>}
            <span className={cn("ez:text-site-rank ez:font-medium", full ? "ez:text-muted" : "ez:text-fg")}>{q ? q.price : amount}</span>
          </p>
          {note && <p className={cn("ez:m-0 ez:text-site-small ez:text-muted", q && q.state !== "open" && "ez:font-medium")}>{note}</p>}
        </div>
        {v.book && (
          <NextLink href={v.book} className={cn(soft, "ez:mt-6 ez:h-12 ez:w-full ez:lg:mt-auto")}>
            {STAY_TITLE.book}
          </NextLink>
        )}
      </div>
    </article>
  );
}

const rateCell = "ez:h-13 ez:px-6 ez:text-right ez:whitespace-nowrap";

function RateTable({ rooms, peak }: { rooms: Room[]; peak: boolean }) {
  const views = rooms.map(roomView);
  const extra = sameExtra(rooms);
  const first = rooms[0];
  const heads = [STAY_TITLE.weekday, STAY_TITLE.weekend, ...(peak ? [STAY_TITLE.peak, STAY_TITLE.peakWeekend] : []), ...(extra ? [] : [STAY_TITLE.extra])];
  return (
    <section id="rates" data-slot="stay-rates" className="ez:mt-16 ez:scroll-mt-6">
      <Head title={STAY_TITLE.rates} />
      <div className="ez:overflow-hidden ez:rounded-md ez:border ez:border-solid ez:border-site-line">
        <div className="ez:overflow-x-auto">
          <table className="ez:w-full ez:border-collapse ez:text-site-body">
            <thead>
              <tr className="ez:bg-surface-alt">
                <th scope="col" className="ez:h-11 ez:px-6 ez:text-left ez:text-site-note ez:font-normal ez:text-muted">
                  {STAY_TITLE.rooms}
                </th>
                {heads.map((h) => (
                  <th key={h} scope="col" className="ez:h-11 ez:px-6 ez:text-right ez:text-site-note ez:font-normal ez:whitespace-nowrap ez:text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="ez:tabular-nums">
              {views.map((r) => (
                <tr key={r.id} className={cn(line, "ez:border-t")}>
                  <th scope="row" className="ez:h-13 ez:px-6 ez:text-left ez:font-medium ez:whitespace-nowrap ez:text-fg">
                    {r.name}
                  </th>
                  <td className={cn(rateCell, "ez:text-fg")}>{r.rates?.weekday ?? "–"}</td>
                  <td className={cn(rateCell, "ez:text-fg")}>{r.rates?.weekend ?? "–"}</td>
                  {peak && <td className={cn(rateCell, "ez:text-fg")}>{r.rates?.peak ?? "–"}</td>}
                  {peak && <td className={cn(rateCell, "ez:text-fg")}>{r.rates?.peakWeekend ?? "–"}</td>}
                  {!extra && <td className={cn(rateCell, "ez:text-fg")}>{r.extra ?? "–"}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {extra && first && (
          <p className={cn(line, "ez:m-0 ez:flex ez:flex-wrap ez:items-center ez:gap-x-8 ez:gap-y-1 ez:border-t ez:px-6 ez:py-3.5 ez:text-site-body ez:text-muted ez:tabular-nums")}>
            <span className="ez:mr-auto ez:text-site-note">{STAY_TITLE.extra}</span>
            <span>
              {STAY_TITLE.adults} <span className="ez:ml-1.5 ez:font-medium ez:text-fg">{won(first.extra_adult_fee ?? 0)}</span>
            </span>
            <span>
              {STAY_TITLE.children} <span className="ez:ml-1.5 ez:font-medium ez:text-fg">{won(first.extra_child_fee ?? 0)}</span>
            </span>
          </p>
        )}
      </div>
    </section>
  );
}

export function List({ title, count, crumbs, search, rooms, peak }: StayListProps) {
  return (
    <div data-slot="stay-rooms" data-variant="catalog" className="ez:grid ez:grid-cols-1 ez:text-fg">
      <nav aria-label="현재 위치" className="ez:flex ez:flex-wrap ez:items-center ez:gap-1 ez:text-site-small ez:text-muted">
        {crumbs.map((c, i) => (
          <span key={c.href} className="ez:inline-flex ez:items-center ez:gap-1">
            {i > 0 && <Icon name="next" size="sm" />}
            {i === crumbs.length - 1 ? (
              <span aria-current="page">{c.label}</span>
            ) : (
              <NextLink href={c.href} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}>
                {c.label}
              </NextLink>
            )}
          </span>
        ))}
      </nav>
      <div className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-2.5 ez:gap-y-1 ez:pt-3">
        <h1 className="ez:m-0 ez:font-body ez:text-site-heading ez:font-medium ez:text-fg ez:md:text-site-title ez:md:font-medium">{title}</h1>
        <span className="ez:text-site-body ez:text-muted ez:tabular-nums">{count}</span>
      </div>
      <div data-slot="stay-search" className="ez:pt-6">
        <BarForm max={search.max} initial={search} action={ROOMS_HREF} />
      </div>
      <div className="ez:mt-2">
        {rooms.map((r, i) => (
          <RoomRow key={r.id} room={r} search={search} tone={i} />
        ))}
      </div>
      <RateTable rooms={rooms} peak={peak} />
    </div>
  );
}
