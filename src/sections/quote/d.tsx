import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Button, ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import type { ProductSummary } from "../../types";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, BlankStars, Lines } from "../kit";
import type { FooterLink } from "../shop/types";
import type { Case, QuoteStarter, Review } from "../template/data";
import { QuoteNavLinks } from "./nav";
import { average, CASES_HREF, caseView, includesOf, leadCase, QUOTE_CONSENT, QUOTE_HREF, QUOTE_TITLE, restCases, reviewCount } from "./shared";
import { OPTION_GRID, OptionCell, StarterForm, starterState } from "./starter";
import type { QuoteFooterProps, QuoteHeaderProps, QuoteListProps } from "./types";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:box-border ez:px-page";

const h2 = "ez:m-0 ez:text-site-section ez:text-fg ez:md:text-site-page";

const hair = "ez:border-0 ez:border-solid ez:border-hairline";

const more = cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1.5 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const glassLink = cn(
  "ez:fx-glass ez:inline-flex ez:items-center ez:justify-center ez:gap-2 ez:rounded-full ez:font-body ez:text-site-body ez:font-medium ez:whitespace-nowrap ez:text-fg ez:no-underline",
  focusRing,
);

const big = "ez:fx-press ez:min-h-13 ez:rounded-full ez:px-7 ez:text-site-body";

const sky = "ez:fx-aurora ez:absolute ez:-top-40 ez:left-[calc(50%-50vw)] ez:-z-1 ez:h-285 ez:w-screen";

const MD_COLS: Record<number, string> = {
  1: "ez:md:grid-cols-1",
  2: "ez:md:grid-cols-2",
  3: "ez:md:grid-cols-3",
  4: "ez:md:grid-cols-4",
  5: "ez:md:grid-cols-5",
  6: "ez:md:grid-cols-6",
};

