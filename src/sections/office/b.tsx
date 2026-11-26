import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Icon } from "../../components/icon";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Lines, Pic } from "../kit";
import { visitRows } from "../landing/parts";
import { LANDING_LABEL, menuItems, paragraphs, telHref } from "../landing/shared";
import type { PlaceLink } from "../template/data";
import { OfficeNavLinks } from "./nav";
import { OFFICE_ID, OFFICE_TITLE } from "./shared";
import type { OfficeFooterProps, OfficeHeaderProps } from "./types";

const HOME = {
  header:
    "ez:lg:[.ez-root:has([data-slot=site-renderer])_&]:sticky ez:lg:[.ez-root:has([data-slot=site-renderer])_&]:top-0 ez:lg:[.ez-root:has([data-slot=site-renderer])_&]:z-10 ez:lg:[.ez-root:has([data-slot=site-renderer])_&]:h-0",
  hide: "ez:lg:[.ez-root:has([data-slot=site-renderer])_&]:hidden",
  show: "ez:lg:[.ez-root:has([data-slot=site-renderer])_&]:block",
  column: "ez:lg:[.ez-root:has([data-slot=site-renderer])_&]:w-2/3",
} as const;

const row = "ez:border-0 ez:border-solid ez:border-site-line";

const rule = "ez:border-0 ez:border-solid ez:border-site-off";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:px-page";

const frame = "ez:grid ez:gap-8 ez:text-fg ez:lg:w-2/3 ez:lg:gap-12";

const title = "ez:m-0 ez:font-display ez:text-site-page-sm ez:text-fg ez:lg:text-site-name";

const quiet = cn("ez:text-fg ez:no-underline ez:underline-offset-4 ez:hover:underline", focusRing);

const outline = cn(
  "ez:inline-flex ez:h-10 ez:items-center ez:justify-center ez:whitespace-nowrap ez:border ez:border-solid ez:border-site-edge ez:px-6 ez:text-site-small ez:text-fg ez:no-underline ez:hover:border-site-off",
  focusRing,
);

function Head({ children, as: Tag = "h2" }: { children: ReactNode; as?: "h2" | "h3" }) {
  return (
    <div className={cn(rule, "ez:border-t ez:pt-8 ez:lg:pt-12")}>
      <Tag className={title}>{children}</Tag>
    </div>
  );
}

function Out({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className ?? quiet}>
      {children}
    </a>
  );
}

function LinkRow({ links, className }: { links: PlaceLink[]; className?: string }) {
  if (!links.length) return null;
  return (
    <ul className={cn("ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-x-4 ez:gap-y-1 ez:p-0", className)}>
      {links.map((l) => (
        <li key={l.key}>
          <Out href={l.href}>{l.label}</Out>
        </li>
      ))}
    </ul>
  );
}

export function Header({ name, logoUrl, phone, address, nav, links }: OfficeHeaderProps) {
  const contact = nav.find((n) => n.href === `/#${OFFICE_ID.company}`);
  return (
    <header data-slot="site-header" data-variant="catalog" className={cn("ez:text-fg", HOME.header)}>
      <div className={cn(row, "ez:border-b ez:bg-surface", HOME.hide)}>
        <div className={cn(wrap, "ez:flex ez:min-h-16 ez:items-center ez:gap-6")}>
          <NextLink href="/" className={cn("ez:min-w-0 ez:font-display ez:text-site-counter ez:text-fg ez:no-underline", focusRing)}>
            <SiteLogo name={name} src={logoUrl} />
          </NextLink>
          <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:flex-1 ez:flex-wrap ez:gap-x-8 ez:text-site-body ez:max-lg:hidden">
            <OfficeNavLinks items={nav} className={cn("ez:whitespace-nowrap", quiet)} />
          </nav>
          <div className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-6 ez:text-site-body">
            <LinkRow links={links} className="ez:gap-x-6 ez:max-md:hidden" />
            {phone && (
              <a href={telHref(phone)} className={cn("ez:whitespace-nowrap ez:tabular-nums", quiet)}>
                {phone}
              </a>
            )}
          </div>
        </div>
      </div>
      <div className={cn("ez:hidden ez:h-0", wrap, HOME.show)}>
        <aside className="ez:ml-auto ez:flex ez:h-screen ez:w-1/3 ez:flex-col ez:overflow-y-auto ez:py-8 ez:pl-gutter">
          <NextLink href="/" className={cn("ez:min-w-0 ez:font-display ez:text-site-name ez:text-fg ez:no-underline", focusRing)}>
            {logoUrl ? <SiteLogo name={name} src={logoUrl} /> : name}
          </NextLink>
          {nav.length > 0 && (
            <nav aria-label="홈 메뉴" className={cn(rule, "ez:mt-24 ez:grid ez:justify-items-start ez:border-t ez:pt-4 ez:pb-16 ez:text-site-counter ez:leading-relaxed")}>
              <OfficeNavLinks items={nav} className={quiet} />
            </nav>
          )}
          {contact && (
            <div className={cn(rule, "ez:border-t ez:pt-4")}>
              <NextLink
                href={contact.href}
                className={cn(
                  "ez:flex ez:h-12 ez:items-center ez:justify-between ez:border ez:border-solid ez:border-site-edge ez:bg-transparent ez:px-4 ez:text-site-body ez:text-fg ez:no-underline ez:hover:border-site-off",
                  focusRing,
                )}
              >
                {LANDING_LABEL.consult}
                <Icon name="right" size="sm" />
              </NextLink>
            </div>
          )}
          {(phone || address || links.length > 0) && (
            <div className="ez:mt-auto ez:grid ez:gap-1 ez:pt-8 ez:text-site-small">
              {address && <p className="ez:m-0 ez:text-muted">{address}</p>}
              {phone && (
                <a href={telHref(phone)} className={cn("ez:justify-self-start ez:tabular-nums", quiet)}>
                  {phone}
                </a>
              )}
              <LinkRow links={links} />
            </div>
          )}
        </aside>
      </div>
    </header>
  );
}

