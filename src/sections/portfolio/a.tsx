import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Lines, Pic } from "../kit";
import { visitRows } from "../landing/parts";
import { caseHref, LANDING_LABEL, paragraphs, telHref } from "../landing/shared";
import type { Case } from "../template/data";
import { PortfolioNavLinks } from "./nav";
import { PORTFOLIO_ID, PORTFOLIO_TITLE } from "./shared";
import type { PortfolioFooterProps, PortfolioHeaderProps } from "./types";
import { scriptOf } from "../../utils/writing";

const rule = "ez:border-0 ez:border-solid ez:border-site-line";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:px-page";

const bleed = "ez:mx-[calc(50%-50vw)]";

const grid = "ez:grid ez:gap-y-10 ez:lg:grid-cols-12 ez:lg:gap-x-gutter";

const label = cn(rule, "ez:m-0 ez:border-b ez:pb-4 ez:text-site-small ez:font-normal ez:text-muted");

const lead = "ez:m-0 ez:font-display ez:text-site-heading ez:leading-snug ez:text-fg ez:lg:text-site-rank";

const name = "ez:m-0 ez:font-display ez:text-site-item ez:font-normal ez:leading-normal ez:text-fg";

const desc = "ez:m-0 ez:text-site-small ez:font-normal ez:text-fg";

const meta = "ez:m-0 ez:text-site-small ez:font-normal ez:text-muted";

const quiet = cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const plain = cn("ez:text-fg ez:no-underline ez:hover:text-muted", focusRing);

const outline = cn(
  "ez:inline-flex ez:h-12 ez:items-center ez:justify-center ez:whitespace-nowrap ez:border ez:border-solid ez:border-site-edge ez:px-6 ez:text-site-small ez:font-normal ez:text-fg ez:no-underline ez:hover:border-site-off",
  focusRing,
);

const out = { target: "_blank", rel: "noopener noreferrer" } as const;

function caseMeta(c: Case): string {
  return [c.category, c.meta].filter((v): v is string => Boolean(v?.trim())).join(" · ");
}

