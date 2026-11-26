import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { buttonVariants, ButtonLink } from "../../components/button";
import { EmptyState } from "../../components/empty-state";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { STAR_PATH } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, BlankPrice, BlankStars, Lines } from "../kit";
import { fillCols } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import { MAP_LABEL, SampleMap } from "../stay/map";
import type { ClassCard, Session } from "../template/data";
import { DayStrip, SessionGroups } from "./e-days";
import { ClassNavLinks } from "./nav";
import { bookable, CLASS_TITLE, CLASSES_HREF, mapHref, SCHEDULE_HREF, sessionView } from "./shared";
import type { ClassFooterProps, ClassHeaderProps, ClassListProps } from "./types";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const bleed = "ez:mx-[calc(50%-50vw)]";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:box-border ez:px-page";

const frame = "ez:overflow-hidden ez:rounded-lg ez:border ez:border-solid";

const panel = "ez:fx-round-md ez:overflow-hidden ez:border ez:border-solid";

const pill = "ez:rounded-full";

const title = "ez:m-0 ez:text-site-section ez:text-fg ez:lg:text-site-page";

const more = cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1.5 ez:text-site-small ez:text-site-off ez:no-underline ez:hover:text-fg", focusRing);

const lineButton = "ez:rounded-full ez:border-site-line ez:font-normal";

const topLink = cn("ez:relative ez:inline-flex ez:h-10 ez:min-w-10 ez:items-center ez:justify-center ez:gap-1.5 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg ez:lg:min-w-0", focusRing);

const price = "ez:text-site-body ez:whitespace-nowrap ez:text-fg";

function Head({ text, aside }: { text: string; aside?: ReactNode }) {
  return (
    <div className="ez:mb-7 ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-x-8 ez:gap-y-3">
      <h2 data-script={scriptOf(text)} className={title}>{text}</h2>
      {aside}
    </div>
  );
}

function More({ href, label = CLASS_TITLE.more }: { href: string; label?: string }) {
  return (
    <NextLink href={href} className={more}>
      {label}
      <Icon name="right" size="sm" />
    </NextLink>
  );
}

