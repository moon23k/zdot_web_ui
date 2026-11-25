import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Button, ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { won } from "../../utils/format";
import { focusRing } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, BlankStars, Lines } from "../kit";
import type { FooterLink } from "../shop/types";
import type { Room } from "../template/data";
import { DateInput, DateText, GuestSelect, NightsText, SelectedDot, StayForm } from "./booking";
import { MAP_LABEL, SampleMap } from "./map";
import { StayNavLinks } from "./nav";
import { addOnView, roomNotes, ROOMS_HREF, roomView, sameExtra, STAY_TITLE, stayDates } from "./shared";
import type { RoomView, StayFooterProps, StayHeaderProps, StayListProps, StaySearch } from "./types";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:box-border ez:px-page";

const bleed = "ez:mx-[calc(50%-50vw)]";

const line = "ez:border-0 ez:border-solid ez:border-site-line";

const hair = "ez:border-0 ez:border-solid ez:border-hairline";

const display = "ez:m-0 ez:font-body ez:text-site-section ez:font-light ez:tracking-tight ez:text-fg ez:md:text-site-display-sm ez:md:font-light";

const figure = "ez:font-figure ez:font-light ez:tabular-nums";

const muteLink = cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const moreLink = cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1.5 ez:text-site-small ez:text-site-off ez:no-underline ez:hover:text-fg", focusRing);

function Head({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-x-6 ez:gap-y-2 ez:pb-7">
      <h2 className={display}>{title}</h2>
      {aside}
    </div>
  );
}

