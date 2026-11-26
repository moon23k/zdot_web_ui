import NextLink from "next/link";
import { Fragment, type ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Button, ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import { StarRow } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing, textLink } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, BlankStars, Lines, Pic } from "../kit";
import type { Case, QuoteFigures, QuoteStarter, TemplateSectionData } from "../template/data";
import { QuoteNavLinks } from "./nav";
import { average, businessLine, CASES_HREF, caseView, hasFigures, leadCase, QUOTE_CONSENT, QUOTE_HREF, QUOTE_TITLE, restCases, reviewCount } from "./shared";
import { OPTION_GRID, OptionCell, StarterForm, starterState } from "./starter";
import type { CaseFact, CaseView, QuoteFooterProps, QuoteHeaderProps, QuoteListProps } from "./types";
import { scriptOf } from "../../utils/writing";

const rule = "ez:border-0 ez:border-solid ez:border-site-line";

const ruled = cn(rule, "ez:border-t ez:pt-section");

const heading = "ez:m-0 ez:font-display ez:text-site-section ez:text-fg ez:lg:text-site-figure-lg";

const split = "ez:grid ez:gap-8 ez:text-fg ez:lg:grid-cols-[minmax(0,5fr)_minmax(0,10.5fr)] ez:lg:gap-10";

const FACT_LABELS = [QUOTE_TITLE.category, QUOTE_TITLE.area, QUOTE_TITLE.scope];

const FIRST_LINE = new Set(["상호", "대표", "사업자등록번호"]);

function Contact({ phone, hours }: { phone?: string | null; hours?: string | null }) {
  if (!phone && !hours) return null;
  return (
    <dl className="ez:m-0 ez:grid ez:gap-5">
      {phone && (
        <div className="ez:grid ez:gap-1">
          <dt className="ez:text-site-note ez:text-muted">{QUOTE_TITLE.center}</dt>
          <dd className="ez:m-0">
            <a href={`tel:${phone}`} className={cn("ez:text-site-heading ez:text-fg ez:no-underline ez:tabular-nums", focusRing)}>
              {phone}
            </a>
          </dd>
        </div>
      )}
      {hours && (
        <div className="ez:grid ez:gap-1">
          <dt className="ez:text-site-note ez:text-muted">{QUOTE_TITLE.hours}</dt>
          <dd data-script={scriptOf(hours)} className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{hours}</dd>
        </div>
      )}
    </dl>
  );
}