export function Header({ name, logoUrl, nav, links }: ClassHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="float" className="ez:bg-surface ez:text-fg">
      <div className={cn(wrap, "ez:flex ez:h-16 ez:items-center ez:gap-6 ez:lg:h-22 ez:lg:gap-0")}>
        <NextLink data-script={scriptOf(name)} href="/" className={cn("ez:min-w-0 ez:text-site-heading ez:text-fg ez:no-underline ez:lg:w-51 ez:lg:shrink-0", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:gap-9 ez:overflow-hidden ez:whitespace-nowrap ez:max-lg:hidden">
          <ClassNavLinks
            items={[nav.classes, ...nav.kinds, ...nav.anchors]}
            className={cn("ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}
            currentClassName="ez:text-fg"
          />
        </nav>
        <div className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-1 ez:lg:gap-6 ez:lg:pl-6">
          <NextLink href={links.search} aria-label={CLASS_TITLE.search} className={topLink}>
            <Icon name="search" />
          </NextLink>
          <NextLink href={links.orders.href} className={cn(topLink, "ez:px-1 ez:lg:px-0")}>
            {links.orders.label}
          </NextLink>
          <NextLink href={links.account.href} aria-label={links.account.label} className={topLink}>
            <Icon name="user" className="ez:lg:hidden" />
            <span className="ez:max-lg:hidden">{links.account.label}</span>
          </NextLink>
          <ButtonLink href={SCHEDULE_HREF} size="sm" className={cn(pill, "ez:max-lg:hidden")}>
            {CLASS_TITLE.book}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({ heading, items }: { heading: string; items: FooterLink[] }) {
  return (
    <nav aria-label={heading} className="ez:grid ez:content-start ez:gap-4 ez:lg:col-span-2">
      <span data-script={scriptOf(heading)} className="ez:text-site-small ez:text-muted">{heading}</span>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-2 ez:p-0 ez:text-site-small">
        {items.map((l) => (
          <li key={l.href}>
            <NextLink href={l.href} className={cn("ez:no-underline ez:hover:text-fg", l.strong ? "ez:text-muted" : "ez:text-site-off", focusRing)}>
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
    <footer data-slot="site-footer" data-variant="night" className="ez:pt-10 ez:text-fg ez:lg:pt-14">
      <div className={wrap}>
        <div className="ez:grid ez:grid-cols-2 ez:gap-x-6 ez:gap-y-10 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-12 ez:pb-10 ez:md:grid-cols-4 ez:lg:grid-cols-12 ez:lg:pt-15">
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-5 ez:md:col-span-4 ez:lg:col-span-4">
            <p data-script={scriptOf(storeName)} className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{storeName}</p>
            {(phone || hours) && (
              <div className="ez:grid ez:gap-1">
                <span className="ez:text-site-small ez:text-muted">{CLASS_TITLE.center}</span>
                {phone && (
                  <a href={`tel:${phone}`} className={cn("ez:justify-self-start ez:text-site-heading ez:text-fg ez:no-underline", focusRing)}>
                    {phone}
                  </a>
                )}
                {hours && <span data-script={scriptOf(hours)} className="ez:text-site-small ez:text-site-off">{hours}</span>}
              </div>
            )}
          </div>
          <FooterColumn heading={CLASS_TITLE.classes} items={classes} />
          <FooterColumn heading="계정" items={account} />
          <FooterColumn heading="고객 지원" items={guide} />
          {terms.length > 0 && <FooterColumn heading="약관" items={terms} />}
        </div>
        <div className="ez:flex ez:flex-col ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-hairline ez:pt-6 ez:pb-12 ez:text-site-small ez:leading-relaxed ez:text-site-off ez:md:flex-row ez:md:justify-between ez:md:gap-10">
          <p className="ez:m-0">{legal}</p>
          <p className="ez:m-0 ez:shrink-0">© {storeName}</p>
        </div>
      </div>
    </footer>
  );
}

const floatBox = "ez:fx-glass ez:mt-3 ez:block ez:rounded-lg ez:px-5.5 ez:pt-5 ez:pb-2.5 ez:text-fg ez:no-underline ez:md:absolute ez:md:bottom-7 ez:md:left-7 ez:md:mt-0 ez:md:w-75";

const floatRow = "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-0 ez:border-t ez:border-solid ez:border-hairline ez:py-2.5 ez:text-site-body";

function HeroFloat({ session }: { session: Session }) {
  const v = sessionView(session);
  const rows: [string, string][] = [
    ["날짜", [v.date, v.day].filter(Boolean).join(" ")],
    ["시간", v.time],
  ];
  if (session.seats_left != null) rows.push(["남은 자리", String(session.seats_left)]);
  return (
    <NextLink href={v.href} className={cn(floatBox, "ez:group", focusRing)}>
      <span className="ez:block ez:text-site-small ez:text-site-off">{CLASS_TITLE.next}</span>
      <span data-script={scriptOf(v.name)} className="ez:mt-1 ez:block ez:truncate ez:text-site-heading ez:underline-offset-4 ez:group-hover:underline">{v.name}</span>
      <span className="ez:mt-3 ez:grid">
        {rows.map(([label, value]) => (
          <span key={label} className={floatRow}>
            <span className="ez:text-site-off">{label}</span>
            <span>{value}</span>
          </span>
        ))}
      </span>
    </NextLink>
  );
}

function BlankFloat() {
  return (
    <div className={floatBox}>
      <span className="ez:block ez:text-site-small ez:text-site-off">{CLASS_TITLE.next}</span>
      <span className="ez:mt-1 ez:block ez:text-site-heading">
        <Bar />
      </span>
      <span className="ez:mt-3 ez:grid">
        {[0, 1].map((i) => (
          <span key={i} className={floatRow}>
            <Bar size="short" />
            <Bar size="short" />
          </span>
        ))}
      </span>
    </div>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const heading = data.title?.trim() || null;
  const sub = heading ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const name = context.storeName?.trim() || null;
  const blank = !heading && !image;
  const near = blank ? null : (bookable(data.sessions)[0] ?? null);
  return (
    <section
      data-slot="hero"
      data-variant="full"
      data-blank={blank ? "" : undefined}
      data-bleed=""
      data-flush=""
      className={cn("ez:relative ez:overflow-clip ez:pt-16 ez:text-fg ez:lg:pt-22", bleed)}
    >
      <div aria-hidden="true" className="ez:fx-sky ez:absolute ez:inset-x-0 ez:top-0 ez:h-168 ez:lg:h-225" />
      <div className="ez:relative">
        <div aria-hidden="true" className="ez:fx-halo ez:z-1" />
        <div aria-hidden="true" className="ez:fx-orb ez:z-1" />
        <div className={cn(wrap, "ez:relative ez:z-2 ez:flex ez:h-152 ez:flex-col ez:items-center ez:pt-12 ez:text-center ez:lg:h-203 ez:lg:pt-21")}>
          {name ? (
            <p data-script={scriptOf(name)} className="ez:fx-fade ez:fx-title-xl ez:m-0 ez:max-w-full ez:break-keep">{name}</p>
          ) : (
            <span className="ez:fx-title-xl">
              <Bar size="long" strong />
            </span>
          )}
          {heading ? (
            <h1 data-script={scriptOf(heading)} className="ez:m-0 ez:mt-6 ez:max-w-140 ez:text-site-item ez:font-normal ez:text-balance ez:whitespace-pre-line ez:text-muted">{heading}</h1>
          ) : (
            <span className="ez:mt-6 ez:text-site-item">
              <Bar size="long" />
            </span>
          )}
          {sub && (
            <p data-slot="hero-sub" className="ez:m-0 ez:mt-2 ez:max-w-140 ez:text-site-body ez:text-site-off">
              {sub}
            </p>
          )}
          {!blank && (
            <div className="ez:mt-9 ez:flex ez:flex-wrap ez:justify-center ez:gap-3">
              <ButtonLink href={data.href ?? CLASSES_HREF} className={pill}>
                {CLASS_TITLE.all}
              </ButtonLink>
              <ButtonLink href={SCHEDULE_HREF} variant="outline" className={lineButton}>
                {CLASS_TITLE.scheduleShort}
              </ButtonLink>
            </div>
          )}
        </div>
        <div className={cn(wrap, "ez:relative ez:z-2")}>
          <div className="ez:relative">
            <div className={cn(panel, "ez:h-100 ez:border-site-line ez:md:h-140 ez:lg:h-175")}>
              <Photo src={image} alt={heading ?? ""} preload sizes="(max-width: 1440px) 100vw, 1344px" tone={0} className="ez:aspect-auto ez:h-full ez:rounded-none" />
            </div>
            {blank ? <BlankFloat /> : near && <HeroFloat session={near} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlankRow() {
  return (
    <div className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-x-4 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:py-4 ez:lg:min-h-24 ez:lg:grid-cols-[6.875rem_minmax(0,1fr)_8.75rem] ez:lg:py-0">
      <span className="ez:text-site-item ez:max-lg:hidden">
        <Bar size="short" />
      </span>
      <span className="ez:text-site-heading">
        <Bar />
      </span>
      <BlankPrice className="ez:justify-end ez:text-site-body ez:text-muted" />
    </div>
  );
}

export function Schedule({ data }: SectionProps<"class_schedule">) {
  const sessions = data.sessions ?? [];
  if (!sessions.length) {
    return (
      <section data-slot="class-schedule" id="schedule" data-variant="night" data-blank="" className="ez:scroll-mt-24 ez:text-fg">
        <Head text={CLASS_TITLE.schedule} />
        <div className="ez:grid ez:grid-cols-7 ez:border-0 ez:border-y ez:border-solid ez:border-site-line">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={cn("ez:flex ez:h-18 ez:flex-col ez:items-center ez:justify-center ez:gap-1.5 ez:lg:h-23 ez:lg:items-start ez:lg:pl-5", i > 0 && "ez:border-0 ez:border-l ez:border-solid ez:border-hairline")}>
              <Bar size="short" className="ez:max-w-6" />
              <span className="ez:text-site-heading">
                <Bar size="short" className="ez:max-w-8" />
              </span>
            </div>
          ))}
        </div>
        {[0, 1, 2].map((i) => (
          <BlankRow key={i} />
        ))}
      </section>
    );
  }
  return (
    <section data-slot="class-schedule" id="schedule" data-variant="night" className="ez:scroll-mt-24 ez:text-fg">
      <DayStrip sessions={sessions} heading={<h2 className={title}>{CLASS_TITLE.schedule}</h2>} more={<More href={SCHEDULE_HREF} label={CLASS_TITLE.scheduleAll} />} />
    </section>
  );
}

function spec(c: ClassCard): string {
  return [c.length && `${CLASS_TITLE.length} ${c.length}`, c.capacity != null && `${CLASS_TITLE.capacity} ${c.capacity}명`].filter(Boolean).join(" · ");
}

const NEXT_PREFIX = new RegExp("^다음 수업\\s*");

function ClassItem({ item, tone, preload }: { item: ClassCard; tone: number; preload?: boolean }) {
  const detail = [item.kind, spec(item)].filter(Boolean).join(" · ");
  const next = item.next?.replace(NEXT_PREFIX, "") || null;
  return (
    <NextLink
      href={item.href ?? `/products/${item.id}`}
      data-slot="class-card"
      data-sample={item.sample || undefined}
      className={cn("ez:group ez:flex ez:min-w-0 ez:flex-col ez:text-fg ez:no-underline", focusRing)}
    >
      <span className={cn(frame, "ez:block ez:border-hairline ez:bg-surface-alt")}>
        <Photo src={item.image} alt={item.name} tone={tone} preload={preload} sizes="(max-width: 768px) 100vw, 430px" className="ez:aspect-[4/3] ez:rounded-none" />
      </span>
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-3 ez:gap-y-1 ez:px-0.5 ez:pt-4">
        <span data-script={scriptOf(item.name)} className="ez:truncate ez:text-site-item ez:underline-offset-4 ez:group-hover:underline">{item.name}</span>
        {item.price ? <span className={price}><Won value={item.price} /></span> : <span />}
        {(detail || item.sample) && (
          <span className="ez:col-span-2 ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:text-site-small ez:text-site-off">
            <span className="ez:truncate">{detail}</span>
            {item.sample && <span className="ez:shrink-0">예시</span>}
          </span>
        )}
        {next && (
          <span className="ez:col-span-2 ez:mt-2 ez:flex ez:min-w-0 ez:gap-2 ez:border-0 ez:border-t ez:border-solid ez:border-hairline ez:pt-2.5 ez:text-site-small">
            <span className="ez:shrink-0 ez:text-site-off">{CLASS_TITLE.next}</span>
            <span className="ez:whitespace-nowrap ez:text-muted">{next}</span>
          </span>
        )}
      </span>
    </NextLink>
  );
}

function BlankClass({ tone }: { tone: number }) {
  return (
    <div className="ez:flex ez:min-w-0 ez:flex-col">
      <span className={cn(frame, "ez:block ez:border-hairline ez:bg-surface-alt")}>
        <Photo src={null} alt="" tone={tone} className="ez:aspect-[4/3] ez:rounded-none" />
      </span>
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-3 ez:gap-y-2 ez:px-0.5 ez:pt-4">
        <span className="ez:text-site-item">
          <Bar />
        </span>
        <BlankPrice className="ez:text-site-body ez:text-muted" />
        <span className="ez:col-span-2 ez:text-site-small">
          <Bar size="short" />
        </span>
      </span>
    </div>
  );
}

const classGrid = "ez:grid ez:grid-cols-1 ez:gap-x-6 ez:gap-y-11 ez:sm:grid-cols-2";

export function Classes({ data }: SectionProps<"class_list">) {
  const items = (data.classes ?? []).slice(0, 3);
  return (
    <section data-slot="class-list" id="classes" data-variant="night" data-blank={items.length ? undefined : ""} className="ez:scroll-mt-24 ez:text-fg">
      <Head text={CLASS_TITLE.classes} aside={items.length ? <More href={CLASSES_HREF} /> : undefined} />
      <div className={cn(classGrid, fillCols(items.length || 3))}>
        {items.length ? items.map((c, i) => <ClassItem key={c.id} item={c} tone={i} />) : [0, 1, 2].map((i) => <BlankClass key={i} tone={i} />)}
      </div>
    </section>
  );
}

type ReviewItem = NonNullable<SectionProps<"reviews">["data"]["items"]>[number];

const reviewCol = "ez:grid ez:min-w-0 ez:content-start ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-6";

function Review({ item, cls }: { item: ReviewItem; cls?: string }) {
  return (
    <article className={reviewCol}>
      <span className="ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-small ez:text-muted">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="ez:size-3.5 ez:fill-star">
          <path d={STAR_PATH} />
        </svg>
        <span className="ez:sr-only">별점 </span>
        {item.rating.toFixed(1)}
      </span>
      <p data-script={scriptOf(item.body)} className="ez:m-0 ez:mt-4 ez:line-clamp-4 ez:min-h-[4lh] ez:text-site-item ez:leading-relaxed ez:text-pretty ez:text-fg">{item.body}</p>
      <span className="ez:mt-5 ez:truncate ez:text-site-small ez:text-site-off">{[item.name, cls, item.date].filter(Boolean).join(" · ")}</span>
    </article>
  );
}

function BlankReview() {
  return (
    <div className={reviewCol}>
      <BlankStars />
      <span className="ez:mt-4 ez:text-site-item">
        <Lines />
      </span>
      <span className="ez:mt-5 ez:text-site-small">
        <Bar size="short" />
      </span>
    </div>
  );
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  const parts = items.length ? [data.average != null ? data.average.toFixed(1) : null, data.count != null ? `${CLASS_TITLE.reviews} ${data.count}` : null].filter(Boolean) : [];
  return (
    <section data-slot="reviews" id="reviews" data-variant="night" data-blank={items.length ? undefined : ""} className="ez:scroll-mt-24 ez:text-fg">
      <Head text={CLASS_TITLE.reviews} aside={parts.length ? <span data-script={scriptOf(parts.join(" · "))} className="ez:text-site-small ez:text-site-off">{parts.join(" · ")}</span> : undefined} />
      <div className="ez:grid ez:gap-x-6 ez:gap-y-10 ez:md:grid-cols-3">
        {items.length
          ? items.map((r, i) => <Review key={`${r.name}-${r.date ?? ""}-${i}`} item={r} cls={r.product ? context.products.find((p) => p.id === r.product)?.name : undefined} />)
          : [0, 1, 2].map((i) => <BlankReview key={i} />)}
      </div>
    </section>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:py-4.5">
      <dt className="ez:shrink-0 ez:text-site-body ez:text-site-off">{label}</dt>
      <dd data-script={scriptOf(children)} className="ez:m-0 ez:min-w-0 ez:text-right ez:text-site-item ez:text-fg">{children}</dd>
    </div>
  );
}

const mapBox = "ez:relative ez:flex ez:min-h-75 ez:items-center ez:justify-center ez:bg-deep ez:lg:min-h-100";

function Pin() {
  return <span aria-hidden="true" className="ez:fx-ring ez:relative ez:size-3.5 ez:rounded-full ez:bg-primary" />;
}

export function Location({ data }: SectionProps<"location">) {
  const address = data.address?.trim() || null;
  const href = address ? (data.href ?? mapHref(address)) : null;
  const phone = address ? data.phone?.trim() || null : null;
  return (
    <section data-slot="location" id="location" data-variant="night" data-blank={address ? undefined : ""} className="ez:scroll-mt-24 ez:text-fg">
      <div className="ez:grid ez:gap-x-6 ez:gap-y-8 ez:lg:grid-cols-[5fr_7fr]">
        <div className="ez:flex ez:min-w-0 ez:flex-col">
          <Head text={CLASS_TITLE.location} />
          <dl className="ez:m-0 ez:border-0 ez:border-t ez:border-solid ez:border-site-line">
            <InfoRow label={CLASS_TITLE.address}>{address ?? <Bar size="long" />}</InfoRow>
            {address && data.hours && <InfoRow label={CLASS_TITLE.hours}>{data.hours}</InfoRow>}
            {phone && (
              <InfoRow label={CLASS_TITLE.phone}>
                <span>{phone}</span>
              </InfoRow>
            )}
          </dl>
          {href && (
            <div className="ez:mt-7 ez:flex ez:flex-wrap ez:gap-2.5 ez:lg:mt-auto ez:lg:pt-7">
              <a href={href} target="_blank" rel="noopener" className={cn(buttonVariants(), pill)}>
                {CLASS_TITLE.map}
              </a>
              {phone && (
                <a href={`tel:${phone}`} className={cn(buttonVariants({ variant: "outline" }), lineButton)}>
                  <Icon name="phone" size="sm" />
                  {CLASS_TITLE.phone}
                </a>
              )}
            </div>
          )}
        </div>
        <div className={cn(panel, "ez:border-site-line")}>
          {href ? (
            <a href={href} target="_blank" rel="noopener" aria-label={MAP_LABEL} className={cn(mapBox, "ez:h-full ez:no-underline", focusRing)}>
              <SampleMap className="ez:opacity-40 ez:grayscale ez:invert" />
              <Pin />
            </a>
          ) : (
            <div className={cn(mapBox, "ez:h-full")}>
              <Icon name="pin" className="ez:size-8 ez:text-site-off" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Upcoming({ sessions, href }: { sessions: Session[]; href: string }) {
  return (
    <section className="ez:mt-20">
      <div className="ez:mb-5 ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-x-8 ez:gap-y-3">
        <h2 className="ez:m-0 ez:text-site-heading ez:text-fg">{CLASS_TITLE.schedule}</h2>
        <More href={href} label={CLASS_TITLE.scheduleAll} />
      </div>
      <div className="ez:border-0 ez:border-t ez:border-solid ez:border-site-line">
        <SessionGroups sessions={sessions.slice(0, 5)} />
      </div>
    </section>
  );
}

const listTab = cn("ez:inline-flex ez:shrink-0 ez:items-baseline ez:gap-1.5 ez:py-3 ez:text-site-lead ez:no-underline ez:hover:text-fg", focusRing);

export function List({ view, title: heading, count, crumbs, tabs, sorts, classes, sessions, links, search, emptyHref }: ClassListProps) {
  const schedule = view === "schedule";
  const empty = schedule ? !sessions.length : !classes.length;
  return (
    <div data-slot="class-catalog" data-variant="night" className="ez:grid ez:grid-cols-1 ez:text-fg">
      <nav aria-label="현재 위치" className="ez:flex ez:flex-wrap ez:items-center ez:gap-1.5 ez:text-site-small ez:text-site-off">
        {crumbs.map((c, i) => (
          <span key={c.href} className="ez:inline-flex ez:items-center ez:gap-1.5">
            {i > 0 && <Icon name="next" size="sm" />}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="ez:text-muted">
                {c.label}
              </span>
            ) : (
              <NextLink href={c.href} className={cn("ez:text-site-off ez:no-underline ez:hover:text-fg", focusRing)}>
                {c.label}
              </NextLink>
            )}
          </span>
        ))}
      </nav>
      <div className="ez:mt-4 ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1">
        <h1 data-script={scriptOf(heading)} className="ez:m-0 ez:text-site-section ez:text-fg ez:md:text-site-page">{heading}</h1>
        {count != null && <span className="ez:text-site-body ez:text-site-off">{count}</span>}
      </div>
      {search && <div className="ez:mt-6">{search}</div>}
      <div className="ez:mt-8 ez:flex ez:flex-wrap ez:items-center ez:justify-between ez:gap-x-6 ez:border-0 ez:border-b ez:border-solid ez:border-site-line">
        <nav aria-label="카테고리" className="ez:-mx-page ez:flex ez:min-w-0 ez:gap-7 ez:overflow-x-auto ez:px-page ez:whitespace-nowrap ez:md:mx-0 ez:md:px-0">
          {tabs.map((t) => (
            <NextLink key={t.href} href={t.href} aria-current={t.on ? "page" : undefined} className={cn(listTab, t.on ? "ez:fx-tab ez:text-fg" : "ez:text-site-off")}>
              {t.label}
              {t.count != null && <span className="ez:text-site-small ez:text-site-off">{t.count}</span>}
            </NextLink>
          ))}
        </nav>
        {schedule ? (
          <More href={links.classes} label={CLASS_TITLE.all} />
        ) : (
          <nav aria-label="정렬" className="ez:flex ez:flex-wrap ez:items-center ez:gap-x-5">
            {sorts.map((s) => (
              <NextLink
                key={s.href}
                href={s.href}
                aria-current={s.on ? "true" : undefined}
                className={cn("ez:inline-flex ez:min-h-11 ez:items-center ez:text-site-body ez:no-underline ez:hover:text-fg", s.on ? "ez:text-fg" : "ez:text-site-off", focusRing)}
              >
                {s.label}
              </NextLink>
            ))}
          </nav>
        )}
      </div>
      <div className="ez:mt-9">
        {empty ? (
          <EmptyState title={schedule ? "예정된 일정이 없어요" : "등록된 클래스가 없어요"} action={emptyHref ? { label: CLASS_TITLE.all, href: emptyHref } : undefined} />
        ) : schedule ? (
          <SessionGroups sessions={sessions} />
        ) : (
          <div className={cn(classGrid, "ez:lg:grid-cols-3")}>
            {classes.map((c, i) => (
              <ClassItem key={c.id} item={c} tone={i} preload={i < 3} />
            ))}
          </div>
        )}
      </div>
      {!schedule && sessions.length > 0 && <Upcoming sessions={sessions} href={links.schedule} />}
    </div>
  );
}
