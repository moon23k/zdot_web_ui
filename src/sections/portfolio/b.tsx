import NextLink from "next/link";
import { SiteLogo } from "../../blocks/site-header/site-logo";
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

const COLUMN = { no: "번호", name: "이름", category: "분류", area: "지역 · 규모", list: "작업 목록" } as const;

const rule = "ez:border-0 ez:border-solid ez:border-site-line";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:px-page";

const caption = "ez:grid ez:grid-cols-[minmax(0,2.5rem)_minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-4";

const row = "ez:grid ez:grid-cols-6 ez:gap-x-4 ez:md:grid-cols-12 ez:md:gap-x-gutter";

const cell = {
  no: "ez:min-w-0 ez:truncate ez:tabular-nums ez:md:col-span-2",
  name: "ez:col-span-3 ez:min-w-0 ez:truncate ez:md:col-span-4",
  category: "ez:col-span-2 ez:min-w-0 ez:truncate ez:md:col-span-2",
  area: "ez:min-w-0 ez:truncate ez:max-md:hidden ez:md:col-span-4",
};

const heading = "ez:m-0 ez:font-display ez:font-normal ez:text-fg";

const plain = cn("ez:text-fg ez:no-underline ez:hover:text-muted", focusRing);

const quiet = cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const outline = cn(
  "ez:inline-flex ez:h-12 ez:items-center ez:justify-center ez:whitespace-nowrap ez:border ez:border-solid ez:border-site-edge ez:px-6 ez:text-site-body ez:font-medium ez:text-fg ez:no-underline ez:hover:border-site-off",
  focusRing,
);

const out = { target: "_blank", rel: "noopener noreferrer" } as const;

function serial(i: number): string {
  return String(i + 1).padStart(2, "0");
}