function FactTable({ facts, blank, className }: { facts: CaseFact[]; blank?: boolean; className?: string }) {
  const rows: { label: string; value: ReactNode }[] = blank ? FACT_LABELS.map((label) => ({ label, value: <Bar /> })) : facts;
  if (!rows.length) return null;
  return (
    <dl className={cn(rule, "ez:m-0 ez:border-t ez:self-stretch", className)}>
      {rows.map((r) => (
        <div key={r.label} className={cn(rule, "ez:flex ez:items-baseline ez:gap-4 ez:border-b ez:py-3.5")}>
          <dt className="ez:w-28 ez:shrink-0 ez:text-site-note ez:text-muted">{r.label}</dt>
          <dd className="ez:m-0 ez:min-w-0 ez:text-site-note ez:text-fg ez:tabular-nums">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function FigureCell({ value, label }: { value: ReactNode; label: ReactNode }) {
  return (
    <div className={cn(rule, "ez:grid ez:w-1/2 ez:content-start ez:gap-4 ez:px-6 ez:first:border-l-0 ez:first:pl-0 ez:sm:w-45 ez:border-l")}>
      <span className="ez:text-site-display-md ez:text-fg ez:tabular-nums">{value}</span>
      <span className="ez:text-site-small ez:text-muted ez:tabular-nums">{label}</span>
    </div>
  );
}

function FigureRow({ figures, trust, blank }: { figures?: QuoteFigures; trust?: TemplateSectionData["trust_line"]; blank?: boolean }) {
  const items = trust?.items ?? [];
  const cells: ReactNode[] = [];
  if (blank) {
    cells.push(<FigureCell key="cases" value={<Bar size="short" />} label={<Bar />} />);
    cells.push(<FigureCell key="reviews" value={<Bar size="short" />} label={<Bar />} />);
  } else {
    if (figures && figures.cases > 0) cells.push(<FigureCell key="cases" value={figures.cases} label={QUOTE_TITLE.cases} />);
    if (figures && figures.reviews > 0 && figures.average != null) {
      cells.push(<FigureCell key="reviews" value={average(figures.average)} label={reviewCount(figures.reviews)} />);
    }
  }
  if (trust) {
    const cell = cn(rule, "ez:w-full ez:min-w-0 ez:sm:w-auto ez:sm:flex-1 ez:sm:border-l ez:sm:px-6 ez:first:border-l-0 ez:first:pl-0");
    cells.push(
      items.length ? (
        <ul key="trust" data-slot="trust-line" className={cn("ez:m-0 ez:grid ez:list-none ez:content-start ez:gap-1.5 ez:p-0 ez:text-fg", cell)}>
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      ) : (
        <div key="trust" data-slot="trust-line" data-blank="" className={cn("ez:grid ez:content-start ez:gap-3", cell)}>
          <Bar />
          <Bar size="long" />
          <Bar />
        </div>
      ),
    );
  }
  if (!cells.length) return null;
  return <div className={cn(rule, "ez:flex ez:flex-wrap ez:gap-y-8 ez:border-t ez:pt-7")}>{cells}</div>;
}

function SectionHead({ title, count, more }: { title: string; count?: number; more?: boolean }) {
  return (
    <div className="ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-4">
      <h2 className={heading}>
        {title}
        {count ? <span className="ez:ml-3 ez:font-body ez:text-site-counter ez:text-muted ez:tabular-nums">{count}</span> : null}
      </h2>
      {more && (
        <NextLink href={CASES_HREF} className={cn(textLink, "ez:text-site-body", focusRing)}>
          {QUOTE_TITLE.more}
          <Icon name="right" size="sm" />
        </NextLink>
      )}
    </div>
  );
}

export function Header({ name, logoUrl, phone, nav, links }: QuoteHeaderProps) {
  return (
    <header data-slot="site-header" className={cn(rule, "ez:border-b ez:bg-surface")}>
      <div className="ez:mx-auto ez:flex ez:min-h-16 ez:max-w-wrap ez:items-center ez:gap-6 ez:px-page ez:lg:min-h-18">
        <NextLink data-script={scriptOf(name)} href="/" className={cn("ez:min-w-0 ez:text-site-counter ez:font-normal ez:text-fg ez:no-underline ez:lg:w-60 ez:lg:shrink-0", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:flex-1 ez:flex-wrap ez:gap-x-8 ez:gap-y-1 ez:text-site-body ez:max-lg:hidden">
          <QuoteNavLinks items={nav} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)} currentClassName="ez:font-medium ez:text-fg" />
        </nav>
        <div className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-6 ez:text-site-body">
          {phone && (
            <a href={`tel:${phone}`} className={cn("ez:inline-flex ez:items-center ez:gap-1.5 ez:text-fg ez:no-underline ez:tabular-nums", focusRing)}>
              <Icon name="phone" size="sm" className="ez:sm:hidden" />
              <span className="ez:max-sm:sr-only">{phone}</span>
            </a>
          )}
          <NextLink href={links.lookup.href} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg ez:max-md:hidden", focusRing)}>
            {links.lookup.label}
          </NextLink>
          <ButtonLink href={links.request.href} variant="outline" className="ez:h-10 ez:min-h-0 ez:px-4.5 ez:text-site-body">
            {links.request.label}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const lead = leadCase(data.cases);
  const view = lead ? caseView(lead) : null;
  const image = lead?.image ?? data.image ?? null;
  const title = data.title?.trim() || null;
  const blank = !title && !image;
  const eyebrow = blank ? "" : [title ? context.storeName : null, data.address?.trim()].filter(Boolean).join(" · ");
  const showFigures = blank || hasFigures(data.figures) || Boolean(data.trust_line);
  const photo = <Pic src={image} ratio={13 / 14} />;
  return (
    <section data-slot="hero" data-blank={blank ? "" : undefined} className="ez:grid ez:gap-12 ez:text-fg ez:lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] ez:lg:gap-20">
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:justify-center ez:gap-14 ez:lg:gap-16 ez:lg:pb-18">
        <div className="ez:grid ez:gap-10 ez:lg:gap-11">
          <div className="ez:grid ez:gap-7">
            {eyebrow && <p className="ez:m-0 ez:text-site-small ez:text-muted ez:tabular-nums">{eyebrow}</p>}
            {title ? (
              <div className="ez:grid">
                <h1 data-script={scriptOf(title)} className="ez:m-0 ez:font-display ez:text-site-name ez:text-fg ez:md:text-site-display-sm ez:xl:text-site-display">{title}</h1>
                {data.sub && (
                  <p data-script={scriptOf(data.sub)} data-slot="hero-sub" className="ez:m-0 ez:font-display ez:text-site-name ez:text-muted ez:md:text-site-display-sm ez:xl:text-site-display">
                    {data.sub}
                  </p>
                )}
              </div>
            ) : blank ? (
              <Bar size="long" className="ez:text-site-display" />
            ) : (
              <p data-script={scriptOf(context.storeName)} className="ez:m-0 ez:font-display ez:text-site-name ez:text-fg ez:md:text-site-display-sm ez:xl:text-site-display">{context.storeName}</p>
            )}
          </div>
          {blank ? (
            <BlankButton variant="outline" className="ez:justify-self-start">
              {QUOTE_TITLE.request}
            </BlankButton>
          ) : (
            <div className="ez:flex ez:flex-wrap ez:items-center ez:gap-7">
              <ButtonLink href={QUOTE_HREF} variant="outline" className="ez:h-14 ez:px-7 ez:text-site-item">
                {QUOTE_TITLE.request}
                <Icon name="right" size="sm" />
              </ButtonLink>
              <NextLink href={CASES_HREF} className={cn(textLink, "ez:text-site-body", focusRing)}>
                {QUOTE_TITLE.cases}
              </NextLink>
            </div>
          )}
        </div>
        {showFigures && <FigureRow figures={data.figures} trust={data.trust_line} blank={blank} />}
      </div>
      <div className="ez:grid ez:min-w-0 ez:content-start">
        {view ? (
          <NextLink href={view.href} className={cn("ez:grid ez:gap-4 ez:text-fg ez:no-underline", focusRing)}>
            {photo}
            <span className="ez:grid ez:gap-1">
              <span className="ez:font-normal ez:text-fg">{view.title}</span>
              {view.line && <span data-script={scriptOf(view.line)} className="ez:text-site-small ez:text-muted ez:tabular-nums">{view.line}</span>}
              {view.scope && <span data-script={scriptOf(view.scope)} className="ez:text-site-small ez:text-muted ez:tabular-nums">{view.scope}</span>}
            </span>
          </NextLink>
        ) : (
          photo
        )}
      </div>
    </section>
  );
}

export function Trust({ data }: SectionProps<"trust_line">) {
  const empty = !(data.items ?? []).length && !hasFigures(data.figures);
  return (
    <section data-slot="trust-line" data-blank={empty ? "" : undefined} className="ez:text-fg">
      <FigureRow figures={data.figures} trust={data} />
    </section>
  );
}

function factLine(view: CaseView): string {
  return view.facts.map((f) => f.value).join(" · ");
}

function Record({ c }: { c: Case | null }) {
  const view = c ? caseView(c) : null;
  return (
    <div data-slot="case-item" className="ez:grid ez:gap-8 ez:lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)] ez:lg:gap-16">
      {view ? (
        <NextLink href={view.href} tabIndex={-1} aria-hidden="true" className="ez:block">
          <Pic src={view.image} ratio={3 / 2} />
        </NextLink>
      ) : (
        <Pic ratio={3 / 2} />
      )}
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:items-start ez:gap-7">
        {view ? <h3 data-script={scriptOf(view.title)} className="ez:m-0 ez:font-display ez:text-site-heading ez:text-fg ez:md:text-site-title">{view.title}</h3> : <Bar size="long" className="ez:text-site-heading ez:md:text-site-title" />}
        <FactTable facts={view?.facts ?? []} blank={!view} />
        {view && (
          <NextLink href={view.href} aria-label={`${view.title} ${QUOTE_TITLE.view}`} className={cn(textLink, "ez:mt-auto ez:text-site-body", focusRing)}>
            {QUOTE_TITLE.view}
            <Icon name="right" size="sm" />
          </NextLink>
        )}
      </div>
    </div>
  );
}

function Work({ c }: { c: Case | null }) {
  const view = c ? caseView(c) : null;
  const body = (
    <>
      <Pic src={view?.image} ratio={3 / 2} />
      <div className="ez:mt-5 ez:grid ez:gap-2">
        {view ? <h3 data-script={scriptOf(view.title)} className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg ez:md:text-site-heading">{view.title}</h3> : <Bar className="ez:text-site-item ez:md:text-site-heading" />}
        <span data-script={scriptOf(view ? factLine(view) : null)} className="ez:text-site-small ez:text-muted ez:tabular-nums">{view ? factLine(view) : <Bar size="long" />}</span>
      </div>
    </>
  );
  return view ? (
    <NextLink data-slot="case-item" href={view.href} className={cn("ez:grid ez:content-start ez:text-fg ez:no-underline", focusRing)}>
      {body}
    </NextLink>
  ) : (
    <div data-slot="case-item" className="ez:grid ez:content-start">
      {body}
    </div>
  );
}

export function Cases({ data }: SectionProps<"case_grid">) {
  const all = data.cases ?? [];
  const list = restCases(all);
  const record = list[0] ?? null;
  const works: (Case | null)[] = all.length ? list.slice(1, 5) : [null, null];
  return (
    <section data-slot="case-grid" id="cases" data-blank={all.length ? undefined : ""} className="ez:grid ez:gap-12 ez:text-fg ez:lg:gap-14">
      <SectionHead title={QUOTE_TITLE.cases} count={all.length} more={all.length > 0} />
      <div className="ez:grid">
        <div className={cn(rule, works.length && "ez:border-b ez:pb-14 ez:lg:pb-20")}>
          <Record c={record} />
        </div>
        {works.length > 0 && (
          <div className="ez:grid ez:grid-cols-2 ez:gap-x-4 ez:gap-y-12 ez:pt-14 ez:md:gap-x-10 ez:md:gap-y-16 ez:lg:pt-20">
            {works.map((c, i) => (
              <Work key={c?.id ?? i} c={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Prices({ data }: SectionProps<"price_tiers">) {
  const items = data.items ?? [];
  const row = cn(rule, "ez:grid ez:min-h-19 ez:grid-cols-[minmax(0,1fr)_auto_auto] ez:items-center ez:gap-x-6 ez:border-b ez:py-4");
  return (
    <section data-slot="price-tiers" id="prices" data-blank={items.length ? undefined : ""} className={cn(split, ruled)}>
      <h2 className={heading}>{QUOTE_TITLE.prices}</h2>
      <ul className={cn(rule, "ez:m-0 ez:min-w-0 ez:list-none ez:border-t ez:p-0")}>
        {items.length
          ? items.map((it, i) => (
              <li key={i}>
                <NextLink href={QUOTE_HREF} className={cn(row, "ez:text-fg ez:no-underline", focusRing)}>
                  <span className="ez:min-w-0 ez:text-site-item ez:font-normal ez:md:text-site-counter">{it.label}</span>
                  <span className="ez:text-site-item ez:font-normal ez:whitespace-nowrap ez:tabular-nums">{it.value}</span>
                  <Icon name="right" size="sm" className="ez:text-muted" />
                </NextLink>
              </li>
            ))
          : [0, 1, 2, 3].map((i) => (
              <li key={i} className={row}>
                <Bar />
                <BlankPrice />
                <span className="ez:size-4" />
              </li>
            ))}
      </ul>
    </section>
  );
}

export function Process({ data }: SectionProps<"process_steps">) {
  const steps = data.steps ?? [];
  const shown: (string | null)[] = steps.length ? steps : [null, null, null, null, null];
  return (
    <section data-slot="process-steps" id="process" data-blank={steps.length ? undefined : ""} className={cn(split, ruled)}>
      <h2 className={heading}>{QUOTE_TITLE.process}</h2>
      <ol className={cn(rule, "ez:m-0 ez:min-w-0 ez:list-none ez:border-t ez:p-0")}>
        {shown.map((s, i) => (
          <li key={i} className={cn(rule, "ez:flex ez:min-h-19 ez:items-center ez:border-b ez:py-4")}>
            <span className="ez:w-18 ez:shrink-0 ez:text-site-note ez:text-muted ez:tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span data-script={scriptOf(s)} className="ez:min-w-0 ez:text-site-item ez:font-normal ez:text-fg ez:md:text-site-counter">{s ?? <Bar />}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

const REVIEW_COLS: Record<number, string> = { 1: "", 2: "ez:md:grid-cols-2", 3: "ez:md:grid-cols-3" };

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  const count = data.count ?? 0;
  const shown = items.length ? items : [null, null, null];
  return (
    <section data-slot="reviews" id="reviews" data-blank={items.length ? undefined : ""} className={cn("ez:grid ez:gap-12 ez:text-fg ez:lg:gap-14", ruled)}>
      <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-6">
        <h2 className={heading}>{QUOTE_TITLE.reviews}</h2>
        {items.length > 0 && data.average != null && (
          <div className="ez:flex ez:items-end ez:gap-5">
            <span className="ez:text-site-display-md ez:text-fg ez:tabular-nums">{average(data.average)}</span>
            <span className="ez:grid ez:gap-1.5 ez:pb-1">
              <StarRow rating={data.average} className="ez:text-fg" />
              <span className="ez:text-site-small ez:text-muted ez:tabular-nums">{reviewCount(count)}</span>
            </span>
          </div>
        )}
      </div>
      <ul className={cn(rule, "ez:m-0 ez:grid ez:list-none ez:border-t ez:p-0", REVIEW_COLS[shown.length])}>
        {shown.map((r, i) => {
          const product = r?.product ? context.products.find((p) => p.id === r.product) : undefined;
          return (
            <li
              key={i}
              className={cn(
                rule,
                "ez:grid ez:content-start ez:gap-4 ez:border-b ez:py-7 ez:md:border-b-0 ez:md:border-l ez:md:px-8 ez:md:pt-8 ez:md:pb-2 ez:md:first:border-l-0 ez:md:first:pl-0",
              )}
            >
              {r ? <StarRow rating={r.rating} className="ez:text-fg" /> : <BlankStars />}
              {r ? <p className="ez:m-0 ez:min-h-[2lh] ez:text-pretty ez:text-fg">{r.body}</p> : <Lines />}
              {r && (
                <span className="ez:mt-1 ez:grid ez:gap-1">
                  {product?.name && <span data-script={scriptOf(product.name)} className="ez:text-site-note ez:font-normal ez:text-fg">{product.name}</span>}
                  <span className="ez:text-site-small ez:text-muted ez:tabular-nums">{[r.name, r.date].filter(Boolean).join(" · ")}</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Faq({ context }: SectionProps<"faq">) {
  const faqs = context.faqs;
  const row = "ez:flex ez:min-h-19 ez:items-center ez:justify-between ez:gap-4 ez:py-4";
  return (
    <section data-slot="faq" id="faq" data-blank={faqs.length ? undefined : ""} className={cn(split, ruled)}>
      <h2 className={heading}>{QUOTE_TITLE.faq}</h2>
      <div className={cn(rule, "ez:min-w-0 ez:border-t")}>
        {faqs.length
          ? faqs.map((f) => (
              <details key={f.id} className={cn(rule, "ez:group ez:border-b")}>
                <summary className={cn(row, "ez:cursor-pointer ez:list-none ez:text-site-item ez:font-normal ez:text-fg ez:[&::-webkit-details-marker]:hidden", focusRing)}>
                  {f.question}
                  <Icon name="plus" size="sm" className="ez:text-muted ez:group-open:hidden" />
                  <Icon name="minus" size="sm" className="ez:hidden ez:text-muted ez:group-open:inline-block" />
                </summary>
                <p className="ez:m-0 ez:pb-6 ez:whitespace-pre-line ez:text-muted">{f.answer}</p>
              </details>
            ))
          : [0, 1, 2, 3].map((i) => (
              <div key={i} className={cn(rule, row, "ez:border-b")}>
                <Bar size="long" />
              </div>
            ))}
      </div>
    </section>
  );
}

const cell = "ez:min-h-11 ez:border-site-edge ez:bg-surface ez:text-site-body ez:text-fg";

function Rest({ names }: { names?: string[] }) {
  if (!names?.length) return null;
  return (
    <p className="ez:m-0 ez:flex ez:flex-wrap ez:gap-y-1.5 ez:border-0 ez:border-t ez:border-solid ez:border-site-edge ez:pt-5 ez:text-site-body ez:text-muted">
      {names.map((n, i) => (
        <Fragment key={n}>
          {i > 0 && (
            <span aria-hidden="true" className="ez:mx-2.5">
              ·
            </span>
          )}
          <span>{n}</span>
        </Fragment>
      ))}
    </p>
  );
}

function Starter({ data }: { data: QuoteStarter }) {
  const state = starterState(data);
  if (state === "closed") return <p className="ez:m-0 ez:self-center ez:text-site-item ez:font-normal ez:text-fg">{QUOTE_TITLE.closed}</p>;
  if (state === "blank") {
    return (
      <div className="ez:grid ez:content-start ez:gap-7">
        {[0, 1, 2].map((i) => (
          <div key={i} className="ez:grid ez:gap-2.5">
            <Bar size="short" />
            <div className={cn(OPTION_GRID, "ez:gap-2")}>
              {[0, 1, 2, 3].map((j) => (
                <span key={j} className="ez:inline-flex ez:h-11 ez:items-center ez:justify-center ez:rounded-button ez:border ez:border-solid ez:border-site-edge ez:bg-surface">
                  <Bar size="short" />
                </span>
              ))}
            </div>
          </div>
        ))}
        <BlankButton variant="outline" className="ez:justify-self-start">
          {QUOTE_TITLE.request}
        </BlankButton>
      </div>
    );
  }
  return (
    <StarterForm data={data} className="ez:grid ez:min-w-0 ez:content-start ez:gap-7">
      {(data.questions ?? []).map((q) => (
        <fieldset key={q.id} className="ez:m-0 ez:min-w-0 ez:border-0 ez:p-0">
          <legend className="ez:mb-2.5 ez:p-0 ez:text-site-note ez:text-muted">{q.label}</legend>
          <div className={cn(OPTION_GRID, "ez:gap-2")}>
            {q.options.map((o) => (
              <OptionCell key={o} name={q.id} value={o} className={cell} />
            ))}
          </div>
        </fieldset>
      ))}
      <Rest names={data.rest} />
      <div className="ez:grid ez:gap-4 ez:pt-1">
        <Button type="submit" className="ez:h-14 ez:justify-self-start ez:px-7 ez:text-site-item">
          {QUOTE_TITLE.request}
          <Icon name="right" size="sm" />
        </Button>
        <p className="ez:m-0 ez:text-site-small ez:text-muted">{QUOTE_CONSENT}</p>
      </div>
    </StarterForm>
  );
}

function RequestBox({ data, storeName, compact }: { data: QuoteStarter; storeName?: string | null; compact?: boolean }) {
  const blank = starterState(data) === "blank";
  const big = compact ? "ez:text-site-name ez:lg:text-site-display-sm" : "ez:text-site-name ez:lg:text-site-display-md";
  return (
    <div
      className={cn(
        "ez:grid ez:gap-12 ez:bg-surface-alt ez:p-8 ez:md:p-12 ez:lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] ez:lg:gap-20",
        compact ? "ez:lg:px-18 ez:lg:py-14" : "ez:lg:p-18",
      )}
    >
      <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-12 ez:lg:gap-14">
        <div className="ez:grid">
          <h2 className={cn("ez:m-0 ez:font-display ez:font-normal ez:text-fg", big)}>{QUOTE_TITLE.request}</h2>
          {storeName && <p data-script={scriptOf(storeName)} className={cn("ez:m-0 ez:font-display ez:font-normal ez:text-muted", big)}>{storeName}</p>}
        </div>
        {!blank && <Contact phone={data.phone} hours={data.hours} />}
      </div>
      <Starter data={data} />
    </div>
  );
}

export function Request({ data, context }: SectionProps<"quote_starter">) {
  const blank = starterState(data) === "blank";
  return (
    <section data-slot="quote-starter" id="request" data-blank={blank ? "" : undefined} className={cn("ez:text-fg", ruled)}>
      <RequestBox data={data} storeName={context.storeName} />
    </section>
  );
}

export function Footer({ storeName, phone, hours, business, nav, guide, account, terms }: QuoteFooterProps) {
  const lines = [business.filter((r) => FIRST_LINE.has(r.label)), business.filter((r) => !FIRST_LINE.has(r.label))].filter((l) => l.length);
  const shown = new Set(nav.map((l) => l.href));
  const extra = account.filter((l) => !shown.has(l.href));
  const link = cn("ez:text-fg ez:no-underline ez:hover:text-muted", focusRing);
  return (
    <footer data-slot="site-footer" className={cn(rule, "ez:border-t ez:text-fg")}>
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-18 ez:pb-12">
        <div className={cn(rule, "ez:grid ez:gap-10 ez:border-b ez:pb-12 ez:md:grid-cols-3")}>
          <p data-script={scriptOf(storeName)} className="ez:m-0 ez:text-site-counter ez:font-normal ez:text-fg">{storeName}</p>
          <div className="ez:grid ez:content-start ez:gap-1">
            {(phone || hours) && <span className="ez:mb-2 ez:text-site-note ez:text-muted">{QUOTE_TITLE.center}</span>}
            {phone && (
              <a href={`tel:${phone}`} className={cn("ez:justify-self-start ez:text-site-heading ez:text-fg ez:no-underline ez:tabular-nums", focusRing)}>
                {phone}
              </a>
            )}
            {hours && <span className="ez:text-site-body ez:text-muted">{`${QUOTE_TITLE.hours} ${hours}`}</span>}
          </div>
          <nav aria-label={QUOTE_TITLE.guide} className="ez:grid ez:content-start ez:gap-6 ez:text-site-body">
            <ul className="ez:m-0 ez:grid ez:list-none ez:gap-2 ez:p-0">
              {nav.map((l) => (
                <li key={`${l.label}-${l.href}`}>
                  <NextLink href={l.href} className={link}>
                    {l.label}
                  </NextLink>
                </li>
              ))}
            </ul>
            {guide.length > 0 && (
              <ul className="ez:m-0 ez:grid ez:list-none ez:gap-2 ez:p-0">
                {guide.map((l) => (
                  <li key={`${l.label}-${l.href}`}>
                    <NextLink href={l.href} className={link}>
                      {l.label}
                    </NextLink>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </div>
        {lines.length > 0 && (
          <div className={cn(rule, "ez:grid ez:gap-3 ez:border-b ez:py-8 ez:md:grid-cols-3 ez:md:gap-10")}>
            <p className="ez:m-0 ez:text-site-note ez:text-muted">{QUOTE_TITLE.business}</p>
            <div className="ez:grid ez:gap-1 ez:text-site-note ez:text-fg ez:md:col-span-2">
              {lines.map((l, i) => (
                <p key={i} className="ez:m-0 ez:leading-relaxed">
                  {businessLine(l)}
                </p>
              ))}
            </div>
          </div>
        )}
        <div className="ez:flex ez:flex-wrap ez:items-center ez:justify-between ez:gap-4 ez:pt-6 ez:text-site-note ez:text-muted">
          <span>{`© ${storeName}`}</span>
          <nav aria-label={QUOTE_TITLE.terms} className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2">
            {[...terms, ...extra].map((t) => (
              <NextLink key={`${t.label}-${t.href}`} href={t.href} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", t.strong && "ez:font-medium ez:text-fg", focusRing)}>
                {t.label}
              </NextLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function ListRow({ c }: { c: Case }) {
  const view = caseView(c);
  return (
    <li data-slot="case-item" className={cn(rule, "ez:grid ez:gap-8 ez:border-b ez:py-10 ez:md:grid-cols-[minmax(0,7fr)_minmax(0,8fr)] ez:md:gap-16 ez:md:py-12")}>
      <NextLink href={view.href} tabIndex={-1} aria-hidden="true" className="ez:block">
        <Pic src={view.image} ratio={3 / 2} />
      </NextLink>
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:items-start ez:gap-6">
        <h2 data-script={scriptOf(view.title)} className="ez:m-0 ez:font-display ez:text-site-heading ez:text-fg ez:md:text-site-title">{view.title}</h2>
        <FactTable facts={view.facts} className="ez:max-w-130" />
        <NextLink href={view.href} aria-label={`${view.title} ${QUOTE_TITLE.view}`} className={cn(textLink, "ez:mt-auto ez:text-site-body", focusRing)}>
          {QUOTE_TITLE.view}
          <Icon name="right" size="sm" />
        </NextLink>
      </div>
    </li>
  );
}

export function List({ title, count, tabs, cases, request, storeName }: QuoteListProps) {
  return (
    <div data-slot="quote-cases" className="ez:grid ez:pt-8 ez:text-fg ez:lg:pt-16">
      <h1 className="ez:m-0 ez:font-display ez:text-site-name ez:text-fg ez:md:text-site-display-md">
        {title}
        <span className="ez:ml-3.5 ez:font-body ez:text-site-heading ez:text-muted ez:tabular-nums">{count}</span>
      </h1>
      {tabs.length > 1 && (
        <nav aria-label={QUOTE_TITLE.category} className="ez:mt-10 ez:flex ez:flex-wrap ez:gap-x-9 ez:gap-y-3 ez:pb-4 ez:lg:mt-12">
          {tabs.map((t) => (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={cn("ez:inline-flex ez:items-baseline ez:gap-1.5 ez:text-site-item ez:font-normal ez:text-muted ez:no-underline ez:hover:text-fg", t.on && "ez:font-medium ez:text-fg", focusRing)}
            >
              {t.label}
              {t.count != null && t.count > 0 && <span className="ez:text-site-small ez:font-normal ez:text-muted ez:tabular-nums">{t.count}</span>}
            </NextLink>
          ))}
        </nav>
      )}
      <ul className={cn(rule, "ez:m-0 ez:list-none ez:border-t ez:p-0", tabs.length > 1 ? "" : "ez:mt-10 ez:lg:mt-12")}>
        {cases.map((c) => (
          <ListRow key={c.id} c={c} />
        ))}
      </ul>
      <section data-slot="quote-starter" id="request" data-blank={starterState(request) === "blank" ? "" : undefined} className="ez:mt-20 ez:lg:mt-24">
        <RequestBox data={request} storeName={storeName} compact />
      </section>
    </div>
  );
}
