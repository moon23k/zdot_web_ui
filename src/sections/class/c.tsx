import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { EmptyState } from "../../components/empty-state";
import { Icon, type IconName } from "../../components/icon";
import { Photo } from "../../components/photo";
import { StarRow } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, BlankPrice, BlankStars, Lines } from "../kit";
import { MAP_LABEL, SampleMap } from "../stay/map";
import { fillCols, lastOdd, ROW_ITEM } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import type { ClassCard, Session } from "../template/data";
import { ClassNavLinks } from "./nav";
import { CLASS_TITLE, CLASSES_HREF, mapHref, SCHEDULE_HREF, sessionView } from "./shared";
import type { ClassFooterProps, ClassHeaderProps, ClassListProps, SessionView } from "./types";

const CARD_SIZES = "(max-width: 1024px) 50vw, 420px";

const sectionTitle = "ez:m-0 ez:text-site-section ez:font-normal ez:tracking-tight ez:text-fg";

const moreLink = cn("ez:inline-flex ez:items-center ez:gap-2 ez:text-site-lead ez:font-normal ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing);

function Head({ title, href }: { title: string; href?: string }) {
  return (
    <div className="ez:flex ez:items-center ez:justify-between ez:gap-3">
      <h2 className={sectionTitle}>{title}</h2>
      {href && (
        <NextLink href={href} className={cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1 ez:text-site-lead ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}>
          {CLASS_TITLE.more}
          <Icon name="next" size="sm" />
        </NextLink>
      )}
    </div>
  );
}

function when(v: SessionView): string {
  return v.day && !v.date.includes(v.day) ? `${v.date} ${v.day}` : v.date;
}

export function Header({ name, logoUrl, nav, links }: ClassHeaderProps) {
  const account = cn("ez:inline-flex ez:min-h-10 ez:items-center ez:gap-1.5 ez:text-site-lead ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing);
  return (
    <header data-slot="site-header" data-variant="showroom" className="ez:bg-transparent">
      <div className="ez:mx-auto ez:grid ez:min-h-16 ez:max-w-wrap ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-6 ez:px-page ez:lg:min-h-19 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <NextLink href="/" className={cn("ez:min-w-0 ez:justify-self-start ez:text-site-heading ez:font-normal ez:tracking-tight ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:justify-center ez:gap-6.5 ez:overflow-hidden ez:whitespace-nowrap ez:max-lg:hidden">
          <ClassNavLinks items={[nav.classes, ...nav.anchors]} className={cn("ez:text-site-lead ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)} currentClassName="ez:font-medium ez:text-fg" />
        </nav>
        <div className="ez:flex ez:items-center ez:justify-self-end ez:gap-4 ez:md:gap-6">
          <NextLink href={links.orders.href} aria-label={links.orders.label} className={account}>
            <Icon name="calendar" className="ez:text-muted" />
            <span className="ez:max-sm:hidden">{links.orders.label}</span>
          </NextLink>
          <NextLink href={links.account.href} aria-label={links.account.label} className={account}>
            <Icon name="user" className="ez:text-muted" />
            <span className="ez:max-sm:hidden">{links.account.label}</span>
          </NextLink>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:grid ez:content-start ez:gap-4">
      <span className="ez:text-site-small ez:font-normal ez:text-muted">{title}</span>
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

export function Footer({ storeName, phone, hours, legal, classes, guide, account, terms }: ClassFooterProps) {
  return (
    <footer data-slot="site-footer" data-variant="showroom">
      <div className="ez:rounded-t-lg ez:bg-surface-alt ez:text-fg">
        <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-14 ez:pb-10 ez:md:pt-16 ez:md:pb-14">
          <div className="ez:grid ez:grid-cols-2 ez:gap-x-8 ez:gap-y-10 ez:md:grid-cols-3 ez:lg:grid-cols-[4fr_3fr_3fr_3fr_3fr]">
            <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-4 ez:md:col-span-3 ez:lg:col-span-1">
              <span className="ez:text-site-small ez:font-normal ez:text-muted">{CLASS_TITLE.center}</span>
              <div className="ez:grid ez:gap-1.5">
                {phone ? (
                  <a href={`tel:${phone}`} className={cn("ez:justify-self-start ez:text-site-section ez:font-normal ez:tracking-tight ez:text-fg ez:tabular-nums ez:no-underline", focusRing)}>
                    {phone}
                  </a>
                ) : (
                  <span className="ez:text-site-section">
                    <Bar size="long" />
                  </span>
                )}
                {hours && <span className="ez:text-site-lead ez:text-muted">{hours}</span>}
              </div>
            </div>
            <FooterColumn title={CLASS_TITLE.classes} items={classes} />
            <FooterColumn title="안내" items={guide} />
            <FooterColumn title="계정" items={account} />
            {terms.length > 0 && <FooterColumn title="약관" items={terms} />}
          </div>
          <div className="ez:mt-12 ez:flex ez:flex-col ez:gap-3 ez:text-site-small ez:leading-relaxed ez:text-muted ez:md:mt-14 ez:md:flex-row ez:md:justify-between ez:md:gap-10">
            <p className="ez:m-0">{legal}</p>
            <p className="ez:m-0 ez:shrink-0">© {storeName}</p>
          </div>
          <p
            aria-hidden="true"
            className="ez:m-0 ez:mt-10 ez:truncate ez:text-center ez:text-site-name ez:leading-none ez:font-normal ez:tracking-tighter ez:text-site-faint ez:md:mt-12 ez:md:text-site-display-lg ez:lg:text-site-hero"
          >
            {storeName}
          </p>
        </div>
      </div>
    </footer>
  );
}

const nextTile = "ez:grid ez:grid-cols-[3fr_2fr] ez:items-stretch ez:gap-5 ez:rounded-lg ez:bg-surface-alt ez:p-4 ez:md:gap-6 ez:md:p-5";

function NextTile({ session }: { session: Session }) {
  const v = sessionView(session);
  return (
    <NextLink href={v.href} className={cn(nextTile, "ez:group ez:text-fg ez:no-underline", focusRing)}>
      <Photo src={v.image} alt={v.name} sizes="(max-width: 1024px) 60vw, 280px" className="ez:aspect-square ez:self-start ez:rounded-sm ez:bg-surface" />
      <span className="ez:flex ez:min-w-0 ez:flex-col ez:pt-1.5">
        <span className="ez:text-site-small ez:text-muted">{CLASS_TITLE.nextCohort}</span>
        <span className="ez:mt-2.5 ez:text-site-heading ez:font-normal ez:tracking-tight ez:tabular-nums">
          {when(v)} {v.time}
        </span>
        <span className="ez:mt-2 ez:line-clamp-2 ez:text-site-item ez:font-normal">{v.name}</span>
        {v.seats && <span className={cn("ez:mt-1 ez:text-site-lead ez:tabular-nums", v.few ? "ez:font-medium ez:text-fg" : "ez:text-muted")}>{v.seats}</span>}
        <span className="ez:mt-auto ez:inline-flex ez:items-center ez:gap-2 ez:pt-4 ez:text-site-lead ez:font-normal ez:group-hover:underline ez:underline-offset-4">
          {CLASS_TITLE.book}
          <Icon name="right" size="sm" />
        </span>
      </span>
    </NextLink>
  );
}

function BlankNextTile() {
  return (
    <div className={nextTile}>
      <Photo src={null} alt="" className="ez:aspect-square ez:self-start ez:rounded-sm ez:bg-surface" />
      <span className="ez:grid ez:content-start ez:gap-3 ez:pt-1.5">
        <span className="ez:text-site-small ez:text-muted">{CLASS_TITLE.nextCohort}</span>
        <span className="ez:text-site-heading">
          <Bar />
        </span>
        <span className="ez:text-site-item">
          <Bar size="long" />
        </span>
      </span>
    </div>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const sub = title ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const blank = !title && !image;
  const session = blank ? null : (data.sessions ?? []).find((s) => s.status !== "full") ?? null;
  const side = blank || session !== null;
  const banner = title && data.href && data.href !== CLASSES_HREF ? data.href : null;
  const photo = <Photo src={image} alt={title ?? ""} preload sizes="(max-width: 1024px) 100vw, 800px" tone={0} className="ez:aspect-[4/3] ez:h-full ez:rounded-lg ez:lg:aspect-auto" />;
  return (
    <section
      data-slot="hero"
      data-variant="showroom"
      data-blank={blank ? "" : undefined}
      className="ez:grid ez:grid-cols-1 ez:gap-3 ez:text-fg ez:md:grid-cols-2 ez:md:gap-4 ez:lg:min-h-148 ez:lg:grid-cols-[13fr_8fr] ez:lg:grid-rows-[67fr_77fr]"
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
      <div className={cn("ez:flex ez:min-h-0 ez:min-w-0 ez:flex-col ez:gap-6 ez:rounded-lg ez:bg-surface-alt ez:p-7 ez:md:px-10 ez:md:pt-9 ez:md:pb-8", !side && "ez:md:col-span-2 ez:lg:col-span-1 ez:lg:row-span-2")}>
        <div className="ez:grid ez:gap-3.5">
          {context.storeName ? (
            <p className="ez:m-0 ez:text-site-name ez:leading-none ez:font-normal ez:tracking-tight ez:break-keep ez:text-fg ez:lg:text-site-display-md">{context.storeName}</p>
          ) : (
            <span className="ez:text-site-name ez:lg:text-site-display-md">
              <Bar size="long" strong />
            </span>
          )}
          {title ? (
            <div className="ez:grid ez:gap-1.5">
              <h1 className="ez:m-0 ez:text-site-item ez:font-normal ez:text-balance ez:text-fg">{title}</h1>
              {sub && (
                <p data-slot="hero-sub" className="ez:m-0 ez:text-site-lead ez:text-muted">
                  {sub}
                </p>
              )}
            </div>
          ) : (
            blank && (
              <span className="ez:text-site-item">
                <Bar size="long" />
              </span>
            )
          )}
        </div>
        <div className="ez:mt-auto">
          {blank ? (
            <span className="ez:text-site-lead">
              <Bar size="short" />
            </span>
          ) : (
            <NextLink href={CLASSES_HREF} className={moreLink}>
              {CLASS_TITLE.view}
              <Icon name="right" size="sm" />
            </NextLink>
          )}
        </div>
      </div>
      {blank ? <BlankNextTile /> : session && <NextTile session={session} />}
    </section>
  );
}

function ClassTile({ item, eager }: { item: ClassCard; eager?: boolean }) {
  const spec = [item.length && `${CLASS_TITLE.length} ${item.length}`, item.capacity != null && `${CLASS_TITLE.capacity} ${item.capacity}명`].filter(Boolean).join(" · ");
  const next = item.next ? (item.left === 0 ? `${item.next} · ${CLASS_TITLE.full}` : item.next) : null;
  const label = [item.kind, item.sample && "예시"].filter(Boolean).join(" · ");
  return (
    <NextLink href={item.href ?? `/products/${item.id}`} data-slot="class-card" data-sample={item.sample ? "" : undefined} className={cn("ez:group ez:flex ez:min-w-0 ez:flex-col ez:text-fg ez:no-underline", focusRing)}>
      <div className="ez:rounded-md ez:bg-surface-alt ez:p-3 ez:md:p-4.5">
        <Photo src={item.image} alt={item.name} preload={eager} sizes={CARD_SIZES} className="ez:aspect-[4/3] ez:rounded-sm ez:bg-surface" />
      </div>
      <div className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-3 ez:gap-y-0.5 ez:px-1 ez:pt-3.5">
        <span className="ez:truncate ez:text-site-lead ez:font-normal ez:group-hover:underline ez:underline-offset-4">{item.name}</span>
        {label ? <span className="ez:justify-self-end ez:text-site-small ez:text-muted">{label}</span> : <span />}
        {spec && <span className="ez:col-span-2 ez:text-site-lead ez:text-muted ez:tabular-nums">{spec}</span>}
        {item.price ? <span className="ez:mt-1.5 ez:text-site-lead ez:tabular-nums">{item.price}</span> : <span />}
        {next && <span className="ez:mt-1.5 ez:min-w-0 ez:justify-self-end ez:truncate ez:text-site-small ez:text-muted ez:tabular-nums">{next}</span>}
      </div>
    </NextLink>
  );
}

function BlankClassTile({ className }: { className?: string }) {
  return (
    <div className={cn("ez:flex ez:min-w-0 ez:flex-col", className)}>
      <div className="ez:rounded-md ez:bg-surface-alt ez:p-3 ez:md:p-4.5">
        <Photo src={null} alt="" className="ez:aspect-[4/3] ez:rounded-sm ez:bg-surface" />
      </div>
      <div className="ez:grid ez:gap-2 ez:px-1 ez:pt-3.5 ez:text-site-lead">
        <Bar />
        <Bar size="short" />
        <BlankPrice className="ez:font-normal ez:text-muted" />
      </div>
    </div>
  );
}

const gridThree = "ez:grid ez:grid-cols-2 ez:gap-x-3 ez:gap-y-8 ez:md:gap-x-4 ez:md:gap-y-10 ez:lg:grid-cols-3";

const shelfRow = "ez:-mx-1.5 ez:flex ez:flex-wrap ez:justify-center ez:gap-y-8 ez:md:-mx-2 ez:md:gap-y-9";

const shelfItem = cn(ROW_ITEM[3], "ez:px-1.5 ez:md:px-2");

export function Classes({ data }: SectionProps<"class_list">) {
  const items = (data.classes ?? []).slice(0, 3);
  if (!items.length) {
    return (
      <section data-slot="class-list" id="classes" data-blank="" className="ez:grid ez:gap-7 ez:text-fg">
        <Head title={CLASS_TITLE.classes} />
        <div className="ez:grid ez:grid-cols-2 ez:gap-x-3 ez:gap-y-8 ez:md:grid-cols-3 ez:md:gap-x-4">
          {[0, 1, 2].map((i) => (
            <BlankClassTile key={i} className={lastOdd(i, 3, 3)} />
          ))}
        </div>
      </section>
    );
  }
  return (
    <section data-slot="class-list" id="classes" className="ez:grid ez:gap-7 ez:text-fg">
      <Head title={CLASS_TITLE.classes} href={CLASSES_HREF} />
      <div className={shelfRow}>
        {items.map((c, i) => (
          <div key={c.id} className={cn(shelfItem, lastOdd(i, items.length, 3))}>
            <ClassTile item={c} />
          </div>
        ))}
      </div>
    </section>
  );
}

const rowBase =
  "ez:grid ez:min-h-19 ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-x-4 ez:gap-y-1 ez:rounded-md ez:px-5 ez:py-3 ez:lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)_minmax(0,4fr)_minmax(0,4fr)_minmax(0,4fr)] ez:lg:gap-4";

const colLeft = "ez:col-start-1 ez:lg:col-start-auto";

const colRight = "ez:col-start-2 ez:justify-self-end ez:lg:col-start-auto";

function SessionRow({ session }: { session: Session }) {
  const v = sessionView(session);
  const tone = v.full ? "ez:text-muted" : "ez:text-fg";
  return (
    <li data-slot="session-row" data-full={v.full ? "" : undefined} className={cn(rowBase, v.full ? "ez:border ez:border-solid ez:border-site-line ez:bg-transparent" : "ez:bg-surface")}>
      <span className={cn(colLeft, "ez:grid ez:gap-0.5")}>
        <span className={cn("ez:text-site-lead ez:font-normal ez:tabular-nums", tone)}>{when(v)}</span>
        <span className="ez:text-site-small ez:text-muted ez:tabular-nums">{v.time}</span>
      </span>
      <span className={cn(colLeft, "ez:grid ez:min-w-0 ez:gap-0.5")}>
        <span className={cn("ez:truncate ez:text-site-lead ez:font-normal", tone)}>{v.name}</span>
        {(v.kind || v.length || v.count) && <span className="ez:truncate ez:text-site-small ez:text-muted">{[v.kind, v.length && `${CLASS_TITLE.length} ${v.length}`, v.count].filter(Boolean).join(" · ")}</span>}
      </span>
      <span className={cn(colLeft, "ez:text-site-lead ez:tabular-nums", v.few ? "ez:font-medium ez:text-fg" : "ez:text-muted")}>{v.seats}</span>
      <span className={cn(colRight, "ez:row-start-1 ez:text-site-lead ez:tabular-nums ez:lg:row-start-auto", tone)}>{v.price}</span>
      {v.full ? (
        <span className={cn(colRight, "ez:row-start-3 ez:lg:row-start-auto")} />
      ) : (
        <NextLink
          href={v.href}
          aria-label={`${v.name} ${when(v)} ${v.time} ${CLASS_TITLE.book}`}
          className={cn(colRight, "ez:row-start-3 ez:inline-flex ez:items-center ez:gap-1 ez:text-site-lead ez:font-normal ez:whitespace-nowrap ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4 ez:lg:row-start-auto", focusRing)}
        >
          {CLASS_TITLE.book}
          <Icon name="next" size="sm" />
        </NextLink>
      )}
    </li>
  );
}

function BlankSessionRow() {
  return (
    <li className={cn(rowBase, "ez:bg-surface")}>
      <span className={cn(colLeft, "ez:text-site-lead")}>
        <Bar size="short" />
      </span>
      <span className={cn(colLeft, "ez:text-site-lead")}>
        <Bar />
      </span>
      <span className={cn(colLeft, "ez:text-site-lead")}>
        <Bar size="short" />
      </span>
      <BlankPrice className={cn(colRight, "ez:row-start-1 ez:text-site-lead ez:font-normal ez:text-muted ez:lg:row-start-auto")} />
      <span className={cn(colRight, "ez:row-start-3 ez:lg:row-start-auto")} />
    </li>
  );
}

export function Schedule({ data }: SectionProps<"class_schedule">) {
  const all = data.sessions ?? [];
  const sessions = all.slice(0, 5);
  const empty = !sessions.length;
  const lead = all.find((s) => s.status !== "full")?.image ?? null;
  const image = all.find((s) => s.image && s.image !== lead)?.image ?? null;
  const photo = empty || image !== null;
  return (
    <section
      data-slot="class-schedule"
      data-variant="showroom"
      id="schedule"
      data-blank={empty ? "" : undefined}
      className={cn("ez:grid ez:grid-cols-1 ez:gap-3 ez:text-fg ez:lg:gap-4", photo && "ez:lg:grid-cols-[5fr_7fr]")}
    >
      {photo && <Photo src={image} alt="" sizes="(max-width: 1024px) 100vw, 540px" tone={1} className="ez:aspect-[4/3] ez:h-full ez:rounded-lg ez:max-lg:hidden ez:lg:aspect-auto ez:lg:min-h-150" />}
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:rounded-lg ez:bg-surface-alt ez:p-5 ez:md:p-9">
        <h2 className={cn(sectionTitle, "ez:px-1")}>{CLASS_TITLE.open}</h2>
        <ul className="ez:m-0 ez:mt-6 ez:grid ez:list-none ez:gap-2 ez:p-0">
          {empty ? [0, 1, 2, 3, 4].map((i) => <BlankSessionRow key={i} />) : sessions.map((s) => <SessionRow key={s.id} session={s} />)}
        </ul>
        <div className="ez:mt-auto ez:px-1 ez:pt-8">
          {empty ? (
            <span className="ez:text-site-lead">
              <Bar size="short" />
            </span>
          ) : (
            <NextLink href={SCHEDULE_HREF} className={moreLink}>
              {CLASS_TITLE.scheduleAll}
              <Icon name="right" size="sm" />
            </NextLink>
          )}
        </div>
      </div>
    </section>
  );
}

const reviewCard = "ez:flex ez:min-h-58 ez:min-w-0 ez:flex-col ez:rounded-md ez:bg-surface-alt ez:p-6 ez:md:p-7";

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  if (!items.length) {
    return (
      <section data-slot="reviews" id="reviews" data-blank="" className="ez:grid ez:gap-7 ez:text-fg">
        <Head title={CLASS_TITLE.reviews} />
        <div className="ez:grid ez:grid-cols-1 ez:gap-3 ez:md:grid-cols-3 ez:md:gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className={reviewCard}>
              <BlankStars />
              <Lines className="ez:mt-5 ez:text-site-lead" />
              <span className="ez:mt-auto ez:pt-6 ez:text-site-small">
                <Bar size="short" />
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section data-slot="reviews" id="reviews" className="ez:grid ez:gap-7 ez:text-fg">
      <Head title={CLASS_TITLE.reviews} />
      <div className={cn("ez:grid ez:grid-cols-1 ez:gap-3 ez:md:gap-4", fillCols(items.length))}>
        {items.map((item, i) => {
          const name = item.product ? context.products.find((p) => p.id === item.product)?.name : null;
          return (
            <article key={`${item.name}-${i}`} className={reviewCard}>
              <StarRow rating={item.rating} className="ez:text-muted" />
              <p className="ez:m-0 ez:mt-4.5 ez:line-clamp-4 ez:text-site-lead ez:leading-relaxed ez:text-fg">{item.body}</p>
              {name && <span className="ez:mt-1 ez:truncate ez:text-site-lead ez:text-muted">{name}</span>}
              <div className="ez:mt-auto ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:pt-6 ez:text-site-small ez:text-muted">
                <span className="ez:truncate">{item.name}</span>
                {item.date && <span className="ez:shrink-0 ez:tabular-nums">{item.date}</span>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

type GuideCell = { icon: IconName; label: string; value: string | null; href?: string | null; external?: boolean };

const guideCell = "ez:flex ez:min-h-26 ez:min-w-0 ez:items-center ez:gap-3.5 ez:rounded-md ez:bg-surface-alt ez:px-6 ez:py-4 ez:text-fg ez:no-underline ez:md:px-7";

function GuideBody({ cell }: { cell: GuideCell }) {
  return (
    <>
      <Icon name={cell.icon} className="ez:text-muted" />
      <span className="ez:grid ez:min-w-0 ez:gap-0.5">
        <span className="ez:text-site-lead ez:font-normal">{cell.label}</span>
        {cell.value ? (
          <span className="ez:line-clamp-2 ez:text-site-small ez:text-muted">{cell.value}</span>
        ) : (
          <span className="ez:text-site-small">
            <Bar />
          </span>
        )}
      </span>
    </>
  );
}

function GuideItem({ cell }: { cell: GuideCell }) {
  if (!cell.href) {
    return (
      <div className={guideCell}>
        <GuideBody cell={cell} />
      </div>
    );
  }
  const cls = cn(guideCell, "ez:hover:underline ez:underline-offset-4", focusRing);
  return cell.external ? (
    <a href={cell.href} className={cls}>
      <GuideBody cell={cell} />
    </a>
  ) : (
    <NextLink href={cell.href} className={cls}>
      <GuideBody cell={cell} />
    </NextLink>
  );
}

const placeTile = "ez:flex ez:min-h-54 ez:items-center ez:justify-center ez:rounded-lg ez:bg-surface-alt ez:text-muted ez:lg:min-h-85";

export function Location({ data }: SectionProps<"location">) {
  const address = data.address?.trim() || null;
  const blank = !address;
  const phone = blank ? null : data.phone?.trim() || null;
  const hours = blank ? null : data.hours?.trim() || null;
  const map = address ? data.href || mapHref(address) : null;
  const pin = <Icon name="pin" className="ez:size-11" />;
  const center = [phone, hours].filter(Boolean).join(" · ") || null;
  const cells: GuideCell[] = [
    { icon: "calendar", label: CLASS_TITLE.cancel, value: blank ? null : data.cancel?.trim() || null, href: blank ? null : data.returns },
    { icon: "phone", label: CLASS_TITLE.center, value: center, href: phone ? `tel:${phone}` : null, external: true },
  ];
  const rows: [string, ReactNode][] = [
    [CLASS_TITLE.hours, hours],
    [CLASS_TITLE.phone, phone && <a href={`tel:${phone}`} className={cn("ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing)}>{phone}</a>],
  ];
  return (
    <section data-slot="location" id="location" data-blank={blank ? "" : undefined} className="ez:grid ez:gap-3 ez:text-fg ez:md:gap-4">
      <div className="ez:grid ez:grid-cols-1 ez:gap-3 ez:md:grid-cols-2 ez:md:gap-4 ez:lg:grid-cols-[13fr_8fr]">
        {map ? (
          <a href={map} target="_blank" rel="noopener noreferrer" aria-label={MAP_LABEL} className={cn(placeTile, "ez:relative ez:overflow-hidden ez:text-fg", focusRing)}>
            <SampleMap />
            <span className="ez:relative">{pin}</span>
          </a>
        ) : (
          <div className={placeTile}>{pin}</div>
        )}
        <div className="ez:flex ez:min-w-0 ez:flex-col ez:gap-7 ez:rounded-lg ez:bg-surface-alt ez:p-7 ez:md:px-10 ez:md:py-9">
          <div className="ez:grid ez:gap-5">
            <h2 className={sectionTitle}>{CLASS_TITLE.location}</h2>
            <p className="ez:m-0 ez:text-site-item ez:font-normal ez:break-keep ez:text-fg">{address ?? <Bar size="long" />}</p>
          </div>
          <div className="ez:mt-auto ez:grid ez:gap-5">
            <dl className="ez:m-0 ez:grid ez:grid-cols-[auto_minmax(0,1fr)] ez:gap-x-4 ez:gap-y-2 ez:text-site-lead">
              {rows.map(([label, value]) => (
                <div key={label} className="ez:contents">
                  <dt className="ez:text-muted">{label}</dt>
                  <dd className="ez:m-0 ez:text-fg ez:tabular-nums">{value || <Bar />}</dd>
                </div>
              ))}
            </dl>
            {map && (
              <a href={map} target="_blank" rel="noopener noreferrer" className={moreLink}>
                {CLASS_TITLE.map}
                <Icon name="right" size="sm" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="ez:grid ez:grid-cols-1 ez:gap-3 ez:sm:grid-cols-2 ez:md:gap-4">
        {cells.map((cell) => (
          <GuideItem key={cell.label} cell={cell} />
        ))}
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
        <summary className={cn("ez:flex ez:min-h-10 ez:cursor-pointer ez:list-none ez:items-center ez:gap-1.5 ez:text-site-lead ez:text-fg ez:[&::-webkit-details-marker]:hidden", focusRing)}>
          {current.label}
          <Icon name="down" size="sm" className="ez:text-muted ez:transition-transform ez:group-open:rotate-180" />
        </summary>
        <ul className="ez:absolute ez:right-0 ez:z-10 ez:m-0 ez:mt-1 ez:grid ez:min-w-40 ez:list-none ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-2">
          {sorts.map((s) => (
            <li key={s.href}>
              <NextLink
                href={s.href}
                aria-current={s.on ? "true" : undefined}
                className={cn("ez:flex ez:min-h-10 ez:items-center ez:rounded-sm ez:px-3 ez:text-site-lead ez:no-underline ez:hover:bg-surface-alt", s.on ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}
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
    <div data-slot="class-catalog" data-view={view} className="ez:grid ez:grid-cols-1 ez:text-fg">
      <Crumbs items={crumbs} />
      <div className="ez:mt-4 ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1">
        <h1 className="ez:m-0 ez:text-site-page-sm ez:font-normal ez:tracking-tight ez:text-fg ez:md:text-site-figure-lg">{title}</h1>
        {count ? <span className="ez:text-site-item ez:font-normal ez:text-muted ez:tabular-nums">{count}</span> : null}
      </div>
      {search && <div className="ez:mt-6">{search}</div>}
      <div className="ez:mt-8 ez:flex ez:items-center ez:justify-between ez:gap-6">
        <nav aria-label="카테고리" className="ez:-mx-page ez:flex ez:min-w-0 ez:gap-6 ez:overflow-x-auto ez:px-page ez:whitespace-nowrap ez:md:mx-0 ez:md:gap-8 ez:md:px-0">
          {tabs.map((t) => (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={cn("ez:inline-flex ez:shrink-0 ez:items-baseline ez:gap-1.5 ez:py-2 ez:text-site-lead ez:no-underline ez:hover:text-fg", t.on ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}
            >
              {t.label}
              {t.count != null && <span className="ez:text-site-small ez:font-normal ez:text-muted ez:tabular-nums">{t.count}</span>}
            </NextLink>
          ))}
        </nav>
        <SortMenu sorts={sorts} />
      </div>
      <div className="ez:mt-8">
        {empty ? (
          <EmptyState title={schedule ? "예정된 일정이 없어요" : "등록된 클래스가 없어요"}>
            {emptyHref && (
              <NextLink href={emptyHref} className={moreLink}>
                {CLASS_TITLE.all}
                <Icon name="right" size="sm" />
              </NextLink>
            )}
          </EmptyState>
        ) : schedule ? (
          <ul className="ez:m-0 ez:grid ez:list-none ez:gap-2 ez:p-0">
            {sessions.map((s) => (
              <SessionRow key={s.id} session={s} />
            ))}
          </ul>
        ) : (
          <div className={gridThree}>
            {classes.map((c, i) => (
              <ClassTile key={c.id} item={c} eager={i < 3} />
            ))}
          </div>
        )}
      </div>
      <div className="ez:mt-14 ez:flex ez:justify-center">
        <NextLink
          href={schedule ? links.classes : links.schedule}
          className={cn("ez:inline-flex ez:h-13 ez:items-center ez:gap-2 ez:rounded-sm ez:bg-surface-alt ez:px-8 ez:text-site-lead ez:font-medium ez:text-fg ez:no-underline", focusRing)}
        >
          {schedule ? CLASS_TITLE.all : CLASS_TITLE.scheduleAll}
          <Icon name="right" size="sm" />
        </NextLink>
      </div>
    </div>
  );
}