export function Header({ name, logoUrl, nav }: PortfolioHeaderProps) {
  const contactHref = `/#${PORTFOLIO_ID.contact}`;
  const lead = nav.filter((n) => n.href !== contactHref);
  const contact = nav.filter((n) => n.href === contactHref);
  return (
    <header data-slot="site-header" className="ez:bg-surface">
      <div className={wrap}>
        <div className={cn(rule, "ez:flex ez:min-h-16 ez:items-center ez:gap-8 ez:border-b ez:py-4 ez:lg:py-6")}>
          <NextLink href="/" className={cn("ez:min-w-0 ez:text-site-item ez:font-normal ez:leading-normal ez:text-fg ez:no-underline", focusRing)}>
            <SiteLogo name={name} src={logoUrl} />
          </NextLink>
          {nav.length > 0 && (
            <nav aria-label="주요 메뉴" className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-4 ez:whitespace-nowrap ez:text-site-body ez:md:gap-8">
              <PortfolioNavLinks items={lead} className={cn(quiet, "ez:py-1")} />
              <PortfolioNavLinks items={contact} className={cn(rule, "ez:border ez:px-4 ez:py-1 ez:text-fg ez:no-underline ez:hover:border-site-edge", focusRing)} />
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

function WorkItem({ item, index }: { item: Case | null; index: number }) {
  const line = cn(rule, caption, "ez:mt-2 ez:border-y ez:py-1.5 ez:text-site-body ez:leading-normal");
  if (!item) {
    return (
      <li className="ez:grid ez:min-w-0 ez:content-start">
        <Pic ratio={1.5} tone={index} />
        <span className={line}>
          <Bar size="short" />
          <Bar />
          <Bar size="short" />
        </span>
      </li>
    );
  }
  return (
    <li className="ez:min-w-0">
      <NextLink href={caseHref(item.id)} className={cn("ez:group ez:grid ez:content-start ez:no-underline", focusRing)}>
        <Pic src={item.image} ratio={1.5} tone={index} />
        <span className={line}>
          <span className="ez:tabular-nums ez:text-muted">{serial(index)}</span>
          <span className="ez:min-w-0 ez:break-keep ez:text-fg ez:group-hover:text-muted">{item.title}</span>
          <span className="ez:whitespace-nowrap ez:text-muted">{item.category}</span>
        </span>
      </NextLink>
    </li>
  );
}

function ListRow({ item, index }: { item: Case | null; index: number }) {
  const line = cn(rule, row, "ez:items-baseline ez:border-b ez:py-3");
  if (!item) {
    return (
      <li className={line}>
        <span className={cell.no}>
          <Bar size="short" />
        </span>
        <span className={cell.name}>
          <Bar size="long" />
        </span>
        <span className={cell.category}>
          <Bar size="short" />
        </span>
        <span className={cell.area}>
          <Bar />
        </span>
      </li>
    );
  }
  return (
    <li>
      <NextLink href={caseHref(item.id)} className={cn(line, "ez:group ez:no-underline", focusRing)}>
        <span className={cn(cell.no, "ez:text-muted")}>{serial(index)}</span>
        <span className={cn(cell.name, "ez:text-fg ez:group-hover:text-muted")}>{item.title}</span>
        <span className={cn(cell.category, "ez:text-fg")}>{item.category}</span>
        <span className={cn(cell.area, "ez:text-muted")}>{item.meta}</span>
      </NextLink>
    </li>
  );
}

export function Work({ data, context }: SectionProps<"case_grid">) {
  const cases = data.cases ?? [];
  const cards: (Case | null)[] = cases.length ? cases : [null, null, null, null];
  const rows: (Case | null)[] = cases.length ? cases : [null, null, null];
  const aside = data.intro !== undefined || data.store_info !== undefined;
  return (
    <section data-slot="case-grid" data-blank={cases.length ? undefined : ""} className="ez:grid ez:gap-y-16 ez:text-fg ez:lg:grid-cols-12 ez:lg:gap-x-gutter">
      <div className={cn("ez:grid ez:min-w-0 ez:content-start ez:gap-16", aside ? "ez:lg:col-span-8" : "ez:lg:col-span-12")}>
        <div id={PORTFOLIO_ID.work} className="ez:grid ez:min-w-0 ez:content-start ez:gap-8">
          <h2 className={cn(heading, "ez:flex ez:items-baseline ez:gap-1 ez:text-site-item")}>
            {PORTFOLIO_TITLE.work}
            {cases.length > 0 && <span className="ez:font-body ez:text-site-small ez:font-normal ez:tabular-nums ez:text-muted">{cases.length}</span>}
          </h2>
          <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-gutter ez:gap-y-12 ez:p-0 ez:md:grid-cols-2">
            {cards.map((c, i) => (
              <WorkItem key={c ? c.id : i} item={c} index={i} />
            ))}
          </ul>
        </div>
        <div className="ez:grid ez:min-w-0 ez:content-start">
          <h3 className={cn(rule, heading, "ez:border-b ez:pb-4 ez:text-site-heading ez:leading-snug")}>{COLUMN.list}</h3>
          <div className={cn(rule, row, "ez:border-b ez:pt-4 ez:pb-3 ez:text-site-small ez:text-muted")}>
            <span className={cell.no}>{COLUMN.no}</span>
            <span className={cell.name}>{COLUMN.name}</span>
            <span className={cell.category}>{COLUMN.category}</span>
            <span className={cell.area}>{COLUMN.area}</span>
          </div>
          <ul className="ez:m-0 ez:grid ez:list-none ez:p-0 ez:text-site-body ez:leading-normal">
            {rows.map((c, i) => (
              <ListRow key={c ? c.id : i} item={c} index={i} />
            ))}
          </ul>
        </div>
      </div>
      {aside && (
        <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-10 ez:max-lg:-order-1 ez:lg:sticky ez:lg:top-8 ez:lg:col-span-4 ez:lg:self-start">
          {data.intro !== undefined && <Intro data={data.intro} context={context} />}
          {data.store_info !== undefined && <Contact data={data.store_info} context={context} />}
        </div>
      )}
    </section>
  );
}

export function Intro({ data }: SectionProps<"intro">) {
  const body = paragraphs(data.body);
  return (
    <section data-slot="intro" id={PORTFOLIO_ID.intro} data-blank={body.length ? undefined : ""} className="ez:grid ez:min-w-0 ez:content-start ez:gap-4 ez:text-fg">
      <h2 className="ez:sr-only">{PORTFOLIO_TITLE.intro}</h2>
      {body.length ? (
        body.map((p, i) => (
          <p key={i} className="ez:m-0 ez:whitespace-pre-line ez:text-site-item ez:font-normal ez:leading-relaxed ez:text-fg">
            {p}
          </p>
        ))
      ) : (
        <>
          <Lines />
          <Lines />
        </>
      )}
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
    <section data-slot="store-info" id={PORTFOLIO_ID.contact} data-blank={data.address ? undefined : ""} className="ez:grid ez:min-w-0 ez:content-start ez:gap-6 ez:text-fg">
      <h2 className="ez:sr-only">{PORTFOLIO_TITLE.contact}</h2>
      <dl className={cn(rule, "ez:m-0 ez:grid ez:border-y ez:py-2")}>
        {visitRows(data).map((r) => (
          <div key={r.label} className="ez:grid ez:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] ez:items-baseline ez:gap-4 ez:py-2 ez:text-site-body">
            <dt className="ez:font-normal ez:text-muted">{r.label}</dt>
            <dd className="ez:m-0 ez:min-w-0 ez:text-fg">{r.value}</dd>
          </div>
        ))}
      </dl>
      {actions.length > 0 && (
        <div className="ez:flex ez:flex-wrap ez:gap-4">
          {actions.map((a) => (
            <a key={a.key} href={a.href} {...(a.external ? out : {})} className={outline}>
              {a.text}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export function Footer({ storeName, phone, hours, address, legal, links, terms }: PortfolioFooterProps) {
  return (
    <footer data-slot="site-footer" className="ez:text-fg">
      <div className={wrap}>
        <div className={cn(rule, "ez:border-t ez:pt-8 ez:pb-12")}>
          <div className="ez:grid ez:gap-x-gutter ez:gap-y-6 ez:text-site-small ez:leading-relaxed ez:md:grid-cols-2 ez:lg:grid-cols-12">
            <p className="ez:m-0 ez:font-normal ez:lg:col-span-4">{storeName}</p>
            {(address || phone || hours) && (
              <div className="ez:grid ez:min-w-0 ez:content-start ez:lg:col-span-3 ez:lg:col-start-6">
                {address && <p className="ez:m-0 ez:text-muted">{address}</p>}
                {phone && (
                  <a href={telHref(phone)} className={cn(plain, "ez:justify-self-start ez:tabular-nums")}>
                    {phone}
                  </a>
                )}
                {hours && <p className="ez:m-0">{`${LANDING_LABEL.hours} ${hours}`}</p>}
              </div>
            )}
            {links.length > 0 && (
              <ul className="ez:m-0 ez:grid ez:min-w-0 ez:list-none ez:content-start ez:p-0 ez:lg:col-span-2 ez:lg:col-start-9">
                {links.map((l) => (
                  <li key={l.key}>
                    <a href={l.href} {...out} className={plain}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <nav aria-label={LANDING_LABEL.terms} className="ez:grid ez:min-w-0 ez:content-start ez:lg:col-span-2 ez:lg:col-start-11 ez:lg:justify-items-end">
              {terms.map((t) => (
                <NextLink key={t.href} href={t.href} className={cn(quiet, t.strong && "ez:text-fg")}>
                  {t.label}
                </NextLink>
              ))}
            </nav>
          </div>
          <p className="ez:m-0 ez:mt-12 ez:max-w-225 ez:text-site-small ez:leading-relaxed ez:text-muted">{legal}</p>
        </div>
      </div>
    </footer>
  );
}
