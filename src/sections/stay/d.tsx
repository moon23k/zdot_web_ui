import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Button, ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, BlankStars, Lines } from "../kit";
import type { FooterLink } from "../shop/types";
import type { Room } from "../template/data";
import { DateInput, DateText, GuestSelect, NightsText, SelectedDot, StayForm } from "./booking";
import { MAP_LABEL, SampleMap } from "./map";
import { StayNavLinks } from "./nav";
import { addOnView, roomNotes, ROOMS_HREF, roomView, sameExtra, STAY_TITLE, stayDates } from "./shared";
import type { StayFooterProps, StayHeaderProps, StayListProps, StaySearch } from "./types";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:box-border ez:px-page";

const h2 = "ez:m-0 ez:text-site-section ez:text-fg ez:md:text-site-page";

const hair = "ez:border-0 ez:border-solid ez:border-hairline";

const more = cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1.5 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const glassLink = cn(
  "ez:fx-glass ez:inline-flex ez:items-center ez:justify-center ez:gap-2 ez:rounded-full ez:font-body ez:text-site-body ez:font-medium ez:whitespace-nowrap ez:text-fg ez:no-underline",
  focusRing,
);

const sky = "ez:fx-aurora ez:absolute ez:-top-40 ez:left-[calc(50%-50vw)] ez:-z-1 ez:h-285 ez:w-screen";

function Head({ title, aside, href }: { title: string; aside?: ReactNode; href?: string }) {
  return (
    <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-x-6 ez:gap-y-3">
      <h2 data-script={scriptOf(title)} className={h2}>{title}</h2>
      {aside}
      {href && (
        <NextLink href={href} className={more}>
          {STAY_TITLE.more}
          <Icon name="next" size="sm" />
        </NextLink>
      )}
    </div>
  );
}

