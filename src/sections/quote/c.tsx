import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Button, ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import { StarRow } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import type { ProductSummary } from "../../types";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, BlankStars, Lines, Pic } from "../kit";
import type { Case, QuoteFigures, QuoteStarter, Review } from "../template/data";
import { QuoteNavLinks } from "./nav";
import { average, CASES_HREF, caseView, includesOf, leadCase, QUOTE_CONSENT, QUOTE_HREF, QUOTE_TITLE, restCases, reviewCount } from "./shared";
import { OPTION_GRID, OptionCell, StarterForm, starterState } from "./starter";
import type { QuoteFooterProps, QuoteHeaderProps, QuoteListProps } from "./types";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const rule = "ez:border-0 ez:border-solid ez:border-site-line";

const soft =
  "ez:inline-flex ez:items-center ez:justify-center ez:gap-2 ez:rounded-button ez:border ez:border-solid ez:border-site-edge ez:font-medium ez:text-fg ez:no-underline ez:cursor-pointer";

const wide = "ez:min-h-13.5 ez:w-full ez:px-5 ez:text-site-item ez:font-medium";

const lk = "ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-body ez:font-normal ez:text-fg ez:no-underline";

const h2 = "ez:m-0 ez:text-site-section ez:text-fg ez:md:text-site-figure-lg";

const MD_COLS: Record<number, string> = {
  1: "ez:md:grid-cols-1",
  2: "ez:md:grid-cols-2",
  3: "ez:md:grid-cols-3",
  4: "ez:md:grid-cols-4",
  5: "ez:md:grid-cols-5",
  6: "ez:md:grid-cols-6",
};

const MD_SPAN: Record<number, string> = {
  1: "ez:md:col-span-1",
  2: "ez:md:col-span-2",
};

function mdCols(n: number): string {
  return MD_COLS[Math.max(1, Math.min(6, n))];
}

function Arrow() {
  return <Icon name="right" size="sm" className="ez:text-muted" />;
}

function Head({ title, aside, more }: { title: string; aside?: ReactNode; more?: string }) {
  return (
    <div className="ez:flex ez:flex-wrap ez:items-center ez:justify-between ez:gap-4">
      <div className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-5 ez:gap-y-2">
        <h2 data-script={scriptOf(title)} className={h2}>{title}</h2>
        {aside}
      </div>
      {more && (
        <NextLink href={more} className={cn(lk, focusRing)}>
          {QUOTE_TITLE.more}
          <Arrow />
        </NextLink>
      )}
    </div>
  );
}

function Rating({ value, count, className }: { value: number; count: number; className?: string }) {
  return (
    <span className={cn("ez:inline-flex ez:items-center ez:gap-2.5 ez:text-site-body ez:text-muted", className)}>
      <StarRow rating={value} className="ez:text-muted" />
      <span className="ez:font-normal ez:text-fg ez:tabular-nums">{average(value)}</span>
      <span className="ez:tabular-nums">{reviewCount(count)}</span>
    </span>
  );
}

function BlankRating({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("ez:inline-flex ez:items-center ez:gap-2.5 ez:text-site-body", className)}>
      <BlankStars />
      <Bar size="short" />
      <Bar size="short" />
    </span>
  );
}

function Contact({ phone, hours, stack }: { phone?: string | null; hours?: string | null; stack?: boolean }) {
  if (!phone && !hours) return null;
  return (
    <div className={cn("ez:flex ez:gap-x-6 ez:gap-y-1.5 ez:text-site-note ez:text-muted", stack ? "ez:flex-col" : "ez:flex-wrap ez:justify-between")}>
      {phone && (
        <span className="ez:inline-flex ez:items-center ez:gap-2">
          <Icon name="phone" size="sm" className="ez:text-muted" />
          <span>{QUOTE_TITLE.center}</span>
          <a href={`tel:${phone}`} className={cn("ez:font-normal ez:text-fg ez:no-underline ez:tabular-nums", focusRing)}>
            {phone}
          </a>
        </span>
      )}
      {hours && (
        <span className="ez:inline-flex ez:items-center ez:gap-2">
          <span>{QUOTE_TITLE.hours}</span>
          <span className="ez:font-normal ez:text-fg ez:tabular-nums">{hours}</span>
        </span>
      )}
    </div>
  );
}

const cell = "ez:min-h-11 ez:border-site-line ez:bg-surface ez:px-1 ez:text-site-note ez:text-muted";

