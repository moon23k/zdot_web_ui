import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { EmptyState } from "../../components/empty-state";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { STAR_PATH } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, BlankPrice, BlankStars, Lines } from "../kit";
import { MAP_LABEL, SampleMap } from "../stay/map";
import { fillCols, lastOdd } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import type { ClassCard, Session } from "../template/data";
import { BlankRow, DayBoard, SessionGroups } from "./d-days";
import { ClassNavLinks } from "./nav";
import { CLASS_TITLE, CLASSES_HREF, mapHref, SCHEDULE_HREF, sessionView } from "./shared";
import type { ClassFooterProps, ClassHeaderProps, ClassListProps, SessionView } from "./types";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const CARD_SIZES = "(max-width: 1024px) 50vw, 440px";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:box-border ez:px-page";

const sectionTitle = "ez:m-0 ez:text-site-section ez:text-fg ez:lg:text-site-display-md";

const button = "ez:inline-flex ez:shrink-0 ez:items-center ez:justify-center ez:gap-2 ez:rounded-full ez:text-site-body ez:font-medium ez:whitespace-nowrap ez:no-underline";

const primaryButton = cn("ez:fx-press ez:h-12 ez:bg-primary ez:px-7 ez:text-on-primary ez:lg:h-13", button, focusRing);

const glassButton = cn("ez:fx-glass ez:h-12 ez:px-7 ez:text-fg ez:lg:h-13", button, focusRing);

const whiteButton = cn("ez:h-12 ez:bg-surface-alt ez:px-7 ez:text-fg ez:lg:h-13", button, focusRing);

const headerButton = cn("ez:fx-press ez:h-11 ez:bg-primary ez:px-5 ez:text-on-primary ez:max-lg:hidden", button, focusRing);