export function Header({ name, logoUrl, nav, links }: StayHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="aurora" className="ez:relative ez:z-10 ez:bg-transparent ez:text-fg">
      <div className={cn(wrap, "ez:pt-4 ez:lg:pt-6")}>
        <div className="ez:fx-glass ez:grid ez:h-14 ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-4 ez:rounded-full ez:pr-2 ez:pl-5 ez:lg:h-17 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] ez:lg:pr-3 ez:lg:pl-8">
          <NextLink data-script={scriptOf(name)} href="/" className={cn("ez:min-w-0 ez:justify-self-start ez:text-site-item ez:font-normal ez:text-fg ez:no-underline", focusRing)}>
            <SiteLogo name={name} src={logoUrl} />
          </NextLink>
          <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:justify-center ez:gap-9 ez:overflow-hidden ez:whitespace-nowrap ez:max-lg:hidden">
            <StayNavLinks items={nav} className={cn("ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)} currentClassName="ez:font-medium ez:text-fg" />
          </nav>
          <div className="ez:flex ez:items-center ez:justify-self-end ez:gap-2 ez:lg:gap-6">
            <NextLink
              href={links.account.href}
              className={cn("ez:inline-flex ez:h-10 ez:min-w-10 ez:items-center ez:justify-center ez:gap-1.5 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}
            >
              <Icon name="user" className="ez:sm:hidden" />
              <span className="ez:max-sm:sr-only">{links.account.label}</span>
            </NextLink>
            <ButtonLink href={links.book.href} className="ez:min-h-10 ez:rounded-full ez:px-5 ez:text-site-body ez:lg:min-h-11">
              {links.book.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:grid ez:content-start ez:gap-2">
      <span data-script={scriptOf(title)} className="ez:mb-2 ez:text-site-note ez:text-muted">{title}</span>
      {items.map((l) => (
        <NextLink
          key={l.href}
          href={l.href}
          className={cn("ez:justify-self-start ez:text-site-note ez:no-underline ez:hover:text-fg", l.strong ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}
        >
          {l.label}
        </NextLink>
      ))}
    </nav>
  );
}

export function Footer({ storeName, phone, hours, legal, stay, guide, account, terms }: StayFooterProps) {
  return (
    <footer data-slot="site-footer" data-variant="aurora" className="ez:mt-18 ez:text-fg">
      <div className={cn(wrap, "ez:pt-10 ez:pb-12")}>
        <div className="ez:grid ez:grid-cols-2 ez:gap-x-8 ez:gap-y-10 ez:md:grid-cols-4 ez:lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-4 ez:md:col-span-4 ez:lg:col-span-1">
            <span data-script={scriptOf(storeName)} className="ez:text-site-item ez:font-normal ez:text-fg">{storeName}</span>
            {(phone || hours) && (
              <div className="ez:grid ez:gap-1">
                <span className="ez:text-site-note ez:text-muted">{STAY_TITLE.center}</span>
                {phone && (
                  <a href={`tel:${phone}`} className={cn("ez:justify-self-start ez:text-site-heading ez:text-fg ez:no-underline", focusRing)}>
                    {phone}
                  </a>
                )}
                {hours && <span data-script={scriptOf(hours)} className="ez:text-site-note ez:text-muted">{hours}</span>}
              </div>
            )}
          </div>
          <FooterColumn title={STAY_TITLE.bookingGuide} items={stay} />
          <FooterColumn title={STAY_TITLE.account} items={account} />
          <FooterColumn title={STAY_TITLE.support} items={guide} />
          {terms.length > 0 && <FooterColumn title={STAY_TITLE.terms} items={terms} />}
        </div>
        <div className={cn(hair, "ez:mt-12 ez:grid ez:gap-1.5 ez:border-t ez:pt-6 ez:text-site-small ez:text-muted")}>
          <p className="ez:m-0">{legal}</p>
          <p className="ez:m-0">© {storeName}</p>
        </div>
      </div>
    </footer>
  );
}

const barGrid =
  "ez:fx-glass ez:fx-round-md ez:grid ez:grid-cols-2 ez:items-center ez:gap-y-1 ez:p-2 ez:sm:h-21 ez:sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.25fr)_auto] ez:sm:gap-y-0 ez:sm:p-0 ez:sm:pr-3";

const barCell =
  "ez:relative ez:grid ez:min-w-0 ez:gap-0.5 ez:rounded-md ez:px-4 ez:py-2 ez:sm:rounded-none ez:sm:border-0 ez:sm:border-r ez:sm:border-solid ez:sm:border-hairline ez:sm:px-5 ez:sm:py-0 ez:lg:px-6";

const barLabel = "ez:text-site-small ez:text-muted";

const barValue = "ez:flex ez:min-w-0 ez:items-baseline ez:gap-2 ez:text-site-item ez:font-normal ez:whitespace-nowrap ez:text-fg";

const barGo = "ez:fx-press ez:col-span-2 ez:min-h-12 ez:rounded-lg ez:px-6 ez:text-site-body ez:sm:col-span-1 ez:sm:ml-3 ez:sm:min-h-15";

const pick = "ez:cursor-pointer ez:appearance-none ez:border-0 ez:bg-transparent ez:px-0.5 ez:font-body ez:text-site-item ez:font-normal ez:text-fg";

function BarForm({ max, initial, action }: { max: number; initial?: StaySearch | null; action?: string | null }) {
  return (
    <StayForm max={max} initial={initial} action={action ?? undefined} className={barGrid}>
      <div className={cn(barCell, "ez:focus-within:bg-glass")}>
        <span className={barLabel}>{STAY_TITLE.dateIn}</span>
        <span className={barValue}>
          <DateText which="check_in" emptyClassName="ez:text-muted" />
        </span>
        <SelectedDot className="ez:absolute ez:top-2 ez:right-3 ez:sm:top-0 ez:sm:right-4" />
        <DateInput which="check_in" />
      </div>
      <div className={cn(barCell, "ez:focus-within:bg-glass")}>
        <span className={barLabel}>{STAY_TITLE.dateOut}</span>
        <span className={barValue}>
          <DateText which="check_out" emptyClassName="ez:text-muted" />
          <NightsText className="ez:text-site-small ez:text-muted" />
        </span>
        <DateInput which="check_out" />
      </div>
      <div className={cn(barCell, "ez:col-span-2 ez:sm:col-span-1")}>
        <span className={barLabel}>{STAY_TITLE.guests}</span>
        <span className={barValue}>
          <span className="ez:inline-flex ez:items-baseline">
            {STAY_TITLE.adults}
            <GuestSelect who="adults" className={cn(pick, "ez:ml-1", focusRing)} />
          </span>
          <span aria-hidden="true" className="ez:text-site-off">
            ·
          </span>
          <span className="ez:inline-flex ez:items-baseline">
            {STAY_TITLE.children}
            <GuestSelect who="children" className={cn(pick, "ez:ml-1", focusRing)} />
          </span>
        </span>
      </div>
      <Button type="submit" className={barGo}>
        {STAY_TITLE.find}
      </Button>
    </StayForm>
  );
}

function BlankBar() {
  return (
    <div className={barGrid}>
      {[STAY_TITLE.dateIn, STAY_TITLE.dateOut, STAY_TITLE.guests].map((label, i) => (
        <div key={label} className={cn(barCell, i === 2 && "ez:col-span-2 ez:sm:col-span-1")}>
          <span className={barLabel}>{label}</span>
          <span className="ez:text-site-item">
            <Bar size="short" />
          </span>
        </div>
      ))}
      <BlankButton variant="outline" className={cn(barGo, "ez:border-transparent ez:bg-glass ez:text-muted ez:shadow-none")}>
        {STAY_TITLE.find}
      </BlankButton>
    </div>
  );
}

function StayBox({ room, storeName }: { room: Room; storeName?: string }) {
  const v = roomView(room);
  const all: { label: string; value?: string | null }[] = [
    { label: STAY_TITLE.dateIn, value: room.check_in },
    { label: STAY_TITLE.dateOut, value: room.check_out },
    { label: STAY_TITLE.guests, value: v.guests },
  ];
  const rows = all.filter((r): r is { label: string; value: string } => Boolean(r.value));
  return (
    <div data-slot="hero-stay" className="ez:fx-glass ez:fx-round-md ez:relative ez:mt-3 ez:px-6 ez:pt-5.5 ez:pb-3 ez:text-fg ez:lg:absolute ez:lg:bottom-12 ez:lg:-left-18 ez:lg:mt-0 ez:lg:w-75">
      <span className="ez:text-site-small ez:text-muted">{STAY_TITLE.info}</span>
      {storeName && <p data-script={scriptOf(storeName)} className="ez:m-0 ez:mt-1 ez:truncate ez:text-site-heading ez:text-fg">{storeName}</p>}
      <dl className="ez:m-0 ez:mt-3.5 ez:text-site-body">
        {rows.map((r) => (
          <div key={r.label} className={cn(hair, "ez:flex ez:justify-between ez:gap-4 ez:border-t ez:py-2.5")}>
            <dt className="ez:text-muted">{r.label}</dt>
            <dd className="ez:m-0 ez:text-right ez:text-fg"><Won value={r.value} /></dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const sub = title ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const max = data.booking?.max ?? null;
  const blank = !title && !image && !max;
  const room = blank ? null : ((data.rooms ?? []).find((r) => r.check_in && r.check_out) ?? null);
  const banner = title && data.href && data.href !== ROOMS_HREF ? data.href : null;
  const photo = <Photo src={image} alt={title ?? ""} preload tone={0} sizes="(max-width: 1024px) 100vw, 660px" className="ez:aspect-4/3 ez:rounded-none ez:lg:aspect-auto ez:lg:h-185" />;
  return (
    <section
      data-slot="hero"
      data-variant="aurora"
      data-blank={blank ? "" : undefined}
      className="ez:relative ez:isolate ez:grid ez:items-center ez:gap-10 ez:pt-6 ez:text-fg ez:lg:grid-cols-2 ez:lg:gap-6 ez:lg:pt-10"
    >
      <div aria-hidden="true" className={sky} />
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:lg:self-end ez:lg:pb-52">
        {context.storeName ? (
          <p data-script={scriptOf(context.storeName)} className="ez:fx-title ez:m-0 ez:break-keep ez:text-fg">{context.storeName}</p>
        ) : (
          <span className="ez:fx-title">
            <Bar size="long" strong />
          </span>
        )}
        {title ? (
          <div className="ez:mt-6 ez:grid ez:max-w-118 ez:gap-1">
            <h1 data-script={scriptOf(title)} className="ez:m-0 ez:text-site-item ez:leading-relaxed ez:font-normal ez:text-pretty ez:text-muted">{title}</h1>
            {sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:text-site-item ez:leading-relaxed ez:text-muted">
                {sub}
              </p>
            )}
          </div>
        ) : (
          blank && <Lines className="ez:mt-6 ez:max-w-118 ez:text-site-item" />
        )}
        <div aria-hidden="true" data-slot="hero-bar-slot" className="ez:hidden ez:lg:[[data-slot=hero]:has(+[data-slot=booking-strip])_&]:mt-10 ez:lg:[[data-slot=hero]:has(+[data-slot=booking-strip])_&]:block ez:lg:[[data-slot=hero]:has(+[data-slot=booking-strip])_&]:h-21" />
      </div>
      <div className="ez:relative ez:min-w-0">
        <div className="ez:fx-round-xl ez:overflow-hidden">
          {banner ? (
            <NextLink href={banner} className={cn("ez:block", focusRing)}>
              {photo}
            </NextLink>
          ) : (
            photo
          )}
        </div>
        {room && <StayBox room={room} storeName={context.storeName} />}
      </div>
    </section>
  );
}

export function Booking({ data }: SectionProps<"booking_strip">) {
  const max = data?.max ?? null;
  return (
    <section data-slot="booking-strip" data-variant="aurora" data-blank={max ? undefined : ""} className="ez:relative ez:z-1 ez:text-fg ez:lg:[[data-slot=hero]+&]:-mt-[calc(var(--ezd-section-gap)+18.25rem)] ez:lg:[[data-slot=hero]+&]:w-1/2 ez:lg:[[data-slot=hero]+&]:pr-18">
      {max ? <BarForm max={max} action={data.href} /> : <BlankBar />}
    </section>
  );
}

function priceParts(from: string): [string | null, string] {
  return from.startsWith("1박 ") ? ["1박", from.slice(3)] : [null, from];
}

function RoomCard({ room, tone }: { room: Room; tone: number }) {
  const v = roomView(room);
  const out = Boolean(v.today);
  const [unit, amount] = priceParts(v.from);
  const tag = [...(v.sample ? [STAY_TITLE.sample] : []), ...roomNotes(v)].join(" · ") || null;
  return (
    <NextLink
      href={v.href}
      data-slot="room-card"
      data-state={v.quote?.state}
      data-sample={v.sample || undefined}
      className={cn("ez:group ez:grid ez:min-w-0 ez:content-start ez:text-fg ez:no-underline", focusRing)}
    >
      <span className="ez:fx-round-lg ez:block ez:overflow-hidden">
        <Photo src={v.image} alt={v.name} tone={tone} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 432px" className={cn("ez:aspect-4/3 ez:rounded-none", out && "ez:opacity-45")} />
      </span>
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-3 ez:gap-y-0.5 ez:px-1.5 ez:pt-4">
        <span data-script={scriptOf(v.name)} className={cn("ez:truncate ez:text-site-item ez:font-normal ez:underline-offset-4 ez:group-hover:underline", out ? "ez:text-muted" : "ez:text-fg")}>{v.name}</span>
        <span className={cn("ez:inline-flex ez:items-baseline ez:gap-1.5 ez:text-site-item ez:font-normal", out ? "ez:text-muted" : "ez:text-fg")}>
          {unit && <span className="ez:text-site-small ez:text-muted">{unit}</span>}
          {amount}
        </span>
        <span className="ez:truncate ez:text-site-small ez:text-muted">{v.guests}</span>
        {tag && <span className="ez:justify-self-end ez:text-site-small ez:text-site-off">{tag}</span>}
      </span>
    </NextLink>
  );
}

function BlankRoom({ tone }: { tone: number }) {
  return (
    <div className="ez:grid ez:min-w-0 ez:content-start">
      <span className="ez:fx-round-lg ez:block ez:overflow-hidden">
        <Photo src={null} alt="" tone={tone} className="ez:aspect-4/3 ez:rounded-none" />
      </span>
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-3 ez:gap-y-1.5 ez:px-1.5 ez:pt-4 ez:text-site-item">
        <Bar />
        <BlankPrice className="ez:text-site-item ez:text-muted" />
        <span className="ez:text-site-small">
          <Bar size="short" />
        </span>
      </span>
    </div>
  );
}

function roomCols(n: number): string {
  if (n === 4) return "ez:sm:grid-cols-2 ez:lg:grid-cols-4";
  if (n <= 2) return "ez:sm:grid-cols-2";
  return "ez:sm:grid-cols-2 ez:lg:grid-cols-3";
}

export function Rooms({ data }: SectionProps<"room_list">) {
  const rooms = (data.rooms ?? []).slice(0, 6);
  return (
    <section data-slot="room-list" id="rooms" data-variant="aurora" data-blank={rooms.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={STAY_TITLE.rooms} href={rooms.length ? ROOMS_HREF : undefined} />
      <div className={cn("ez:grid ez:grid-cols-1 ez:gap-x-6 ez:gap-y-10", roomCols(rooms.length || 3))}>
        {rooms.length ? rooms.map((r, i) => <RoomCard key={r.id} room={r} tone={i} />) : [0, 1, 2].map((i) => <BlankRoom key={i} tone={i} />)}
      </div>
    </section>
  );
}

export function Amenities({ data }: SectionProps<"amenities">) {
  const items = (data.items ?? []).slice(0, 20);
  const shown: (string | null)[] = items.length ? items.map((it) => it.name) : [null, null, null, null, null, null, null, null];
  return (
    <section data-slot="amenities" id="amenities" data-variant="aurora" data-blank={items.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={STAY_TITLE.amenities} />
      <ul className="ez:m-0 ez:grid ez:list-none ez:grid-cols-2 ez:gap-x-6 ez:p-0 ez:md:grid-cols-3 ez:lg:grid-cols-4">
        {shown.map((name, i) => (
          <li key={name ? `${name}-${i}` : i} className={cn(hair, "ez:flex ez:min-w-0 ez:items-center ez:gap-3 ez:border-t ez:py-4.5 ez:text-site-item ez:text-fg")}>
            <Icon name="check" size="sm" className="ez:text-site-off" />
            {name ? <span className="ez:min-w-0 ez:break-keep">{name}</span> : <Bar />}
          </li>
        ))}
      </ul>
    </section>
  );
}

type ReviewItem = NonNullable<SectionProps<"reviews">["data"]["items"]>[number];

const reviewCard = "ez:fx-round-lg ez:flex ez:min-h-60 ez:min-w-0 ez:flex-col ez:bg-surface-alt ez:px-8 ez:pt-8 ez:pb-7 ez:md:min-h-68";

function ReviewCard({ item, room }: { item: ReviewItem; room?: string }) {
  return (
    <article className={reviewCard}>
      <span role="img" aria-label={`별점 ${item.rating}점`} className="ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-note ez:text-muted">
        <Icon name="star" size="sm" className="ez:fill-current ez:text-star" />
        {item.rating.toFixed(1)}
      </span>
      <p data-script={scriptOf(item.body)} className="ez:m-0 ez:mt-4.5 ez:line-clamp-4 ez:text-site-item ez:leading-relaxed ez:whitespace-pre-line ez:text-fg">{item.body}</p>
      <span className="ez:mt-auto ez:truncate ez:pt-5.5 ez:text-site-small ez:text-site-off">{[item.name, room, item.date].filter(Boolean).join(" · ")}</span>
    </article>
  );
}

function BlankReview() {
  return (
    <div className={reviewCard}>
      <BlankStars />
      <Lines className="ez:mt-5 ez:text-site-item" />
      <span className="ez:mt-auto ez:pt-5.5 ez:text-site-small">
        <Bar size="short" />
      </span>
    </div>
  );
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  const count = data.count ?? items.length;
  const aside =
    items.length && data.average != null ? <span className="ez:pb-1 ez:text-site-body ez:text-muted">{`${data.average.toFixed(1)} · ${STAY_TITLE.reviews} ${count}`}</span> : null;
  return (
    <section data-slot="reviews" id="reviews" data-variant="aurora" data-blank={items.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={STAY_TITLE.reviews} aside={aside} />
      <div className="ez:grid ez:grid-cols-1 ez:gap-4 ez:md:grid-cols-3 ez:md:gap-6">
        {items.length
          ? items.map((r, i) => <ReviewCard key={`${r.name}-${r.date ?? ""}-${i}`} item={r} room={r.product ? context.products.find((p) => p.id === r.product)?.name : undefined} />)
          : [0, 1, 2].map((i) => <BlankReview key={i} />)}
      </div>
    </section>
  );
}

const mapTile =
  "ez:fx-round-md ez:relative ez:flex ez:min-h-70 ez:items-center ez:justify-center ez:overflow-hidden ez:border ez:border-solid ez:border-glass-edge ez:bg-glass ez:text-muted ez:lg:min-h-95";

const infoRow = cn(hair, "ez:flex ez:justify-between ez:gap-6 ez:border-b ez:py-4.5");

export function Location({ data }: SectionProps<"location">) {
  const address = data.address?.trim() || null;
  const phone = address ? data.phone?.trim() || null : null;
  const pin = <Icon name="pin" className="ez:size-8" />;
  return (
    <section data-slot="location" id="location" data-variant="aurora" data-blank={address ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={STAY_TITLE.location} />
      <div className="ez:fx-aurora-wash ez:fx-round-xl ez:grid ez:gap-4 ez:p-3 ez:md:p-10 ez:lg:grid-cols-[5fr_7fr]">
        <div className="ez:fx-glass ez:fx-round-md ez:flex ez:min-w-0 ez:flex-col ez:px-6 ez:pt-4 ez:pb-6 ez:md:px-8 ez:md:pb-8">
          <dl className="ez:m-0 ez:text-site-body">
            <div className={infoRow}>
              <dt className="ez:shrink-0 ez:text-muted">{STAY_TITLE.address}</dt>
              <dd className="ez:m-0 ez:min-w-0 ez:text-right ez:break-keep ez:text-fg">{address ?? <Bar size="long" />}</dd>
            </div>
            {phone && (
              <div className={infoRow}>
                <dt className="ez:shrink-0 ez:text-muted">{STAY_TITLE.phone}</dt>
                <dd className="ez:m-0 ez:text-fg">{phone}</dd>
              </div>
            )}
          </dl>
          {address && (data.href || phone) && (
            <div className="ez:mt-auto ez:flex ez:flex-wrap ez:gap-2.5 ez:pt-7">
              {data.href && (
                <ButtonLink href={data.href} target="_blank" rel="noopener" className="ez:fx-press ez:min-h-13 ez:rounded-full ez:px-7 ez:text-site-body">
                  {STAY_TITLE.map}
                </ButtonLink>
              )}
              {phone && (
                <a href={`tel:${phone}`} className={cn(glassLink, "ez:min-h-13 ez:px-7")}>
                  <Icon name="phone" size="sm" />
                  {STAY_TITLE.phone}
                </a>
              )}
            </div>
          )}
        </div>
        {address && data.href ? (
          <a href={data.href} target="_blank" rel="noopener" aria-label={MAP_LABEL} className={cn(mapTile, "ez:text-fg", focusRing)}>
            <SampleMap />
            <span className="ez:relative">{pin}</span>
          </a>
        ) : (
          <div className={mapTile}>{pin}</div>
        )}
      </div>
    </section>
  );
}

function Crumbs({ items }: { items: StayListProps["crumbs"] }) {
  return (
    <nav aria-label="현재 위치" className="ez:flex ez:flex-wrap ez:items-center ez:gap-1.5 ez:text-site-small ez:text-muted">
      {items.map((c, i) => (
        <span key={c.href} className="ez:inline-flex ez:items-center ez:gap-1.5">
          {i > 0 && <Icon name="next" size="sm" />}
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

function RoomRow({ room, search, tone }: { room: Room; search: StaySearch; tone: number }) {
  const v = roomView(room);
  const q = v.quote;
  const full = q?.state === "full";
  const [unit, amount] = priceParts(v.from);
  const times = [room.check_in && `${STAY_TITLE.checkIn} ${room.check_in}`, room.check_out && `${STAY_TITLE.checkOut} ${room.check_out}`].filter(Boolean).join(" · ");
  const note = roomNotes(v).join(" · ");
  return (
    <article
      data-slot="room-card"
      data-state={q?.state}
      data-sample={v.sample || undefined}
      className="ez:fx-round-lg ez:grid ez:gap-5 ez:bg-surface-alt ez:p-3 ez:md:grid-cols-[minmax(0,17.5rem)_minmax(0,1fr)] ez:md:gap-x-8 ez:md:p-4 ez:lg:grid-cols-[22rem_minmax(0,1fr)_17rem] ez:lg:gap-x-10"
    >
      <NextLink href={v.href} tabIndex={-1} aria-hidden="true" className="ez:block ez:self-start">
        <Photo src={v.image} alt="" tone={tone} preload={tone < 2} sizes="(max-width: 768px) 100vw, 352px" className={cn("ez:aspect-4/3", full && "ez:opacity-45")} />
      </NextLink>
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:items-start ez:gap-1 ez:px-2 ez:md:px-0 ez:md:py-2">
        {(v.guests || v.sample) && (
          <p className="ez:m-0 ez:flex ez:gap-2 ez:text-site-small ez:text-muted">
            {v.guests && <span>{v.guests}</span>}
            {v.sample && <span>{STAY_TITLE.sample}</span>}
          </p>
        )}
        <h2 data-script={scriptOf(v.name)} className={cn("ez:m-0 ez:mb-2 ez:text-site-section", full ? "ez:text-muted" : "ez:text-fg")}>{v.name}</h2>
        {times && (
          <p className="ez:m-0 ez:flex ez:items-center ez:gap-2 ez:text-site-body ez:text-muted">
            <Icon name="clock" size="sm" />
            {times}
          </p>
        )}
        <NextLink href={v.href} className={cn(more, "ez:mt-4 ez:md:mt-auto ez:md:pt-4")}>
          {STAY_TITLE.view}
          <Icon name="next" size="sm" />
        </NextLink>
      </div>
      <div className={cn(hair, "ez:flex ez:min-w-0 ez:flex-col ez:border-t ez:px-2 ez:pt-5 ez:pb-2 ez:md:col-span-2 ez:md:px-0 ez:lg:col-span-1 ez:lg:border-t-0 ez:lg:border-l ez:lg:py-2 ez:lg:pr-2 ez:lg:pl-8")}>
        {v.rates && (
          <dl className="ez:m-0 ez:grid ez:text-site-note ez:leading-relaxed">
            {[
              { label: STAY_TITLE.weekday, value: v.rates.weekday },
              { label: STAY_TITLE.weekend, value: v.rates.weekend },
            ].map((r) => (
              <div key={r.label} className="ez:flex ez:justify-between ez:gap-4">
                <dt className="ez:text-muted">{r.label}</dt>
                <dd className="ez:m-0 ez:text-muted"><Won value={r.value} /></dd>
              </div>
            ))}
          </dl>
        )}
        <div className={cn("ez:grid ez:justify-items-end ez:text-right", v.rates && cn(hair, "ez:mt-3.5 ez:border-t ez:pt-3.5"))}>
          {q && search.check_in && <p className="ez:m-0 ez:text-site-small ez:text-muted">{[stayDates(search.check_in, search.check_out), q.nights].filter(Boolean).join(" · ")}</p>}
          <p className="ez:m-0 ez:flex ez:items-baseline ez:gap-1.5">
            {!q && unit && <span className="ez:text-site-small ez:text-muted">{unit}</span>}
            <span className={cn("ez:text-site-heading", full ? "ez:text-muted" : "ez:text-fg")}><Won value={q ? q.price : amount} /></span>
          </p>
          {note && <p data-script={scriptOf(note)} className="ez:m-0 ez:text-site-small ez:text-muted">{note}</p>}
        </div>
        {v.book && (
          <ButtonLink href={v.book} block className="ez:fx-press ez:mt-6 ez:min-h-12 ez:rounded-lg ez:text-site-body ez:lg:mt-auto">
            {STAY_TITLE.book}
          </ButtonLink>
        )}
      </div>
    </article>
  );
}

const rateHead = "ez:h-12 ez:w-auto ez:px-6 ez:text-site-note ez:font-normal ez:whitespace-nowrap ez:text-muted";

const rateCell = "ez:h-13 ez:w-auto ez:px-6 ez:text-right ez:font-normal ez:whitespace-nowrap ez:text-fg";

function RateTable({ rooms, peak }: { rooms: Room[]; peak: boolean }) {
  const views = rooms.map(roomView);
  const extra = sameExtra(rooms);
  const first = rooms[0];
  const heads = [STAY_TITLE.weekday, STAY_TITLE.weekend, ...(peak ? [STAY_TITLE.peak, STAY_TITLE.peakWeekend] : []), ...(extra ? [] : [STAY_TITLE.extra])];
  return (
    <section id="rates" data-slot="stay-rates" className="ez:mt-24 ez:grid ez:scroll-mt-6 ez:gap-9">
      <h2 className={h2}>{STAY_TITLE.rates}</h2>
      <div className="ez:fx-round-lg ez:overflow-hidden ez:bg-surface-alt">
        <div className="ez:overflow-x-auto">
          <table className="ez:w-full ez:border-collapse ez:text-site-body">
            <thead>
              <tr className={cn(hair, "ez:border-b")}>
                <th scope="col" className={cn(rateHead, "ez:text-left")}>
                  {STAY_TITLE.rooms}
                </th>
                {heads.map((h) => (
                  <th key={h} scope="col" className={cn(rateHead, "ez:text-right")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {views.map((r) => (
                <tr key={r.id} className={cn(hair, "ez:border-b ez:last:border-b-0")}>
                  <th scope="row" className="ez:h-13 ez:w-auto ez:px-6 ez:text-left ez:font-normal ez:whitespace-nowrap ez:text-fg">
                    {r.name}
                  </th>
                  <td className={rateCell}>{r.rates?.weekday ?? "–"}</td>
                  <td className={rateCell}>{r.rates?.weekend ?? "–"}</td>
                  {peak && <td className={rateCell}>{r.rates?.peak ?? "–"}</td>}
                  {peak && <td className={rateCell}>{r.rates?.peakWeekend ?? "–"}</td>}
                  {!extra && <td className={rateCell}>{r.extra ?? "–"}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {extra && first && (
          <p className={cn(hair, "ez:m-0 ez:flex ez:flex-wrap ez:items-center ez:gap-x-8 ez:gap-y-1 ez:border-t ez:px-6 ez:py-3.5 ez:text-site-body ez:text-muted")}>
            <span className="ez:mr-auto ez:text-site-note">{STAY_TITLE.extra}</span>
            <span>
              {STAY_TITLE.adults} <span className="ez:ml-1.5 ez:text-fg"><Won amount={first.extra_adult_fee ?? 0} /></span>
            </span>
            <span>
              {STAY_TITLE.children} <span className="ez:ml-1.5 ez:text-fg"><Won amount={first.extra_child_fee ?? 0} /></span>
            </span>
          </p>
        )}
      </div>
    </section>
  );
}

function AddOnList({ items, photo }: { items: StayListProps["addOns"]; photo?: string | null }) {
  const views = items.map(addOnView);
  return (
    <section data-slot="stay-add-ons" className={cn("ez:mt-24 ez:grid ez:items-center ez:gap-6", photo && "ez:lg:grid-cols-[5fr_7fr]")}>
      <div className="ez:grid ez:min-w-0 ez:gap-9">
        <h2 className={h2}>{STAY_TITLE.addOns}</h2>
        <ul className="ez:m-0 ez:list-none ez:p-0">
          {views.map((a, i) => (
            <li key={`${a.name}-${i}`} className={cn(hair, "ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-4 ez:border-t ez:py-4.5")}>
              <span className="ez:grid ez:min-w-0 ez:gap-0.5">
                <span data-script={scriptOf(a.name)} className="ez:text-site-item ez:font-normal ez:text-fg">{a.name}</span>
                <span className="ez:text-site-small ez:text-muted">{`${a.unit} · ${a.pay}`}</span>
              </span>
              <span className="ez:text-site-item ez:text-fg"><Won value={a.price} /></span>
            </li>
          ))}
        </ul>
      </div>
      {photo && (
        <div className="ez:fx-round-xl ez:overflow-hidden">
          <Photo src={photo} alt="" tone={2} sizes="(max-width: 1024px) 100vw, 780px" className="ez:aspect-4/3 ez:rounded-none ez:lg:aspect-auto ez:lg:h-120" />
        </div>
      )}
    </section>
  );
}

export function List({ title, count, crumbs, search, rooms, peak, addOns, photo }: StayListProps) {
  return (
    <div data-slot="stay-rooms" data-variant="aurora" className="ez:grid ez:grid-cols-1 ez:pt-6 ez:text-fg">
      <Crumbs items={crumbs} />
      <div className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1 ez:pt-4">
        <h1 data-script={scriptOf(title)} className="ez:m-0 ez:text-site-section ez:text-fg ez:md:text-site-page">{title}</h1>
        {count ? <span className="ez:text-site-item ez:font-normal ez:text-muted">{count}</span> : null}
      </div>
      <div data-slot="stay-search" className="ez:pt-8">
        <BarForm max={search.max} initial={search} action={ROOMS_HREF} />
      </div>
      <div className="ez:mt-8 ez:grid ez:gap-4">
        {rooms.map((r, i) => (
          <RoomRow key={r.id} room={r} search={search} tone={i} />
        ))}
      </div>
      <RateTable rooms={rooms} peak={peak} />
      {addOns.length > 0 && <AddOnList items={addOns} photo={photo} />}
    </div>
  );
}
