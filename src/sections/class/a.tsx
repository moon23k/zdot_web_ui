import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { EmptyState } from "../../components/empty-state";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { StarRow } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing, textLink } from "../../utils/styles";
import { Bar, BlankPrice, BlankStars, Lines } from "../kit";
import { ROW_ITEM } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import type { ClassCard, Session } from "../template/data";
import { ClassNavLinks } from "./nav";
import { CLASS_TITLE, CLASSES_HREF, SCHEDULE_HREF, sessionView } from "./shared";
import type { ClassFooterProps, ClassHeaderProps, ClassListProps } from "./types";

const bleed = "ez:mx-[calc(50%-50vw)]";

const line = "ez:border-0 ez:border-solid ez:border-site-line";

const link = cn(textLink, "ez:font-normal ez:text-site-body");

const body = "ez:mt-8 ez:lg:mt-14";

const row = "ez:-mx-3 ez:flex ez:flex-wrap ez:justify-center ez:gap-y-12 ez:lg:gap-y-16";

const cell = cn(ROW_ITEM[3], "ez:px-3");

function Head({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "center" | "start" }) {
  return (
    <div className={cn("ez:grid ez:gap-3.5", align === "center" ? "ez:justify-items-center ez:text-center" : "ez:justify-items-start")}>
      <span aria-hidden="true" className="ez:text-site-small ez:uppercase ez:tracking-widest ez:text-muted">
        {eyebrow}
      </span>
      <h2 className="ez:m-0 ez:font-display ez:text-site-heading ez:font-normal ez:leading-snug ez:lg:text-site-title">{title}</h2>
    </div>
  );
}

function Foot({ href, label = CLASS_TITLE.more }: { href: string; label?: string }) {
  return (
    <div className="ez:mt-12 ez:flex ez:justify-center ez:lg:mt-16">
      <NextLink href={href} className={cn(link, focusRing)}>
        {label}
      </NextLink>
    </div>
  );
}

function spec(c: ClassCard): string {
  return [c.length && `${CLASS_TITLE.length} ${c.length}`, c.capacity != null && `${CLASS_TITLE.capacity} ${c.capacity}명`].filter(Boolean).join(" · ");
}

function Card({ c, preload }: { c: ClassCard; preload?: boolean }) {
  const detail = spec(c);
  return (
    <NextLink href={c.href ?? CLASSES_HREF} data-slot="class-card" className={cn("ez:group ez:grid ez:min-w-0 ez:content-start ez:text-fg ez:no-underline", focusRing)}>
      <Photo src={c.image} alt={c.name} preload={preload} sizes="(max-width: 768px) 50vw, 440px" className="ez:aspect-[4/5]" />
      <span className="ez:grid ez:justify-items-center ez:pt-5 ez:text-center ez:lg:pt-6">
        <span className="ez:mb-3 ez:block ez:h-4 ez:text-site-small ez:leading-none ez:tracking-widest ez:text-muted">{c.kind ?? ""}</span>
        <span className="ez:line-clamp-2 ez:text-site-item ez:font-medium ez:underline-offset-4 ez:group-hover:underline">{c.name}</span>
        {detail && <span className="ez:mt-1.5 ez:text-site-body ez:text-muted">{detail}</span>}
        {c.price && <span className="ez:mt-1 ez:text-site-body ez:tabular-nums">{c.price}</span>}
        {c.next && <span className="ez:mt-2.5 ez:text-site-body ez:text-muted">{c.next}</span>}
      </span>
    </NextLink>
  );
}

function BlankCard({ tone }: { tone: number }) {
  return (
    <div className="ez:grid ez:min-w-0 ez:content-start">
      <Photo src={null} alt="" tone={tone} className="ez:aspect-[4/5]" />
      <span className="ez:grid ez:justify-items-center ez:gap-2 ez:pt-5 ez:text-center ez:lg:pt-6">
        <span className="ez:mt-7 ez:text-site-item">
          <Bar />
        </span>
        <span className="ez:text-site-body">
          <Bar size="short" />
        </span>
        <BlankPrice className="ez:font-normal ez:text-site-body" />
      </span>
    </div>
  );
}