export function Header({ name, logoUrl, nav, links }: StayHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="float" className="ez:bg-surface ez:text-fg">
      <div className={cn(wrap, "ez:flex ez:h-16 ez:items-center ez:gap-6 ez:lg:h-22")}>
        <NextLink href="/" className={cn("ez:min-w-0 ez:text-site-heading ez:font-light ez:text-fg ez:no-underline ez:lg:w-51 ez:lg:shrink-0", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:gap-9 ez:overflow-hidden ez:text-site-body ez:whitespace-nowrap ez:max-lg:hidden">
          <StayNavLinks items={nav} className={muteLink} currentClassName="ez:text-fg" />
        </nav>
        <div className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-6 ez:text-site-body">
          <NextLink href={links.account.href} className={cn("ez:inline-flex ez:items-center", muteLink)}>
            <Icon name="user" className="ez:sm:hidden" />
            <span className="ez:max-sm:sr-only">{links.account.label}</span>
          </NextLink>
          <ButtonLink href={links.book.href} className="ez:h-11 ez:min-h-0 ez:rounded-full ez:px-5 ez:text-site-body">
            {links.book.label}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:flex ez:flex-col ez:lg:col-span-2">
      <span className="ez:mb-3.5 ez:text-site-small ez:text-muted">{title}</span>
      {items.map((l) => (
        <NextLink
          key={l.href}
          href={l.href}
          className={cn("ez:self-start ez:text-site-small ez:leading-loose ez:no-underline ez:hover:text-fg", l.strong ? "ez:text-fg" : "ez:text-site-off", focusRing)}
        >
          {l.label}
        </NextLink>
      ))}
    </nav>
  );
}

export function Footer({ storeName, phone, hours, legal, stay, guide, account, terms }: StayFooterProps) {
  return (
    <footer data-slot="site-footer" data-variant="night" className="ez:text-site-off">
      <div className={wrap}>
        <div className={cn(line, "ez:grid ez:grid-cols-2 ez:gap-x-6 ez:gap-y-10 ez:border-t ez:pt-13 ez:pb-10 ez:md:grid-cols-4 ez:lg:grid-cols-12")}>
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-2 ez:md:col-span-4">
            <p className="ez:m-0 ez:text-site-heading ez:font-light ez:text-fg">{storeName}</p>
            {phone && (
              <a href={`tel:${phone}`} className={cn("ez:mt-2 ez:justify-self-start ez:text-site-body ez:text-fg ez:no-underline", figure, focusRing)}>
                <span className="ez:mr-2 ez:font-body ez:text-site-small ez:text-site-off">{STAY_TITLE.center}</span>
                {phone}
              </a>
            )}
            {hours && <span className="ez:text-site-small ez:text-site-off">{hours}</span>}
          </div>
          <FooterColumn title={STAY_TITLE.bookingGuide} items={stay} />
          <FooterColumn title={STAY_TITLE.support} items={guide} />
          <FooterColumn title={STAY_TITLE.account} items={account} />
          {terms.length > 0 && <FooterColumn title={STAY_TITLE.terms} items={terms} />}
        </div>
        <div className={cn(hair, "ez:grid ez:gap-1.5 ez:border-t ez:pt-6 ez:pb-10 ez:text-site-small")}>
          <p className="ez:m-0">{legal}</p>
          <p className="ez:m-0">© {storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const barShell =
  "ez:relative ez:grid ez:w-full ez:max-w-190 ez:overflow-hidden ez:rounded-lg ez:border ez:border-solid ez:border-site-line ez:bg-surface-alt/80 ez:text-left ez:md:h-20 ez:md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto] ez:md:items-center ez:md:pr-2.5";

const barCell = cn(hair, "ez:relative ez:grid ez:min-w-0 ez:content-center ez:gap-0.5 ez:border-b ez:px-6 ez:py-3.5 ez:md:h-full ez:md:border-r ez:md:border-b-0 ez:md:py-0");

const barLabel = "ez:text-site-small ez:text-site-off";

const barValue = "ez:flex ez:min-w-0 ez:items-baseline ez:gap-2 ez:text-site-item ez:font-light ez:whitespace-nowrap ez:text-fg";

const barGo = "ez:m-2.5 ez:h-15 ez:rounded-md ez:px-7 ez:text-site-body ez:md:m-0 ez:md:ml-2.5";

const pick = cn("ez:cursor-pointer ez:appearance-none ez:border-0 ez:bg-transparent ez:px-0.5 ez:font-body ez:text-site-item ez:font-light ez:text-fg", focusRing);

function NightBar({ max, initial, action, className }: { max: number; initial?: StaySearch | null; action?: string | null; className?: string }) {
  return (
    <StayForm max={max} initial={initial} action={action ?? undefined} className={cn(barShell, className)}>
      <div className={cn(barCell, "ez:has-focus-visible:bg-select")}>
        <span className={barLabel}>{STAY_TITLE.dateIn}</span>
        <span className={barValue}>
          <DateText which="check_in" emptyClassName="ez:text-muted" />
        </span>
        <SelectedDot className="ez:absolute ez:top-3 ez:right-3" />
        <DateInput which="check_in" />
      </div>
      <div className={cn(barCell, "ez:has-focus-visible:bg-select")}>
        <span className={barLabel}>{STAY_TITLE.dateOut}</span>
        <span className={barValue}>
          <DateText which="check_out" emptyClassName="ez:text-muted" />
          <NightsText className="ez:text-site-small ez:text-site-off" />
        </span>
        <DateInput which="check_out" />
      </div>
      <div className={barCell}>
        <span className={barLabel}>{STAY_TITLE.guests}</span>
        <span className={barValue}>
          <span className="ez:inline-flex ez:items-baseline">
            {STAY_TITLE.adults}
            <GuestSelect who="adults" className={cn(pick, "ez:ml-1")} />
          </span>
          <span aria-hidden="true" className="ez:text-site-off">
            ·
          </span>
          <span className="ez:inline-flex ez:items-baseline">
            {STAY_TITLE.children}
            <GuestSelect who="children" className={cn(pick, "ez:ml-1")} />
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
    <div className={cn(barShell, "ez:mx-auto")}>
      {[STAY_TITLE.dateIn, STAY_TITLE.dateOut, STAY_TITLE.guests].map((label) => (
        <div key={label} className={barCell}>
          <span className={barLabel}>{label}</span>
          <span className={barValue}>
            <Bar />
          </span>
        </div>
      ))}
      <BlankButton variant="outline" className={cn(barGo, "ez:text-muted")}>
        {STAY_TITLE.find}
      </BlankButton>
    </div>
  );
}

function StayInfo({ room, name }: { room: Room; name?: string }) {
  const rows = [
    { label: STAY_TITLE.checkIn, value: room.check_in },
    { label: STAY_TITLE.checkOut, value: room.check_out },
  ];
  return (
    <div data-slot="hero-info" className="ez:fx-glass ez:rounded-lg ez:px-5.5 ez:pt-5 ez:pb-2.5 ez:text-left ez:lg:absolute ez:lg:bottom-7 ez:lg:left-7 ez:lg:w-75">
      <p className="ez:m-0 ez:text-site-small ez:text-site-off">{STAY_TITLE.info}</p>
      {name && <p className="ez:m-0 ez:mt-1 ez:text-site-heading ez:font-light ez:text-fg">{name}</p>}
      <dl className="ez:m-0 ez:mt-3 ez:text-site-body">
        {rows.map((r) => (
          <div key={r.label} className={cn(hair, "ez:flex ez:justify-between ez:gap-6 ez:border-t ez:py-2.5")}>
            <dt className="ez:whitespace-nowrap ez:text-site-off">{r.label}</dt>
            <dd className={cn("ez:m-0 ez:text-fg", figure)}>{r.value}</dd>
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
  const room = blank ? null : (data.rooms ?? []).find((r) => r.check_in && r.check_out) ?? null;
  return (
    <section data-slot="hero" data-variant="full" data-blank={blank ? "" : undefined} data-bleed="" data-flush="" className={cn(bleed, "ez:relative ez:overflow-clip ez:pt-16 ez:text-fg ez:lg:pt-22")}>
      <div aria-hidden="true" className="ez:fx-sky ez:absolute ez:inset-x-0 ez:top-0 ez:h-219 ez:lg:h-225" />
      <div className="ez:relative ez:min-h-203 ez:lg:h-203">
        <div aria-hidden="true" className="ez:fx-halo" />
        <div aria-hidden="true" className="ez:fx-orb" />
        <div className={cn(wrap, "ez:relative ez:z-2 ez:flex ez:flex-col ez:items-center ez:pt-21 ez:pb-12 ez:text-center ez:lg:h-full ez:lg:justify-end ez:lg:pb-94")}>
          {context.storeName ? (
            <p className="ez:fx-fade ez:fx-title-xl ez:m-0 ez:max-w-full ez:break-keep">{context.storeName}</p>
          ) : (
            <span className="ez:flex ez:w-full ez:justify-center ez:text-site-display-sm ez:lg:text-site-hero">
              <Bar size="long" strong />
            </span>
          )}
          {title && <h1 className="ez:m-0 ez:mt-5 ez:max-w-140 ez:text-site-item ez:font-light ez:whitespace-pre-line ez:text-muted">{title}</h1>}
          {sub && (
            <p data-slot="hero-sub" className="ez:m-0 ez:mt-2 ez:max-w-140 ez:text-site-body ez:text-site-off">
              {sub}
            </p>
          )}
          <div aria-hidden="true" data-slot="hero-booking-room" className="ez:hidden ez:lg:mt-9 ez:lg:h-20 ez:lg:[[data-slot=hero]:has(+[data-slot=booking-strip])_&]:block" />
        </div>
      </div>
      <div className={cn(wrap, "ez:relative ez:z-2")}>
        <div className="ez:relative ez:grid ez:gap-3 ez:lg:block ez:lg:h-175">
          <div className="ez:fx-round-md ez:overflow-hidden ez:border ez:border-solid ez:border-site-line ez:lg:absolute ez:lg:inset-0">
            <Photo src={image} alt={title ?? ""} preload tone={0} sizes="(max-width: 1440px) 100vw, 1344px" className="ez:aspect-4/3 ez:rounded-none ez:lg:aspect-auto ez:lg:h-full" />
          </div>
          {room && <StayInfo room={room} name={context.storeName} />}
        </div>
      </div>
    </section>
  );
}

export function Booking({ data }: SectionProps<"booking_strip">) {
  const max = data?.max ?? null;
  return (
    <section
      data-slot="booking-strip"
      data-variant="night"
      data-blank={max ? undefined : ""}
      className="ez:relative ez:z-3 ez:flex ez:justify-center ez:text-fg ez:lg:h-20 ez:lg:[[data-slot=hero]+&]:-mt-[calc(var(--ezd-section-gap)+72.25rem)] ez:lg:[[data-slot=hero]+&]:mb-[67.25rem]"
    >
      {max ? <NightBar max={max} action={data.href} className="ez:mx-auto" /> : <BlankBar />}
    </section>
  );
}

function priceParts(from: string): [string | null, string] {
  return from.startsWith("1박 ") ? ["1박", from.slice(3)] : [null, from];
}

const roomGrid = "ez:grid ez:gap-x-6 ez:gap-y-11 ez:sm:grid-cols-2 ez:lg:grid-cols-3";

const roomPhoto = "ez:aspect-4/3 ez:rounded-lg ez:border ez:border-solid ez:border-hairline";

function RoomCard({ room, tone }: { room: Room; tone: number }) {
  const v = roomView(room);
  const [unit, amount] = priceParts(v.from);
  return (
    <NextLink
      href={v.href}
      data-slot="room-card"
      data-state={v.quote?.state}
      data-sample={v.sample || undefined}
      className={cn("ez:group ez:grid ez:min-w-0 ez:content-start ez:text-fg ez:no-underline", focusRing)}
    >
      <Photo src={v.image} alt={v.name} tone={tone} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 432px" className={roomPhoto} />
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:gap-x-3 ez:gap-y-1 ez:px-0.5 ez:pt-4">
        <span className="ez:truncate ez:text-site-item ez:font-light ez:underline-offset-4 ez:group-hover:underline">{v.name}</span>
        <span className={cn("ez:text-site-body ez:whitespace-nowrap ez:text-fg", figure)}>
          {unit && <span className="ez:mr-1.5 ez:font-body ez:text-site-small ez:text-site-off">{unit}</span>}
          {amount}
        </span>
        <span className="ez:truncate ez:text-site-small ez:text-site-off">{v.guests}</span>
        {v.sample && <span className="ez:justify-self-end ez:text-site-small ez:text-site-off">{STAY_TITLE.sample}</span>}
      </span>
    </NextLink>
  );
}

function BlankRoom({ tone }: { tone: number }) {
  return (
    <div className="ez:grid ez:min-w-0 ez:content-start">
      <Photo src={null} alt="" tone={tone} className={roomPhoto} />
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:gap-x-3 ez:gap-y-2 ez:px-0.5 ez:pt-4">
        <span className="ez:text-site-item">
          <Bar />
        </span>
        <BlankPrice className="ez:text-site-body ez:text-site-off" />
        <span className="ez:text-site-small">
          <Bar size="short" />
        </span>
      </span>
    </div>
  );
}

export function Rooms({ data }: SectionProps<"room_list">) {
  const rooms = (data.rooms ?? []).slice(0, 6);
  const more = rooms.length ? (
    <NextLink href={ROOMS_HREF} className={moreLink}>
      {STAY_TITLE.more}
      <Icon name="next" size="sm" />
    </NextLink>
  ) : null;
  return (
    <section data-slot="room-list" id="rooms" data-variant="night" data-blank={rooms.length ? undefined : ""} className="ez:text-fg">
      <Head title={STAY_TITLE.rooms} aside={more} />
      <div className={roomGrid}>{rooms.length ? rooms.map((r, i) => <RoomCard key={r.id} room={r} tone={i} />) : [0, 1, 2].map((i) => <BlankRoom key={i} tone={i} />)}</div>
    </section>
  );
}

export function Amenities({ data }: SectionProps<"amenities">) {
  const items = (data.items ?? []).slice(0, 20);
  const cell = cn(line, "ez:flex ez:min-w-0 ez:items-center ez:gap-3 ez:border-t ez:py-5 ez:text-site-item ez:font-light ez:text-fg");
  return (
    <section data-slot="amenities" id="amenities" data-variant="night" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={STAY_TITLE.amenities} />
      <ul className={cn(line, "ez:m-0 ez:grid ez:list-none ez:grid-cols-2 ez:gap-x-6 ez:border-b ez:p-0 ez:md:grid-cols-3 ez:lg:grid-cols-4")}>
        {items.length
          ? items.map((it, i) => (
              <li key={`${it.name}-${i}`} className={cell}>
                <Icon name="check" size="sm" className="ez:text-success" />
                <span className="ez:min-w-0 ez:truncate">{it.name}</span>
              </li>
            ))
          : [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <li key={i} className={cell}>
                <Bar />
              </li>
            ))}
      </ul>
    </section>
  );
}

type ReviewItem = NonNullable<SectionProps<"reviews">["data"]["items"]>[number];

type ReviewRoom = SectionProps<"reviews">["context"]["products"][number];

const reviewCol = cn(line, "ez:grid ez:min-w-0 ez:grid-rows-[auto_1fr_auto] ez:border-t ez:pt-6");

function ReviewColumn({ item, room }: { item: ReviewItem; room?: ReviewRoom }) {
  return (
    <article className={reviewCol}>
      <span className="ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-small ez:text-muted">
        <Icon name="star" size="sm" className="ez:size-3.5 ez:fill-star ez:text-star" />
        <span className={figure}>{item.rating.toFixed(1)}</span>
      </span>
      <p className="ez:m-0 ez:mt-4.5 ez:line-clamp-4 ez:text-site-item ez:leading-relaxed ez:font-light ez:text-fg">{item.body}</p>
      <span className="ez:mt-8 ez:truncate ez:text-site-small ez:text-site-off">{[item.name, room?.name, item.date].filter(Boolean).join(" · ")}</span>
    </article>
  );
}

function BlankReview() {
  return (
    <div className={reviewCol}>
      <BlankStars />
      <span className="ez:mt-4.5 ez:text-site-item">
        <Lines />
      </span>
      <span className="ez:mt-8 ez:text-site-small">
        <Bar size="short" />
      </span>
    </div>
  );
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  const average = items.length && data.average != null ? data.average : null;
  const aside =
    average != null ? (
      <span className={cn("ez:text-site-small ez:text-site-off", figure)}>
        {average.toFixed(1)}
        {data.count != null && ` · ${STAY_TITLE.reviews} ${data.count}`}
      </span>
    ) : null;
  return (
    <section data-slot="reviews" id="reviews" data-variant="night" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={STAY_TITLE.reviews} aside={aside} />
      <div className="ez:grid ez:gap-x-6 ez:gap-y-10 ez:md:grid-cols-3">
        {items.length
          ? items.map((r, i) => <ReviewColumn key={`${r.name}-${r.date ?? ""}-${i}`} item={r} room={r.product ? context.products.find((p) => p.id === r.product) : undefined} />)
          : [0, 1, 2].map((i) => <BlankReview key={i} />)}
      </div>
    </section>
  );
}

const infoRow = cn(line, "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-b ez:py-5 ez:text-site-item ez:font-light");

export function Location({ data }: SectionProps<"location">) {
  const address = data.address?.trim() || null;
  const phone = address ? data.phone || null : null;
  const href = address ? data.href || null : null;
  return (
    <section data-slot="location" id="location" data-variant="night" data-blank={address ? undefined : ""} className="ez:text-fg">
      <Head title={STAY_TITLE.location} />
      <div className="ez:grid ez:gap-6 ez:lg:grid-cols-[5fr_7fr]">
        <div className={cn(line, "ez:flex ez:flex-col ez:border-t")}>
          <dl className="ez:m-0">
            <div className={infoRow}>
              <dt className="ez:shrink-0 ez:text-site-off">{STAY_TITLE.address}</dt>
              <dd className="ez:m-0 ez:min-w-0 ez:text-right ez:text-fg">{address ?? <Bar size="long" />}</dd>
            </div>
            {phone && (
              <div className={infoRow}>
                <dt className="ez:shrink-0 ez:text-site-off">{STAY_TITLE.phone}</dt>
                <dd className="ez:m-0">
                  <a href={`tel:${phone}`} className={cn("ez:text-fg ez:no-underline ez:hover:underline", figure, focusRing)}>
                    {phone}
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {(href || phone) && (
            <div className="ez:mt-auto ez:flex ez:flex-wrap ez:gap-2.5 ez:pt-7">
              {href && (
                <ButtonLink href={href} target="_blank" rel="noopener" aria-label={MAP_LABEL} className="ez:h-12 ez:min-h-0 ez:rounded-full ez:px-6 ez:text-site-body">
                  {STAY_TITLE.map}
                </ButtonLink>
              )}
              {phone && (
                <ButtonLink href={`tel:${phone}`} variant="outline" className="ez:h-12 ez:min-h-0 ez:rounded-full ez:border-site-line ez:px-6 ez:text-site-body">
                  <Icon name="phone" size="sm" />
                  {STAY_TITLE.phone}
                </ButtonLink>
              )}
            </div>
          )}
        </div>
        <div className="ez:relative ez:min-h-75 ez:fx-round-md ez:overflow-hidden ez:border ez:border-solid ez:border-site-line ez:bg-deep ez:lg:min-h-100">
          {href ? (
            <>
              <SampleMap className="ez:invert ez:hue-rotate-180" />
              <span aria-hidden="true" className="ez:fx-ring ez:absolute ez:top-1/2 ez:left-1/2 ez:size-3.5 ez:-translate-1/2 ez:rounded-full ez:bg-primary" />
            </>
          ) : (
            <span aria-hidden="true" className="ez:absolute ez:inset-0 ez:flex ez:items-center ez:justify-center ez:text-site-off">
              <Icon name="pin" className="ez:size-8" />
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function noteTone(v: RoomView): string {
  const q = v.quote;
  if (q?.state === "full" || (!q && v.today)) return "ez:text-danger";
  if (q?.state === "open") return "ez:text-success";
  return q ? "ez:text-warning-text" : "ez:text-muted";
}

function RoomRow({ room, search, tone }: { room: Room; search: StaySearch; tone: number }) {
  const v = roomView(room);
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
      className={cn(line, "ez:grid ez:gap-5 ez:border-b ez:py-8 ez:md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] ez:md:gap-x-8 ez:lg:grid-cols-[22rem_minmax(0,1fr)_17rem] ez:lg:gap-10")}
    >
      <NextLink href={v.href} tabIndex={-1} aria-hidden="true" className="ez:block ez:self-start">
        <Photo src={v.image} alt="" tone={tone} preload={tone < 2} sizes="(max-width: 768px) 100vw, 352px" className={cn(roomPhoto, full && "ez:opacity-45")} />
      </NextLink>
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:items-start ez:gap-1 ez:lg:pt-1">
        {(v.guests || v.sample) && (
          <p className="ez:m-0 ez:flex ez:gap-2 ez:text-site-small ez:text-site-off">
            {v.guests && <span>{v.guests}</span>}
            {v.sample && <span>{STAY_TITLE.sample}</span>}
          </p>
        )}
        <h2 className={cn("ez:m-0 ez:mb-2.5 ez:font-body ez:text-site-heading ez:font-light", full ? "ez:text-muted" : "ez:text-fg")}>{v.name}</h2>
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
          <dl className={cn("ez:m-0 ez:grid ez:text-site-small ez:leading-relaxed", figure)}>
            {[
              { label: STAY_TITLE.weekday, value: v.rates.weekday },
              { label: STAY_TITLE.weekend, value: v.rates.weekend },
            ].map((r) => (
              <div key={r.label} className="ez:flex ez:justify-between ez:gap-4">
                <dt className="ez:font-body ez:text-site-off">{r.label}</dt>
                <dd className="ez:m-0 ez:text-muted">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className={cn("ez:grid ez:justify-items-end ez:text-right", v.rates && cn(hair, "ez:mt-3.5 ez:border-t ez:pt-3.5"))}>
          {q && search.check_in && <p className={cn("ez:m-0 ez:text-site-small ez:text-site-off", figure)}>{[stayDates(search.check_in, search.check_out), q.nights].filter(Boolean).join(" · ")}</p>}
          <p className="ez:m-0 ez:flex ez:items-baseline ez:gap-1.5">
            {!q && unit && <span className="ez:text-site-small ez:text-site-off">{unit}</span>}
            <span className={cn("ez:text-site-rank", figure, full ? "ez:text-muted" : "ez:text-fg")}>{q ? q.price : amount}</span>
          </p>
          {note && (
            <p className={cn("ez:m-0 ez:inline-flex ez:items-center ez:gap-1.75 ez:text-site-small", noteTone(v))}>
              <span aria-hidden="true" className="ez:size-1.5 ez:rounded-full ez:bg-current" />
              {note}
            </p>
          )}
        </div>
        {v.book && (
          <ButtonLink href={v.book} variant="outline" className="ez:mt-6 ez:h-12 ez:w-full ez:rounded-full ez:border-site-line ez:lg:mt-auto">
            {STAY_TITLE.book}
          </ButtonLink>
        )}
      </div>
    </article>
  );
}

const rateCell = "ez:h-13 ez:px-6 ez:text-right ez:whitespace-nowrap ez:text-fg";

function RateTable({ rooms, peak }: { rooms: Room[]; peak: boolean }) {
  const views = rooms.map(roomView);
  const extra = sameExtra(rooms);
  const first = rooms[0];
  const heads = [STAY_TITLE.weekday, STAY_TITLE.weekend, ...(peak ? [STAY_TITLE.peak, STAY_TITLE.peakWeekend] : []), ...(extra ? [] : [STAY_TITLE.extra])];
  return (
    <section id="rates" data-slot="stay-rates" className="ez:mt-20 ez:scroll-mt-6">
      <Head title={STAY_TITLE.rates} />
      <div className="ez:overflow-hidden ez:rounded-lg ez:border ez:border-solid ez:border-site-line">
        <div className="ez:overflow-x-auto">
          <table className="ez:w-full ez:border-collapse ez:text-site-body">
            <thead>
              <tr className="ez:bg-surface-alt">
                <th scope="col" className="ez:h-11 ez:w-auto ez:px-6 ez:text-left ez:text-site-small ez:font-normal ez:text-site-off">
                  {STAY_TITLE.rooms}
                </th>
                {heads.map((h) => (
                  <th key={h} scope="col" className="ez:h-11 ez:w-auto ez:px-6 ez:text-right ez:text-site-small ez:font-normal ez:whitespace-nowrap ez:text-site-off">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={figure}>
              {views.map((r) => (
                <tr key={r.id} className={cn(line, "ez:border-t")}>
                  <th scope="row" className="ez:h-13 ez:w-auto ez:px-6 ez:text-left ez:font-body ez:font-light ez:whitespace-nowrap ez:text-fg">
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
          <p className={cn(line, "ez:m-0 ez:flex ez:flex-wrap ez:items-center ez:gap-x-8 ez:gap-y-1 ez:border-t ez:px-6 ez:py-3.5 ez:text-site-body ez:text-muted")}>
            <span className="ez:mr-auto ez:text-site-small ez:text-site-off">{STAY_TITLE.extra}</span>
            <span>
              {STAY_TITLE.adults} <span className={cn("ez:ml-1.5 ez:text-fg", figure)}>{won(first.extra_adult_fee ?? 0)}</span>
            </span>
            <span>
              {STAY_TITLE.children} <span className={cn("ez:ml-1.5 ez:text-fg", figure)}>{won(first.extra_child_fee ?? 0)}</span>
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
    <section id="add-ons" data-slot="add-ons" className="ez:mt-20">
      <Head title={STAY_TITLE.addOns} />
      <div className={cn("ez:grid ez:items-center ez:gap-6", photo && "ez:lg:grid-cols-[5fr_7fr]")}>
        <ul className={cn(line, "ez:m-0 ez:list-none ez:border-b ez:p-0")}>
          {views.map((a, i) => (
            <li key={`${a.name}-${i}`} className={cn(line, "ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-x-6 ez:gap-y-1 ez:border-t ez:py-5")}>
              <span className="ez:text-site-item ez:font-light ez:text-fg">{a.name}</span>
              <span className="ez:flex ez:items-baseline ez:gap-2 ez:text-site-small ez:text-site-off">
                <span className={cn("ez:text-site-body ez:text-fg", figure)}>{a.price}</span>
                {`${a.unit} · ${a.pay}`}
              </span>
            </li>
          ))}
        </ul>
        {photo && <Photo src={photo} alt="" tone={2} sizes="(max-width: 1024px) 100vw, 784px" className="ez:aspect-4/3 ez:rounded-lg ez:border ez:border-solid ez:border-hairline" />}
      </div>
    </section>
  );
}

export function List({ title, count, crumbs, search, rooms, peak, addOns, photo }: StayListProps) {
  return (
    <div data-slot="stay-rooms" data-variant="night" className="ez:grid ez:grid-cols-1 ez:text-fg">
      <nav aria-label="현재 위치" className="ez:flex ez:flex-wrap ez:items-center ez:gap-1 ez:text-site-small ez:text-site-off">
        {crumbs.map((c, i) => (
          <span key={c.href} className="ez:inline-flex ez:items-center ez:gap-1">
            {i > 0 && <Icon name="next" size="sm" />}
            {i === crumbs.length - 1 ? (
              <span aria-current="page">{c.label}</span>
            ) : (
              <NextLink href={c.href} className={cn("ez:text-site-off ez:no-underline ez:hover:text-fg", focusRing)}>
                {c.label}
              </NextLink>
            )}
          </span>
        ))}
      </nav>
      <div className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1 ez:pt-4">
        <h1 className={display}>{title}</h1>
        <span className={cn("ez:text-site-body ez:text-site-off", figure)}>{count}</span>
      </div>
      <div data-slot="stay-search" className="ez:pt-8">
        <NightBar max={search.max} initial={search} action={ROOMS_HREF} />
      </div>
      <div className="ez:mt-4">
        {rooms.map((r, i) => (
          <RoomRow key={r.id} room={r} search={search} tone={i} />
        ))}
      </div>
      <RateTable rooms={rooms} peak={peak} />
      {addOns.length > 0 && <AddOnList items={addOns} photo={photo} />}
    </div>
  );
}
