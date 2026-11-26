import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Button } from "../../components/button";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { StarRow } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, BlankStars, Lines } from "../kit";
import { lastOdd, ROW_ITEM } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import type { Room } from "../template/data";
import { DateInput, DateText, GuestSelect, NightsText, SelectedDot, StayForm } from "./booking";
import { AmenityIcon } from "./icons";
import { StayNavLinks } from "./nav";
import { addOnView, roomNotes, ROOMS_HREF, roomView, STAY_TITLE } from "./shared";
import type { AddOnView, StayFooterProps, StayHeaderProps, StayListProps } from "./types";
import { MAP_LABEL, SampleMap } from "./map";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const CARD_SIZES = "(max-width: 1024px) 50vw, 320px";
const CARD_SIZES_WIDE = "(max-width: 1024px) 50vw, 640px";

const iconLink = cn("ez:relative ez:inline-flex ez:h-10 ez:min-w-10 ez:items-center ez:justify-center ez:text-fg ez:no-underline", focusRing);

const pill = cn(
  "ez:inline-flex ez:h-11.5 ez:cursor-pointer ez:items-center ez:justify-center ez:gap-2 ez:rounded-button ez:border-0 ez:px-6 ez:font-body ez:text-site-lead ez:font-medium ez:whitespace-nowrap ez:text-fg ez:no-underline",
  focusRing,
);