const moreLink = cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1.5 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const textLink = cn("ez:inline-flex ez:h-10 ez:items-center ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const iconLink = cn("ez:relative ez:inline-flex ez:size-10 ez:items-center ez:justify-center ez:text-fg ez:no-underline ez:lg:hidden", focusRing);

const hair = "ez:border-0 ez:border-solid ez:border-hairline";

const field = "ez:fx-aurora-wash ez:fx-round-xl ez:p-3 ez:md:p-6 ez:lg:p-10";

function when(v: SessionView): string {
  return v.day && !v.date.includes(v.day) ? `${v.date} ${v.day}` : v.date;
}

function Head({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="ez:mb-6 ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-x-6 ez:gap-y-3 ez:lg:mb-9">
      <h2 data-script={scriptOf(title)} className={sectionTitle}>{title}</h2>
      {aside}
    </div>
  );
}

function More({ href, label = CLASS_TITLE.more }: { href: string; label?: string }) {
  return (
    <NextLink href={href} className={moreLink}>
      {label}
      <Icon name="right" size="sm" />
    </NextLink>
  );
}

export function Header({ name, logoUrl, nav, links }: ClassHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="aurora" className="ez:relative ez:z-10 ez:bg-transparent ez:pt-3 ez:lg:pt-6">
      <div className={wrap}>
        <div className="ez:fx-glass ez:grid ez:h-14 ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-6 ez:rounded-full ez:pr-2 ez:pl-5 ez:lg:h-17 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] ez:lg:gap-9 ez:lg:pr-3 ez:lg:pl-8">
          <NextLink data-script={scriptOf(name)} href="/" className={cn("ez:min-w-0 ez:justify-self-start ez:text-site-item ez:font-normal ez:text-fg ez:no-underline", focusRing)}>
            <SiteLogo name={name} src={logoUrl} />
          </NextLink>
          <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:justify-center ez:gap-9 ez:overflow-hidden ez:whitespace-nowrap ez:max-lg:hidden">
            <ClassNavLinks
              items={[nav.classes, ...nav.anchors]}
              className={cn("ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}
              currentClassName="ez:font-medium ez:text-fg"
            />
          </nav>
          <div className="ez:flex ez:items-center ez:justify-self-end ez:gap-0.5 ez:lg:gap-6">
            <span className="ez:flex ez:items-center ez:gap-6 ez:whitespace-nowrap ez:max-lg:hidden">
              <NextLink href={links.orders.href} className={textLink}>
                {links.orders.label}
              </NextLink>
              <NextLink href={links.account.href} className={textLink}>
                {links.account.label}
              </NextLink>
            </span>
            <NextLink href={links.search} aria-label={CLASS_TITLE.search} className={iconLink}>
              <Icon name="search" />
            </NextLink>
            <NextLink href={links.orders.href} aria-label={links.orders.label} className={iconLink}>
              <Icon name="calendar" />
            </NextLink>
            <NextLink href={links.account.href} aria-label={links.account.label} className={iconLink}>
              <Icon name="user" />
            </NextLink>
            <NextLink href={SCHEDULE_HREF} className={headerButton}>
              {CLASS_TITLE.book}
            </NextLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:grid ez:content-start ez:gap-3.5">
      <span data-script={scriptOf(title)} className="ez:text-site-note ez:text-fg">{title}</span>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-1.5 ez:p-0 ez:text-site-note">
        {items.map((l) => (
          <li key={l.href}>
            <NextLink href={l.href} className={cn("ez:no-underline ez:hover:text-fg", l.strong ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}>
              {l.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer({ storeName, phone, hours, legal, classes, guide, account, terms }: ClassFooterProps) {
  return (
    <footer data-slot="site-footer" data-variant="aurora" className="ez:text-fg">
      <div className={cn(wrap, "ez:pt-16 ez:pb-12 ez:lg:pt-18 ez:lg:pb-16")}>
        <div className="ez:grid ez:grid-cols-2 ez:gap-x-6 ez:gap-y-10 ez:md:grid-cols-4 ez:lg:grid-cols-[6fr_3fr_3fr_3fr_3fr]">
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-3 ez:md:col-span-4 ez:lg:col-span-1">
            <p data-script={scriptOf(storeName)} className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{storeName}</p>
            {(phone || hours) && (
              <div className="ez:grid ez:gap-0.5 ez:text-site-note ez:text-muted">
                <span>{CLASS_TITLE.center}</span>
                {phone && (
                  <a href={`tel:${phone}`} className={cn("ez:justify-self-start ez:text-fg ez:tabular-nums ez:no-underline ez:hover:underline", focusRing)}>
                    {phone}
                  </a>
                )}
                {hours && <span>{hours}</span>}
              </div>
            )}
          </div>
          <FooterColumn title={CLASS_TITLE.classes} items={classes} />
          <FooterColumn title="안내" items={guide} />
          <FooterColumn title="계정" items={account} />
          {terms.length > 0 && <FooterColumn title="약관" items={terms} />}
        </div>
        <div className="ez:mt-12 ez:flex ez:flex-col ez:gap-3 ez:text-site-small ez:leading-relaxed ez:text-muted ez:md:flex-row ez:md:justify-between ez:md:gap-10 ez:lg:mt-14">
          <p className="ez:m-0">{legal}</p>
          <p className="ez:m-0 ez:shrink-0">© {storeName}</p>
        </div>
      </div>
    </footer>
  );
}

const floatBox = "ez:relative ez:mx-4 ez:-mt-14 ez:block ez:fx-round-md ez:px-6 ez:pt-5.5 ez:pb-3 ez:text-fg ez:no-underline ez:lg:absolute ez:lg:bottom-12 ez:lg:-left-18 ez:lg:mx-0 ez:lg:mt-0 ez:lg:w-75";

const floatRow = cn(hair, "ez:flex ez:items-baseline ez:justify-between ez:gap-4 ez:border-t ez:py-2.5");

function NextFloat({ session }: { session: Session }) {
  const v = sessionView(session);
  return (
    <NextLink href={v.href} data-slot="hero-session" className={cn("ez:fx-glass ez:group", floatBox, focusRing)}>
      <span className="ez:block ez:text-site-note ez:text-muted">{CLASS_TITLE.next}</span>
      <span data-script={scriptOf(v.name)} className="ez:mt-1 ez:mb-3.5 ez:block ez:truncate ez:text-site-heading ez:underline-offset-4 ez:group-hover:underline">{v.name}</span>
      <dl className="ez:m-0 ez:text-site-note">
        <div className={floatRow}>
          <dt className="ez:text-muted ez:tabular-nums">{when(v)}</dt>
          <dd className="ez:m-0 ez:tabular-nums">{v.time}</dd>
        </div>
        {(v.seats || v.price) && (
          <div className={floatRow}>
            <dt className="ez:text-muted ez:tabular-nums">{v.seats}</dt>
            <dd className="ez:m-0 ez:tabular-nums"><Won value={v.price} /></dd>
          </div>
        )}
      </dl>
    </NextLink>
  );
}

function BlankFloat() {
  return (
    <div className={cn("ez:fx-glass", floatBox)}>
      <span className="ez:block ez:text-site-note ez:text-muted">{CLASS_TITLE.next}</span>
      <span className="ez:mt-1 ez:mb-3.5 ez:block ez:text-site-heading">
        <Bar />
      </span>
      <div className={cn(floatRow, "ez:text-site-note")}>
        <Bar size="short" />
      </div>
      <div className={cn(floatRow, "ez:text-site-note")}>
        <Bar size="short" />
      </div>
    </div>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const sub = title ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const blank = !title && !image;
  const session = blank ? null : ((data.sessions ?? []).find((s) => s.status !== "full") ?? null);
  const banner = title && data.href && data.href !== CLASSES_HREF ? data.href : null;
  const photo = (
    <div className="ez:fx-round-xl ez:overflow-hidden">
      <Photo src={image} alt={title ?? ""} preload sizes="(max-width: 1024px) 100vw, 660px" tone={0} className="ez:aspect-[4/3] ez:rounded-none ez:lg:aspect-auto ez:lg:h-185" />
    </div>
  );
  return (
    <section
      data-slot="hero"
      data-variant="aurora"
      data-blank={blank ? "" : undefined}
      className="ez:relative ez:isolate ez:grid ez:grid-cols-1 ez:items-center ez:gap-10 ez:pt-4 ez:text-fg ez:lg:grid-cols-2 ez:lg:gap-6 ez:lg:pt-10"
    >
      <span aria-hidden="true" className="ez:fx-aurora ez:absolute ez:-top-40 ez:-bottom-40 ez:left-1/2 ez:-z-10 ez:w-screen ez:-translate-x-1/2" />
      <div className="ez:grid ez:min-w-0 ez:justify-items-start">
        {context.storeName ? (
          <p data-script={scriptOf(context.storeName)} className="ez:fx-title ez:m-0 ez:break-keep ez:text-fg">{context.storeName}</p>
        ) : (
          <span className="ez:fx-title ez:w-3/5">
            <Bar size="full" strong block />
          </span>
        )}
        {title ? (
          <div className="ez:mt-5 ez:grid ez:max-w-118 ez:gap-2 ez:lg:mt-6">
            <h1 data-script={scriptOf(title)} className="ez:m-0 ez:text-site-item ez:font-normal ez:text-balance ez:text-fg">{title}</h1>
            {sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:text-site-body ez:leading-relaxed ez:text-muted">
                {sub}
              </p>
            )}
          </div>
        ) : (
          blank && (
            <span className="ez:mt-6 ez:w-full ez:max-w-118">
              <Lines />
            </span>
          )
        )}
        <div className="ez:mt-8 ez:flex ez:flex-wrap ez:gap-3 ez:lg:mt-10">
          {blank ? (
            <span className="ez:text-site-body">
              <Bar size="short" />
            </span>
          ) : (
            <>
              <NextLink href={CLASSES_HREF} className={primaryButton}>
                {CLASS_TITLE.view}
              </NextLink>
              <NextLink href={SCHEDULE_HREF} className={glassButton}>
                {CLASS_TITLE.scheduleShort}
              </NextLink>
            </>
          )}
        </div>
      </div>
      <div className="ez:relative ez:min-w-0">
        {banner ? (
          <NextLink href={banner} className={cn("ez:block", focusRing)}>
            {photo}
          </NextLink>
        ) : (
          photo
        )}
        {blank ? <BlankFloat /> : session && <NextFloat session={session} />}
      </div>
    </section>
  );
}

const glassBoard = "ez:fx-glass ez:fx-round-md ez:px-3 ez:pt-3 ez:pb-2 ez:md:px-7 ez:md:pt-7 ez:md:pb-4";

export function Schedule({ data }: SectionProps<"class_schedule">) {
  const sessions = data.sessions ?? [];
  const empty = !sessions.length;
  return (
    <section data-slot="class-schedule" id="schedule" data-variant="aurora" data-blank={empty ? "" : undefined} className="ez:text-fg">
      <Head title={CLASS_TITLE.scheduleShort} aside={empty ? undefined : <More href={SCHEDULE_HREF} label={CLASS_TITLE.scheduleAll} />} />
      <div className={field}>
        {empty ? (
          <div className={glassBoard}>
            <ul className="ez:m-0 ez:list-none ez:p-0">
              {[0, 1, 2].map((i) => (
                <BlankRow key={i} />
              ))}
            </ul>
          </div>
        ) : (
          <DayBoard sessions={sessions} />
        )}
      </div>
    </section>
  );
}

function ClassTile({ item, eager }: { item: ClassCard; eager?: boolean }) {
  const spec = [item.kind, item.length && `${CLASS_TITLE.length} ${item.length}`, item.capacity != null && `${CLASS_TITLE.capacity} ${item.capacity}명`, item.sample && "예시"].filter(Boolean).join(" · ");
  const next = item.next ? (item.left === 0 ? `${item.next} · ${CLASS_TITLE.full}` : item.next) : null;
  return (
    <NextLink
      href={item.href ?? `/products/${item.id}`}
      data-slot="class-card"
      data-sample={item.sample ? "" : undefined}
      className={cn("ez:group ez:grid ez:min-w-0 ez:content-start ez:text-fg ez:no-underline", focusRing)}
    >
      <span className="ez:fx-round-lg ez:block ez:overflow-hidden">
        <Photo src={item.image} alt={item.name} preload={eager} sizes={CARD_SIZES} className="ez:aspect-[4/3] ez:rounded-none" />
      </span>
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-3 ez:gap-y-1 ez:px-1.5 ez:pt-4">
        <span data-script={scriptOf(item.name)} className="ez:truncate ez:text-site-item ez:font-normal ez:underline-offset-4 ez:group-hover:underline">{item.name}</span>
        {item.price ? <span className="ez:text-site-item ez:font-normal ez:whitespace-nowrap ez:tabular-nums"><Won value={item.price} /></span> : <span />}
        {(spec || next) && (
          <>
            <span data-script={scriptOf(spec)} className="ez:truncate ez:text-site-note ez:text-muted">{spec}</span>
            {next ? <span className="ez:justify-self-end ez:text-site-note ez:whitespace-nowrap ez:text-muted ez:tabular-nums">{next}</span> : <span />}
          </>
        )}
      </span>
    </NextLink>
  );
}

function BlankClassTile({ tone, className }: { tone: number; className?: string }) {
  return (
    <div className={cn("ez:grid ez:min-w-0 ez:content-start", className)}>
      <span className="ez:fx-round-lg ez:block ez:overflow-hidden">
        <Photo src={null} alt="" tone={tone} className="ez:aspect-[4/3] ez:rounded-none" />
      </span>
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-x-3 ez:gap-y-2 ez:px-1.5 ez:pt-4 ez:text-site-item">
        <Bar />
        <BlankPrice className="ez:text-muted" />
        <span className="ez:text-site-note">
          <Bar size="short" />
        </span>
      </span>
    </div>
  );
}

const classGrid = "ez:grid ez:grid-cols-2 ez:gap-x-3 ez:gap-y-8 ez:md:grid-cols-3 ez:md:gap-x-6 ez:md:gap-y-10";

export function Classes({ data }: SectionProps<"class_list">) {
  const items = (data.classes ?? []).slice(0, 3);
  return (
    <section data-slot="class-list" id="classes" data-variant="aurora" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={CLASS_TITLE.classes} aside={items.length ? <More href={CLASSES_HREF} /> : undefined} />
      <div className={classGrid}>
        {items.length
          ? items.map((c, i) => (
              <div key={c.id} className={cn("ez:grid ez:min-w-0", lastOdd(i, items.length, 3))}>
                <ClassTile item={c} />
              </div>
            ))
          : [0, 1, 2].map((i) => <BlankClassTile key={i} tone={i} className={lastOdd(i, 3, 3)} />)}
      </div>
    </section>
  );
}

const reviewCard = "ez:flex ez:min-h-60 ez:min-w-0 ez:flex-col ez:fx-round-lg ez:bg-surface-alt ez:px-6 ez:pt-7 ez:pb-6 ez:md:min-h-68 ez:md:px-8 ez:md:pt-8 ez:md:pb-7";

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  const summary =
    items.length && data.average != null && data.count ? (
      <span className="ez:text-site-body ez:text-muted ez:tabular-nums">
        {data.average.toFixed(1)} · {CLASS_TITLE.reviews} {data.count}
      </span>
    ) : undefined;
  return (
    <section data-slot="reviews" id="reviews" data-variant="aurora" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={CLASS_TITLE.reviews} aside={summary} />
      <div className={cn("ez:grid ez:grid-cols-1 ez:gap-3 ez:md:gap-6", fillCols(items.length || 3))}>
        {items.length
          ? items.map((r, i) => {
              const cls = r.product ? context.products.find((p) => p.id === r.product)?.name : null;
              return (
                <article key={`${r.name}-${r.date ?? ""}-${i}`} className={reviewCard}>
                  <span role="img" aria-label={`별점 ${r.rating}점`} className="ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-note ez:text-muted ez:tabular-nums">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="ez:size-3.5 ez:text-primary">
                      <path fill="currentColor" d={STAR_PATH} />
                    </svg>
                    {r.rating.toFixed(1)}
                  </span>
                  <p data-script={scriptOf(r.body)} className="ez:m-0 ez:mt-4.5 ez:line-clamp-4 ez:text-site-item ez:leading-relaxed ez:text-pretty ez:text-fg">{r.body}</p>
                  <span data-script={scriptOf([r.name, cls].filter(Boolean).join(" · "))} className="ez:mt-auto ez:truncate ez:pt-5.5 ez:text-site-small ez:text-site-off">{[r.name, cls].filter(Boolean).join(" · ")}</span>
                </article>
              );
            })
          : [0, 1, 2].map((i) => (
              <div key={i} className={reviewCard}>
                <BlankStars />
                <Lines className="ez:mt-5 ez:text-site-item" />
                <span className="ez:mt-auto ez:pt-5.5 ez:text-site-small">
                  <Bar size="short" />
                </span>
              </div>
            ))}
      </div>
    </section>
  );
}

const mapTile = "ez:relative ez:flex ez:min-h-60 ez:items-center ez:justify-center ez:overflow-hidden ez:fx-round-md ez:border ez:border-solid ez:border-glass-edge ez:bg-glass ez:text-muted ez:lg:min-h-95";

export function Location({ data }: SectionProps<"location">) {
  const address = data.address?.trim() || null;
  const blank = !address;
  const phone = blank ? null : data.phone?.trim() || null;
  const hours = blank ? null : data.hours?.trim() || null;
  const map = address ? data.href || mapHref(address) : null;
  const rows: [string, ReactNode][] = [
    [CLASS_TITLE.address, address],
    [CLASS_TITLE.hours, hours],
    [
      CLASS_TITLE.phone,
      phone && (
        <a href={`tel:${phone}`} className={cn("ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing)}>
          {phone}
        </a>
      ),
    ],
  ];
  return (
    <section data-slot="location" id="location" data-variant="aurora" data-blank={blank ? "" : undefined} className="ez:text-fg">
      <Head title={CLASS_TITLE.location} />
      <div className={cn(field, "ez:grid ez:grid-cols-1 ez:gap-3 ez:md:gap-4 ez:lg:grid-cols-[5fr_7fr]")}>
        <div className="ez:fx-glass ez:fx-round-md ez:flex ez:min-w-0 ez:flex-col ez:px-6 ez:pt-2 ez:pb-6 ez:md:px-8 ez:md:pt-3 ez:md:pb-8">
          <dl className="ez:m-0 ez:text-site-body">
            {rows.map(([label, value]) => (
              <div key={label} className={cn(hair, "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-b ez:py-4")}>
                <dt className="ez:shrink-0 ez:text-muted">{label}</dt>
                <dd className="ez:m-0 ez:min-w-0 ez:text-right ez:break-keep ez:tabular-nums ez:text-fg">{value || <Bar />}</dd>
              </div>
            ))}
          </dl>
          {map && (
            <div className="ez:mt-auto ez:flex ez:flex-wrap ez:gap-2.5 ez:pt-7">
              <a href={map} target="_blank" rel="noopener noreferrer" className={primaryButton}>
                {CLASS_TITLE.map}
              </a>
              {phone && (
                <a href={`tel:${phone}`} className={whiteButton}>
                  <Icon name="phone" size="sm" />
                  {CLASS_TITLE.phone}
                </a>
              )}
            </div>
          )}
        </div>
        {map ? (
          <a href={map} target="_blank" rel="noopener noreferrer" aria-label={MAP_LABEL} className={cn(mapTile, focusRing)}>
            <SampleMap />
            <span aria-hidden="true" className="ez:relative ez:size-4.5 ez:rounded-full ez:bg-primary ez:shadow-[0_0_0_8px_var(--ezd-glow-soft)]" />
          </a>
        ) : (
          <div className={mapTile}>
            <Icon name="pin" className="ez:size-8" />
          </div>
        )}
      </div>
    </section>
  );
}

function SortMenu({ sorts }: { sorts: ClassListProps["sorts"] }) {
  const current = sorts.find((s) => s.on) ?? sorts[0];
  if (!current) return null;
  return (
    <nav aria-label="정렬" className="ez:shrink-0">
      <details className="ez:group ez:relative">
        <summary className={cn("ez:flex ez:min-h-10 ez:cursor-pointer ez:list-none ez:items-center ez:gap-1.5 ez:text-site-body ez:text-fg ez:[&::-webkit-details-marker]:hidden", focusRing)}>
          {current.label}
          <Icon name="down" size="sm" className="ez:text-muted ez:transition-transform ez:group-open:rotate-180" />
        </summary>
        <ul className="ez:fx-lift ez:absolute ez:right-0 ez:z-10 ez:m-0 ez:mt-1 ez:grid ez:min-w-40 ez:list-none ez:rounded-lg ez:bg-surface-alt ez:p-2">
          {sorts.map((s) => (
            <li key={s.href}>
              <NextLink
                href={s.href}
                aria-current={s.on ? "true" : undefined}
                className={cn("ez:flex ez:min-h-10 ez:items-center ez:rounded-md ez:px-3 ez:text-site-body ez:no-underline ez:hover:bg-surface", s.on ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}
              >
                {s.label}
              </NextLink>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}

function Crumbs({ items }: { items: ClassListProps["crumbs"] }) {
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

export function List({ view, title, count, crumbs, tabs, sorts, classes, sessions, links, search, emptyHref }: ClassListProps) {
  const schedule = view === "schedule";
  const empty = schedule ? !sessions.length : !classes.length;
  return (
    <div data-slot="class-catalog" data-view={view} data-variant="aurora" className="ez:grid ez:grid-cols-1 ez:pt-6 ez:text-fg ez:lg:pt-10">
      <Crumbs items={crumbs} />
      <div className="ez:mt-4 ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1">
        <h1 data-script={scriptOf(title)} className={sectionTitle}>{title}</h1>
        {count ? <span className="ez:text-site-item ez:font-normal ez:text-muted ez:tabular-nums">{count}</span> : null}
      </div>
      {search && <div className="ez:mt-6">{search}</div>}
      <div className="ez:mt-8 ez:flex ez:items-center ez:justify-between ez:gap-6 ez:lg:mt-10">
        <nav aria-label="카테고리" className="ez:-mx-page ez:flex ez:min-w-0 ez:gap-6 ez:overflow-x-auto ez:px-page ez:whitespace-nowrap ez:md:mx-0 ez:md:gap-7 ez:md:px-0">
          {tabs.map((t) => (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={cn("ez:inline-flex ez:shrink-0 ez:items-baseline ez:gap-1.5 ez:py-2 ez:text-site-body ez:no-underline ez:hover:text-fg", t.on ? "ez:fx-tab ez:font-medium ez:text-fg" : "ez:text-site-off", focusRing)}
            >
              {t.label}
              {t.count != null && <span className="ez:text-site-small ez:font-normal ez:text-muted ez:tabular-nums">{t.count}</span>}
            </NextLink>
          ))}
        </nav>
        {!schedule && <SortMenu sorts={sorts} />}
      </div>
      <div className="ez:mt-8 ez:lg:mt-10">
        {empty ? (
          <EmptyState title={schedule ? "예정된 일정이 없어요" : "등록된 클래스가 없어요"} action={emptyHref ? { label: CLASS_TITLE.all, href: emptyHref } : undefined} />
        ) : schedule ? (
          <div className={field}>
            <div className={glassBoard}>
              <SessionGroups sessions={sessions} />
            </div>
          </div>
        ) : (
          <div className={cn(classGrid, "ez:lg:grid-cols-3")}>
            {classes.map((c, i) => (
              <ClassTile key={c.id} item={c} eager={i < 3} />
            ))}
          </div>
        )}
      </div>
      <div className="ez:mt-14 ez:flex ez:justify-center">
        <NextLink href={schedule ? links.classes : links.schedule} className={glassButton}>
          {schedule ? CLASS_TITLE.all : CLASS_TITLE.scheduleAll}
          <Icon name="right" size="sm" />
        </NextLink>
      </div>
    </div>
  );
}