function SessionRow({ s }: { s: Session }) {
  const v = sessionView(s);
  const meta = [v.kind, v.length].filter(Boolean).join(" · ");
  const seats = (
    <span className={cn("ez:text-site-body", v.few && !v.full ? "ez:font-semibold ez:text-fg" : "ez:text-muted")}>{v.seats}</span>
  );
  return (
    <li
      data-slot="session-row"
      data-full={v.full || undefined}
      className={cn(
        line,
        "ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-x-4 ez:gap-y-1.5 ez:border-b ez:px-2 ez:py-5 ez:text-site-body ez:lg:grid-cols-[15fr_11fr_56fr_15fr_14fr_11fr] ez:lg:gap-6 ez:lg:py-6.5",
        v.full ? "ez:text-muted" : "ez:text-fg",
      )}
    >
      <span className="ez:col-span-2 ez:flex ez:items-baseline ez:gap-2.5 ez:lg:col-span-1">
        <span className="ez:text-site-item ez:font-normal ez:leading-none ez:tabular-nums ez:lg:text-site-rank">{v.date}</span>
        {v.day && <span className="ez:text-site-body ez:text-muted">{v.day}</span>}
        <span className="ez:tabular-nums ez:lg:hidden">{v.time}</span>
      </span>
      <span className="ez:tabular-nums ez:max-lg:hidden">{v.time}</span>
      <span className="ez:grid ez:min-w-0 ez:gap-1">
        <span className={cn("ez:text-site-item", !v.full && "ez:font-medium")}>{v.name}</span>
        {meta && <span className="ez:text-site-note ez:text-muted">{meta}</span>}
        {v.seats && <span className="ez:lg:hidden">{seats}</span>}
      </span>
      <span className="ez:max-lg:hidden">{seats}</span>
      <span className="ez:flex ez:flex-col ez:items-end ez:gap-1.5 ez:lg:contents">
        <span className="ez:text-right ez:tabular-nums">{v.price}</span>
        <span className="ez:text-right">
          {!v.full && (
            <NextLink href={v.href} aria-label={`${v.name} ${v.date} ${v.time} ${CLASS_TITLE.book}`} className={cn(link, focusRing)}>
              {CLASS_TITLE.book}
            </NextLink>
          )}
        </span>
      </span>
    </li>
  );
}

function BlankRow() {
  return (
    <li className={cn(line, "ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-x-4 ez:gap-y-1.5 ez:border-b ez:px-2 ez:py-5 ez:lg:grid-cols-[15fr_11fr_56fr_15fr_14fr_11fr] ez:lg:gap-6 ez:lg:py-6.5")}>
      <span className="ez:col-span-2 ez:text-site-rank ez:lg:col-span-1">
        <Bar size="short" />
      </span>
      <span className="ez:max-lg:hidden">
        <Bar size="short" />
      </span>
      <span className="ez:grid ez:gap-1.5 ez:text-site-item">
        <Bar />
        <span className="ez:text-site-note">
          <Bar size="short" />
        </span>
      </span>
      <span className="ez:max-lg:hidden">
        <Bar size="short" />
      </span>
      <span className="ez:text-right">
        <BlankPrice className="ez:font-normal" />
      </span>
      <span className="ez:max-lg:hidden" />
    </li>
  );
}

function Rows({ sessions }: { sessions: Session[] }) {
  return (
    <ul className={cn(line, "ez:m-0 ez:list-none ez:border-t ez:p-0")}>
      {sessions.length ? sessions.map((s) => <SessionRow key={s.id} s={s} />) : [0, 1, 2].map((i) => <BlankRow key={i} />)}
    </ul>
  );
}