function StarterBody({ data, contact }: { data: QuoteStarter; contact: boolean }) {
  const state = starterState(data);
  if (state === "closed") {
    return (
      <div className="ez:grid ez:gap-5">
        <p className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{QUOTE_TITLE.closed}</p>
        {contact && (
          <div className={cn(rule, "ez:border-t ez:pt-4")}>
            <Contact phone={data.phone} hours={data.hours} />
          </div>
        )}
      </div>
    );
  }
  if (state === "blank") {
    return (
      <div className="ez:grid">
        {[0, 1, 2].map((i) => (
          <div key={i} aria-hidden="true" className="ez:mb-5 ez:grid ez:gap-2">
            <Bar size="short" className="ez:text-site-note" />
            <div className={cn(OPTION_GRID, "ez:gap-1.5")}>
              {[0, 1, 2, 3].map((j) => (
                <span key={j} className={cn(rule, "ez:flex ez:min-h-11 ez:items-center ez:justify-center ez:rounded-button ez:border")}>
                  <Bar size="short" className="ez:text-site-note" />
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className={cn(rule, "ez:border-t ez:pt-4.5")}>
          <BlankButton variant="outline" className={cn(soft, wide, "ez:bg-surface-alt ez:cursor-default")}>
            {QUOTE_TITLE.request}
          </BlankButton>
        </div>
        <p className="ez:m-0 ez:mt-3 ez:text-site-small ez:text-muted">{QUOTE_CONSENT}</p>
      </div>
    );
  }
  return (
    <StarterForm data={data} className="ez:grid">
      {(data.questions ?? []).map((q) => (
        <fieldset key={q.id} className="ez:m-0 ez:mb-5 ez:min-w-0 ez:border-0 ez:p-0">
          <legend className="ez:mb-2 ez:p-0 ez:text-site-note ez:font-normal ez:text-fg">{q.label}</legend>
          <div className={cn(OPTION_GRID, "ez:gap-1.5")}>
            {q.options.map((o) => (
              <OptionCell key={o} name={q.id} value={o} className={cell} />
            ))}
          </div>
        </fieldset>
      ))}
      {data.rest?.length ? (
        <p className={cn(rule, "ez:m-0 ez:flex ez:flex-wrap ez:gap-x-2 ez:gap-y-1 ez:border-t ez:pt-3.5 ez:pb-4.5 ez:text-site-note ez:text-muted")}>
          {data.rest.map((r, i) => (
            <span key={r} className="ez:inline-flex ez:gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="ez:text-site-faint">
                  ·
                </span>
              )}
              {r}
            </span>
          ))}
        </p>
      ) : null}
      <Button type="submit" block className={wide}>
        {QUOTE_TITLE.request}
        <Icon name="right" size="sm" />
      </Button>
      <p className="ez:m-0 ez:mt-3 ez:text-site-small ez:text-muted">{QUOTE_CONSENT}</p>
      {contact && (data.phone || data.hours) ? (
        <div className={cn(rule, "ez:mt-4.5 ez:border-t ez:pt-4")}>
          <Contact phone={data.phone} hours={data.hours} />
        </div>
      ) : null}
    </StarterForm>
  );
}

function Fig({ value, label }: { value: string | null; label: string }) {
  return (
    <div className="ez:flex ez:min-h-19 ez:flex-col ez:justify-center ez:py-3.5 ez:pr-4.5 ez:md:w-38 ez:md:not-first:border-l ez:md:not-first:pl-4.5 ez:border-0 ez:border-solid ez:border-site-line">
      {value ? <span className="ez:text-site-rank ez:font-normal ez:text-fg ez:tabular-nums">{value}</span> : <Bar size="short" className="ez:text-site-rank" />}
      <span className="ez:text-site-note ez:text-muted">{label}</span>
    </div>
  );
}

function Cells({ figures, trust, blank, rating }: { figures?: QuoteFigures; trust?: { items?: string[] }; blank?: boolean; rating?: boolean }) {
  const lead: ReactNode[] = [];
  if (figures && figures.cases > 0) lead.push(<Fig key="cases" value={String(figures.cases)} label={QUOTE_TITLE.cases} />);
  else if (blank) lead.push(<Fig key="cases" value={null} label={QUOTE_TITLE.cases} />);
  if (rating && figures && figures.reviews > 0 && figures.average != null) {
    lead.push(<Fig key="reviews" value={average(figures.average)} label={reviewCount(figures.reviews)} />);
  }
  if (!lead.length && !trust) return null;
  const items = trust?.items ?? [];
  const shown: (string | null)[] = items.length ? items : [null, null, null];
  return (
    <div className={cn(rule, "ez:grid ez:border-y ez:md:flex")}>
      {lead.length > 0 && <div className="ez:grid ez:grid-cols-2 ez:md:flex ez:md:shrink-0">{lead}</div>}
      {trust && (
        <ul
          data-slot="trust-line"
          data-blank={items.length ? undefined : ""}
          className={cn(rule, "ez:m-0 ez:grid ez:list-none ez:grid-cols-2 ez:p-0 ez:md:min-w-0 ez:md:flex-1", mdCols(shown.length), lead.length > 0 && "ez:max-md:border-t")}
        >
          {shown.map((t, i) => (
            <li
              key={t ?? i}
              className={cn(
                rule,
                "ez:flex ez:min-h-19 ez:items-center ez:border-l ez:px-4.5 ez:py-3.5 ez:text-site-body ez:font-normal ez:text-fg",
                "ez:max-md:odd:border-l-0 ez:max-md:odd:pl-0 ez:max-md:nth-[n+3]:border-t",
                !lead.length && "ez:md:first:border-l-0 ez:md:first:pl-0",
              )}
            >
              {t ?? <Bar />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Header({ name, logoUrl, phone, nav, links }: QuoteHeaderProps) {
  return (
    <header data-slot="site-header" className={cn(rule, "ez:border-b ez:bg-surface")}>
      <div className="ez:mx-auto ez:flex ez:min-h-16 ez:max-w-wrap ez:items-center ez:gap-6 ez:px-page ez:lg:min-h-18 ez:lg:gap-12">
        <NextLink data-script={scriptOf(name)} href="/" className={cn("ez:min-w-0 ez:text-site-counter ez:font-normal ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:gap-7.5 ez:text-site-body ez:max-lg:hidden">
          <QuoteNavLinks items={nav} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)} currentClassName="ez:font-medium ez:text-fg" />
        </nav>
        <div className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-4 ez:text-site-body ez:md:gap-6">
          {phone && (
            <a href={`tel:${phone}`} className={cn("ez:whitespace-nowrap ez:font-normal ez:text-fg ez:no-underline ez:tabular-nums", focusRing)}>
              {phone}
            </a>
          )}
          <NextLink href={links.lookup.href} className={cn("ez:whitespace-nowrap ez:text-muted ez:no-underline ez:max-md:hidden", focusRing)}>
            {links.lookup.label}
          </NextLink>
          <ButtonLink href={links.request.href} variant="outline" className="ez:min-h-10 ez:px-4.5 ez:text-site-body">
            {links.request.label}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const lead = leadCase(data.cases);
  const image = data.image ?? lead?.image ?? null;
  const title = data.title?.trim() || null;
  const blank = !title && !image;
  const figures = data.figures;
  const rated = Boolean(figures && figures.reviews > 0 && figures.average != null);
  return (
    <section
      data-slot="hero"
      data-blank={blank ? "" : undefined}
      className="ez:grid ez:gap-10 ez:pt-4 ez:text-fg ez:lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] ez:lg:gap-12 ez:xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] ez:xl:gap-18"
    >
      <div className="ez:flex ez:min-w-0 ez:flex-col">
        {rated && figures?.average != null ? <Rating value={figures.average} count={figures.reviews} /> : blank ? <BlankRating /> : null}
        <div className="ez:mt-5.5 ez:mb-7.5 ez:grid ez:gap-3">
          {title ? (
            <h1 data-script={scriptOf(title)} className="ez:m-0 ez:text-site-page ez:text-fg ez:md:text-site-display-md">{title}</h1>
          ) : blank ? (
            <span aria-hidden="true" className="ez:grid ez:gap-2 ez:text-site-page ez:md:text-site-display-md">
              <Bar size="long" block className="ez:h-[1.1em]" />
              <Bar size="mid" block className="ez:h-[1.1em]" />
            </span>
          ) : (
            <p data-script={scriptOf(context.storeName)} className="ez:m-0 ez:text-site-page ez:text-fg ez:md:text-site-display-md">{context.storeName}</p>
          )}
          {title && data.sub && (
            <p data-script={scriptOf(data.sub)} data-slot="hero-sub" className="ez:m-0 ez:text-site-heading ez:text-muted">
              {data.sub}
            </p>
          )}
        </div>
        <Cells figures={figures} trust={data.trust_line} blank={blank} />
        <figure className="ez:m-0 ez:mt-7 ez:grid ez:gap-3">
          <Pic src={image} alt={lead?.title ?? ""} ratio={7 / 3} />
          {!blank && (
            <figcaption className="ez:flex ez:justify-end">
              <NextLink href={CASES_HREF} className={cn(lk, focusRing)}>
                {QUOTE_TITLE.cases}
                <Arrow />
              </NextLink>
            </figcaption>
          )}
        </figure>
      </div>
      <div className={cn(rule, "ez:self-start ez:rounded-lg ez:border ez:bg-surface ez:px-5 ez:pt-7 ez:pb-6 ez:sm:px-7.5")}>
        <h2 className="ez:m-0 ez:mb-5.5 ez:text-site-heading ez:text-fg">{QUOTE_TITLE.request}</h2>
        <StarterBody data={blank ? {} : (data.request ?? {})} contact={!blank} />
      </div>
    </section>
  );
}

export function Trust({ data }: SectionProps<"trust_line">) {
  const empty = !(data.items ?? []).length && !(data.figures && (data.figures.cases > 0 || data.figures.reviews > 0));
  return (
    <section data-slot="trust-line" data-blank={empty ? "" : undefined} className="ez:text-fg">
      <Cells figures={data.figures} trust={data} rating />
    </section>
  );
}

function productOf(products: ProductSummary[], review: Review | null): ProductSummary | undefined {
  return review?.product ? products.find((p) => p.id === review.product) : undefined;
}

function BigReview({ review, product }: { review: Review; product?: ProductSummary }) {
  const photo = product?.cover_url ?? null;
  const meta = (
    <div className="ez:flex ez:flex-wrap ez:items-center ez:gap-3.5 ez:text-site-body ez:text-muted">
      <StarRow rating={review.rating} className="ez:text-muted" />
      <span>{review.name}</span>
      {review.date && <span className="ez:tabular-nums">{review.date}</span>}
    </div>
  );
  const text = <p data-script={scriptOf(review.body)} className="ez:m-0 ez:text-site-heading ez:text-pretty ez:text-fg ez:md:text-site-logo/snug">{review.body}</p>;
  const item = (
    <div className={cn(rule, "ez:grid ez:justify-items-start ez:gap-4.5 ez:border-t ez:pt-5")}>
      {product && <span data-script={scriptOf(product.name)} className="ez:text-site-item ez:font-normal ez:text-fg">{product.name}</span>}
      <NextLink href={QUOTE_HREF} className={cn(lk, focusRing)}>
        {QUOTE_TITLE.request}
        <Arrow />
      </NextLink>
    </div>
  );
  if (photo) {
    return (
      <article className={cn(rule, "ez:grid ez:gap-8 ez:border-b ez:pb-14 ez:md:grid-cols-2 ez:md:gap-16")}>
        <Pic src={photo} alt={product?.name ?? ""} ratio={4 / 3} />
        <div className="ez:flex ez:min-w-0 ez:flex-col ez:pt-1">
          {meta}
          <div className="ez:mt-6 ez:mb-9 ez:md:mb-auto">{text}</div>
          <div className="ez:md:mt-9">{item}</div>
        </div>
      </article>
    );
  }
  return (
    <article className={cn(rule, "ez:grid ez:gap-8 ez:border-b ez:pb-14 ez:md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] ez:md:gap-16")}>
      <div className="ez:grid ez:content-start ez:gap-6 ez:max-md:order-2">
        {meta}
        {item}
      </div>
      {text}
    </article>
  );
}

function SmallReview({ review, product }: { review: Review; product?: ProductSummary }) {
  return (
    <article
      className={cn(
        rule,
        "ez:grid ez:min-w-0 ez:content-start ez:gap-3.5 ez:pt-8 ez:max-md:not-first:border-t ez:md:border-l ez:md:px-9 ez:md:first:border-l-0 ez:md:first:pl-0 ez:md:last:pr-0",
      )}
    >
      <div className="ez:grid ez:min-w-0 ez:gap-0.5">
        {product && <span data-script={scriptOf(product.name)} className="ez:text-site-body ez:font-normal ez:text-fg">{product.name}</span>}
        <span className="ez:flex ez:gap-2.5 ez:text-site-note ez:text-muted">
          <span>{review.name}</span>
          {review.date && <span className="ez:tabular-nums">{review.date}</span>}
        </span>
      </div>
      <StarRow rating={review.rating} className="ez:text-muted" />
      <p data-script={scriptOf(review.body)} className="ez:m-0 ez:text-site-item ez:font-normal ez:text-pretty ez:text-fg">{review.body}</p>
    </article>
  );
}

function BlankReviews() {
  return (
    <div aria-hidden="true" className="ez:grid">
      <div className={cn(rule, "ez:grid ez:gap-8 ez:border-b ez:pb-14 ez:md:grid-cols-2 ez:md:gap-16")}>
        <Pic ratio={4 / 3} />
        <div className="ez:flex ez:flex-col ez:gap-6 ez:pt-1">
          <BlankRating />
          <span className="ez:grid ez:gap-3 ez:text-site-heading ez:md:text-site-logo">
            <Bar size="full" block />
            <Bar size="full" block />
            <Bar size="tail" block />
          </span>
          <div className={cn(rule, "ez:mt-auto ez:grid ez:gap-3 ez:border-t ez:pt-5")}>
            <Bar size="long" className="ez:text-site-item" />
          </div>
        </div>
      </div>
      <div className="ez:grid ez:md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              rule,
              "ez:grid ez:content-start ez:gap-3.5 ez:pt-8 ez:max-md:not-first:border-t ez:md:border-l ez:md:px-9 ez:md:first:border-l-0 ez:md:first:pl-0 ez:md:last:pr-0",
            )}
          >
            <div className="ez:grid ez:gap-2">
              <Bar size="long" />
              <Bar size="mid" />
            </div>
            <BlankStars />
            <Lines className="ez:text-site-item" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  const count = data.count ?? items.length;
  const [first, ...rest] = items;
  const small = rest.slice(0, 2);
  return (
    <section data-slot="reviews" id="reviews" data-blank={first ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={QUOTE_TITLE.reviews} aside={first && data.average != null ? <Rating value={data.average} count={count} /> : !first ? <BlankRating /> : undefined} />
      {first ? (
        <div className="ez:grid">
          <BigReview review={first} product={productOf(context.products, first)} />
          {small.length > 0 && (
            <div className="ez:grid ez:md:grid-cols-2">
              {small.map((r, i) => (
                <SmallReview key={`${r.name}-${r.date ?? i}`} review={r} product={productOf(context.products, r)} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <BlankReviews />
      )}
    </section>
  );
}

function CaseTile({ c }: { c: Case }) {
  const view = caseView(c);
  return (
    <NextLink data-slot="case-item" href={view.href} className={cn("ez:grid ez:min-w-0 ez:content-start ez:text-fg ez:no-underline", focusRing)}>
      <Pic src={view.image} alt="" ratio={4 / 3} />
      <span data-script={scriptOf(view.title)} className="ez:mt-4 ez:text-site-item ez:font-normal ez:text-fg">{view.title}</span>
      {view.line && <span data-script={scriptOf(view.line)} className="ez:mt-1 ez:text-site-body ez:text-muted">{view.line}</span>}
    </NextLink>
  );
}

function BlankTile() {
  return (
    <div data-slot="case-item" aria-hidden="true" className="ez:grid ez:content-start ez:gap-3">
      <Pic ratio={4 / 3} />
      <span className="ez:grid ez:gap-2 ez:pt-1">
        <Bar size="long" className="ez:text-site-item" />
        <Bar size="mid" />
      </span>
    </div>
  );
}

export function Cases({ data }: SectionProps<"case_grid">) {
  const all = data.cases ?? [];
  const rest = restCases(all);
  const pool = (rest.length % 3 === 0 ? rest : all).slice(0, 6);
  const list = pool.length > 3 ? pool.slice(0, pool.length - (pool.length % 3)) : pool;
  return (
    <section data-slot="case-grid" id="cases" data-blank={all.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head
        title={QUOTE_TITLE.cases}
        aside={all.length ? <span className="ez:text-site-counter ez:text-muted ez:tabular-nums">{all.length}</span> : undefined}
        more={all.length ? CASES_HREF : undefined}
      />
      <div className="ez:grid ez:grid-cols-2 ez:gap-x-4 ez:gap-y-8 ez:md:grid-cols-3 ez:md:gap-x-8 ez:md:gap-y-12">
        {list.length ? list.map((c) => <CaseTile key={c.id} c={c} />) : [0, 1, 2].map((i) => <BlankTile key={i} />)}
      </div>
    </section>
  );
}

function Includes({ lines }: { lines: string[] }) {
  if (!lines.length) return null;
  return (
    <div className="ez:mt-6 ez:grid ez:w-full ez:gap-2">
      <span className="ez:text-site-small ez:text-muted">{QUOTE_TITLE.includes}</span>
      <ul aria-label={QUOTE_TITLE.includes} data-slot="package-includes" className="ez:m-0 ez:list-none ez:p-0">
        {lines.map((text, i) => (
          <li data-script={scriptOf(text)} key={`${text}-${i}`} className={cn(rule, "ez:border-t ez:py-3 ez:text-site-note ez:text-muted ez:last:border-b")}>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Packages({ data }: SectionProps<"package_cards">) {
  const items = data.items ?? [];
  const shown = items.length ? items : [null, null, null, null];
  const n = shown.length;
  const cols = n <= 4 ? n : n % 3 === 0 ? 3 : 4;
  return (
    <section data-slot="package-cards" id="packages" data-blank={items.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={QUOTE_TITLE.packages} />
      <ul
        className={cn(
          rule,
          "ez:m-0 ez:grid ez:list-none ez:overflow-hidden ez:rounded-lg ez:border ez:bg-surface ez:p-0",
          mdCols(cols),
          n === 1 && "ez:md:max-w-md",
          n === 2 && "ez:md:max-w-3xl",
        )}
      >
        {shown.map((p, i) => (
          <li
            key={p?.name ?? i}
            className={cn(
              rule,
              "ez:flex ez:flex-col ez:items-start ez:px-7 ez:pt-7 ez:pb-6.5",
              i > 0 && "ez:max-md:border-t",
              i >= cols && "ez:md:border-t",
              i % cols !== 0 && "ez:md:border-l",
            )}
          >
            <span data-script={scriptOf(p ? p.name : null)} className="ez:text-site-item ez:font-normal ez:text-fg">{p ? p.name : <Bar />}</span>
            <span className="ez:mt-1.5 ez:text-site-section ez:text-fg ez:tabular-nums">{p ? <Won value={p.price} /> : <BlankPrice className="ez:font-normal" />}</span>
            <Includes lines={includesOf(p)} />
            {p && (
              <div className="ez:mt-auto ez:pt-5">
                <NextLink href={QUOTE_HREF} aria-label={`${p.name} ${QUOTE_TITLE.request}`} className={cn(lk, focusRing)}>
                  {QUOTE_TITLE.request}
                  <Arrow />
                </NextLink>
              </div>
            )}
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
    <section data-slot="process-steps" id="process" data-blank={steps.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={QUOTE_TITLE.process} />
      <ol className={cn("ez:m-0 ez:grid ez:list-none ez:gap-4 ez:p-0 ez:md:gap-0", mdCols(shown.length))}>
        {shown.map((s, i) => (
          <li
            key={i}
            className="ez:relative ez:flex ez:items-center ez:gap-4 ez:md:block ez:md:not-last:after:absolute ez:md:not-last:after:top-5 ez:md:not-last:after:right-3 ez:md:not-last:after:left-13 ez:md:not-last:after:h-px ez:md:not-last:after:bg-site-edge ez:md:not-last:after:content-['']"
          >
            <span
              aria-hidden={s ? undefined : "true"}
              className="ez:flex ez:size-10 ez:shrink-0 ez:items-center ez:justify-center ez:rounded-md ez:border ez:border-solid ez:border-site-edge ez:bg-surface ez:text-site-note ez:font-normal ez:text-fg ez:tabular-nums"
            >
              {s ? String(i + 1).padStart(2, "0") : null}
            </span>
            <span data-script={scriptOf(s)} className="ez:block ez:text-site-item ez:font-normal ez:text-fg ez:md:mt-4.5 ez:md:pr-6">{s ?? <Bar />}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Faq({ context }: SectionProps<"faq">) {
  const faqs = context.faqs;
  const row = (i: number) => cn(rule, "ez:border-b", i === 0 && "ez:border-t", i === 1 && "ez:md:border-t");
  return (
    <section data-slot="faq" id="faq" data-blank={faqs.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={QUOTE_TITLE.faq} />
      <div className="ez:grid ez:items-start ez:md:grid-cols-2 ez:md:gap-x-16">
        {faqs.length
          ? faqs.map((f, i) => (
              <details key={f.id} className={cn("ez:group", row(i))}>
                <summary
                  className={cn(
                    "ez:flex ez:min-h-11 ez:cursor-pointer ez:list-none ez:items-center ez:justify-between ez:gap-4 ez:py-5.5 ez:text-site-item ez:font-normal ez:text-fg ez:[&::-webkit-details-marker]:hidden",
                    focusRing,
                  )}
                >
                  {f.question}
                  <Icon name="plus" size="sm" className="ez:text-muted ez:group-open:hidden" />
                  <Icon name="minus" size="sm" className="ez:hidden ez:text-muted ez:group-open:inline-block" />
                </summary>
                <p data-script={scriptOf(f.answer)} className="ez:m-0 ez:-mt-2 ez:pb-5.5 ez:whitespace-pre-line ez:text-site-body ez:text-muted">{f.answer}</p>
              </details>
            ))
          : [0, 1, 2, 3].map((i) => (
              <div key={i} className={cn("ez:flex ez:min-h-17 ez:items-center ez:py-5.5", row(i))}>
                <Bar size="long" className="ez:text-site-item" />
              </div>
            ))}
      </div>
    </section>
  );
}

function RequestAction({ data }: { data: QuoteStarter }) {
  const state = starterState(data);
  if (state === "open") {
    return (
      <ButtonLink href={data.href ?? QUOTE_HREF} variant="outline" block className={wide}>
        {QUOTE_TITLE.request}
        <Arrow />
      </ButtonLink>
    );
  }
  if (state === "closed") return <p className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{QUOTE_TITLE.closed}</p>;
  return (
    <BlankButton variant="outline" className={cn(soft, wide, "ez:bg-surface ez:cursor-default")}>
      {QUOTE_TITLE.request}
    </BlankButton>
  );
}

export function Request({ data, context }: SectionProps<"quote_starter">) {
  const blank = starterState(data) === "blank";
  return (
    <section
      data-slot="quote-starter"
      id="request"
      data-blank={blank ? "" : undefined}
      className={cn(
        rule,
        "ez:grid ez:items-center ez:gap-8 ez:rounded-lg ez:border ez:bg-surface-alt ez:px-6 ez:py-9 ez:text-fg ez:md:px-14 ez:md:py-13 ez:lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] ez:lg:gap-20",
      )}
    >
      <div className="ez:grid ez:gap-4">
        <h2 className="ez:sr-only">{QUOTE_TITLE.request}</h2>
        {data.rating && data.rating.count > 0 ? <Rating value={data.rating.average} count={data.rating.count} /> : blank ? <BlankRating /> : null}
        {context.storeName ? (
          <p data-script={scriptOf(context.storeName)} className="ez:m-0 ez:text-site-section ez:text-fg ez:md:text-site-page">{context.storeName}</p>
        ) : (
          <Bar size="long" className="ez:text-site-page" />
        )}
      </div>
      <div className="ez:grid ez:gap-4">
        <RequestAction data={data} />
        {!blank && <Contact phone={data.phone} hours={data.hours} />}
      </div>
    </section>
  );
}

export function Footer({ storeName, phone, hours, business, nav, guide, account, terms }: QuoteFooterProps) {
  const seen = new Set(nav.map((l) => l.href));
  const bottom = [...terms, ...guide, ...account.filter((a) => !seen.has(a.href))];
  return (
    <footer data-slot="site-footer" className={cn(rule, "ez:mt-12 ez:border-t ez:text-site-note ez:text-fg")}>
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-14 ez:pb-10">
        <div className="ez:grid ez:gap-10 ez:md:grid-cols-[minmax(0,1fr)_auto_auto] ez:md:gap-16">
          <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-5">
            <span data-script={scriptOf(storeName)} className="ez:text-site-counter ez:font-normal ez:text-fg">{storeName}</span>
            {business.length > 0 && (
              <dl aria-label={QUOTE_TITLE.business} className="ez:m-0 ez:grid ez:gap-y-2 ez:sm:grid-cols-2 ez:sm:gap-x-12">
                {business.map((r) => (
                  <div key={r.label} className="ez:flex ez:min-w-0 ez:gap-3.5">
                    <dt className="ez:min-w-24 ez:shrink-0 ez:text-muted">{r.label}</dt>
                    <dd className="ez:m-0 ez:min-w-0 ez:break-words ez:text-fg ez:tabular-nums"><Won value={r.value} /></dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          {(phone || hours) && (
            <div className="ez:grid ez:content-start ez:gap-1 ez:md:w-60">
              <span className="ez:mb-2 ez:text-muted">{QUOTE_TITLE.center}</span>
              {phone && (
                <a href={`tel:${phone}`} className={cn("ez:justify-self-start ez:text-site-heading ez:text-fg ez:no-underline ez:tabular-nums", focusRing)}>
                  {phone}
                </a>
              )}
              {hours && <span className="ez:text-muted ez:tabular-nums">{hours}</span>}
            </div>
          )}
          <nav aria-label={QUOTE_TITLE.guide} className="ez:grid ez:content-start ez:gap-1.5 ez:md:w-50">
            <span className="ez:mb-2 ez:text-muted">{QUOTE_TITLE.guide}</span>
            {nav.map((l) => (
              <NextLink key={l.href} href={l.href} className={cn("ez:justify-self-start ez:text-fg ez:no-underline", focusRing)}>
                {l.label}
              </NextLink>
            ))}
          </nav>
        </div>
        <nav aria-label={QUOTE_TITLE.terms} className={cn(rule, "ez:mt-12 ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2 ez:border-t ez:pt-5")}>
          {bottom.map((t) => (
            <NextLink key={`${t.label}-${t.href}`} href={t.href} className={cn("ez:text-muted ez:no-underline", t.strong && "ez:font-medium ez:text-fg", focusRing)}>
              {t.label}
            </NextLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}

function ListItem({ c }: { c: Case }) {
  const view = caseView(c);
  return (
    <NextLink data-slot="case-item" href={view.href} className={cn("ez:grid ez:min-w-0 ez:content-start ez:text-fg ez:no-underline", focusRing)}>
      <Pic src={view.image} alt="" ratio={4 / 3} />
      <span data-script={scriptOf(view.title)} className="ez:mt-4 ez:text-site-item ez:font-normal ez:text-fg">{view.title}</span>
      {view.line && <span data-script={scriptOf(view.line)} className="ez:mt-1 ez:text-site-body ez:text-muted">{view.line}</span>}
      {view.scope && (
        <span className={cn(rule, "ez:mt-2.5 ez:flex ez:gap-2.5 ez:border-t ez:pt-2.5 ez:text-site-note")}>
          <span className="ez:shrink-0 ez:text-muted">{QUOTE_TITLE.scope}</span>
          <span className="ez:min-w-0 ez:text-fg">{view.scope}</span>
        </span>
      )}
    </NextLink>
  );
}

export function List({ title, count, tabs, cases, rating, request, storeName }: QuoteListProps) {
  const gap = 3 - (cases.length % 3);
  const span = gap === 3 ? 1 : gap;
  const blank = starterState(request) === "blank";
  return (
    <div data-slot="quote-cases" className="ez:grid ez:pt-8 ez:text-fg">
      <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-4">
        <h1 className="ez:m-0 ez:flex ez:items-baseline ez:gap-5 ez:text-site-section ez:text-fg ez:md:text-site-page">
          {title}
          <span className="ez:text-site-counter ez:font-normal ez:text-muted ez:tabular-nums">{count}</span>
        </h1>
        {rating && rating.count > 0 && <Rating value={rating.average} count={rating.count} className="ez:pb-1.5" />}
      </div>
      {tabs.length > 1 ? (
        <nav aria-label={QUOTE_TITLE.category} className={cn(rule, "ez:mt-8 ez:flex ez:flex-wrap ez:gap-x-8 ez:gap-y-2 ez:border-b")}>
          {tabs.map((t) => (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={cn("ez:inline-flex ez:items-baseline ez:gap-1.5 ez:pb-3.5 ez:text-site-body ez:text-muted ez:no-underline", t.on && "ez:font-medium ez:text-fg", focusRing)}
            >
              {t.label}
              {t.count ? <span className="ez:text-site-small ez:font-normal ez:text-muted ez:tabular-nums">{t.count}</span> : null}
            </NextLink>
          ))}
        </nav>
      ) : null}
      <div className={cn("ez:grid ez:grid-cols-2 ez:gap-x-4 ez:gap-y-10 ez:md:grid-cols-3 ez:md:gap-x-8 ez:md:gap-y-12", tabs.length > 1 ? "ez:mt-10" : "ez:mt-9")}>
        {cases.map((c) => (
          <ListItem key={c.id} c={c} />
        ))}
        <section
          aria-label={QUOTE_TITLE.request}
          data-blank={blank ? "" : undefined}
          className={cn(rule, "ez:col-span-2 ez:flex ez:flex-col ez:gap-8 ez:rounded-lg ez:border ez:bg-surface-alt ez:px-8 ez:py-9", MD_SPAN[span])}
        >
          <p data-script={scriptOf(storeName || QUOTE_TITLE.request)} className="ez:m-0 ez:text-site-section ez:text-fg">{storeName || QUOTE_TITLE.request}</p>
          <div className="ez:mt-auto ez:grid ez:gap-4">
            <RequestAction data={request} />
            {!blank && <Contact phone={request.phone} hours={request.hours} stack />}
          </div>
        </section>
      </div>
    </div>
  );
}