const moreLink = cn("ez:inline-flex ez:items-center ez:gap-2 ez:text-site-lead ez:font-normal ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing);

const sectionTitle = "ez:m-0 ez:text-site-section ez:text-fg";

function Head({ title, aside, href }: { title: string; aside?: ReactNode; href?: string }) {
  return (
    <div className="ez:flex ez:items-center ez:justify-between ez:gap-3">
      <div className="ez:flex ez:min-w-0 ez:items-center ez:gap-4">
        <h2 data-script={scriptOf(title)} className={sectionTitle}>{title}</h2>
        {aside}
      </div>
      {href && (
        <NextLink href={href} className={cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1 ez:text-site-lead ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}>
          {STAY_TITLE.more}
          <Icon name="next" size="sm" />
        </NextLink>
      )}
    </div>
  );
}

export function Header({ name, logoUrl, nav, links }: StayHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="showroom" className="ez:bg-transparent">
      <div className="ez:mx-auto ez:grid ez:min-h-16 ez:max-w-wrap ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-6 ez:px-page ez:lg:min-h-19 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <NextLink data-script={scriptOf(name)} href="/" className={cn("ez:min-w-0 ez:justify-self-start ez:text-site-heading ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:justify-center ez:gap-6.5 ez:overflow-hidden ez:whitespace-nowrap ez:max-lg:hidden">
          <StayNavLinks items={nav} className={cn("ez:text-site-lead ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)} currentClassName="ez:font-medium ez:text-fg" />
        </nav>
        <div className="ez:flex ez:items-center ez:justify-self-end ez:gap-1">
          <NextLink href={links.account.href} aria-label={links.account.label} className={iconLink}>
            <Icon name="user" />
          </NextLink>
          <NextLink href={links.book.href} className={cn(pill, "ez:ml-2.5 ez:h-10 ez:bg-surface-alt ez:px-5")}>
            {links.book.label}
          </NextLink>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:grid ez:content-start ez:gap-4">
      <span data-script={scriptOf(title)} className="ez:text-site-small ez:font-normal ez:text-muted">{title}</span>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-2.5 ez:p-0 ez:text-site-lead">
        {items.map((l) => (
          <li key={l.href}>
            <NextLink href={l.href} className={cn("ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", l.strong && "ez:font-medium", focusRing)}>
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
    <footer data-slot="site-footer" data-variant="showroom">
      <div className="ez:rounded-t-lg ez:bg-surface-alt ez:text-fg">
        <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-14 ez:pb-10 ez:md:pt-16 ez:md:pb-14">
          <div className="ez:grid ez:grid-cols-2 ez:gap-x-8 ez:gap-y-10 ez:md:grid-cols-3 ez:lg:grid-cols-[4fr_3fr_3fr_3fr_3fr]">
            <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-4 ez:md:col-span-3 ez:lg:col-span-1">
              <span className="ez:text-site-small ez:font-normal ez:text-muted">{STAY_TITLE.center}</span>
              {(phone || hours) && (
                <div className="ez:grid ez:gap-1.5">
                  {phone && (
                    <a href={`tel:${phone}`} className={cn("ez:justify-self-start ez:text-site-section ez:text-fg ez:tabular-nums ez:no-underline", focusRing)}>
                      {phone}
                    </a>
                  )}
                  {hours && <span data-script={scriptOf(hours)} className="ez:text-site-lead ez:text-muted">{hours}</span>}
                </div>
              )}
            </div>
            <FooterColumn title={STAY_TITLE.rooms} items={stay} />
            <FooterColumn title={STAY_TITLE.guide} items={guide} />
            <FooterColumn title={STAY_TITLE.booking} items={account} />
            {terms.length > 0 && <FooterColumn title={STAY_TITLE.terms} items={terms} />}
          </div>
          <div className="ez:mt-12 ez:flex ez:flex-col ez:gap-3 ez:text-site-small ez:leading-relaxed ez:text-muted ez:md:mt-14 ez:md:flex-row ez:md:justify-between ez:md:gap-10">
            <p className="ez:m-0">{legal}</p>
            <p className="ez:m-0 ez:shrink-0">© {storeName}</p>
          </div>
          <p
            data-script={scriptOf(storeName)}
            aria-hidden="true"
            className="ez:m-0 ez:mt-10 ez:truncate ez:text-center ez:text-site-name ez:text-site-faint ez:md:mt-12 ez:md:text-site-display-lg ez:lg:text-site-hero"
          >
            {storeName}
          </p>
        </div>
      </div>
    </footer>
  );
}

const field = "ez:relative ez:grid ez:min-w-0 ez:content-center ez:gap-0.5 ez:rounded-sm ez:bg-surface ez:px-3.5 ez:py-3 ez:text-fg";

const fieldFocus = "ez:has-focus-visible:outline-2 ez:has-focus-visible:outline-offset-2 ez:has-focus-visible:outline-fg";

const fieldLabel = "ez:text-site-small ez:text-muted";

const guestSelect = "ez:m-0 ez:cursor-pointer ez:appearance-none ez:border-0 ez:bg-transparent ez:p-0 ez:font-body ez:text-site-lead ez:text-fg ez:tabular-nums ez:outline-none";

function DateField({ which, nights, className }: { which: "check_in" | "check_out"; nights?: boolean; className?: string }) {
  return (
    <label className={cn(field, fieldFocus, className)}>
      <span className={fieldLabel}>{which === "check_in" ? STAY_TITLE.dateIn : STAY_TITLE.dateOut}</span>
      <span className="ez:flex ez:items-baseline ez:gap-2.5 ez:whitespace-nowrap ez:text-site-lead ez:tabular-nums">
        <DateText which={which} emptyClassName="ez:text-muted" />
        {nights && <NightsText className="ez:text-site-small ez:text-muted" />}
      </span>
      {which === "check_in" && <SelectedDot className="ez:absolute ez:top-3.5 ez:right-3.5" />}
      <DateInput which={which} />
    </label>
  );
}

function GuestField({ className }: { className?: string }) {
  return (
    <div className={cn(field, fieldFocus, className)}>
      <span className={fieldLabel}>{STAY_TITLE.guests}</span>
      <span className="ez:flex ez:items-baseline ez:gap-1 ez:whitespace-nowrap ez:text-site-lead">
        {STAY_TITLE.adults}
        <GuestSelect who="adults" className={guestSelect} />
        <span aria-hidden="true" className="ez:px-1 ez:text-muted">
          ·
        </span>
        {STAY_TITLE.children}
        <GuestSelect who="children" className={guestSelect} />
      </span>
    </div>
  );
}

function BlankField({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn(field, className)}>
      <span className={fieldLabel}>{label}</span>
      <span className="ez:text-site-lead">
        <Bar size="short" />
      </span>
    </div>
  );
}

const heroFields = "ez:grid ez:grid-cols-2 ez:gap-2 ez:xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]";

const heroGuest = "ez:col-span-2 ez:xl:col-span-1";

const heroGo = "ez:h-11.5 ez:min-h-0 ez:gap-2 ez:px-6";

function HeroBooking({ max, href }: { max: number | null; href?: string | null }) {
  if (!max) {
    return (
      <div data-slot="hero-booking" className="ez:grid ez:gap-3">
        <div className={heroFields}>
          <BlankField label={STAY_TITLE.dateIn} />
          <BlankField label={STAY_TITLE.dateOut} />
          <BlankField label={STAY_TITLE.guests} className={heroGuest} />
        </div>
        <BlankButton variant="outline" className={cn(pill, "ez:min-h-0 ez:w-full ez:border-transparent ez:bg-surface ez:text-muted")}>
          {STAY_TITLE.find}
        </BlankButton>
      </div>
    );
  }
  return (
    <div data-slot="hero-booking">
      <StayForm max={max} action={href ?? undefined} className="ez:grid ez:gap-3">
        <div className={heroFields}>
          <DateField which="check_in" />
          <DateField which="check_out" />
          <GuestField className={heroGuest} />
        </div>
        <Button type="submit" block className={heroGo}>
          {STAY_TITLE.find}
        </Button>
      </StayForm>
    </div>
  );
}

const heroRoomTile = "ez:grid ez:grid-cols-2 ez:items-start ez:gap-5 ez:rounded-lg ez:bg-surface-alt ez:p-4 ez:md:gap-6 ez:md:p-5";

function HeroRoom({ room }: { room: Room }) {
  const r = roomView(room);
  const out = Boolean(r.today);
  return (
    <NextLink href={r.href} data-slot="hero-room" data-sample={r.sample ? "" : undefined} className={cn(heroRoomTile, "ez:group ez:items-stretch ez:text-fg ez:no-underline", focusRing)}>
      <Photo src={r.image} alt={r.name} sizes="(max-width: 1024px) 50vw, 220px" className={cn("ez:aspect-square ez:rounded-sm ez:bg-surface", out && "ez:opacity-45")} />
      <span className="ez:flex ez:min-w-0 ez:flex-col ez:pt-1.5 ez:pb-1">
        <span data-script={scriptOf(r.name)} className="ez:line-clamp-2 ez:text-site-item ez:font-normal ez:group-hover:underline ez:underline-offset-4">{r.name}</span>
        {r.guests && <span className="ez:mt-1 ez:text-site-small ez:text-muted">{r.guests}</span>}
        <span className={cn("ez:mt-3 ez:text-site-item ez:tabular-nums", out && "ez:text-muted")}><Won value={r.from} /></span>
        {roomNotes(r).length > 0 && <span data-script={scriptOf(roomNotes(r).join(" · "))} className="ez:mt-0.5 ez:text-site-small ez:text-muted">{roomNotes(r).join(" · ")}</span>}
        <span className="ez:mt-auto ez:inline-flex ez:items-center ez:gap-2 ez:pt-4 ez:text-site-lead ez:font-normal">
          {STAY_TITLE.view}
          <Icon name="right" size="sm" />
        </span>
      </span>
    </NextLink>
  );
}

function BlankHeroRoom() {
  return (
    <div className={heroRoomTile}>
      <Photo src={null} alt="" className="ez:aspect-square ez:rounded-sm ez:bg-surface" />
      <span className="ez:grid ez:content-start ez:gap-2.5 ez:pt-1.5 ez:text-site-item">
        <Bar />
        <span className="ez:text-site-small">
          <Bar size="short" />
        </span>
        <BlankPrice className="ez:font-normal ez:text-muted" />
      </span>
    </div>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const sub = title ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const max = data.booking?.max ?? null;
  const blank = !title && !image && !max;
  const rooms = blank ? [] : (data.rooms ?? []);
  const room = rooms.find((r) => r.image && r.image !== image) ?? rooms.find((r) => r.image) ?? rooms[0] ?? null;
  const side = blank || room !== null;
  const banner = title && data.href && data.href !== ROOMS_HREF ? data.href : null;
  const photo = <Photo src={image} alt={title ?? ""} preload sizes="(max-width: 1024px) 100vw, 800px" tone={0} className="ez:aspect-[4/3] ez:h-full ez:rounded-lg ez:lg:aspect-auto" />;
  return (
    <section
      data-slot="hero"
      data-variant="showroom"
      data-blank={blank ? "" : undefined}
      className="ez:grid ez:grid-cols-1 ez:gap-3 ez:text-fg ez:md:grid-cols-2 ez:md:gap-4 ez:lg:min-h-148 ez:lg:grid-cols-[13fr_8fr] ez:lg:grid-rows-[81fr_63fr]"
    >
      <div className="ez:min-h-0 ez:md:col-span-2 ez:lg:col-span-1 ez:lg:row-span-2">
        {banner ? (
          <NextLink href={banner} className={cn("ez:block ez:h-full", focusRing)}>
            {photo}
          </NextLink>
        ) : (
          photo
        )}
      </div>
      <div className={cn("ez:flex ez:min-h-0 ez:min-w-0 ez:flex-col ez:gap-6 ez:rounded-lg ez:bg-surface-alt ez:p-6 ez:md:px-8 ez:md:pt-8 ez:md:pb-7", !side && "ez:md:col-span-2 ez:lg:col-span-1 ez:lg:row-span-2")}>
        <div className="ez:grid ez:gap-3.5">
          {context.storeName ? (
            <p data-script={scriptOf(context.storeName)} className="ez:m-0 ez:text-site-name ez:break-keep ez:text-fg ez:lg:text-site-display-md">{context.storeName}</p>
          ) : (
            <span className="ez:text-site-name ez:lg:text-site-display-md">
              <Bar size="long" strong />
            </span>
          )}
          {title && (
            <div className="ez:grid ez:gap-1.5">
              <h1 data-script={scriptOf(title)} className="ez:m-0 ez:text-site-item ez:font-normal ez:text-balance ez:text-fg">{title}</h1>
              {sub && (
                <p data-slot="hero-sub" className="ez:m-0 ez:text-site-lead ez:text-muted">
                  {sub}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="ez:mt-auto">
          <HeroBooking max={max} href={data.booking?.href} />
        </div>
      </div>
      {blank ? <BlankHeroRoom /> : room && <HeroRoom room={room} />}
    </section>
  );
}

export function Amenities({ data }: SectionProps<"amenities">) {
  const items = data.items ?? [];
  const empty = !items.length;
  return (
    <section data-slot="amenities" id="amenities" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-7 ez:text-fg">
      <Head title={STAY_TITLE.amenities} />
      <ul className="ez:m-0 ez:grid ez:list-none ez:grid-cols-2 ez:content-center ez:gap-x-6 ez:gap-y-5 ez:rounded-md ez:bg-surface-alt ez:px-6 ez:py-6 ez:sm:grid-cols-3 ez:md:grid-cols-4 ez:lg:min-h-20 ez:lg:grid-cols-5 ez:lg:px-8">
        {empty
          ? [0, 1, 2, 3, 4].map((i) => (
              <li key={i} className="ez:flex ez:items-center ez:text-site-lead">
                <Bar />
              </li>
            ))
          : items.map((it, i) => (
              <li key={`${it.name}-${i}`} className="ez:flex ez:min-w-0 ez:items-center ez:gap-2.5 ez:text-site-lead ez:text-muted">
                <AmenityIcon name={it.name} />
                <span className="ez:min-w-0 ez:break-keep">{it.name}</span>
              </li>
            ))}
      </ul>
    </section>
  );
}

function RoomCard({ room, eager, wide }: { room: Room; eager?: boolean; wide?: boolean }) {
  const r = roomView(room);
  const out = Boolean(r.today);
  const label = [...(r.sample ? [STAY_TITLE.sample] : []), ...roomNotes(r)].join(" · ") || null;
  return (
    <NextLink
      href={r.href}
      data-slot="room-card"
      data-state={r.quote?.state}
      data-sample={r.sample ? "" : undefined}
      className={cn("ez:group ez:flex ez:min-w-0 ez:flex-col ez:text-fg ez:no-underline", focusRing)}
    >
      <div className="ez:rounded-md ez:bg-surface-alt ez:p-3 ez:md:p-4.5">
        <Photo src={r.image} alt={r.name} preload={eager} sizes={wide ? CARD_SIZES_WIDE : CARD_SIZES} className={cn(wide ? "ez:aspect-[3/2]" : "ez:aspect-square", "ez:rounded-sm ez:bg-surface", out && "ez:opacity-45")} />
      </div>
      <div className="ez:grid ez:grid-cols-1 ez:items-baseline ez:gap-x-3 ez:gap-y-0.5 ez:px-1 ez:pt-3.5 ez:md:grid-cols-[minmax(0,1fr)_auto]">
        <span data-script={scriptOf(r.name)} className={cn("ez:truncate ez:text-site-lead ez:font-normal ez:group-hover:underline ez:underline-offset-4", out ? "ez:text-muted" : "ez:text-fg")}>{r.name}</span>
        <span className="ez:text-site-small ez:text-muted ez:md:justify-self-end">{r.guests}</span>
        <span className={cn("ez:text-site-lead ez:tabular-nums", out ? "ez:text-muted" : "ez:text-fg")}><Won value={r.from} /></span>
        {label && <span className="ez:text-site-small ez:text-muted ez:md:justify-self-end">{label}</span>}
      </div>
    </NextLink>
  );
}

function BlankRoomCard() {
  return (
    <div className="ez:flex ez:min-w-0 ez:flex-col">
      <div className="ez:rounded-md ez:bg-surface-alt ez:p-3 ez:md:p-4.5">
        <Photo src={null} alt="" className="ez:aspect-square ez:rounded-sm ez:bg-surface" />
      </div>
      <div className="ez:grid ez:gap-2 ez:px-1 ez:pt-3.5 ez:text-site-lead">
        <Bar />
        <BlankPrice className="ez:font-normal ez:text-muted" />
      </div>
    </div>
  );
}

const gridFour = "ez:grid ez:grid-cols-2 ez:gap-x-3 ez:gap-y-8 ez:md:gap-x-4 ez:md:gap-y-9 ez:lg:grid-cols-4";

const shelfRow = "ez:-mx-1.5 ez:flex ez:flex-wrap ez:justify-center ez:gap-y-8 ez:md:-mx-2 ez:md:gap-y-9";

const shelfItem = cn(ROW_ITEM[4], "ez:px-1.5 ez:md:px-2");
const shelfFew = { 2: cn(ROW_ITEM[2], "ez:px-1.5 ez:md:px-2"), 3: cn(ROW_ITEM[3], "ez:px-1.5 ez:md:px-2") } as const;

export function Rooms({ data }: SectionProps<"room_list">) {
  const rooms = data.rooms ?? [];
  if (!rooms.length) {
    return (
      <section data-slot="room-list" id="rooms" data-blank="" className="ez:grid ez:gap-7 ez:text-fg">
        <Head title={STAY_TITLE.rooms} />
        <div className={gridFour}>
          {[0, 1, 2, 3].map((i) => (
            <BlankRoomCard key={i} />
          ))}
        </div>
      </section>
    );
  }
  return (
    <section data-slot="room-list" id="rooms" className="ez:grid ez:gap-7 ez:text-fg">
      <Head title={STAY_TITLE.rooms} aside={<span className="ez:text-site-lead ez:text-muted ez:tabular-nums">{rooms.length}</span>} href={ROOMS_HREF} />
      <div className={shelfRow}>
        {rooms.map((room, i) => (
          <div key={room.id} className={cn(rooms.length < 4 ? shelfFew[rooms.length < 3 ? 2 : 3] : shelfItem, lastOdd(i, rooms.length, rooms.length < 4 ? 3 : 4))}>
            <RoomCard room={room} wide={rooms.length < 4} />
          </div>
        ))}
      </div>
    </section>
  );
}

const addOnRow = "ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-4 ez:rounded-md ez:bg-surface ez:px-5 ez:py-4";

function AddOnText({ a }: { a: AddOnView }) {
  return (
    <>
      <span className="ez:grid ez:min-w-0 ez:gap-0.5">
        <span data-script={scriptOf(a.name)} className="ez:text-site-lead ez:font-normal ez:text-fg">{a.name}</span>
        <span className="ez:text-site-small ez:text-muted">{`${a.unit} · ${a.pay}`}</span>
      </span>
      <span className="ez:text-site-lead ez:text-fg ez:tabular-nums"><Won value={a.price} /></span>
    </>
  );
}

export function AddOns({ data }: SectionProps<"add_ons">) {
  const items = (data.items ?? []).map(addOnView);
  const empty = !items.length;
  return (
    <section data-slot="add-ons" id="add-ons" data-blank={empty ? "" : undefined} className="ez:grid ez:grid-cols-1 ez:gap-3 ez:text-fg ez:md:grid-cols-2 ez:md:gap-4">
      <Photo src={empty ? null : data.image} alt="" sizes="(max-width: 768px) 100vw, 640px" tone={1} className="ez:aspect-[4/3] ez:h-full ez:rounded-lg ez:md:aspect-auto ez:md:min-h-120" />
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:rounded-lg ez:bg-surface-alt ez:p-5 ez:md:p-9">
        <h2 className={cn(sectionTitle, "ez:px-1")}>{STAY_TITLE.addOns}</h2>
        <ul className="ez:m-0 ez:mt-6 ez:grid ez:list-none ez:gap-2 ez:p-0">
          {empty
            ? [0, 1, 2].map((i) => (
                <li key={i} className={addOnRow}>
                  <span className="ez:grid ez:gap-2 ez:text-site-lead">
                    <Bar />
                    <span className="ez:text-site-small">
                      <Bar size="short" />
                    </span>
                  </span>
                  <BlankPrice className="ez:text-site-lead ez:font-normal ez:text-muted" />
                </li>
              ))
            : items.map((a, i) => (
                <li key={`${a.name}-${i}`} className={addOnRow}>
                  <AddOnText a={a} />
                </li>
              ))}
        </ul>
        <div className="ez:mt-auto ez:px-1 ez:pt-8">
          {empty ? (
            <span className="ez:text-site-lead">
              <Bar size="short" />
            </span>
          ) : (
            <NextLink href={ROOMS_HREF} className={moreLink}>
              {STAY_TITLE.view}
              <Icon name="right" size="sm" />
            </NextLink>
          )}
        </div>
      </div>
    </section>
  );
}

function galleryLayout(n: number): { grid: string; cells: string[] } {
  const lead = "ez:col-span-2 ez:aspect-[4/3] ez:md:aspect-[16/9] ez:lg:col-span-1 ez:lg:row-span-2 ez:lg:aspect-auto";
  const small = "ez:aspect-square ez:lg:aspect-auto";
  if (n >= 5) return { grid: "ez:lg:grid-cols-[2fr_1fr_1fr] ez:lg:grid-rows-2", cells: [lead, small, small, small, small] };
  if (n === 4) return { grid: "ez:lg:grid-cols-[2fr_1fr_1fr] ez:lg:grid-rows-2", cells: [lead, small, small, "ez:col-span-2 ez:aspect-[2/1] ez:lg:aspect-auto"] };
  if (n === 3) return { grid: "ez:lg:grid-cols-[2fr_1fr] ez:lg:grid-rows-2", cells: [lead, small, small] };
  if (n === 2) return { grid: "ez:lg:grid-rows-1", cells: [small, small] };
  return { grid: "ez:grid-cols-1 ez:lg:grid-rows-1", cells: ["ez:aspect-[16/9] ez:lg:aspect-auto"] };
}

export function Gallery({ data }: SectionProps<"gallery">) {
  const images = (data.images ?? []).slice(0, 5);
  const empty = !images.length;
  const slots: (string | null)[] = empty ? [null, null, null, null, null] : images;
  const layout = galleryLayout(slots.length);
  return (
    <section data-slot="gallery" id="gallery" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-7 ez:text-fg">
      <Head title={STAY_TITLE.gallery} />
      <div className={cn("ez:grid ez:grid-cols-2 ez:gap-3 ez:md:gap-4 ez:lg:h-124", layout.grid)}>
        {slots.map((src, i) => (
          <div key={src ?? i} className={cn("ez:relative ez:min-h-0", layout.cells[i])}>
            <Photo
              src={src}
              alt=""
              sizes={i === 0 ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 1024px) 50vw, 320px"}
              tone={i}
              className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-lg"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

const infoTile = "ez:min-w-0 ez:rounded-md ez:bg-surface-alt ez:p-6 ez:md:p-7";

const cancelRow = "ez:grid ez:min-h-11 ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-4 ez:rounded-sm ez:bg-surface ez:px-5 ez:py-2.5 ez:text-site-lead";

type CancelRow = { label: ReactNode; value?: ReactNode };

function CancelRows({ rows }: { rows: CancelRow[] }) {
  return (
    <dl className="ez:m-0 ez:grid ez:gap-1.5">
      {rows.map((r, i) => (
        <div key={i} className={cancelRow}>
          <dt className="ez:min-w-0 ez:text-muted">{r.label}</dt>
          <dd className="ez:m-0 ez:text-fg ez:tabular-nums">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TimeTile({ label, value, className }: { label: string; value?: string | null; className?: string }) {
  return (
    <div className={cn(infoTile, "ez:flex ez:min-h-35.5 ez:flex-col ez:justify-between ez:gap-6", className)}>
      <span className="ez:text-site-lead ez:text-muted">{label}</span>
      {value ? (
        <span className="ez:text-site-figure-lg ez:leading-none ez:font-normal ez:text-fg ez:tabular-nums">{value}</span>
      ) : (
        <span className="ez:text-site-item">
          <Bar size="short" />
        </span>
      )}
    </div>
  );
}

export function Info({ data }: SectionProps<"house_rules">) {
  const rules = data.rules ?? [];
  const rows = data.cancel?.rows ?? [];
  const groups = (data.cancel?.groups ?? []).filter((g) => g.rows.length);
  const hasCancel = rows.length > 0 || groups.length > 0;
  const blank = !data.check_in && !rules.length && !hasCancel;
  return (
    <section data-slot="house-rules" id="rules" data-blank={blank ? "" : undefined} className="ez:grid ez:gap-7 ez:text-fg">
      <Head title={STAY_TITLE.info} />
      <div className="ez:grid ez:grid-cols-2 ez:gap-3 ez:md:gap-4 ez:lg:grid-cols-[19fr_19fr_40fr] ez:lg:grid-rows-[auto_auto]">
        <TimeTile label={STAY_TITLE.checkIn} value={data.check_in} className="ez:lg:col-start-1 ez:lg:row-start-1" />
        <TimeTile label={STAY_TITLE.checkOut} value={data.check_out} className="ez:lg:col-start-1 ez:lg:row-start-2" />
        <div className={cn(infoTile, "ez:col-span-2 ez:lg:col-span-1 ez:lg:col-start-2 ez:lg:row-span-2 ez:lg:row-start-1")}>
          <h3 className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{STAY_TITLE.rules}</h3>
          <ul className="ez:m-0 ez:mt-5 ez:grid ez:list-none ez:gap-3.5 ez:p-0 ez:text-site-lead ez:text-muted">
            {rules.length ? (
              rules.map((r, i) => <li key={`${r}-${i}`}>{r}</li>)
            ) : (
              <li>
                <Bar />
              </li>
            )}
          </ul>
        </div>
        <div className={cn(infoTile, "ez:col-span-2 ez:lg:col-span-1 ez:lg:col-start-3 ez:lg:row-span-2 ez:lg:row-start-1")}>
          <h3 className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{STAY_TITLE.cancel}</h3>
          <div className="ez:mt-5 ez:grid ez:gap-4">
            {rows.length > 0 && <CancelRows rows={rows} />}
            {groups.map((g, i) => (
              <div key={`${g.title}-${i}`} className="ez:grid ez:gap-2">
                <span data-script={scriptOf(g.title)} className="ez:px-1 ez:text-site-small ez:text-muted">{g.title}</span>
                <CancelRows rows={g.rows} />
              </div>
            ))}
            {!hasCancel && (
              <div className={cancelRow}>
                <Bar />
                <Bar size="short" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const placeTile = "ez:flex ez:min-h-54 ez:items-center ez:justify-center ez:rounded-lg ez:bg-surface-alt ez:text-muted";

export function Location({ data }: SectionProps<"location">) {
  const address = data.address?.trim() || null;
  const blank = !address;
  const pin = <Icon name="pin" className="ez:size-8" />;
  return (
    <section data-slot="location" id="location" data-blank={blank ? "" : undefined} className="ez:grid ez:gap-7 ez:text-fg">
      <Head title={STAY_TITLE.location} />
      <div className="ez:grid ez:grid-cols-1 ez:gap-3 ez:md:grid-cols-2 ez:md:gap-4 ez:lg:grid-cols-[17fr_8fr]">
        {!blank && data.href ? (
          <a href={data.href} target="_blank" rel="noopener" aria-label={MAP_LABEL} className={cn(placeTile, "ez:relative ez:overflow-hidden ez:text-fg", focusRing)}>
            <SampleMap />
            <span className="ez:relative">{pin}</span>
          </a>
        ) : (
          <div className={placeTile}>{pin}</div>
        )}
        <dl className="ez:m-0 ez:flex ez:min-h-54 ez:min-w-0 ez:flex-col ez:justify-between ez:gap-7 ez:rounded-lg ez:bg-surface-alt ez:px-7 ez:py-7 ez:md:px-8">
          <div className="ez:grid ez:gap-2">
            <dt className="ez:text-site-small ez:text-muted">{STAY_TITLE.address}</dt>
            <dd data-script={scriptOf(address)} className="ez:m-0 ez:text-site-item ez:leading-normal ez:break-keep ez:text-fg">{address ?? <Bar size="long" />}</dd>
          </div>
          <div className="ez:grid ez:gap-2">
            <dt className="ez:text-site-small ez:text-muted">{STAY_TITLE.center}</dt>
            <dd className="ez:m-0 ez:text-site-heading ez:text-fg ez:tabular-nums">
              {data.phone && !blank ? (
                <a href={`tel:${data.phone}`} className={cn("ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing)}>
                  {data.phone}
                </a>
              ) : (
                <span className="ez:text-site-item">
                  <Bar />
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

const reviewGrid = "ez:grid ez:grid-cols-1 ez:gap-3 ez:md:grid-cols-3 ez:md:gap-4";

const reviewCard = "ez:flex ez:min-h-58 ez:min-w-0 ez:flex-col ez:rounded-md ez:bg-surface-alt ez:p-6 ez:md:p-7";

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  if (!items.length) {
    return (
      <section data-slot="reviews" id="reviews" data-blank="" className="ez:grid ez:gap-7 ez:text-fg">
        <Head title={STAY_TITLE.reviews} />
        <div className={reviewGrid}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={reviewCard}>
              <BlankStars />
              <Lines className="ez:mt-5 ez:text-site-lead" />
              <span className="ez:mt-auto ez:pt-5 ez:text-site-lead">
                <Bar size="short" />
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }
  const count = data.count ?? items.length;
  const aside =
    data.average != null ? (
      <span className="ez:inline-flex ez:items-baseline ez:gap-2">
        <Icon name="star" size="sm" className="ez:self-center ez:fill-current ez:text-muted" />
        <span className="ez:text-site-item ez:text-fg ez:tabular-nums">{data.average.toFixed(1)}</span>
        <span className="ez:text-site-lead ez:text-muted ez:tabular-nums">{count}</span>
      </span>
    ) : (
      <span className="ez:text-site-lead ez:text-muted ez:tabular-nums">{count}</span>
    );
  return (
    <section data-slot="reviews" id="reviews" className="ez:grid ez:gap-7 ez:text-fg">
      <Head title={STAY_TITLE.reviews} aside={aside} />
      <div className={reviewGrid}>
        {items.map((item, i) => {
          const room = item.product ? context.products.find((p) => p.id === item.product)?.name : null;
          return (
            <article key={`${item.name}-${i}`} className={reviewCard}>
              <StarRow rating={item.rating} className="ez:text-muted" />
              <p data-script={scriptOf(item.body)} className="ez:m-0 ez:mt-4 ez:line-clamp-5 ez:text-site-lead ez:leading-relaxed ez:text-muted">{item.body}</p>
              <div className="ez:mt-auto ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:pt-5">
                <span data-script={scriptOf(room ?? item.name)} className="ez:truncate ez:text-site-lead ez:font-normal ez:text-fg">{room ?? item.name}</span>
                {item.date && <span className="ez:shrink-0 ez:text-site-small ez:text-muted ez:tabular-nums">{item.date}</span>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Crumbs({ items }: { items: StayListProps["crumbs"] }) {
  return (
    <nav aria-label="현재 위치" className="ez:flex ez:flex-wrap ez:items-center ez:gap-1.5 ez:text-site-small ez:text-muted">
      {items.map((c, i) => (
        <span key={c.href} className="ez:flex ez:items-center ez:gap-1.5">
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

function ListCard({ room, eager }: { room: Room; eager?: boolean }) {
  const r = roomView(room);
  const q = r.quote;
  const full = q?.state === "full";
  const notes = [...(r.sample ? [STAY_TITLE.sample] : []), ...roomNotes(r)].join(" · ");
  const times = room.check_in && room.check_out ? `${STAY_TITLE.checkIn} ${room.check_in} · ${STAY_TITLE.checkOut} ${room.check_out}` : null;
  return (
    <article data-slot="room-card" data-state={q?.state} data-sample={r.sample ? "" : undefined} className="ez:flex ez:min-w-0 ez:flex-col ez:text-fg">
      <NextLink href={r.href} tabIndex={-1} aria-hidden="true" className="ez:block ez:rounded-md ez:bg-surface-alt ez:p-3 ez:md:p-4.5">
        <Photo src={r.image} alt="" preload={eager} sizes="(max-width: 768px) 100vw, 640px" className={cn("ez:aspect-[3/2] ez:rounded-sm ez:bg-surface", full && "ez:opacity-45")} />
      </NextLink>
      <div className="ez:flex ez:flex-col ez:gap-3 ez:px-1 ez:pt-4 ez:sm:flex-row ez:sm:items-start ez:sm:justify-between ez:sm:gap-6">
        <div className="ez:grid ez:min-w-0 ez:gap-0.5">
          <NextLink
            data-script={scriptOf(r.name)}
            href={r.href}
            className={cn("ez:truncate ez:text-site-item ez:font-normal ez:no-underline ez:hover:underline ez:underline-offset-4", full ? "ez:text-muted" : "ez:text-fg", focusRing)}
          >
            {r.name}
          </NextLink>
          {r.guests && <span className="ez:mt-0.5 ez:text-site-lead ez:text-muted">{r.guests}</span>}
          {times && <span className="ez:text-site-small ez:text-muted ez:tabular-nums">{times}</span>}
        </div>
        <div className="ez:flex ez:shrink-0 ez:items-center ez:justify-between ez:gap-5">
          <div className="ez:grid ez:gap-0.5 ez:sm:text-right">
            {q ? (
              <span className={cn("ez:text-site-item ez:tabular-nums", full ? "ez:text-muted" : "ez:text-fg")}>
                <span className="ez:mr-1.5 ez:text-site-small ez:text-muted">{q.nights}</span>
                <Won value={q.price} />
              </span>
            ) : (
              <span className="ez:text-site-item ez:text-fg ez:tabular-nums"><Won value={r.from} /></span>
            )}
            {notes && <span data-script={scriptOf(notes)} className="ez:text-site-small ez:text-muted">{notes}</span>}
          </div>
          {r.book && (
            <NextLink href={r.book} className={cn(pill, "ez:bg-surface-alt")}>
              {STAY_TITLE.book}
            </NextLink>
          )}
        </div>
      </div>
    </article>
  );
}

function AddOnTile({ items, photo }: { items: AddOnView[]; photo?: string | null }) {
  return (
    <section data-slot="stay-add-ons" className="ez:grid ez:gap-3 ez:text-fg ez:md:col-span-2 ez:lg:relative ez:lg:flex ez:lg:min-h-120 ez:lg:items-end ez:lg:p-6">
      <Photo src={photo} alt="" sizes="(max-width: 1024px) 100vw, 1280px" tone={2} className="ez:aspect-[16/9] ez:rounded-md ez:lg:absolute ez:lg:inset-0 ez:lg:aspect-auto ez:lg:h-full" />
      <div className="ez:relative ez:grid ez:gap-4.5 ez:rounded-md ez:bg-surface-alt ez:p-6 ez:md:p-7 ez:lg:w-110 ez:lg:bg-surface">
        <h2 className="ez:m-0 ez:text-site-heading ez:text-fg">{STAY_TITLE.addOns}</h2>
        <ul className="ez:m-0 ez:grid ez:list-none ez:gap-1.5 ez:p-0">
          {items.map((a, i) => (
            <li key={`${a.name}-${i}`} className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-4 ez:rounded-sm ez:bg-surface ez:px-4.5 ez:py-3 ez:lg:bg-surface-alt">
              <AddOnText a={a} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const rateHead = "ez:h-12 ez:w-auto ez:px-6 ez:text-left ez:text-site-small ez:font-normal ez:whitespace-nowrap ez:text-muted";

const rateCell = "ez:h-14 ez:w-auto ez:bg-surface ez:px-6 ez:py-0 ez:text-left ez:text-site-lead ez:font-normal ez:whitespace-nowrap ez:text-fg ez:tabular-nums ez:first:rounded-l-sm ez:last:rounded-r-sm";

function Rates({ rooms, peak }: { rooms: Room[]; peak: boolean }) {
  const views = rooms.map(roomView);
  const heads = [STAY_TITLE.weekday, STAY_TITLE.weekend, ...(peak ? [STAY_TITLE.peak, STAY_TITLE.peakWeekend] : []), STAY_TITLE.extra];
  return (
    <section id="rates" className="ez:mt-24 ez:grid ez:gap-7 ez:text-fg">
      <h2 className={sectionTitle}>{STAY_TITLE.rates}</h2>
      <div className="ez:overflow-x-auto ez:rounded-lg ez:bg-surface-alt ez:px-3 ez:pb-1.5">
        <table className="ez:w-full ez:min-w-180 ez:border-separate ez:border-spacing-x-0 ez:border-spacing-y-1.5">
          <thead>
            <tr>
              <th scope="col" className={rateHead}>
                {STAY_TITLE.rooms}
              </th>
              {heads.map((h) => (
                <th key={h} scope="col" className={rateHead}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {views.map((r) => (
              <tr key={r.id}>
                <th data-script={scriptOf(r.name)} scope="row" className={rateCell}>
                  {r.name}
                </th>
                <td className={rateCell}>{r.rates?.weekday ?? "–"}</td>
                <td className={rateCell}>{r.rates?.weekend ?? "–"}</td>
                {peak && <td className={rateCell}>{r.rates?.peak ?? "–"}</td>}
                {peak && <td className={rateCell}>{r.rates?.peakWeekend ?? "–"}</td>}
                <td data-script={scriptOf(r.extra ?? "–")} className={cn(rateCell, "ez:text-muted")}>{r.extra ?? "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function List({ title, count, crumbs, search, rooms, peak, addOns, photo }: StayListProps) {
  const extras = addOns.map(addOnView);
  return (
    <div data-slot="stay-rooms" className="ez:grid ez:grid-cols-1 ez:text-fg">
      <Crumbs items={crumbs} />
      <div className="ez:mt-4 ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1">
        <h1 data-script={scriptOf(title)} className="ez:m-0 ez:text-site-page-sm ez:text-fg ez:md:text-site-figure-lg">{title}</h1>
        {count ? <span className="ez:text-site-item ez:font-normal ez:text-muted ez:tabular-nums">{count}</span> : null}
      </div>
      <StayForm
        initial={search}
        max={search.max}
        className="ez:mt-7 ez:grid ez:grid-cols-2 ez:items-center ez:gap-2 ez:rounded-md ez:bg-surface-alt ez:p-3 ez:lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
      >
        <DateField which="check_in" className="ez:md:px-5" />
        <DateField which="check_out" nights className="ez:md:px-5" />
        <GuestField className="ez:col-span-2 ez:md:px-5 ez:lg:col-span-1" />
        <Button type="submit" className={cn(heroGo, "ez:col-span-2 ez:lg:col-span-1 ez:lg:mr-2 ez:lg:ml-3")}>
          {STAY_TITLE.change}
        </Button>
      </StayForm>
      <div className="ez:mt-8 ez:grid ez:grid-cols-1 ez:gap-x-4 ez:gap-y-10 ez:md:grid-cols-2">
        {rooms.map((room, i) => (
          <ListCard key={room.id} room={room} eager={i < 2} />
        ))}
        {extras.length > 0 && <AddOnTile items={extras} photo={photo} />}
      </div>
      <Rates rooms={rooms} peak={peak} />
    </div>
  );
}