export function Header({ name, logoUrl, nav, links }: ClassHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="float" className="ez:bg-surface">
      <div className={cn(line, "ez:border-b")}>
        <div className="ez:mx-auto ez:grid ez:min-h-16 ez:max-w-wrap ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-6 ez:px-page ez:lg:min-h-22 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:gap-8 ez:overflow-hidden ez:whitespace-nowrap ez:text-site-body ez:max-lg:hidden">
            <ClassNavLinks items={[nav.classes, ...nav.anchors]} className="ez:py-1.5 ez:text-fg ez:no-underline" currentClassName="ez:font-medium" />
          </nav>
          <NextLink
            href="/"
            className={cn(
              "ez:min-w-0 ez:font-display ez:text-site-heading ez:font-medium ez:leading-none ez:tracking-wide ez:text-fg ez:no-underline ez:lg:justify-self-center ez:lg:text-center ez:lg:text-site-logo",
              focusRing,
            )}
          >
            <SiteLogo name={name} src={logoUrl} />
          </NextLink>
          <div className="ez:flex ez:items-center ez:justify-end ez:gap-3 ez:whitespace-nowrap ez:lg:gap-4">
            <NextLink href={links.orders.href} className={cn("ez:py-1.5 ez:text-site-body ez:text-fg ez:no-underline", focusRing)}>
              {links.orders.label}
            </NextLink>
            <NextLink href={links.account.href} aria-label={links.account.label} className={cn("ez:inline-flex ez:size-11 ez:items-center ez:justify-center ez:text-fg ez:no-underline", focusRing)}>
              <Icon name="user" size="lg" />
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
      {over && <span aria-hidden="true" className="ez:absolute ez:inset-x-0 ez:top-0 ez:h-32 ez:bg-linear-to-b ez:from-surface/85 ez:to-transparent ez:lg:h-50" />}
      {title && over && <span aria-hidden="true" className="ez:absolute ez:inset-x-0 ez:bottom-0 ez:h-3/5 ez:bg-linear-to-t ez:from-surface/90 ez:via-surface/60 ez:to-transparent" />}
      {title && (
        <div className="ez:absolute ez:inset-x-0 ez:bottom-12 ez:mx-auto ez:max-w-wrap ez:px-page ez:lg:bottom-37.5">
          <div className="ez:flex ez:flex-col ez:items-start ez:gap-5 ez:text-fg ez:lg:gap-7">
            <h1 className="ez:m-0 ez:max-w-4xl ez:font-display ez:text-site-page ez:font-normal ez:leading-none ez:text-balance ez:lg:text-site-display-lg">{title}</h1>
            {sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:max-w-xl ez:text-site-body">
                {sub}
              </p>
            )}
            <NextLink href={data.href ?? CLASSES_HREF} className={cn(link, focusRing)}>
              {CLASS_TITLE.view}
            </NextLink>
          </div>
        </div>
      )}
    </section>
  );
}

export function Classes({ data }: SectionProps<"class_list">) {
  const classes = (data.classes ?? []).slice(0, 3);
  return (
    <section data-slot="class-list" id="classes" data-blank={classes.length ? undefined : ""} className="ez:grid ez:text-fg">
      <Head eyebrow="Classes" title={CLASS_TITLE.classes} />
      <div className={cn(body, row)}>
        {classes.length
          ? classes.map((c) => (
              <div key={c.id} className={cell}>
                <Card c={c} />
              </div>
            ))
          : [0, 1, 2].map((i) => (
              <div key={i} className={cell}>
                <BlankCard tone={i} />
              </div>
            ))}
      </div>
      {classes.length > 0 && <Foot href={CLASSES_HREF} />}
    </section>
  );
}

export function Studio({ data, context }: SectionProps<"photo_band">) {
  const image = data.images?.[1] ?? data.image ?? data.images?.[0] ?? null;
  const name = context.storeName?.trim() || null;
  return (
    <section data-slot="photo-band" data-blank={image ? undefined : ""} data-bleed="" className={cn("ez:grid ez:bg-surface-alt ez:text-fg ez:lg:grid-cols-2", bleed)}>
      <Photo src={image} alt="" sizes="(max-width: 1024px) 100vw, 50vw" tone={1} className="ez:aspect-[4/5] ez:rounded-none ez:lg:aspect-auto ez:lg:h-225" />
      <div className="ez:flex ez:flex-col ez:items-start ez:justify-center ez:gap-6 ez:px-page ez:py-14 ez:lg:gap-7 ez:lg:px-30 ez:lg:py-20">
        <span aria-hidden="true" className="ez:text-site-small ez:uppercase ez:tracking-widest ez:text-muted">
          Studio
        </span>
        {image && name ? (
          <p className="ez:m-0 ez:font-display ez:text-site-name ez:font-normal ez:leading-tight ez:wrap-break-word ez:lg:text-site-page">{name}</p>
        ) : (
          <span className="ez:w-full ez:max-w-100 ez:text-site-name">
            <Bar size="long" strong block />
          </span>
        )}
        {image && (
          <NextLink href={CLASSES_HREF} className={cn(link, focusRing, "ez:mt-2")}>
            {CLASS_TITLE.view}
          </NextLink>
        )}
      </div>
    </section>
  );
}