export function Footer({ phone, hours, address, business, links, terms }: OfficeFooterProps) {
  const contact = [address, phone, hours && `${OFFICE_TITLE.hours} ${hours}`].filter((v): v is string => Boolean(v));
  const line = "ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-x-4 ez:gap-y-1 ez:p-0";
  return (
    <footer data-slot="site-footer" data-variant="catalog" className="ez:text-fg">
      <div className={wrap}>
        <div className={cn(row, "ez:grid ez:gap-3 ez:border-t ez:pt-4 ez:pb-12 ez:text-site-small", HOME.column)}>
          {contact.length > 0 && (
            <ul className={line}>
              {contact.map((c) => (
                <li key={c} className="ez:tabular-nums">
                  {c}
                </li>
              ))}
            </ul>
          )}
          {business.length > 0 && (
            <ul aria-label={OFFICE_TITLE.business} className={cn(line, "ez:text-muted")}>
              {business.map((r) => (
                <li key={r.label}>{`${r.label} ${r.value}`}</li>
              ))}
            </ul>
          )}
          <div className="ez:flex ez:flex-wrap ez:items-center ez:justify-between ez:gap-x-6 ez:gap-y-2">
            <LinkRow links={links} />
            {terms.length > 0 && (
              <nav aria-label={OFFICE_TITLE.terms} className="ez:flex ez:flex-wrap ez:gap-x-4 ez:gap-y-1">
                {terms.map((t) => (
                  <NextLink key={t.href} href={t.href} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", t.strong && "ez:font-medium ez:text-fg", focusRing)}>
                    {t.label}
                  </NextLink>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const head = data.title?.trim();
  const sub = data.sub?.trim();
  const line = "ez:m-0 ez:whitespace-pre-line ez:font-display ez:text-site-page-sm ez:text-fg ez:lg:text-site-page";
  return (
    <section
      data-slot="hero"
      data-blank={head || data.image ? undefined : ""}
      data-flush=""
      className="ez:-mx-page ez:grid ez:grid-cols-[var(--ezd-pad)_minmax(0,1fr)_var(--ezd-pad)] ez:text-fg ez:lg:mr-0 ez:lg:grid-cols-[var(--ezd-pad)_minmax(0,2fr)_minmax(0,1fr)]"
    >
      <Pic src={data.image} ratio={1} className="ez:col-span-full ez:row-start-1 ez:lg:col-start-1 ez:lg:col-end-3" />
      <div className="ez:relative ez:col-start-2 ez:row-start-1 ez:grid ez:gap-4 ez:self-start ez:pt-10 ez:lg:w-3/4 ez:lg:pt-40">
        {head ? <h1 className={line}>{head}</h1> : context.storeName ? <p className={line}>{context.storeName}</p> : <Bar className="ez:text-site-page-sm ez:lg:text-site-page" />}
        {head && sub && (
          <p data-slot="hero-sub" className="ez:m-0 ez:text-site-body ez:text-fg">
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}

export function Intro({ data }: SectionProps<"intro">) {
  const text = paragraphs(data.body);
  return (
    <section data-slot="intro" id={OFFICE_ID.intro} data-blank={text.length ? undefined : ""} className={frame}>
      <Head>{OFFICE_TITLE.intro}</Head>
      <div className="ez:grid ez:gap-6 ez:lg:w-3/4 ez:lg:gap-8">
        {text.length ? (
          text.map((p, i) => (
            <p key={i} className="ez:m-0 ez:whitespace-pre-line ez:text-site-body ez:font-normal ez:leading-relaxed ez:text-fg ez:lg:text-site-counter">
              {p}
            </p>
          ))
        ) : (
          <>
            <Lines />
            <Lines />
          </>
        )}
      </div>
    </section>
  );
}

const serviceRow = cn(row, "ez:grid ez:grid-cols-4 ez:items-start ez:gap-x-gutter ez:gap-y-2 ez:border-b ez:py-8 ez:first:pt-0 ez:md:grid-cols-8 ez:lg:py-12");

const serviceNo = "ez:text-site-page-sm ez:tabular-nums ez:md:text-site-page";

const serviceName = "ez:col-span-3 ez:m-0 ez:text-site-heading";

const servicePrice = "ez:col-span-3 ez:col-start-2 ez:m-0 ez:tabular-nums ez:md:col-span-4 ez:md:col-start-5 ez:md:row-start-1";

export function Services({ data }: SectionProps<"menu">) {
  const items = menuItems((data.groups ?? []).filter((g) => g.items.length));
  return (
    <section data-slot="menu" id={OFFICE_ID.services} data-blank={items.length ? undefined : ""} className={frame}>
      <Head>{OFFICE_TITLE.services}</Head>
      <ul className="ez:m-0 ez:list-none ez:p-0">
        {items.length
          ? items.map((m, i) => (
              <li key={m.id} className={serviceRow}>
                <span className={serviceNo}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={serviceName}>{m.name}</h3>
                {m.price && <p className={servicePrice}>{m.price}</p>}
              </li>
            ))
          : [0, 1, 2].map((i) => (
              <li key={i} aria-hidden="true" className={serviceRow}>
                <Bar size="short" className={serviceNo} />
                <span className={serviceName}>
                  <Bar />
                </span>
                <span className={servicePrice}>
                  <Bar size="short" />
                </span>
              </li>
            ))}
      </ul>
    </section>
  );
}

type Pair = { key: string; label: ReactNode; value: ReactNode };

function Pairs({ rows }: { rows: Pair[] }) {
  return (
    <dl className="ez:m-0 ez:grid ez:md:grid-cols-2 ez:md:gap-x-gutter">
      {rows.map((r) => (
        <div key={r.key} className={cn(row, "ez:grid ez:grid-cols-4 ez:gap-x-gutter ez:border-b ez:py-4 ez:first:border-t ez:md:nth-2:border-t")}>
          <dt className="ez:font-normal ez:text-fg">{r.label}</dt>
          <dd className="ez:col-span-3 ez:m-0 ez:min-w-0 ez:text-fg">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Rows({ rows }: { rows: Pair[] }) {
  return (
    <dl className={cn(row, "ez:m-0 ez:grid ez:border-t")}>
      {rows.map((r) => (
        <div key={r.key} className={cn(row, "ez:grid ez:grid-cols-4 ez:gap-x-gutter ez:border-b ez:py-4 ez:md:grid-cols-8")}>
          <dt className="ez:font-normal ez:text-fg">{r.label}</dt>
          <dd className="ez:col-span-3 ez:m-0 ez:min-w-0 ez:text-fg ez:md:col-span-7">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const BLANK_PAIRS: Pair[] = [0, 1, 2, 3].map((i) => ({ key: `blank-${i}`, label: <Bar size="short" />, value: <Bar /> }));

export function Company({ data }: SectionProps<"store_info">) {
  const company = data.company ?? [];
  const links = data.links ?? [];
  const pairs: Pair[] = company.length ? company.map((r) => ({ key: r.label, label: r.label, value: r.value })) : BLANK_PAIRS;
  const visit = visitRows(data).map((r) => ({ key: r.label, label: r.label, value: r.value }));
  const acts = Boolean(data.phone || data.href || links.length);
  return (
    <section data-slot="store-info" id={OFFICE_ID.company} data-blank={data.address || company.length ? undefined : ""} className="ez:grid ez:gap-section ez:text-fg ez:lg:w-2/3">
      <div className="ez:grid ez:gap-8 ez:lg:gap-12">
        <Head>{OFFICE_TITLE.company}</Head>
        <Pairs rows={pairs} />
      </div>
      <div className="ez:grid ez:gap-8 ez:lg:gap-12">
        <Head as="h3">{OFFICE_TITLE.contact}</Head>
        <div className="ez:grid ez:gap-4">
          <Pic src={data.image} ratio={2} />
          <Rows rows={visit} />
        </div>
        {acts && (
          <div className="ez:flex ez:flex-wrap ez:gap-2">
            {data.phone && (
              <a href={telHref(data.phone)} className={outline}>
                {OFFICE_TITLE.call}
              </a>
            )}
            {data.href && (
              <Out href={data.href} className={outline}>
                {OFFICE_TITLE.directions}
              </Out>
            )}
            {links.map((l) => (
              <Out key={l.key} href={l.href} className={outline}>
                {l.label}
              </Out>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