export function Header({ name: storeName, logoUrl, nav, links }: PortfolioHeaderProps) {
  return (
    <header data-slot="site-header" className="ez:bg-surface">
      <div className={cn(wrap, "ez:flex ez:min-h-16 ez:items-center ez:gap-8 ez:lg:min-h-20")}>
        <NextLink data-script={scriptOf(storeName)} href="/" className={cn("ez:min-w-0 ez:font-display ez:text-site-item ez:font-normal ez:leading-none ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={storeName} src={logoUrl} />
        </NextLink>
        {(nav.length > 0 || links.length > 0) && (
          <nav aria-label="주요 메뉴" className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-5 ez:whitespace-nowrap ez:text-site-small ez:font-normal ez:md:gap-8">
            <PortfolioNavLinks items={nav} className={cn(plain, "ez:py-1.5")} />
            {links.map((l) => (
              <a key={l.key} href={l.href} {...out} className={cn(quiet, "ez:py-1.5 ez:max-md:hidden")}>
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const heading = data.title?.trim() || null;
  const sub = heading ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const storeName = context.storeName?.trim() || null;
  return (
    <section data-slot="hero" data-blank={heading || image ? undefined : ""} data-bleed="" data-flush="" className={cn("ez:grid", bleed)}>
      <Photo src={image} alt="" preload sizes="100vw" tone={0} className="ez:aspect-auto ez:h-90 ez:rounded-none ez:md:h-120 ez:lg:h-160" />
      <div className={cn(wrap, grid, "ez:pt-6")}>
        <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-1 ez:lg:col-span-8">
          {heading ? (
            <h1 data-script={scriptOf(heading)} className={lead}>{heading}</h1>
          ) : storeName ? (
            <p data-script={scriptOf(storeName)} className={lead}>{storeName}</p>
          ) : (
            <Bar size="long" className="ez:text-site-heading ez:lg:text-site-rank" />
          )}
          {sub && (
            <p data-slot="hero-sub" className="ez:m-0 ez:text-site-body ez:leading-relaxed ez:text-muted ez:lg:text-site-item">
              {sub}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function WorkItem({ item, index }: { item: Case | null; index: number }) {
  if (!item) {
    return (
      <li className="ez:grid ez:min-w-0 ez:content-start">
        <Pic ratio={1.5} tone={index} />
        <span className="ez:pt-4 ez:text-site-item">
          <Bar size="long" />
        </span>
        <span className="ez:pt-1 ez:text-site-small">
          <Bar size="short" />
        </span>
      </li>
    );
  }
  const line = caseMeta(item);
  const scope = item.scope?.trim();
  return (
    <li className="ez:min-w-0">
      <NextLink href={caseHref(item.id)} className={cn("ez:group ez:grid ez:content-start ez:no-underline", focusRing)}>
        <Pic src={item.image} ratio={1.5} tone={index} />
        <h3 data-script={scriptOf(item.title)} className={cn(name, "ez:pt-4 ez:group-hover:text-muted")}>{item.title}</h3>
        {scope && <p data-script={scriptOf(scope)} className={cn(desc, "ez:pt-1")}>{scope}</p>}
        {line && <p data-script={scriptOf(line)} className={cn(meta, "ez:pt-1")}>{line}</p>}
      </NextLink>
    </li>
  );
}

export function Work({ data }: SectionProps<"case_grid">) {
  const cases = data.cases ?? [];
  const shown: (Case | null)[] = cases.length ? cases : [null, null, null, null];
  return (
    <section data-slot="case-grid" id={PORTFOLIO_ID.work} data-blank={cases.length ? undefined : ""} className="ez:grid ez:gap-8 ez:text-fg">
      <h2 className={label}>{PORTFOLIO_TITLE.work}</h2>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-gutter ez:gap-y-8 ez:p-0 ez:md:grid-cols-2">
        {shown.map((c, i) => (
          <WorkItem key={c ? c.id : i} item={c} index={i} />
        ))}
      </ul>
    </section>
  );
}

export function Intro({ data, context }: SectionProps<"intro">) {
  const body = paragraphs(data.body);
  const storeName = context.storeName?.trim() || null;
  return (
    <section data-slot="intro" id={PORTFOLIO_ID.intro} data-blank={body.length ? undefined : ""} className="ez:grid ez:gap-12 ez:text-fg">
      <h2 className={label}>{PORTFOLIO_TITLE.intro}</h2>
      <div className={grid}>
        <div className="ez:min-w-0 ez:lg:col-span-5">
          {storeName ? <h3 data-script={scriptOf(storeName)} className="ez:m-0 ez:font-display ez:text-site-title ez:text-fg">{storeName}</h3> : <Bar className="ez:text-site-title" />}
        </div>
        <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-6 ez:lg:col-span-5 ez:lg:col-start-7">
          {body.length ? (
            body.map((p, i) => (
              <p data-script={scriptOf(p)} key={i} className="ez:m-0 ez:whitespace-pre-line ez:text-site-body ez:leading-loose ez:text-fg">
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
    </section>
  );
}

export function Contact({ data }: SectionProps<"store_info">) {
  const actions: { key: string; href: string; text: string; external: boolean }[] = [
    ...(data.phone ? [{ key: "call", href: telHref(data.phone), text: LANDING_LABEL.call, external: false }] : []),
    ...(data.href ? [{ key: "directions", href: data.href, text: LANDING_LABEL.directions, external: true }] : []),
    ...(data.links ?? []).map((l) => ({ key: l.key, href: l.href, text: l.label, external: true })),
  ];
  return (
    <section data-slot="store-info" id={PORTFOLIO_ID.contact} data-blank={data.address ? undefined : ""} className="ez:grid ez:gap-12 ez:text-fg">
      <h2 className={label}>{PORTFOLIO_TITLE.contact}</h2>
      <div className={grid}>
        <div className="ez:min-w-0 ez:lg:col-span-5">
          {actions.length > 0 && (
            <div className="ez:flex ez:flex-wrap ez:gap-4">
              {actions.map((a) => (
                <a data-script={scriptOf(a.text)} key={a.key} href={a.href} {...(a.external ? out : {})} className={outline}>
                  {a.text}
                </a>
              ))}
            </div>
          )}
        </div>
        <dl className={cn(rule, "ez:m-0 ez:grid ez:min-w-0 ez:content-start ez:border-t ez:lg:col-span-6 ez:lg:col-start-7")}>
          {visitRows(data).map((r) => (
            <div key={r.label} className={cn(rule, "ez:grid ez:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] ez:items-baseline ez:gap-4 ez:border-b ez:py-4")}>
              <dt className="ez:text-site-small ez:font-normal ez:text-muted">{r.label}</dt>
              <dd className="ez:m-0 ez:min-w-0 ez:text-site-body ez:text-fg">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function FooterItem({ head, children, className }: { head: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("ez:grid ez:min-w-0 ez:content-start ez:gap-1", className)}>
      <p data-script={scriptOf(head)} className="ez:m-0 ez:text-site-small ez:font-normal ez:text-muted">{head}</p>
      {children}
    </div>
  );
}

export function Footer({ phone, hours, address, legal, links, terms }: PortfolioFooterProps) {
  return (
    <footer data-slot="site-footer" className="ez:text-fg">
      <div className={cn(wrap, "ez:py-12")}>
        <div className="ez:grid ez:gap-x-gutter ez:gap-y-6 ez:text-site-small ez:md:grid-cols-2 ez:lg:grid-cols-12">
          {phone && (
            <FooterItem head={LANDING_LABEL.phone} className="ez:lg:col-span-2">
              <a href={telHref(phone)} className={cn(plain, "ez:justify-self-start ez:tabular-nums")}>
                {phone}
              </a>
            </FooterItem>
          )}
          {hours && (
            <FooterItem head={LANDING_LABEL.hours} className="ez:lg:col-span-2">
              <p className="ez:m-0 ez:text-fg">{hours}</p>
            </FooterItem>
          )}
          {address && (
            <FooterItem head={LANDING_LABEL.address} className="ez:lg:col-span-3">
              <p className="ez:m-0 ez:text-fg">{address}</p>
            </FooterItem>
          )}
          {links.length > 0 && (
            <FooterItem head={LANDING_LABEL.links} className="ez:lg:col-span-2">
              <ul className="ez:m-0 ez:grid ez:list-none ez:gap-1 ez:p-0">
                {links.map((l) => (
                  <li key={l.key}>
                    <a href={l.href} {...out} className={plain}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FooterItem>
          )}
        </div>
        <div className="ez:mt-12 ez:grid ez:gap-3 ez:text-site-small ez:text-muted">
          <p className="ez:m-0 ez:max-w-225 ez:leading-relaxed">{legal}</p>
          <nav aria-label={LANDING_LABEL.terms} className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2">
            {terms.map((t) => (
              <NextLink key={t.href} href={t.href} className={cn(quiet, t.strong && "ez:text-fg")}>
                {t.label}
              </NextLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