export function Schedule({ data }: SectionProps<"class_schedule">) {
  const sessions = (data.sessions ?? []).slice(0, 6);
  return (
    <section data-slot="class-schedule" id="schedule" data-blank={sessions.length ? undefined : ""} className="ez:grid ez:text-fg">
      <Head eyebrow="Schedule" title={CLASS_TITLE.schedule} />
      <div className={body}>
        <Rows sessions={sessions} />
      </div>
      {sessions.length > 0 && <Foot href={SCHEDULE_HREF} label={CLASS_TITLE.scheduleAll} />}
    </section>
  );
}

export function Story({ data, context }: SectionProps<"testimonial">) {
  const first = data.items?.[0];
  const quote = data.quote?.trim();
  const review = quote
    ? { body: quote, name: data.name ?? null, rating: null, product: null }
    : first
      ? { body: first.body, name: first.name, rating: first.rating, product: first.product ?? null }
      : null;
  const course = review?.product ? context.products.find((p) => p.id === review.product)?.name : undefined;
  const who = [review?.name, course].filter(Boolean).join(" · ");
  return (
    <section data-slot="testimonial" id="reviews" data-blank={review ? undefined : ""} data-bleed="" className={cn("ez:bg-surface-alt ez:px-page ez:py-18 ez:text-center ez:text-fg ez:lg:py-30", bleed)}>
      <h2 className="ez:sr-only">{CLASS_TITLE.reviews}</h2>
      {review ? (
        <figure className="ez:m-0 ez:mx-auto ez:grid ez:max-w-215 ez:justify-items-center ez:gap-6 ez:lg:gap-8">
          {review.rating != null && <StarRow rating={review.rating} className="ez:gap-1.5 ez:text-muted" />}
          <blockquote className="ez:m-0 ez:line-clamp-5 ez:font-display ez:text-site-heading ez:font-normal ez:leading-snug ez:text-balance ez:lg:text-site-name">{review.body}</blockquote>
          {who && <figcaption className="ez:text-site-body ez:text-muted">{who}</figcaption>}
        </figure>
      ) : (
        <div aria-hidden="true" className="ez:mx-auto ez:grid ez:max-w-150 ez:justify-items-center ez:gap-6 ez:lg:gap-8">
          <BlankStars />
          <Lines strong className="ez:justify-items-center ez:text-site-figure-lg" />
          <span className="ez:text-site-body">
            <Bar size="short" />
          </span>
        </div>
      )}
    </section>
  );
}

