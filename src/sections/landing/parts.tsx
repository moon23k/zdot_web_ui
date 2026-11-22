import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing, textLink } from "../../utils/styles";
import { Bar, Lines, Pic } from "../kit";
import type { PlaceLink, TemplateSectionData } from "../template/data";
import { LandingNavLinks } from "./nav";
import { caseHref, LANDING_LABEL, menuItems, paragraphs, telHref } from "./shared";
import type { LandingFooterProps, LandingHeaderProps } from "./types";

const rule = "ez:border-0 ez:border-solid ez:border-site-line";

const heading = "ez:m-0 ez:font-display ez:text-site-section ez:font-medium ez:text-fg";

const link = cn(textLink, focusRing);

export function OutLinks({ links, className }: { links: PlaceLink[]; className?: string }) {
  if (!links.length) return null;
  return (
    <ul className={cn("ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-x-6 ez:gap-y-2 ez:p-0", className)}>
      {links.map((l) => (
        <li key={l.key}>
          <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function InfoList({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className={cn(rule, "ez:m-0 ez:grid ez:border-t")}>
      {rows.map((r) => (
        <div key={r.label} className={cn(rule, "ez:grid ez:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] ez:gap-4 ez:border-b ez:py-3.5")}>
          <dt className="ez:font-medium ez:text-fg">{r.label}</dt>
          <dd className="ez:m-0 ez:min-w-0 ez:text-fg">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

type Visit = TemplateSectionData["store_info"] & TemplateSectionData["location"];

export function visitRows(data: Visit): { label: string; value: ReactNode }[] {
  const blank = !data.address;
  return [
    { label: LANDING_LABEL.address, value: data.address ?? <Bar size="long" /> },
    ...(data.hours || blank ? [{ label: LANDING_LABEL.hours, value: data.hours ?? <Bar /> }] : []),
    ...(data.phone || blank
      ? [
          {
            label: LANDING_LABEL.phone,
            value: data.phone ? (
              <a href={telHref(data.phone)} className={cn("ez:text-fg ez:no-underline ez:tabular-nums", focusRing)}>
                {data.phone}
              </a>
            ) : (
              <Bar size="short" />
            ),
          },
        ]
      : []),
  ];
}

export function VisitActions({ data }: { data: Visit }) {
  const links = data.links ?? [];
  if (!data.href && !links.length) return null;
  return (
    <div className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2">
      {data.href && (
        <a href={data.href} target="_blank" rel="noopener noreferrer" className={link}>
          {LANDING_LABEL.directions}
        </a>
      )}
      <OutLinks links={links} />
    </div>
  );
}

export function StandInHeader({ name, logoUrl, phone, nav, links }: LandingHeaderProps) {
  return (
    <header data-slot="site-header" className={cn(rule, "ez:border-b ez:bg-surface")}>
      <div className="ez:mx-auto ez:flex ez:min-h-16 ez:max-w-wrap ez:items-center ez:gap-6 ez:px-page">
        <NextLink href="/" className={cn("ez:min-w-0 ez:text-site-counter ez:font-medium ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:flex-1 ez:flex-wrap ez:gap-x-8 ez:text-site-body ez:max-lg:hidden">
          <LandingNavLinks items={nav} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)} />
        </nav>
        <div className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-6 ez:text-site-body">
          <OutLinks links={links} className="ez:max-md:hidden" />
          {phone && (
            <a href={telHref(phone)} className={cn("ez:text-fg ez:no-underline ez:tabular-nums", focusRing)}>
              {phone}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

export function StandInFooter({ storeName, phone, hours, address, business, links, terms }: LandingFooterProps) {
  return (
    <footer data-slot="site-footer" className={cn(rule, "ez:border-t ez:text-fg")}>
      <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:gap-6 ez:px-page ez:py-12 ez:text-site-note">
        <p className="ez:m-0 ez:text-site-counter ez:font-medium">{storeName}</p>
        <div className="ez:grid ez:gap-1 ez:text-muted">
          {address && <span>{address}</span>}
          {phone && <span className="ez:tabular-nums">{phone}</span>}
          {hours && <span>{`${LANDING_LABEL.hours} ${hours}`}</span>}
        </div>
        <OutLinks links={links} />
        {business.length > 0 && <p className="ez:m-0 ez:text-muted">{business.map((r) => `${r.label} ${r.value}`).join(" · ")}</p>}
        <nav aria-label={LANDING_LABEL.terms} className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2">
          {terms.map((t) => (
            <NextLink key={t.href} href={t.href} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", t.strong && "ez:font-medium ez:text-fg", focusRing)}>
              {t.label}
            </NextLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export function StandInHero({ data, context }: SectionProps<"hero">) {
  const title = data.title?.trim();
  const sub = data.sub?.trim();
  return (
    <section data-slot="hero" data-blank={data.image || title ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg">
      <Pic src={data.image} ratio={1.5} />
      {title ? <h1 className="ez:m-0 ez:font-display ez:text-site-section ez:font-medium">{title}</h1> : context.storeName && <p className="ez:m-0 ez:text-site-section ez:font-medium">{context.storeName}</p>}
      {title && sub && (
        <p data-slot="hero-sub" className="ez:m-0 ez:text-muted">
          {sub}
        </p>
      )}
    </section>
  );
}

export function IntroBlock({ data, title, id }: SectionProps<"intro"> & { title: string; id: string }) {
  const body = paragraphs(data.body);
  return (
    <section data-slot="intro" id={id} data-blank={body.length ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg ez:lg:grid-cols-2 ez:lg:gap-gutter">
      <div className="ez:grid ez:content-start ez:gap-6">
        <h2 className={heading}>{title}</h2>
        <div className="ez:grid ez:max-w-prose ez:gap-4">
          {body.length ? (
            body.map((p, i) => (
              <p key={i} className="ez:m-0 ez:whitespace-pre-line ez:leading-relaxed">
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
      </div>
      <Pic src={data.image} ratio={1.5} />
    </section>
  );
}

export function MenuBlock({ data, title, id }: SectionProps<"menu"> & { title: string; id: string }) {
  const groups = (data.groups ?? []).filter((g) => g.items.length);
  const empty = !menuItems(groups).length;
  return (
    <section data-slot="menu" id={id} data-blank={empty ? "" : undefined} className="ez:grid ez:gap-8 ez:text-fg">
      <h2 className={heading}>{title}</h2>
      {empty ? (
        <dl className={cn(rule, "ez:m-0 ez:border-t")}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn(rule, "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-b ez:py-3.5")}>
              <dt>
                <Bar size="long" />
              </dt>
              <dd className="ez:m-0">
                <Bar size="short" />
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="ez:grid ez:gap-10 ez:md:grid-cols-2 ez:lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.id ?? "all"} className="ez:grid ez:content-start ez:gap-3">
              {g.name && <h3 className="ez:m-0 ez:text-site-item ez:font-medium">{g.name}</h3>}
              <dl className={cn(rule, "ez:m-0 ez:border-t")}>
                {g.items.map((item) => (
                  <div key={item.id} className={cn(rule, "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-b ez:py-3")}>
                    <dt className="ez:min-w-0">{item.name}</dt>
                    <dd className="ez:m-0 ez:shrink-0 ez:tabular-nums">{item.price}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function StoreBlock({ data, title, id }: SectionProps<"store_info"> & { title: string; id: string }) {
  return (
    <section data-slot="store-info" id={id} data-blank={data.address ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg ez:lg:grid-cols-2 ez:lg:gap-gutter">
      <div className="ez:grid ez:content-start ez:gap-6">
        <h2 className={heading}>{title}</h2>
        <InfoList rows={visitRows(data)} />
        {data.company && data.company.length > 0 && <InfoList rows={data.company} />}
        <VisitActions data={data} />
      </div>
      <Pic src={data.image} ratio={1.5} />
    </section>
  );
}

export function LocationBlock({ data, title, id }: SectionProps<"location"> & { title: string; id: string }) {
  return (
    <section data-slot="location" id={id} data-blank={data.address ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg">
      <h2 className={heading}>{title}</h2>
      <InfoList rows={visitRows(data)} />
      <VisitActions data={data} />
    </section>
  );
}


export function CasesBlock({ data, title, id }: SectionProps<"case_grid"> & { title: string; id: string }) {
  const cases = data.cases ?? [];
  return (
    <section data-slot="case-grid" id={id} data-blank={cases.length ? undefined : ""} className="ez:grid ez:gap-8 ez:text-fg">
      <h2 className={heading}>{title}</h2>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-gutter ez:gap-y-10 ez:p-0 ez:md:grid-cols-2 ez:lg:grid-cols-3">
        {cases.length
          ? cases.map((c) => (
              <li key={c.id}>
                <NextLink href={caseHref(c.id)} className={cn("ez:grid ez:gap-3 ez:text-fg ez:no-underline", focusRing)}>
                  <Pic src={c.image} ratio={1.5} />
                  <span className="ez:text-site-item">{c.title}</span>
                  {c.category && <span className="ez:text-site-note ez:text-muted">{c.category}</span>}
                </NextLink>
              </li>
            ))
          : [0, 1, 2].map((i) => (
              <li key={i} className="ez:grid ez:gap-3">
                <Pic ratio={1.5} />
                <Bar size="long" />
              </li>
            ))}
      </ul>
    </section>
  );
}