function tel(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function Head({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-x-6 ez:gap-y-3">
      <h2 data-script={scriptOf(title)} className={h2}>{title}</h2>
      {aside}
    </div>
  );
}

function Rating({ value, count, className }: { value: number; count: number; className?: string }) {
  return (
    <span className={cn("ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-body ez:text-muted", className)}>
      <Icon name="star" size="sm" className="ez:fill-current ez:text-star" />
      {`${average(value)} · ${reviewCount(count)}`}
    </span>
  );
}

export function Header({ name, logoUrl, phone, nav, links }: QuoteHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="aurora" className="ez:relative ez:z-10 ez:bg-transparent ez:text-fg">
      <div className={cn(wrap, "ez:pt-4 ez:lg:pt-6")}>
        <div className="ez:fx-glass ez:grid ez:h-14 ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-4 ez:rounded-full ez:pr-2 ez:pl-5 ez:lg:h-17 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] ez:lg:pr-3 ez:lg:pl-8">
          <NextLink data-script={scriptOf(name)} href="/" className={cn("ez:min-w-0 ez:justify-self-start ez:text-site-item ez:font-normal ez:text-fg ez:no-underline", focusRing)}>
            <SiteLogo name={name} src={logoUrl} />
          </NextLink>
          <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:justify-center ez:gap-9 ez:overflow-hidden ez:whitespace-nowrap ez:max-lg:hidden">
            <QuoteNavLinks items={nav} className={cn("ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)} currentClassName="ez:font-medium ez:text-fg" />
          </nav>
          <div className="ez:flex ez:items-center ez:justify-self-end ez:gap-3 ez:text-site-body ez:lg:gap-6">
            {phone && (
              <a href={tel(phone)} className={cn("ez:inline-flex ez:h-10 ez:min-w-10 ez:items-center ez:justify-center ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}>
                <Icon name="phone" size="sm" className="ez:sm:hidden" />
                <span className="ez:max-sm:sr-only">{phone}</span>
              </a>
            )}
            <NextLink href={links.lookup.href} className={cn("ez:whitespace-nowrap ez:text-muted ez:no-underline ez:hover:text-fg ez:max-md:hidden", focusRing)}>
              {links.lookup.label}
            </NextLink>
            <ButtonLink href={links.request.href} className="ez:min-h-10 ez:rounded-full ez:px-5 ez:text-site-body ez:lg:min-h-11">
              {links.request.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function CaseBox({ c }: { c: Case }) {
  const view = caseView(c);
  return (
    <NextLink
      href={view.href}
      data-slot="hero-case"
      className={cn("ez:fx-glass ez:fx-round-md ez:relative ez:mt-3 ez:block ez:px-6 ez:pt-5.5 ez:pb-3 ez:text-fg ez:no-underline ez:lg:absolute ez:lg:bottom-12 ez:lg:-left-18 ez:lg:mt-0 ez:lg:w-75", focusRing)}
    >
      <span className="ez:text-site-small ez:text-muted">{QUOTE_TITLE.cases}</span>
      <span data-script={scriptOf(view.title)} className="ez:mt-1 ez:block ez:truncate ez:text-site-heading ez:text-fg">{view.title}</span>
      {view.facts.length > 0 && (
        <dl className="ez:m-0 ez:mt-3.5 ez:text-site-body">
          {view.facts.map((f) => (
            <div key={f.label} className={cn(hair, "ez:flex ez:justify-between ez:gap-4 ez:border-t ez:py-2.5")}>
              <dt className="ez:shrink-0 ez:text-muted">{f.label}</dt>
              <dd className="ez:m-0 ez:min-w-0 ez:truncate ez:text-right ez:text-fg"><Won value={f.value} /></dd>
            </div>
          ))}
        </dl>
      )}
    </NextLink>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const lead = leadCase(data.cases);
  const image = lead?.image ?? data.image ?? null;
  const title = data.title?.trim() || null;
  const blank = !title && !image;
  const statement = "ez:fx-title ez:m-0 ez:break-keep ez:text-fg";
  return (
    <section
      data-slot="hero"
      data-variant="aurora"
      data-blank={blank ? "" : undefined}
      className="ez:relative ez:isolate ez:grid ez:items-center ez:gap-10 ez:pt-6 ez:text-fg ez:lg:grid-cols-2 ez:lg:gap-6 ez:lg:pt-10"
    >
      <div aria-hidden="true" className={sky} />
      <div className="ez:flex ez:min-w-0 ez:flex-col">
        {title ? (
          <h1 data-script={scriptOf(title)} className={statement}>{title}</h1>
        ) : blank ? (
          <span aria-hidden="true" className="ez:fx-title ez:grid ez:gap-3">
            <Bar size="long" strong block />
          </span>
        ) : (
          <p data-script={scriptOf(context.storeName)} className={statement}>{context.storeName}</p>
        )}
        {title && data.sub ? (
          <p data-script={scriptOf(data.sub)} data-slot="hero-sub" className="ez:m-0 ez:mt-6 ez:max-w-118 ez:text-site-item ez:leading-relaxed ez:font-normal ez:text-muted">
            {data.sub}
          </p>
        ) : (
          blank && <Lines className="ez:mt-6 ez:max-w-118 ez:text-site-item" />
        )}
        {blank ? (
          <div className="ez:mt-10 ez:flex ez:gap-3">
            <BlankButton variant="outline" className={cn(big, "ez:border-transparent ez:bg-glass ez:text-muted ez:shadow-none")}>
              {QUOTE_TITLE.request}
            </BlankButton>
          </div>
        ) : (
          <div className="ez:mt-10 ez:flex ez:flex-wrap ez:gap-3">
            <ButtonLink href={QUOTE_HREF} className={big}>
              {QUOTE_TITLE.request}
            </ButtonLink>
            <NextLink href={CASES_HREF} className={cn(glassLink, "ez:min-h-13 ez:px-7")}>
              {QUOTE_TITLE.cases}
            </NextLink>
          </div>
        )}
      </div>
      <div className="ez:relative ez:min-w-0">
        <div className="ez:fx-round-xl ez:overflow-hidden">
          <Photo src={image} alt={lead?.title ?? title ?? ""} preload tone={0} sizes="(max-width: 1024px) 100vw, 660px" className="ez:aspect-4/3 ez:rounded-none ez:lg:aspect-auto ez:lg:h-185" />
        </div>
        {lead && <CaseBox c={lead} />}
      </div>
    </section>
  );
}

function CaseTile({ c, tone }: { c: Case; tone: number }) {
  const view = caseView(c);
  return (
    <NextLink data-slot="case-item" href={view.href} className={cn("ez:fx-round-lg ez:group ez:relative ez:block ez:min-w-0 ez:overflow-hidden ez:text-fg ez:no-underline", focusRing)}>
      <Photo src={view.image} alt="" tone={tone} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 432px" className="ez:aspect-square ez:rounded-none" />
      <span className="ez:fx-glass ez:absolute ez:right-3 ez:bottom-3 ez:left-3 ez:flex ez:min-h-14 ez:items-center ez:gap-3 ez:rounded-lg ez:px-5 ez:py-2">
        <span data-script={scriptOf(view.title)} className="ez:min-w-0 ez:truncate ez:text-site-body ez:text-fg ez:underline-offset-4 ez:group-hover:underline">{view.title}</span>
        {view.line && <span data-script={scriptOf(view.line)} className="ez:ml-auto ez:shrink-0 ez:truncate ez:text-site-small ez:text-muted">{view.line}</span>}
      </span>
    </NextLink>
  );
}

function BlankTile({ tone }: { tone: number }) {
  return (
    <div data-slot="case-item" aria-hidden="true" className="ez:fx-round-lg ez:relative ez:min-w-0 ez:overflow-hidden">
      <Photo src={null} alt="" tone={tone} className="ez:aspect-square ez:rounded-none" />
      <span className="ez:fx-glass ez:absolute ez:right-3 ez:bottom-3 ez:left-3 ez:flex ez:min-h-14 ez:items-center ez:rounded-lg ez:px-5 ez:text-site-body">
        <Bar />
      </span>
    </div>
  );
}

const tab = cn("ez:inline-flex ez:items-baseline ez:gap-1.5 ez:pb-1 ez:text-site-body ez:text-site-off ez:no-underline ez:hover:text-fg", focusRing);

function categoriesOf(cases: Case[]): string[] {
  return [...new Set(cases.map((c) => c.category?.trim()).filter((c): c is string => Boolean(c)))];
}

export function Cases({ data }: SectionProps<"case_grid">) {
  const all = data.cases ?? [];
  const rest = restCases(all);
  const pool = (rest.length % 3 === 0 ? rest : all).slice(0, 6);
  const list = pool.length > 3 ? pool.slice(0, pool.length - (pool.length % 3)) : pool;
  const kinds = categoriesOf(all);
  const aside =
    kinds.length > 1 ? (
      <nav aria-label={QUOTE_TITLE.category} className="ez:flex ez:flex-wrap ez:gap-x-7 ez:gap-y-2">
        <NextLink href={CASES_HREF} className={cn(tab, "ez:font-medium ez:text-fg")}>
          {QUOTE_TITLE.all}
        </NextLink>
        {kinds.map((k) => (
          <NextLink key={k} href={`${CASES_HREF}?category=${encodeURIComponent(k)}`} className={tab}>
            {k}
          </NextLink>
        ))}
      </nav>
    ) : all.length ? (
      <NextLink href={CASES_HREF} className={more}>
        {QUOTE_TITLE.more}
        <Icon name="right" size="sm" />
      </NextLink>
    ) : undefined;
  return (
    <section data-slot="case-grid" id="cases" data-variant="aurora" data-blank={all.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={QUOTE_TITLE.cases} aside={aside} />
      <div className="ez:grid ez:grid-cols-1 ez:gap-6 ez:sm:grid-cols-2 ez:lg:grid-cols-3">
        {list.length ? list.map((c, i) => <CaseTile key={c.id} c={c} tone={i} />) : [0, 1, 2].map((i) => <BlankTile key={i} tone={i} />)}
      </div>
    </section>
  );
}

type PackageItem = NonNullable<SectionProps<"package_cards">["data"]["items"]>[number];

function priceParts(price: string): [string, string | null] {
  return price.endsWith("원") ? [price.slice(0, -1), "원"] : [price, null];
}

const planCard = "ez:fx-glass ez:fx-round-md ez:flex ez:min-h-80 ez:min-w-0 ez:flex-col ez:px-7 ez:pt-7 ez:pb-6 ez:lg:min-h-94";

function PlanCard({ p }: { p: PackageItem }) {
  const [amount, unit] = priceParts(p.price);
  const lines = includesOf(p);
  return (
    <li className={planCard}>
      <span data-script={scriptOf(p.name)} className="ez:text-site-item ez:font-normal ez:break-keep ez:text-fg">{p.name}</span>
      <span className="ez:mt-3 ez:flex ez:items-baseline ez:gap-1">
        <span className="ez:text-site-section ez:break-all ez:text-fg ez:lg:text-site-page">{amount}</span>
        {unit && <span className="ez:text-site-body ez:text-muted">{unit}</span>}
      </span>
      {lines.length > 0 && (
        <ul aria-label={QUOTE_TITLE.includes} data-slot="package-includes" className="ez:m-0 ez:mt-6 ez:grid ez:list-none ez:p-0">
          {lines.map((text, i) => (
            <li key={`${text}-${i}`} className="ez:flex ez:items-start ez:gap-2.5 ez:py-1.5 ez:text-site-body ez:text-muted">
              <Icon name="check" size="sm" className="ez:mt-0.5 ez:text-site-off" />
              <span className="ez:min-w-0">{text}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="ez:mt-auto ez:pt-6">
        <NextLink
          href={QUOTE_HREF}
          aria-label={`${p.name} ${QUOTE_TITLE.request}`}
          className={cn(hair, "ez:flex ez:items-center ez:justify-between ez:border-t ez:pt-4.5 ez:text-site-body ez:text-fg ez:no-underline", focusRing)}
        >
          {QUOTE_TITLE.request}
          <Icon name="right" size="sm" />
        </NextLink>
      </div>
    </li>
  );
}

function BlankPlan() {
  return (
    <li className={planCard}>
      <span className="ez:text-site-item">
        <Bar />
      </span>
      <BlankPrice className="ez:mt-3 ez:text-site-section ez:text-muted ez:lg:text-site-page" />
      <span className="ez:mt-6 ez:grid ez:gap-3 ez:text-site-body">
        <Bar block />
        <Bar size="short" block />
      </span>
    </li>
  );
}

export function Packages({ data }: SectionProps<"package_cards">) {
  const items = data.items ?? [];
  const n = items.length || 4;
  const cols = n <= 4 ? n : n % 3 === 0 ? 3 : 4;
  return (
    <section data-slot="package-cards" id="packages" data-variant="aurora" data-blank={items.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={QUOTE_TITLE.packages} />
      <div className="ez:fx-aurora-wash ez:fx-round-xl ez:p-3 ez:md:p-10">
        <ul className={cn("ez:m-0 ez:grid ez:list-none ez:grid-cols-1 ez:gap-4 ez:p-0 ez:sm:grid-cols-2", cols >= 3 ? cn("ez:md:grid-cols-2", cols === 3 ? "ez:lg:grid-cols-3" : "ez:lg:grid-cols-4") : MD_COLS[cols])}>
          {items.length ? items.map((p, i) => <PlanCard key={`${p.name}-${i}`} p={p} />) : [0, 1, 2, 3].map((i) => <BlankPlan key={i} />)}
        </ul>
      </div>
    </section>
  );
}

export function Process({ data }: SectionProps<"process_steps">) {
  const steps = data.steps ?? [];
  const shown: (string | null)[] = steps.length ? steps : [null, null, null, null, null];
  return (
    <section data-slot="process-steps" id="process" data-variant="aurora" data-blank={steps.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={QUOTE_TITLE.process} />
      <ol className={cn("ez:m-0 ez:grid ez:list-none ez:gap-4 ez:p-0 ez:md:gap-0", MD_COLS[Math.max(1, Math.min(6, shown.length))])}>
        {shown.map((s, i) => (
          <li
            key={i}
            className="ez:relative ez:flex ez:items-center ez:gap-4 ez:md:block ez:md:not-last:after:absolute ez:md:not-last:after:top-5.5 ez:md:not-last:after:right-0 ez:md:not-last:after:left-11 ez:md:not-last:after:h-px ez:md:not-last:after:bg-site-line ez:md:not-last:after:content-['']"
          >
            <span
              aria-hidden={s ? undefined : "true"}
              className="ez:relative ez:z-1 ez:flex ez:size-11 ez:shrink-0 ez:items-center ez:justify-center ez:rounded-full ez:border ez:border-solid ez:border-site-line ez:bg-surface-alt ez:text-site-note ez:text-muted"
            >
              {s ? i + 1 : null}
            </span>
            <span data-script={scriptOf(s)} className="ez:block ez:min-w-0 ez:text-site-heading ez:break-keep ez:text-fg ez:md:mt-5.5 ez:md:pr-6">{s ?? <Bar />}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

const reviewCard = "ez:fx-round-lg ez:flex ez:min-h-60 ez:min-w-0 ez:flex-col ez:bg-surface-alt ez:px-8 ez:pt-8 ez:pb-7 ez:md:min-h-68";

function productOf(products: ProductSummary[], review: Review): string | undefined {
  return review.product ? products.find((p) => p.id === review.product)?.name : undefined;
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  const count = data.count ?? items.length;
  const aside = items.length && data.average != null ? <span className="ez:pb-1 ez:text-site-body ez:text-muted">{`${average(data.average)} · ${reviewCount(count)}`}</span> : null;
  return (
    <section data-slot="reviews" id="reviews" data-variant="aurora" data-blank={items.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={QUOTE_TITLE.reviews} aside={aside} />
      <div className="ez:grid ez:grid-cols-1 ez:gap-4 ez:md:grid-cols-3 ez:md:gap-6">
        {items.length
          ? items.map((r, i) => (
              <article key={`${r.name}-${r.date ?? ""}-${i}`} className={reviewCard}>
                <span role="img" aria-label={`별점 ${r.rating}점`} className="ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-note ez:text-muted">
                  <Icon name="star" size="sm" className="ez:fill-current ez:text-star" />
                  {r.rating.toFixed(1)}
                </span>
                <p data-script={scriptOf(r.body)} className="ez:m-0 ez:mt-4.5 ez:line-clamp-4 ez:text-site-item ez:leading-relaxed ez:whitespace-pre-line ez:text-fg">{r.body}</p>
                <span className="ez:mt-auto ez:truncate ez:pt-5.5 ez:text-site-small ez:text-site-off">{[r.name, productOf(context.products, r), r.date].filter(Boolean).join(" · ")}</span>
              </article>
            ))
          : [0, 1, 2].map((i) => (
              <div key={i} className={reviewCard}>
                <BlankStars />
                <Lines className="ez:mt-5 ez:text-site-item" />
                <span className="ez:mt-auto ez:pt-5.5 ez:text-site-small">
                  <Bar size="short" />
                </span>
              </div>
            ))}
      </div>
    </section>
  );
}

const option = "ez:min-h-14 ez:border-hairline ez:bg-field ez:text-site-body ez:text-muted ez:lg:justify-start ez:lg:px-5 ez:lg:text-left";

const optionGrid = cn(OPTION_GRID, "ez:mt-4 ez:gap-2 ez:lg:grid-cols-1");

function StarterBody({ data }: { data: QuoteStarter }) {
  const state = starterState(data);
  if (state === "closed") return <p className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{QUOTE_TITLE.closed}</p>;
  if (state === "blank") {
    return (
      <div className="ez:grid">
        <span aria-hidden="true" className="ez:text-site-heading">
          <Bar size="short" />
        </span>
        <div aria-hidden="true" className={optionGrid}>
          {[0, 1, 2, 3].map((j) => (
            <span key={j} className="ez:flex ez:min-h-14 ez:items-center ez:justify-center ez:rounded-button ez:border ez:border-solid ez:border-hairline ez:bg-field ez:px-5 ez:lg:justify-start">
              <Bar size="short" />
            </span>
          ))}
        </div>
        <BlankButton variant="outline" className={cn(big, "ez:mt-5 ez:w-full ez:border-transparent ez:bg-glass ez:text-muted ez:shadow-none")}>
          {QUOTE_TITLE.request}
        </BlankButton>
        <p className="ez:m-0 ez:mt-3.5 ez:text-site-small ez:text-muted">{QUOTE_CONSENT}</p>
      </div>
    );
  }
  const questions = data.questions ?? [];
  return (
    <StarterForm data={data} className="ez:grid">
      {questions.map((q, i) => (
        <fieldset key={q.id} className="ez:m-0 ez:mb-6 ez:min-w-0 ez:border-0 ez:p-0">
          <legend className="ez:flex ez:w-full ez:items-baseline ez:justify-between ez:gap-4 ez:p-0 ez:text-site-heading ez:text-fg">
            <span className="ez:min-w-0">{q.label}</span>
            {questions.length > 1 && (
              <span aria-hidden="true" className="ez:shrink-0 ez:text-site-small ez:text-site-off">
                {`${i + 1} / ${questions.length}`}
              </span>
            )}
          </legend>
          <div className={optionGrid}>
            {q.options.map((o) => (
              <OptionCell key={o} name={q.id} value={o} className={option} />
            ))}
          </div>
        </fieldset>
      ))}
      {data.rest?.length ? (
        <p className={cn(hair, "ez:m-0 ez:mb-5 ez:flex ez:flex-wrap ez:gap-x-2 ez:gap-y-1 ez:border-t ez:pt-3.5 ez:text-site-note ez:text-muted")}>
          {data.rest.map((r, i) => (
            <span key={r} className="ez:inline-flex ez:gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="ez:text-site-off">
                  ·
                </span>
              )}
              {r}
            </span>
          ))}
        </p>
      ) : null}
      <Button type="submit" block className={big}>
        {QUOTE_TITLE.request}
      </Button>
      <p className="ez:m-0 ez:mt-3.5 ez:text-site-small ez:text-muted">{QUOTE_CONSENT}</p>
    </StarterForm>
  );
}

function Contacts({ phone, hours, blank }: { phone?: string | null; hours?: string | null; blank?: boolean }) {
  const rows: { label: string; value: ReactNode }[] = [];
  if (phone)
    rows.push({
      label: QUOTE_TITLE.center,
      value: (
        <a href={tel(phone)} className={cn("ez:text-fg ez:no-underline", focusRing)}>
          {phone}
        </a>
      ),
    });
  else if (blank) rows.push({ label: QUOTE_TITLE.center, value: <Bar size="short" /> });
  if (hours) rows.push({ label: QUOTE_TITLE.hours, value: hours });
  else if (blank) rows.push({ label: QUOTE_TITLE.hours, value: <Bar /> });
  if (!rows.length) return null;
  return (
    <dl className="ez:m-0 ez:max-w-105 ez:text-site-body">
      {rows.map((r) => (
        <div key={r.label} className="ez:flex ez:justify-between ez:gap-6 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:py-3.5">
          <dt className="ez:shrink-0 ez:text-muted">{r.label}</dt>
          <dd className="ez:m-0 ez:min-w-0 ez:text-right ez:text-fg">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Request({ data, context }: SectionProps<"quote_starter">) {
  const blank = starterState(data) === "blank";
  return (
    <section
      data-slot="quote-starter"
      id="request"
      data-variant="aurora"
      data-blank={blank ? "" : undefined}
      className="ez:fx-aurora-wash ez:fx-round-xl ez:grid ez:items-center ez:gap-10 ez:px-4 ez:py-8 ez:text-fg ez:md:p-8 ez:lg:grid-cols-[minmax(0,1fr)_32.5rem] ez:lg:gap-18 ez:lg:py-16 ez:lg:pl-18"
    >
      <div className="ez:grid ez:min-w-0 ez:gap-12 ez:px-2 ez:md:px-0">
        <h2 className="ez:sr-only">{QUOTE_TITLE.request}</h2>
        {context.storeName ? (
          <p data-script={scriptOf(context.storeName)} className="ez:m-0 ez:text-site-section ez:break-keep ez:text-fg ez:md:text-site-display-sm">{context.storeName}</p>
        ) : (
          <span className="ez:text-site-display-sm">
            <Bar size="long" strong />
          </span>
        )}
        <Contacts phone={data.phone} hours={data.hours} blank={blank} />
      </div>
      <div className="ez:fx-glass ez:fx-round-md ez:min-w-0 ez:p-6 ez:md:p-8">
        <StarterBody data={data} />
      </div>
    </section>
  );
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:grid ez:content-start ez:gap-2">
      <span data-script={scriptOf(title)} className="ez:mb-2 ez:text-site-note ez:text-muted">{title}</span>
      {items.map((l) => (
        <NextLink
          key={`${l.label}-${l.href}`}
          href={l.href}
          className={cn("ez:justify-self-start ez:text-site-note ez:no-underline ez:hover:text-fg", l.strong ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}
        >
          {l.label}
        </NextLink>
      ))}
    </nav>
  );
}

export function Footer({ storeName, phone, hours, business, nav, guide, account, terms }: QuoteFooterProps) {
  const links = [...nav, ...guide, ...account].filter((l, i, all) => all.findIndex((o) => o.href === l.href) === i);
  return (
    <footer data-slot="site-footer" data-variant="aurora" className="ez:mt-18 ez:text-fg">
      <div className={cn(wrap, "ez:pt-10 ez:pb-12")}>
        <div className="ez:grid ez:grid-cols-2 ez:gap-x-8 ez:gap-y-10 ez:md:grid-cols-4 ez:lg:grid-cols-[2fr_1fr_1fr_2fr]">
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-4 ez:md:col-span-4 ez:lg:col-span-1">
            <span data-script={scriptOf(storeName)} className="ez:text-site-item ez:font-normal ez:text-fg">{storeName}</span>
            {(phone || hours) && (
              <div className="ez:grid ez:gap-1">
                <span className="ez:text-site-note ez:text-muted">{QUOTE_TITLE.center}</span>
                {phone && (
                  <a href={tel(phone)} className={cn("ez:justify-self-start ez:text-site-heading ez:text-fg ez:no-underline", focusRing)}>
                    {phone}
                  </a>
                )}
                {hours && <span className="ez:text-site-note ez:text-muted">{`${QUOTE_TITLE.hours} ${hours}`}</span>}
              </div>
            )}
          </div>
          <FooterColumn title={QUOTE_TITLE.guide} items={links} />
          {terms.length > 0 && <FooterColumn title={QUOTE_TITLE.terms} items={terms} />}
          {business.length > 0 && (
            <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-2 ez:lg:col-span-1">
              <span className="ez:mb-2 ez:text-site-note ez:text-muted">{QUOTE_TITLE.business}</span>
              <dl aria-label={QUOTE_TITLE.business} className="ez:m-0 ez:grid ez:gap-2 ez:text-site-note">
                {business.map((r) => (
                  <div key={r.label} className="ez:flex ez:min-w-0 ez:gap-2">
                    <dt className="ez:shrink-0 ez:text-muted">{r.label}</dt>
                    <dd className="ez:m-0 ez:min-w-0 ez:break-words ez:text-muted"><Won value={r.value} /></dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
        <p className={cn(hair, "ez:m-0 ez:mt-12 ez:border-t ez:pt-6 ez:text-site-small ez:text-muted")}>{`© ${storeName}`}</p>
      </div>
    </footer>
  );
}

function ListTile({ c, tone }: { c: Case; tone: number }) {
  const view = caseView(c);
  return (
    <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-3">
      <CaseTile c={c} tone={tone} />
      {view.scope && (
        <p className="ez:m-0 ez:flex ez:gap-2.5 ez:px-1.5 ez:text-site-note">
          <span className="ez:shrink-0 ez:text-muted">{QUOTE_TITLE.scope}</span>
          <span className="ez:min-w-0 ez:text-fg">{view.scope}</span>
        </p>
      )}
    </div>
  );
}

function ListRequest({ data, storeName }: { data: QuoteStarter; storeName?: string | null }) {
  const state = starterState(data);
  return (
    <section
      aria-label={QUOTE_TITLE.request}
      data-blank={state === "blank" ? "" : undefined}
      className="ez:fx-aurora-wash ez:fx-round-xl ez:mt-24 ez:grid ez:items-center ez:gap-8 ez:px-6 ez:py-9 ez:md:px-12 ez:md:py-14 ez:lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] ez:lg:gap-18"
    >
      <p data-script={scriptOf(storeName || QUOTE_TITLE.request)} className="ez:m-0 ez:text-site-section ez:break-keep ez:text-fg ez:md:text-site-page">{storeName || QUOTE_TITLE.request}</p>
      <div className="ez:fx-glass ez:fx-round-md ez:grid ez:gap-5 ez:p-6 ez:md:p-8">
        {state === "open" ? (
          <ButtonLink href={data.href ?? QUOTE_HREF} block className={big}>
            {QUOTE_TITLE.request}
          </ButtonLink>
        ) : state === "closed" ? (
          <p className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{QUOTE_TITLE.closed}</p>
        ) : (
          <BlankButton variant="outline" className={cn(big, "ez:w-full ez:border-transparent ez:bg-glass ez:text-muted ez:shadow-none")}>
            {QUOTE_TITLE.request}
          </BlankButton>
        )}
        <Contacts phone={data.phone} hours={data.hours} />
      </div>
    </section>
  );
}

export function List({ title, count, tabs, cases, rating, request, storeName }: QuoteListProps) {
  return (
    <div data-slot="quote-cases" data-variant="aurora" className="ez:grid ez:pt-8 ez:text-fg">
      <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-4">
        <h1 className="ez:m-0 ez:flex ez:items-baseline ez:gap-4 ez:text-site-section ez:text-fg ez:md:text-site-page">
          {title}
          <span className="ez:text-site-item ez:font-normal ez:text-muted">{count}</span>
        </h1>
        {rating && rating.count > 0 && <Rating value={rating.average} count={rating.count} className="ez:pb-1.5" />}
      </div>
      {tabs.length > 1 && (
        <nav aria-label={QUOTE_TITLE.category} className={cn(hair, "ez:mt-8 ez:flex ez:flex-wrap ez:gap-x-8 ez:gap-y-2 ez:border-b")}>
          {tabs.map((t) => (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={cn("ez:inline-flex ez:items-baseline ez:gap-1.5 ez:pb-3.5 ez:text-site-body ez:text-site-off ez:no-underline ez:hover:text-fg", t.on && "ez:fx-tab ez:font-medium ez:text-fg", focusRing)}
            >
              {t.label}
              {t.count ? <span className="ez:text-site-small ez:font-normal ez:text-muted">{t.count}</span> : null}
            </NextLink>
          ))}
        </nav>
      )}
      <div className={cn("ez:grid ez:grid-cols-1 ez:gap-x-6 ez:gap-y-8 ez:sm:grid-cols-2 ez:lg:grid-cols-3", tabs.length > 1 ? "ez:mt-10" : "ez:mt-9")}>
        {cases.map((c, i) => (
          <ListTile key={c.id} c={c} tone={i} />
        ))}
      </div>
      <ListRequest data={request} storeName={storeName} />
    </div>
  );
}