export function Location({ data }: SectionProps<"location">) {
  const address = data.address?.trim() || null;
  const map = "ez:flex ez:h-75 ez:w-full ez:items-center ez:justify-center ez:bg-surface-alt ez:text-muted ez:lg:h-130";
  const pin = <Icon name="pin" className="ez:size-9" />;
  const rows: [string, ReactNode][] = address
    ? [
        [CLASS_TITLE.address, address],
        ...(data.hours ? [[CLASS_TITLE.hours, data.hours] as [string, ReactNode]] : []),
        ...(data.phone
          ? [
              [
                CLASS_TITLE.phone,
                <a key="tel" href={`tel:${data.phone}`} className={cn("ez:text-fg ez:no-underline ez:tabular-nums ez:underline-offset-4 ez:hover:underline", focusRing)}>
                  {data.phone}
                </a>,
              ] as [string, ReactNode],
            ]
          : []),
      ]
    : [
        [CLASS_TITLE.address, <Bar key="a" size="long" />],
        [CLASS_TITLE.hours, <Bar key="h" />],
        [CLASS_TITLE.phone, <Bar key="p" />],
      ];
  return (
    <section data-slot="location" id="location" data-blank={address ? undefined : ""} className="ez:grid ez:items-start ez:gap-x-gutter ez:gap-y-10 ez:text-fg ez:lg:grid-cols-2">
      {address && data.href ? (
        <a href={data.href} target="_blank" rel="noopener" aria-label={CLASS_TITLE.map} className={cn(map, "ez:no-underline", focusRing)}>
          {pin}
        </a>
      ) : (
        <div className={map}>{pin}</div>
      )}
      <div className="ez:grid ez:content-start ez:gap-10 ez:lg:gap-12 ez:lg:pt-6 ez:lg:pl-18">
        <Head eyebrow="Visit" title={CLASS_TITLE.location} align="start" />
        <dl className="ez:m-0 ez:grid ez:grid-cols-[auto_minmax(0,1fr)] ez:gap-x-10 ez:gap-y-5.5">
          {rows.map(([label, value]) => (
            <div key={label} className="ez:contents">
              <dt className="ez:text-site-body ez:text-muted">{label}</dt>
              <dd className="ez:m-0 ez:text-site-body ez:leading-relaxed">{value}</dd>
            </div>
          ))}
        </dl>
        {address && data.href && (
          <div>
            <a href={data.href} target="_blank" rel="noopener" className={cn(link, focusRing)}>
              {CLASS_TITLE.map}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function FooterNav({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:grid ez:content-start ez:gap-4 ez:lg:gap-5">
      <span className="ez:text-site-note ez:text-muted">{title}</span>
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

export function Footer({ storeName, phone, hours, legal, classes, guide, account, terms }: ClassFooterProps) {
  return (
    <footer data-slot="site-footer" data-variant="editorial" className={cn(line, "ez:border-t ez:text-fg")}>
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-16 ez:pb-10 ez:lg:pt-28 ez:lg:pb-14">
        <p className="ez:m-0 ez:mb-12 ez:font-display ez:text-site-name ez:font-normal ez:leading-none ez:wrap-break-word ez:md:text-site-display ez:lg:mb-22 ez:lg:text-site-hero">{storeName}</p>
        <div className="ez:grid ez:grid-cols-2 ez:gap-x-gutter ez:gap-y-10 ez:pb-12 ez:md:grid-cols-[7fr_5fr_5fr_5fr] ez:lg:pb-18">
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-4 ez:md:col-span-1 ez:lg:gap-5">
            <span className="ez:text-site-note ez:text-muted">{CLASS_TITLE.center}</span>
            {(phone || hours) && (
              <div className="ez:grid ez:gap-2.5">
                {phone && (
                  <a href={`tel:${phone}`} className={cn("ez:font-display ez:text-site-counter ez:leading-tight ez:text-fg ez:no-underline ez:tabular-nums ez:lg:text-site-name", focusRing)}>
                    {phone}
                  </a>
                )}
                {hours && <span className="ez:text-site-body ez:text-muted">{hours}</span>}
              </div>
            )}
          </div>
          <FooterNav title={CLASS_TITLE.classes} items={classes} />
          <FooterNav title="안내" items={guide} />
          <FooterNav title="내 예약" items={account} />
        </div>
        <div className={cn(line, "ez:grid ez:gap-6 ez:border-t ez:pt-7 ez:md:grid-cols-[minmax(0,1fr)_auto]")}>
          <div className="ez:grid ez:gap-3.5">
            {terms.length > 0 && (
              <nav aria-label="약관" className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2 ez:text-site-body">
                {terms.map((l) => (
                  <NextLink key={l.href} href={l.href} className={cn("ez:text-fg ez:no-underline ez:underline-offset-4 ez:hover:underline", l.strong && "ez:font-medium", focusRing)}>
                    {l.label}
                  </NextLink>
                ))}
              </nav>
            )}
            <p className="ez:m-0 ez:max-w-225 ez:text-site-note ez:leading-relaxed ez:text-muted">{legal}</p>
          </div>
          <span className="ez:text-site-note ez:text-muted">© {storeName}</span>
        </div>
      </div>
    </footer>
  );
}

function Crumbs({ items }: { items: ClassListProps["crumbs"] }) {
  return (
    <nav aria-label="현재 위치" className="ez:flex ez:flex-wrap ez:items-center ez:justify-center ez:gap-x-2.5 ez:text-site-note ez:tracking-wide ez:text-muted">
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

export function List({ view, title, count, crumbs, tabs, sorts, classes, sessions, links, search, emptyHref }: ClassListProps) {
  const schedule = view === "schedule";
  const empty = schedule ? !sessions.length : !classes.length;
  return (
    <div data-slot="class-catalog" data-view={view} className="ez:grid ez:grid-cols-1 ez:text-fg">
      <div className="ez:grid ez:justify-items-center ez:pt-8 ez:text-center ez:lg:pt-18">
        <Crumbs items={crumbs} />
        <h1 className="ez:m-0 ez:mt-5 ez:font-display ez:text-site-page-sm ez:font-normal ez:leading-tight ez:lg:mt-7 ez:lg:text-site-display-md">{title}</h1>
        {search && <div className="ez:mt-8 ez:w-full ez:max-w-130 ez:text-left">{search}</div>}
        {tabs.length > 1 && (
          <nav aria-label={CLASS_TITLE.kinds} className="ez:mt-8 ez:flex ez:flex-wrap ez:justify-center ez:gap-x-10 ez:gap-y-1 ez:text-site-body ez:lg:mt-11">
            {tabs.map((t) => (
              <NextLink
                key={t.href}
                href={t.href}
                aria-current={t.on ? "page" : undefined}
                className={cn("ez:inline-flex ez:min-h-11 ez:items-center ez:gap-1.5 ez:no-underline ez:hover:text-fg", t.on ? "ez:font-semibold ez:text-fg" : "ez:text-muted", focusRing)}
              >
                {t.label}
                {t.count != null && <span className="ez:text-site-small ez:font-normal ez:text-muted ez:tabular-nums">{t.count}</span>}
              </NextLink>
            ))}
          </nav>
        )}
      </div>
      <div className={cn(line, "ez:mt-10 ez:flex ez:flex-wrap ez:items-center ez:justify-between ez:gap-x-6 ez:gap-y-2 ez:border-y ez:py-3 ez:text-site-body ez:lg:mt-16")}>
        {schedule ? (
          <span className="ez:text-muted">
            {CLASS_TITLE.scheduleShort} <b className="ez:font-medium ez:text-fg ez:tabular-nums">{sessions.length}</b>개
          </span>
        ) : count != null ? (
          <span className="ez:text-muted">
            {CLASS_TITLE.classes} <b className="ez:font-medium ez:text-fg ez:tabular-nums">{count}</b>개
          </span>
        ) : (
          <span />
        )}
        {!schedule && sorts.length > 0 && (
          <nav aria-label="정렬" className="ez:flex ez:flex-wrap ez:gap-x-7">
            {sorts.map((s) => (
              <NextLink
                key={s.href}
                href={s.href}
                aria-current={s.on ? "true" : undefined}
                className={cn("ez:inline-flex ez:min-h-11 ez:items-center ez:no-underline ez:hover:text-fg", s.on ? "ez:font-semibold ez:text-fg" : "ez:text-muted", focusRing)}
              >
                {s.label}
              </NextLink>
            ))}
          </nav>
        )}
      </div>
      <div className="ez:mt-10 ez:lg:mt-14">
        {empty ? (
          <EmptyState title={schedule ? "예정된 일정이 없어요" : "등록된 클래스가 없어요"} action={emptyHref ? { label: CLASS_TITLE.all, href: emptyHref } : undefined} />
        ) : schedule ? (
          <Rows sessions={sessions} />
        ) : (
          <div className="ez:grid ez:grid-cols-2 ez:gap-x-gutter ez:gap-y-12 ez:lg:grid-cols-3 ez:lg:gap-y-20">
            {classes.map((c, i) => (
              <Card key={c.id} c={c} preload={i < 3} />
            ))}
          </div>
        )}
      </div>
      <div className="ez:mt-16 ez:mb-8 ez:flex ez:justify-center ez:lg:mt-24 ez:lg:mb-16">
        <NextLink href={schedule ? links.classes : links.schedule} className={cn(link, focusRing)}>
          {schedule ? CLASS_TITLE.all : CLASS_TITLE.scheduleAll}
        </NextLink>
      </div>
    </div>
  );
}
