import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { EmptyState } from "../../components/empty-state";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { StarRow } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, BlankPrice, BlankStars, Lines } from "../kit";
import { fillCols } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import type { ClassCard, Session } from "../template/data";
import { DayStrip, SessionGroups } from "./b-days";
import { ClassNavLinks } from "./nav";
import { CLASS_TITLE, CLASSES_HREF, mapHref, SCHEDULE_HREF, sessionView } from "./shared";
import type { ClassFooterProps, ClassHeaderProps, ClassListProps, SessionView } from "./types";

const WEEK = "일월화수목금토";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:box-border ez:px-page";

const heading = "ez:m-0 ez:font-body ez:text-site-heading ez:font-medium ez:text-fg";

const line = "ez:border-0 ez:border-solid ez:border-site-line";

const tlink = "ez:inline-flex ez:self-start ez:border-0 ez:border-b ez:border-solid ez:border-site-edge ez:pb-0.5 ez:text-site-lead ez:text-muted";

const tlinkLive = cn(tlink, "ez:no-underline ez:hover:border-fg ez:hover:text-fg", focusRing);

const moreLink = cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-0.5 ez:text-site-note ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const navLink = cn("ez:flex ez:h-full ez:items-center ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const navOn = "ez:font-medium ez:text-fg";

const textLink = cn("ez:inline-flex ez:h-10 ez:items-center ez:px-2.5 ez:text-site-note ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const price = "ez:text-site-figure ez:font-medium ez:tabular-nums ez:text-fg";

const classRow = "ez:grid ez:grid-cols-2 ez:gap-x-4 ez:gap-y-10 ez:md:gap-x-5";

const cols3 = "ez:grid ez:grid-cols-2 ez:gap-x-4 ez:gap-y-10 ez:md:grid-cols-3 ez:md:gap-x-5";

function when(s: Session): { day: string; week: string | null } {
  if (!s.ymd) return { day: s.day ?? s.date, week: null };
  const [, m, d] = s.ymd.split("-");
  return { day: `${Number(m)}.${d}`, week: WEEK[new Date(`${s.ymd}T00:00:00Z`).getUTCDay()] };
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" aria-hidden="true" className="ez:size-5 ez:shrink-0">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Header({ name, logoUrl, nav, links }: ClassHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="catalog" className="ez:bg-surface ez:text-fg">
      <div className={cn(wrap, "ez:grid ez:h-16 ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-4 ez:lg:h-21 ez:lg:grid-cols-[1fr_minmax(0,30rem)_1fr] ez:lg:gap-10")}>
        <NextLink href="/" className={cn("ez:min-w-0 ez:text-site-heading ez:font-medium ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <form
          role="search"
          action={links.search}
          className="ez:flex ez:h-11 ez:items-center ez:gap-2.5 ez:rounded-md ez:border ez:border-solid ez:border-site-field ez:bg-surface ez:px-4 ez:text-muted ez:focus-within:outline-2 ez:focus-within:outline-offset-2 ez:focus-within:outline-primary ez:max-lg:hidden"
        >
          <Icon name="search" />
          <input
            type="search"
            name="q"
            aria-label={CLASS_TITLE.search}
            placeholder={CLASS_TITLE.search}
            className="ez:h-full ez:min-w-0 ez:flex-1 ez:border-0 ez:bg-transparent ez:p-0 ez:font-body ez:text-site-body ez:text-fg ez:outline-none ez:placeholder:text-muted"
          />
        </form>
        <div className="ez:flex ez:items-center ez:justify-end ez:gap-1">
          <NextLink
            href={links.search}
            aria-label={CLASS_TITLE.search}
            className={cn("ez:inline-flex ez:size-10 ez:items-center ez:justify-center ez:text-muted ez:no-underline ez:hover:text-fg ez:lg:hidden", focusRing)}
          >
            <Icon name="search" size="lg" />
          </NextLink>
          <NextLink href={links.orders.href} className={textLink}>
            {links.orders.label}
          </NextLink>
          <NextLink href={links.account.href} className={textLink}>
            {links.account.label}
          </NextLink>
        </div>
      </div>
      <div className={cn(line, "ez:border-y ez:max-lg:hidden")}>
        <nav aria-label="주요 메뉴" className={cn(wrap, "ez:flex ez:h-13 ez:items-center ez:gap-9 ez:overflow-hidden ez:whitespace-nowrap")}>
          <span className={cn(line, "ez:flex ez:h-5 ez:shrink-0 ez:items-center ez:gap-2 ez:border-r ez:pr-9 ez:text-muted")}>
            <MenuIcon />
            <ClassNavLinks items={[{ ...nav.classes, label: CLASS_TITLE.all }]} className={navLink} currentClassName={navOn} />
          </span>
          <span className="ez:flex ez:h-full ez:min-w-0 ez:items-center ez:gap-8">
            <ClassNavLinks items={[...nav.kinds, ...nav.anchors]} className={navLink} currentClassName={navOn} />
          </span>
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

export function Footer({ storeName, phone, hours, legal, classes, guide, account, terms }: ClassFooterProps) {
  return (
    <footer data-slot="site-footer" data-variant="catalog" className={cn(line, "ez:border-t ez:text-fg")}>
      <div className={cn(wrap, "ez:grid ez:grid-cols-2 ez:gap-x-8 ez:gap-y-10 ez:pt-13 ez:pb-10 ez:md:grid-cols-4 ez:lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]")}>
        <div className="ez:col-span-2 ez:flex ez:flex-col ez:md:col-span-4 ez:lg:col-span-1">
          <span className="ez:mb-3.5 ez:text-site-note ez:font-medium ez:text-fg">{CLASS_TITLE.center}</span>
          {phone && (
            <a href={`tel:${phone}`} className={cn("ez:mb-2 ez:self-start ez:text-site-rank ez:font-medium ez:text-fg ez:tabular-nums ez:no-underline", focusRing)}>
              {phone}
            </a>
          )}
          {hours && <span className="ez:text-site-note ez:text-muted">{hours}</span>}
        </div>
        <FooterColumn title={CLASS_TITLE.classes} items={classes} />
        <FooterColumn title="계정" items={account} />
        <FooterColumn title="고객 지원" items={guide} />
        {terms.length > 0 && <FooterColumn title="약관" items={terms} />}
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

function Head({ title, href, label = CLASS_TITLE.more }: { title: string; href?: string; label?: string }) {
  return (
    <div className="ez:mb-6 ez:flex ez:items-end ez:justify-between ez:gap-3">
      <h2 className={heading}>{title}</h2>
      {href && (
        <NextLink href={href} className={moreLink}>
          {label}
          <Icon name="next" size="sm" />
        </NextLink>
      )}
    </div>
  );
}

function Seats({ v }: { v: SessionView }) {
  if (!v.seats) return null;
  return <span className={cn("ez:text-site-note ez:whitespace-nowrap", v.few ? "ez:font-medium ez:text-fg" : v.full ? "ez:font-medium ez:text-muted" : "ez:text-muted")}>{v.seats}</span>;
}

function Near({ session }: { session: Session }) {
  const v = sessionView(session);
  const t = when(session);
  return (
    <NextLink href={v.href} className={cn("ez:group ez:flex ez:flex-1 ez:flex-col ez:justify-center ez:gap-1.5 ez:py-5 ez:text-fg ez:no-underline", line, "ez:border-t ez:first-of-type:border-t-0", focusRing)}>
      <span className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-2 ez:text-site-body ez:text-muted ez:tabular-nums">
        <span className="ez:text-site-rank ez:font-medium ez:text-fg">{t.day}</span>
        {t.week && <span>{t.week}</span>}
        <span>{v.time}</span>
      </span>
      <span className="ez:truncate ez:text-site-body ez:text-fg ez:underline-offset-4 ez:group-hover:underline">{v.name}</span>
      <span className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3">
        <Seats v={v} />
        {v.price && <span className={price}>{v.price}</span>}
      </span>
      <span className={cn(tlink, "ez:mt-1.5 ez:group-hover:border-fg ez:group-hover:text-fg")}>{CLASS_TITLE.book}</span>
    </NextLink>
  );
}

function BlankNear() {
  return (
    <div className={cn("ez:flex ez:flex-1 ez:flex-col ez:justify-center ez:gap-2.5 ez:py-5", line, "ez:border-t ez:first-of-type:border-t-0")}>
      <span className="ez:text-site-rank">
        <Bar size="short" />
      </span>
      <span className="ez:text-site-body">
        <Bar />
      </span>
      <BlankPrice className="ez:text-site-figure" />
    </div>
  );
}

export function Hero({ data }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const blank = !title && !data.image;
  const near = (data.sessions ?? []).slice(0, 2);
  const split = blank || near.length > 0;
  return (
    <section data-slot="hero" data-variant="full" data-blank={blank ? "" : undefined} className={cn("ez:grid ez:gap-4 ez:text-fg ez:lg:h-120", split && "ez:lg:grid-cols-[2fr_1fr]")}>
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
            <div aria-hidden="true" className="ez:absolute ez:bottom-6 ez:left-5 ez:grid ez:w-2/5 ez:max-w-56 ez:gap-2 ez:text-site-heading ez:md:bottom-14 ez:md:left-10 ez:md:text-site-name">
              <Bar size="full" block />
              <Bar size="mid" block />
            </div>
          )}
        </div>
        {title && (
          <div className="ez:grid ez:content-end ez:gap-2 ez:p-6 ez:md:px-10 ez:md:pt-10 ez:md:pb-14">
            <h1 className="ez:m-0 ez:font-body ez:text-site-heading ez:font-normal ez:whitespace-pre-line ez:text-fg ez:md:text-site-name ez:md:font-normal">{title}</h1>
            {data.sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:text-site-lead ez:text-muted">
                {data.sub}
              </p>
            )}
            <NextLink href={data.href ?? CLASSES_HREF} className={cn(tlinkLive, "ez:mt-3")}>
              {CLASS_TITLE.all}
            </NextLink>
          </div>
        )}
      </div>
      {split && (
        <div className="ez:flex ez:min-h-0 ez:flex-col ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:px-6">
          <h2 className="ez:m-0 ez:pt-5 ez:pb-1 ez:font-body ez:text-site-note ez:font-normal ez:text-muted">{CLASS_TITLE.nearest}</h2>
          {blank ? [0, 1].map((i) => <BlankNear key={i} />) : near.map((s) => <Near key={s.id} session={s} />)}
        </div>
      )}
    </section>
  );
}

function BlankRow() {
  return (
    <div className={cn(line, "ez:grid ez:grid-cols-[4rem_minmax(0,1fr)] ez:items-center ez:gap-x-4 ez:border-b ez:py-3.5 ez:lg:grid-cols-[5.5rem_4rem_minmax(0,1fr)_7.5rem] ez:lg:gap-x-5")}>
      <span className="ez:text-site-item ez:max-lg:hidden">
        <Bar size="short" />
      </span>
      <Photo src={null} alt="" className="ez:aspect-square ez:size-16 ez:rounded-sm" />
      <span className="ez:grid ez:gap-1.5">
        <span className="ez:text-site-body">
          <Bar />
        </span>
        <span className="ez:text-site-small">
          <Bar size="short" />
        </span>
      </span>
      <span className="ez:text-right ez:max-lg:hidden">
        <BlankPrice className="ez:text-site-figure" />
      </span>
    </div>
  );
}

export function Schedule({ data }: SectionProps<"class_schedule">) {
  const sessions = data.sessions ?? [];
  if (!sessions.length) {
    return (
      <section data-slot="class-schedule" id="schedule" data-variant="catalog" data-blank="" className="ez:text-fg">
        <Head title={CLASS_TITLE.scheduleShort} />
        <div className={cn(line, "ez:border-t")}>
          {[0, 1, 2].map((i) => (
            <BlankRow key={i} />
          ))}
        </div>
      </section>
    );
  }
  return (
    <section data-slot="class-schedule" id="schedule" data-variant="catalog" className="ez:text-fg">
      <Head title={CLASS_TITLE.scheduleShort} href={SCHEDULE_HREF} label={CLASS_TITLE.scheduleAll} />
      <DayStrip sessions={sessions} />
    </section>
  );
}

function spec(c: ClassCard): string {
  return [c.length && `${CLASS_TITLE.length} ${c.length}`, c.capacity != null && `${CLASS_TITLE.capacity} ${c.capacity}명`].filter(Boolean).join(" · ");
}

function ClassItem({ item, tone, preload }: { item: ClassCard; tone: number; preload?: boolean }) {
  const detail = spec(item);
  const next = item.next?.replace(/^다음 수업\s*/, "") || null;
  return (
    <NextLink
      href={item.href ?? `/products/${item.id}`}
      data-slot="class-card"
      data-sample={item.sample || undefined}
      className={cn("ez:group ez:grid ez:min-w-0 ez:content-start ez:gap-3.5 ez:text-fg ez:no-underline", focusRing)}
    >
      <Photo src={item.image} alt={item.name} tone={tone} preload={preload} sizes="(max-width: 768px) 50vw, 320px" className="ez:aspect-square ez:rounded-sm" />
      <span className="ez:grid ez:min-w-0 ez:content-start ez:gap-0.5">
        {item.kind && <span className="ez:truncate ez:text-site-small ez:text-muted">{item.kind}</span>}
        {item.sample ? (
          <span className="ez:flex ez:items-baseline ez:gap-2">
            <span className="ez:min-w-0 ez:flex-1 ez:truncate ez:text-site-body ez:underline-offset-4 ez:group-hover:underline">{item.name}</span>
            <span className="ez:shrink-0 ez:text-site-small ez:font-medium ez:text-muted">예시</span>
          </span>
        ) : (
          <span className="ez:truncate ez:text-site-body ez:underline-offset-4 ez:group-hover:underline">{item.name}</span>
        )}
        {detail && <span className="ez:truncate ez:text-site-small ez:text-muted">{detail}</span>}
        {item.price && <span className={cn(price, "ez:mt-1.5")}>{item.price}</span>}
        {next && (
          <span className={cn(line, "ez:mt-2 ez:flex ez:min-w-0 ez:gap-1.5 ez:border-t ez:pt-2 ez:text-site-small")}>
            <span className="ez:shrink-0 ez:text-muted">{CLASS_TITLE.next}</span>
            <span className="ez:truncate ez:text-fg ez:tabular-nums">{next}</span>
          </span>
        )}
      </span>
    </NextLink>
  );
}

function BlankClass({ tone }: { tone: number }) {
  return (
    <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-3.5">
      <Photo src={null} alt="" tone={tone} className="ez:aspect-square ez:rounded-sm" />
      <span className="ez:grid ez:gap-1.5">
        <span className="ez:text-site-small">
          <Bar size="short" />
        </span>
        <span className="ez:text-site-body">
          <Bar />
        </span>
        <BlankPrice className="ez:text-site-figure" />
      </span>
    </div>
  );
}

export function Classes({ data }: SectionProps<"class_list">) {
  const items = (data.classes ?? []).slice(0, 4);
  return (
    <section data-slot="class-list" id="classes" data-variant="catalog" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={CLASS_TITLE.classes} href={items.length ? CLASSES_HREF : undefined} />
      <div className={cn(classRow, fillCols(items.length || 4))}>{items.length ? items.map((c, i) => <ClassItem key={c.id} item={c} tone={i} />) : [0, 1, 2, 3].map((i) => <BlankClass key={i} tone={i} />)}</div>
    </section>
  );
}

type ReviewItem = NonNullable<SectionProps<"reviews">["data"]["items"]>[number];

type ReviewClass = SectionProps<"reviews">["context"]["products"][number];

function ReviewCard({ item, cls, tone }: { item: ReviewItem; cls?: ReviewClass; tone: number }) {
  return (
    <article className="ez:flex ez:min-w-0 ez:gap-4 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-5">
      {cls && <Photo src={cls.cover_url} alt={cls.name} tone={tone} sizes="80px" className="ez:aspect-square ez:size-20 ez:shrink-0 ez:rounded-sm" />}
      <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-1.5">
        <StarRow rating={item.rating} className="ez:text-muted" />
        <p className="ez:m-0 ez:line-clamp-2 ez:text-site-body ez:text-fg">{item.body}</p>
        <p className="ez:m-0 ez:flex ez:min-w-0 ez:gap-2 ez:text-site-small ez:text-muted">
          {cls && <span className="ez:truncate">{cls.name}</span>}
          <span className="ez:shrink-0">{[item.name, item.date].filter(Boolean).join(" · ")}</span>
        </p>
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
        <Head title={CLASS_TITLE.reviews} />
        <div className={cn("ez:grid ez:gap-4 ez:lg:gap-5", fillCols(items.length || 3))}>
          {items.length
            ? items.map((r, i) => <ReviewCard key={`${r.name}-${r.date ?? ""}-${i}`} item={r} tone={i} cls={r.product ? context.products.find((p) => p.id === r.product) : undefined} />)
            : [0, 1, 2].map((i) => <BlankReview key={i} tone={i} />)}
        </div>
      </div>
    </section>
  );
}

export function Faq({ context }: SectionProps<"faq">) {
  const faqs = context.faqs.slice(0, 4);
  if (!faqs.length) {
    return (
      <section data-slot="faq" id="faq" data-variant="catalog" data-blank="" className="ez:text-fg">
        <Head title={CLASS_TITLE.faq} />
        <div className={cn(line, "ez:border-t")}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={cn(line, "ez:flex ez:min-h-15 ez:items-center ez:border-b")}>
              <Bar size="long" />
            </div>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section data-slot="faq" id="faq" data-variant="catalog" className="ez:text-fg">
      <Head title={CLASS_TITLE.faq} href="/policy/returns" label={CLASS_TITLE.cancel} />
      <div className={cn(line, "ez:border-t")}>
        {faqs.map((f) => (
          <details key={f.id} className={cn(line, "ez:group ez:border-b")}>
            <summary
              className={cn(
                "ez:flex ez:min-h-15 ez:cursor-pointer ez:list-none ez:items-center ez:justify-between ez:gap-4 ez:py-3 ez:text-site-lead ez:text-fg ez:[&::-webkit-details-marker]:hidden",
                focusRing,
              )}
            >
              {f.question}
              <Icon name="plus" size="sm" className="ez:text-muted ez:transition-transform ez:group-open:rotate-45" />
            </summary>
            <p className="ez:m-0 ez:pb-5 ez:whitespace-pre-line ez:text-site-body ez:text-muted">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ez:grid ez:min-w-0 ez:gap-1">
      <dt className="ez:text-site-note ez:text-muted">{label}</dt>
      <dd className="ez:m-0 ez:text-site-body ez:text-fg ez:lg:whitespace-nowrap">{children}</dd>
    </div>
  );
}

const mapBox = "ez:flex ez:min-h-40 ez:items-center ez:justify-center ez:bg-surface-alt ez:text-muted";

export function Location({ data }: SectionProps<"location">) {
  const address = data.address?.trim() || null;
  const href = address ? (data.href ?? mapHref(address)) : null;
  const pin = <Icon name="pin" className="ez:size-8" />;
  return (
    <section data-slot="location" id="location" data-variant="catalog" data-blank={address ? undefined : ""} className="ez:text-fg">
      <div className="ez:grid ez:overflow-hidden ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:lg:h-42 ez:lg:grid-cols-[26.25rem_minmax(0,1fr)]">
        {href ? (
          <a href={href} target="_blank" rel="noopener" aria-label={CLASS_TITLE.map} className={cn(mapBox, "ez:no-underline ez:hover:text-fg", focusRing)}>
            {pin}
          </a>
        ) : (
          <div className={mapBox}>{pin}</div>
        )}
        <div className="ez:grid ez:items-center ez:gap-x-8 ez:gap-y-5 ez:p-6 ez:lg:grid-cols-[9.375rem_minmax(0,1fr)_auto] ez:lg:px-10 ez:lg:py-0">
          <h2 className={heading}>{CLASS_TITLE.location}</h2>
          <dl className="ez:m-0 ez:grid ez:gap-4 ez:md:flex ez:md:flex-wrap ez:md:gap-x-12">
            <Fact label={CLASS_TITLE.address}>{address ?? <Bar size="long" />}</Fact>
            {address && data.hours && <Fact label={CLASS_TITLE.hours}>{data.hours}</Fact>}
            {address && data.phone && (
              <Fact label={CLASS_TITLE.phone}>
                <a href={`tel:${data.phone}`} className={cn("ez:text-fg ez:tabular-nums ez:no-underline ez:hover:underline", focusRing)}>
                  {data.phone}
                </a>
              </Fact>
            )}
          </dl>
          {href && (
            <a href={href} target="_blank" rel="noopener" className={tlinkLive}>
              {CLASS_TITLE.map}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function Upcoming({ sessions, href }: { sessions: Session[]; href: string }) {
  return (
    <div className="ez:pt-7 ez:max-lg:hidden">
      <h2 className="ez:m-0 ez:mb-2 ez:font-body ez:text-site-body ez:font-medium ez:text-fg">{CLASS_TITLE.schedule}</h2>
      <ul className="ez:m-0 ez:list-none ez:p-0">
        {sessions.slice(0, 5).map((s) => {
          const v = sessionView(s);
          const t = when(s);
          return (
            <li key={s.id}>
              <NextLink
                href={v.href}
                className={cn(line, "ez:group ez:grid ez:grid-cols-[4.375rem_minmax(0,1fr)] ez:gap-2.5 ez:border-b ez:py-2.5 ez:text-fg ez:no-underline", v.full && "ez:opacity-50", focusRing)}
              >
                <span className="ez:grid ez:text-site-small ez:text-muted ez:tabular-nums">
                  <span>{[t.day, t.week].filter(Boolean).join(" ")}</span>
                  <span>{v.time}</span>
                </span>
                <span className="ez:grid ez:min-w-0">
                  <span className="ez:truncate ez:text-site-note ez:text-fg ez:underline-offset-4 ez:group-hover:underline">{v.name}</span>
                  {v.seats && <span className={cn("ez:text-site-small", v.few ? "ez:font-medium ez:text-fg" : "ez:text-muted")}>{v.seats}</span>}
                </span>
              </NextLink>
            </li>
          );
        })}
      </ul>
      <NextLink href={href} className={cn(moreLink, "ez:mt-3")}>
        {CLASS_TITLE.scheduleAll}
        <Icon name="next" size="sm" />
      </NextLink>
    </div>
  );
}

export function List({ view, title, count, crumbs, tabs, sorts, classes, sessions, links, search, emptyHref }: ClassListProps) {
  const schedule = view === "schedule";
  const empty = schedule ? !sessions.length : !classes.length;
  return (
    <div data-slot="class-catalog" data-variant="catalog" className="ez:grid ez:grid-cols-1 ez:text-fg">
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
      <div className={cn(line, "ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-2.5 ez:gap-y-1 ez:border-b ez:pt-3 ez:pb-7")}>
        <h1 className="ez:m-0 ez:font-body ez:text-site-heading ez:font-medium ez:text-fg ez:md:text-site-title ez:md:font-medium">{title}</h1>
        {count != null && <span className="ez:text-site-body ez:text-muted ez:tabular-nums">{count}</span>}
      </div>
      {search && <div className="ez:pt-6">{search}</div>}
      <div className="ez:grid ez:grid-cols-1 ez:gap-x-10 ez:lg:grid-cols-[13.75rem_minmax(0,1fr)]">
        <div className="ez:min-w-0 ez:lg:self-start">
          <nav aria-label="카테고리" className={cn(line, "ez:border-b ez:py-3 ez:lg:pt-7 ez:lg:pb-5")}>
            <h2 className="ez:m-0 ez:mb-3 ez:font-body ez:text-site-body ez:font-medium ez:text-fg ez:max-lg:sr-only">{CLASS_TITLE.kinds}</h2>
            <ul className="ez:m-0 ez:flex ez:list-none ez:gap-6 ez:overflow-x-auto ez:p-0 ez:lg:grid ez:lg:gap-0 ez:lg:overflow-visible">
              {tabs.map((t) => (
                <li key={t.href} className="ez:shrink-0">
                  <NextLink
                    href={t.href}
                    aria-current={t.on ? "page" : undefined}
                    className={cn("ez:flex ez:min-h-11 ez:items-center ez:gap-2 ez:whitespace-nowrap ez:text-site-body ez:no-underline ez:lg:min-h-8", t.on ? "ez:text-fg" : "ez:text-muted ez:hover:text-fg", focusRing)}
                  >
                    <Icon name="check" size="sm" className={cn("ez:text-primary", !t.on && "ez:invisible ez:max-lg:hidden")} />
                    <span className="ez:lg:flex-1">{t.label}</span>
                    {t.count != null && <span className="ez:text-site-small ez:text-muted ez:tabular-nums">{t.count}</span>}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
          {!schedule && sessions.length > 0 && <Upcoming sessions={sessions} href={links.schedule} />}
        </div>
        <div className="ez:min-w-0">
          <div className="ez:mb-2 ez:flex ez:min-h-16 ez:flex-wrap ez:items-center ez:justify-between ez:gap-x-6">
            {schedule ? (
              <NextLink href={links.classes} className={cn(moreLink, "ez:min-h-11")}>
                {CLASS_TITLE.all}
                <Icon name="next" size="sm" />
              </NextLink>
            ) : (
              <nav aria-label="정렬" className="ez:flex ez:flex-wrap ez:items-center ez:gap-x-6">
                {sorts.map((s) => (
                  <NextLink
                    key={s.href}
                    href={s.href}
                    aria-current={s.on ? "true" : undefined}
                    className={cn("ez:inline-flex ez:min-h-11 ez:items-center ez:text-site-body ez:no-underline", s.on ? "ez:font-semibold ez:text-fg" : "ez:text-muted ez:hover:text-fg", focusRing)}
                  >
                    {s.label}
                  </NextLink>
                ))}
              </nav>
            )}
          </div>
          {empty ? (
            <EmptyState title={schedule ? "예정된 일정이 없어요" : "등록된 클래스가 없어요"} action={emptyHref ? { label: CLASS_TITLE.all, href: emptyHref } : undefined} />
          ) : schedule ? (
            <SessionGroups sessions={sessions} />
          ) : (
            <div className={cols3}>
              {classes.map((c, i) => (
                <ClassItem key={c.id} item={c} tone={i} preload={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
