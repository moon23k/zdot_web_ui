import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Button, ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, BlankStars, Lines } from "../kit";
import type { FooterLink } from "../shop/types";
import type { Case, QuoteStarter } from "../template/data";
import { QuoteNavLinks } from "./nav";
import { average, CASES_HREF, caseView, includesOf, leadCase, QUOTE_CONSENT, QUOTE_HREF, QUOTE_TITLE, reviewCount } from "./shared";
import { StarterForm, starterState } from "./starter";
import type { QuoteFooterProps, QuoteHeaderProps, QuoteListProps } from "./types";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:box-border ez:px-page";

const bleed = "ez:mx-[calc(50%-50vw)]";

const line = "ez:border-0 ez:border-solid ez:border-site-line";

const hair = "ez:border-0 ez:border-solid ez:border-hairline";

const display = "ez:m-0 ez:font-body ez:text-site-section ez:text-fg ez:md:text-site-display-sm";

const figure = "ez:font-figure ez:tabular-nums";

const muteLink = cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const moreLink = cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1.5 ez:text-site-small ez:text-site-off ez:no-underline ez:hover:text-fg", focusRing);

const glowFloor = "ez:pointer-events-none ez:absolute ez:inset-0 ez:bg-[radial-gradient(70%_90%_at_22%_128%,var(--ezd-glow-soft),transparent_70%)]";

const LG_COLS: Record<number, string> = {
  1: "ez:lg:grid-cols-1",
  2: "ez:lg:grid-cols-2",
  3: "ez:lg:grid-cols-3",
  4: "ez:lg:grid-cols-4",
  5: "ez:lg:grid-cols-5",
  6: "ez:lg:grid-cols-6",
};

function tel(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function pad(i: number) {
  return String(i + 1).padStart(2, "0");
}

function Head({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-x-6 ez:gap-y-3 ez:pb-7">
      <h2 className={display}>{title}</h2>
      {aside}
    </div>
  );
}

export function Header({ name, logoUrl, phone, nav, links }: QuoteHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="float" className="ez:bg-surface ez:text-fg">
      <div className={cn(wrap, "ez:flex ez:h-16 ez:items-center ez:gap-6 ez:lg:h-22")}>
        <NextLink href="/" className={cn("ez:min-w-0 ez:text-site-heading ez:text-fg ez:no-underline ez:lg:w-51 ez:lg:shrink-0", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:gap-9 ez:overflow-hidden ez:text-site-body ez:whitespace-nowrap ez:max-lg:hidden">
          <QuoteNavLinks items={nav} className={muteLink} currentClassName="ez:text-fg" />
        </nav>
        <div className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-6 ez:text-site-body">
          {phone && (
            <a href={tel(phone)} className={cn("ez:inline-flex ez:items-center ez:text-muted ez:no-underline ez:hover:text-fg", figure, focusRing)}>
              <Icon name="phone" className="ez:sm:hidden" />
              <span className="ez:max-sm:sr-only">{phone}</span>
            </a>
          )}
          <NextLink href={links.lookup.href} className={cn("ez:max-md:hidden", muteLink)}>
            {links.lookup.label}
          </NextLink>
          <NextLink href={links.account.href} className={cn("ez:max-lg:hidden", muteLink)}>
            {links.account.label}
          </NextLink>
          <ButtonLink href={links.request.href} className="ez:h-11 ez:min-h-0 ez:rounded-full ez:px-5 ez:text-site-body">
            {links.request.label}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:flex ez:flex-col ez:lg:col-span-2">
      <span className="ez:mb-3.5 ez:text-site-small ez:text-muted">{title}</span>
      {items.map((l) => (
        <NextLink
          key={`${l.label}-${l.href}`}
          href={l.href}
          className={cn("ez:self-start ez:text-site-small ez:leading-loose ez:no-underline ez:hover:text-fg", l.strong ? "ez:text-fg" : "ez:text-site-off", focusRing)}
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
    <footer data-slot="site-footer" data-variant="night" className="ez:text-site-off">
      <div className={wrap}>
        <div className={cn(line, "ez:grid ez:grid-cols-2 ez:gap-x-6 ez:gap-y-10 ez:border-t ez:pt-13 ez:pb-10 ez:md:grid-cols-4 ez:lg:grid-cols-12")}>
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-2 ez:md:col-span-4">
            <p className="ez:m-0 ez:text-site-heading ez:text-fg">{storeName}</p>
            {phone && (
              <a href={tel(phone)} className={cn("ez:mt-2 ez:justify-self-start ez:text-site-body ez:text-fg ez:no-underline", figure, focusRing)}>
                <span className="ez:mr-2 ez:font-body ez:text-site-small ez:text-site-off">{QUOTE_TITLE.center}</span>
                {phone}
              </a>
            )}
            {hours && <span className="ez:text-site-small ez:text-site-off">{`${QUOTE_TITLE.hours} ${hours}`}</span>}
          </div>
          <FooterColumn title={QUOTE_TITLE.guide} items={links} />
          {terms.length > 0 && <FooterColumn title={QUOTE_TITLE.terms} items={terms} />}
          <div className="ez:col-span-2 ez:flex ez:flex-col ez:md:col-span-4">
            <span className="ez:mb-3.5 ez:text-site-small ez:text-muted">{QUOTE_TITLE.business}</span>
            <dl aria-label={QUOTE_TITLE.business} className="ez:m-0 ez:grid ez:grid-cols-[auto_minmax(0,1fr)] ez:gap-x-6 ez:gap-y-1 ez:text-site-small ez:leading-relaxed">
              {business.map((r) => (
                <div key={r.label} className="ez:contents">
                  <dt>{r.label}</dt>
                  <dd className="ez:m-0 ez:min-w-0 ez:break-words ez:text-muted ez:tabular-nums">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className={cn(hair, "ez:border-t ez:pt-6 ez:pb-10 ez:text-site-small")}>
          <p className="ez:m-0">{`© ${storeName}`}</p>
        </div>
      </div>
    </footer>
  );
}

function CaseInfo({ c }: { c: Case }) {
  const view = caseView(c);
  return (
    <div data-slot="hero-case" className="ez:fx-glass ez:rounded-lg ez:px-5.5 ez:pt-5 ez:pb-2.5 ez:text-left ez:lg:absolute ez:lg:bottom-7 ez:lg:left-7 ez:lg:w-75">
      <p className="ez:m-0 ez:text-site-small ez:text-site-off">{QUOTE_TITLE.case}</p>
      <NextLink href={view.href} className={cn("ez:mt-1 ez:block ez:text-site-heading ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing)}>
        {view.title}
      </NextLink>
      {view.facts.length > 0 && (
        <dl className="ez:m-0 ez:mt-3 ez:text-site-body">
          {view.facts.map((f) => (
            <div key={f.label} className={cn(hair, "ez:flex ez:justify-between ez:gap-6 ez:border-t ez:py-2.5")}>
              <dt className="ez:whitespace-nowrap ez:text-site-off">{f.label}</dt>
              <dd className="ez:m-0 ez:min-w-0 ez:truncate ez:text-right ez:text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const sub = title ? data.sub?.trim() || null : null;
  const lead = leadCase(data.cases);
  const image = lead?.image ?? data.image ?? null;
  const blank = !title && !image;
  const big = "ez:h-13 ez:min-h-0 ez:rounded-full ez:px-7 ez:text-site-body";
  return (
    <section data-slot="hero" data-variant="full" data-blank={blank ? "" : undefined} data-bleed="" data-flush="" className={cn(bleed, "ez:relative ez:overflow-clip ez:pt-16 ez:text-fg ez:lg:pt-22")}>
      <div aria-hidden="true" className="ez:fx-sky ez:absolute ez:inset-x-0 ez:top-0 ez:h-219 ez:lg:h-225" />
      <div className="ez:relative ez:min-h-203">
        <div aria-hidden="true" className="ez:fx-halo" />
        <div aria-hidden="true" className="ez:fx-orb" />
        <div className={cn(wrap, "ez:relative ez:z-2 ez:flex ez:flex-col ez:items-center ez:pt-21 ez:pb-12 ez:text-center")}>
          {context.storeName ? (
            <p className="ez:fx-fade ez:fx-title-xl ez:m-0 ez:max-w-full ez:break-keep">{context.storeName}</p>
          ) : (
            <span className="ez:flex ez:w-full ez:justify-center ez:text-site-display-sm ez:lg:text-site-hero">
              <Bar size="long" strong />
            </span>
          )}
          {title && <h1 className="ez:m-0 ez:mt-5 ez:max-w-140 ez:text-site-item ez:whitespace-pre-line ez:text-muted">{title}</h1>}
          {sub && (
            <p data-slot="hero-sub" className="ez:m-0 ez:mt-2 ez:max-w-140 ez:text-site-body ez:text-site-off">
              {sub}
            </p>
          )}
          <div className="ez:mt-9 ez:flex ez:flex-wrap ez:justify-center ez:gap-3">
            {blank ? (
              <BlankButton className={big}>{QUOTE_TITLE.request}</BlankButton>
            ) : (
              <>
                <ButtonLink href={QUOTE_HREF} className={big}>
                  {QUOTE_TITLE.request}
                </ButtonLink>
                {(data.cases?.length ?? 0) > 0 && (
                  <ButtonLink href={CASES_HREF} variant="outline" className={cn(big, "ez:border-site-line")}>
                    {QUOTE_TITLE.view}
                  </ButtonLink>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {(image || blank) && (
        <div className={cn(wrap, "ez:relative ez:z-2")}>
          <div className="ez:relative ez:grid ez:gap-3 ez:lg:block ez:lg:h-175">
            <div className="ez:fx-round-md ez:overflow-hidden ez:border ez:border-solid ez:border-site-line ez:lg:absolute ez:lg:inset-0">
              <Photo src={image} alt={lead?.title ?? title ?? ""} preload tone={0} sizes="(max-width: 1440px) 100vw, 1344px" className="ez:aspect-4/3 ez:rounded-none ez:lg:aspect-auto ez:lg:h-full" />
            </div>
            {lead && !blank && <CaseInfo c={lead} />}
          </div>
        </div>
      )}
    </section>
  );
}

const caseGrid =
  "ez:grid ez:grid-cols-[2rem_minmax(0,1fr)_6rem] ez:items-center ez:gap-x-4 ez:py-4 ez:md:grid-cols-[3rem_minmax(0,1fr)_9rem_9rem] ez:lg:h-37 ez:lg:grid-cols-[5.5rem_minmax(0,1fr)_12.75rem_7rem_12.5rem] ez:lg:gap-x-6 ez:lg:py-0";

const casePhoto = "ez:aspect-video ez:rounded-md ez:border ez:border-solid ez:border-hairline";

const litRow = "ez:bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--ezd-select)_40%,transparent)_30%,transparent)]";

function CaseRow({ c, index, lit }: { c: Case; index: number; lit: boolean }) {
  const view = caseView(c);
  return (
    <li data-slot="case-item" className={cn(line, "ez:border-t", lit && litRow)}>
      <NextLink href={view.href} className={cn("ez:group ez:no-underline", caseGrid, focusRing)}>
        <span className={cn("ez:text-site-small ez:text-site-off", figure)}>{pad(index)}</span>
        <span className="ez:grid ez:min-w-0 ez:gap-1">
          <span className="ez:flex ez:min-w-0 ez:items-center ez:gap-4">
            {lit && <span aria-hidden="true" className="ez:fx-glow ez:size-2 ez:shrink-0 ez:rounded-full ez:bg-primary" />}
            <span
              className={cn("ez:truncate ez:text-site-heading ez:group-hover:text-fg ez:lg:text-site-section", lit ? "ez:text-fg" : "ez:text-muted")}
            >
              {view.title}
            </span>
          </span>
          {view.line && <span className="ez:truncate ez:text-site-small ez:text-site-off ez:md:hidden">{view.line}</span>}
        </span>
        <span className="ez:truncate ez:text-site-small ez:text-site-off ez:max-md:hidden">{view.category}</span>
        <span className="ez:truncate ez:text-site-small ez:text-site-off ez:max-lg:hidden">{view.area ?? view.scope}</span>
        <Photo src={view.image} alt="" tone={index} sizes="200px" className={cn(casePhoto, "ez:md:max-lg:col-start-4 ez:md:max-lg:row-start-1", !lit && "ez:opacity-60")} />
      </NextLink>
    </li>
  );
}

function BlankCaseRow({ index }: { index: number }) {
  return (
    <li className={cn(line, "ez:border-t")}>
      <div className={caseGrid}>
        <span />
        <span className="ez:text-site-heading ez:lg:text-site-section">
          <Bar size="long" />
        </span>
        <span className="ez:text-site-small ez:max-md:hidden">
          <Bar size="short" />
        </span>
        <span className="ez:text-site-small ez:max-lg:hidden">
          <Bar size="short" />
        </span>
        <Photo src={null} alt="" tone={index} className={cn(casePhoto, "ez:md:max-lg:col-start-4 ez:md:max-lg:row-start-1")} />
      </div>
    </li>
  );
}

function categoriesOf(cases: Case[]): string[] {
  return [...new Set(cases.map((c) => c.category?.trim()).filter((v): v is string => Boolean(v)))];
}

export function Cases({ data }: SectionProps<"case_grid">) {
  const all = data.cases ?? [];
  const shown = all.slice(0, 6);
  const kinds = categoriesOf(all).slice(0, 4);
  const aside =
    kinds.length > 1 ? (
      <nav aria-label={QUOTE_TITLE.category} className="ez:flex ez:flex-wrap ez:gap-x-7 ez:gap-y-2 ez:text-site-body">
        <NextLink href={CASES_HREF} className={cn("ez:text-fg ez:no-underline", focusRing)}>
          {QUOTE_TITLE.all}
        </NextLink>
        {kinds.map((k) => (
          <NextLink key={k} href={`${CASES_HREF}?category=${encodeURIComponent(k)}`} className={cn("ez:text-site-off ez:no-underline ez:hover:text-fg", focusRing)}>
            {k}
          </NextLink>
        ))}
      </nav>
    ) : all.length ? (
      <NextLink href={CASES_HREF} className={moreLink}>
        {QUOTE_TITLE.more}
        <Icon name="next" size="sm" />
      </NextLink>
    ) : null;
  return (
    <section data-slot="case-grid" id="cases" data-variant="night" data-blank={all.length ? undefined : ""} className="ez:text-fg">
      <Head title={QUOTE_TITLE.cases} aside={aside} />
      <ol className={cn(line, "ez:m-0 ez:list-none ez:border-b ez:p-0")}>
        {shown.length ? shown.map((c, i) => <CaseRow key={c.id} c={c} index={i} lit={i === 0} />) : [0, 1, 2].map((i) => <BlankCaseRow key={i} index={i} />)}
      </ol>
    </section>
  );
}

function ruled(i: number, cols: number) {
  const smLeft = i % 2 === 1;
  const lgLeft = i % cols !== 0;
  return cn(
    i > 0 && "ez:border-t",
    i >= 2 ? "ez:sm:border-t" : "ez:sm:border-t-0",
    smLeft ? "ez:sm:border-l ez:sm:pl-7" : "ez:sm:border-l-0 ez:sm:pl-0",
    i >= cols ? "ez:lg:border-t" : "ez:lg:border-t-0",
    lgLeft ? "ez:lg:border-l ez:lg:pl-7" : "ez:lg:border-l-0 ez:lg:pl-0"
  );
}

function Includes({ lines }: { lines: string[] }) {
  if (!lines.length) return null;
  return (
    <ul aria-label={QUOTE_TITLE.includes} data-slot="package-includes" className="ez:m-0 ez:mt-7 ez:grid ez:list-none ez:gap-1 ez:p-0">
      {lines.map((text, i) => (
        <li key={`${text}-${i}`} className="ez:flex ez:items-start ez:gap-2.5 ez:py-1 ez:text-site-body ez:text-muted">
          <Icon name="check" size="sm" className="ez:mt-1 ez:text-success" />
          <span className="ez:min-w-0">{text}</span>
        </li>
      ))}
    </ul>
  );
}

function priceParts(price: string): [string, string | null] {
  return price.endsWith("원") ? [price.slice(0, -1), "원"] : [price, null];
}

type PackageItem = NonNullable<SectionProps<"package_cards">["data"]["items"]>[number];

function PackageCell({ p, index, cols }: { p: PackageItem | null; index: number; cols: number }) {
  const [amount, unit] = p ? priceParts(p.price) : ["", null];
  return (
    <li className={cn(line, "ez:flex ez:flex-col ez:items-start ez:py-7 ez:pr-7 ez:lg:min-h-95", ruled(index, cols))}>
      <span className={cn("ez:h-5 ez:text-site-small ez:text-site-off", figure)}>{p ? pad(index) : null}</span>
      <h3 className="ez:m-0 ez:mt-6 ez:font-body ez:text-site-heading ez:break-keep ez:text-fg ez:lg:mt-10">{p ? p.name : <Bar />}</h3>
      <p className="ez:m-0 ez:mt-2.5 ez:max-w-full ez:text-site-section ez:break-words ez:text-fg ez:tabular-nums ez:lg:text-site-display-sm">
        {p ? (
          <>
            {amount}
            {unit && <small className="ez:ml-1 ez:text-site-body ez:text-site-off">{unit}</small>}
          </>
        ) : (
          <BlankPrice />
        )}
      </p>
      {p && <Includes lines={includesOf(p)} />}
      {p && (
        <NextLink
          href={QUOTE_HREF}
          aria-label={`${p.name} ${QUOTE_TITLE.request}`}
          className={cn("ez:mt-auto ez:inline-flex ez:items-center ez:gap-2 ez:pt-7 ez:text-site-body ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing)}
        >
          {QUOTE_TITLE.request}
          <Icon name="right" size="sm" />
        </NextLink>
      )}
    </li>
  );
}

export function Packages({ data }: SectionProps<"package_cards">) {
  const items = data.items ?? [];
  const shown: (PackageItem | null)[] = items.length ? items : [null, null, null, null];
  const cols = Math.min(4, shown.length);
  return (
    <section data-slot="package-cards" id="packages" data-variant="night" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={QUOTE_TITLE.packages} />
      <ul className={cn(line, "ez:m-0 ez:grid ez:list-none ez:border-y ez:p-0", shown.length > 1 && "ez:sm:grid-cols-2", LG_COLS[cols])}>
        {shown.map((p, i) => (
          <PackageCell key={p ? `${p.name}-${i}` : i} p={p} index={i} cols={cols} />
        ))}
      </ul>
    </section>
  );
}

export function Process({ data }: SectionProps<"process_steps">) {
  const steps = data.steps ?? [];
  const shown: (string | null)[] = steps.length ? steps : [null, null, null, null, null];
  const cols = Math.min(6, shown.length);
  return (
    <section data-slot="process-steps" id="process" data-variant="night" data-blank={steps.length ? undefined : ""} className="ez:text-fg">
      <Head title={QUOTE_TITLE.process} />
      <div className="ez:relative ez:pt-2">
        <span aria-hidden="true" className="ez:absolute ez:inset-x-0 ez:top-11.5 ez:h-px ez:bg-site-line ez:max-lg:hidden" />
        <ol className={cn("ez:relative ez:m-0 ez:grid ez:list-none ez:gap-y-6 ez:p-0 ez:lg:gap-y-10", LG_COLS[cols])}>
          {shown.map((s, i) => {
            const on = Boolean(s) && i === 0;
            return (
              <li key={i} className="ez:grid ez:grid-cols-[2.5rem_auto_minmax(0,1fr)] ez:items-center ez:gap-x-4 ez:lg:block ez:lg:pr-4">
                <span className={cn("ez:block ez:text-site-small ez:text-site-off ez:lg:h-5.25", figure)}>{pad(i)}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "ez:relative ez:block ez:size-2.75 ez:rounded-full ez:border ez:border-solid ez:lg:mt-3",
                    on ? "ez:fx-glow ez:border-primary ez:bg-primary" : "ez:border-site-off ez:bg-surface"
                  )}
                />
                <span className={cn("ez:block ez:font-body ez:text-site-heading ez:break-keep ez:lg:mt-6.5", on ? "ez:text-fg" : "ez:text-muted")}>{s ?? <Bar />}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

type ReviewItem = NonNullable<SectionProps<"reviews">["data"]["items"]>[number];

type ReviewProduct = SectionProps<"reviews">["context"]["products"][number];

const reviewCol = cn(line, "ez:grid ez:min-w-0 ez:grid-rows-[auto_1fr_auto] ez:border-t ez:pt-6");

function ReviewColumn({ item, product }: { item: ReviewItem; product?: ReviewProduct }) {
  return (
    <article className={reviewCol}>
      <span className="ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-small ez:text-muted">
        <Icon name="star" size="sm" className="ez:size-3.5 ez:fill-star ez:text-star" />
        <span className={figure}>{average(item.rating)}</span>
      </span>
      <p className="ez:m-0 ez:mt-4.5 ez:line-clamp-4 ez:text-site-item ez:leading-relaxed ez:whitespace-pre-line ez:text-fg">{item.body}</p>
      <span className="ez:mt-8 ez:truncate ez:text-site-small ez:text-site-off">{[item.name, product?.name, item.date].filter(Boolean).join(" · ")}</span>
    </article>
  );
}

function BlankReview() {
  return (
    <div className={reviewCol}>
      <BlankStars />
      <span className="ez:mt-4.5 ez:text-site-item">
        <Lines />
      </span>
      <span className="ez:mt-8 ez:text-site-small">
        <Bar size="short" />
      </span>
    </div>
  );
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  const count = data.count ?? items.length;
  const aside = items.length && data.average != null ? <span className={cn("ez:text-site-small ez:text-site-off", figure)}>{`${average(data.average)} · ${reviewCount(count)}`}</span> : null;
  return (
    <section data-slot="reviews" id="reviews" data-variant="night" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={QUOTE_TITLE.reviews} aside={aside} />
      <div className="ez:grid ez:gap-x-6 ez:gap-y-10 ez:md:grid-cols-3">
        {items.length
          ? items.map((r, i) => <ReviewColumn key={`${r.name}-${i}`} item={r} product={r.product ? context.products.find((p) => p.id === r.product) : undefined} />)
          : [0, 1, 2].map((i) => <BlankReview key={i} />)}
      </div>
    </section>
  );
}

const formBox = "ez:relative ez:grid ez:min-w-0 ez:gap-7 ez:rounded-lg ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-6 ez:md:p-8";

const optionGrid = "ez:mt-5 ez:grid ez:gap-2 ez:sm:grid-cols-2";

const optionCell = "ez:flex ez:h-14 ez:min-w-0 ez:items-center ez:justify-between ez:gap-3 ez:rounded-md ez:border ez:border-solid ez:border-hairline ez:px-5 ez:text-site-body";

function Option({ name, value }: { name: string; value: string }) {
  return (
    <label
      className={cn(
        optionCell,
        "ez:group ez:cursor-pointer ez:text-muted ez:has-checked:border-site-line ez:has-checked:bg-select ez:has-checked:text-fg ez:has-focus-visible:outline-2 ez:has-focus-visible:outline-offset-2 ez:has-focus-visible:outline-primary"
      )}
    >
      <input type="radio" name={name} value={value} className="ez:sr-only" />
      <span className="ez:min-w-0 ez:break-keep">{value}</span>
      <Icon name="check" size="sm" className="ez:hidden ez:text-primary ez:group-has-checked:inline-block" />
    </label>
  );
}

function RequestBox({ data }: { data: QuoteStarter }) {
  const state = starterState(data);
  if (state === "closed") {
    return (
      <div className={formBox}>
        <p className="ez:m-0 ez:text-site-item ez:text-fg">{QUOTE_TITLE.closed}</p>
      </div>
    );
  }
  if (state === "blank") {
    return (
      <div className={formBox}>
        {[0, 1].map((i) => (
          <div key={i}>
            <span className="ez:block ez:text-site-heading">
              <Bar size="short" />
            </span>
            <div className={optionGrid}>
              {[0, 1, 2, 3].map((j) => (
                <span key={j} className={optionCell}>
                  <Bar size="short" />
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="ez:grid ez:gap-3.5">
          <BlankButton variant="outline" className="ez:h-14 ez:w-full ez:rounded-full ez:text-muted">
            {QUOTE_TITLE.request}
          </BlankButton>
          <p className="ez:m-0 ez:text-site-small ez:text-muted">{QUOTE_CONSENT}</p>
        </div>
      </div>
    );
  }
  const questions = data.questions ?? [];
  return (
    <StarterForm data={data} className={formBox}>
      {questions.map((q, i) => (
        <fieldset key={q.id} className="ez:relative ez:m-0 ez:min-w-0 ez:border-0 ez:p-0">
          <legend className="ez:p-0 ez:pr-14 ez:text-site-heading ez:text-fg">{q.label}</legend>
          <span aria-hidden="true" className={cn("ez:absolute ez:top-1.5 ez:right-0 ez:text-site-small ez:text-site-off", figure)}>{`${i + 1} / ${questions.length}`}</span>
          <div className={optionGrid}>
            {q.options.map((o) => (
              <Option key={o} name={q.id} value={o} />
            ))}
          </div>
        </fieldset>
      ))}
      {data.rest && data.rest.length > 0 && (
        <ul className="ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-x-2.5 ez:gap-y-1 ez:p-0 ez:text-site-small ez:text-site-off">
          {data.rest.map((r) => (
            <li key={r} className={cn(hair, "ez:border-l ez:pl-2.5 ez:first:border-l-0 ez:first:pl-0")}>
              {r}
            </li>
          ))}
        </ul>
      )}
      <div className="ez:grid ez:gap-3.5">
        <Button type="submit" block className="ez:h-14 ez:rounded-full ez:text-site-body">
          {QUOTE_TITLE.request}
        </Button>
        <p className="ez:m-0 ez:text-site-small ez:text-muted">{QUOTE_CONSENT}</p>
      </div>
    </StarterForm>
  );
}

function ContactRows({ phone, hours, blank }: { phone?: string | null; hours?: string | null; blank: boolean }) {
  const row = cn(line, "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-t ez:py-3.5");
  if (!blank && !phone && !hours) return null;
  return (
    <dl className="ez:m-0 ez:mt-10 ez:max-w-105 ez:text-site-item ez:lg:mt-12">
      {(phone || blank) && (
        <div className={row}>
          <dt className="ez:shrink-0 ez:text-site-off">{QUOTE_TITLE.center}</dt>
          <dd className="ez:m-0">
            {phone ? (
              <a href={tel(phone)} className={cn("ez:text-fg ez:no-underline ez:hover:underline", figure, focusRing)}>
                {phone}
              </a>
            ) : (
              <Bar />
            )}
          </dd>
        </div>
      )}
      {(hours || blank) && (
        <div className={row}>
          <dt className="ez:shrink-0 ez:text-site-off">{QUOTE_TITLE.hours}</dt>
          <dd className="ez:m-0 ez:text-right ez:text-fg">{hours ?? <Bar />}</dd>
        </div>
      )}
    </dl>
  );
}

export function Request({ data }: SectionProps<"quote_starter">) {
  const state = starterState(data);
  return (
    <section data-slot="quote-starter" id="request" data-variant="night" data-blank={state === "blank" ? "" : undefined} className="ez:text-fg">
      <div className="ez:relative ez:fx-round-md ez:overflow-hidden ez:border ez:border-solid ez:border-site-line ez:bg-deep">
        <div aria-hidden="true" className={glowFloor} />
        <div className="ez:relative ez:grid ez:items-center ez:gap-10 ez:p-6 ez:md:p-12 ez:lg:grid-cols-[minmax(0,1fr)_32.5rem] ez:lg:gap-18 ez:lg:p-18">
          <div className="ez:min-w-0">
            <h2 className={cn(display, "ez:lg:text-site-display-sm")}>{QUOTE_TITLE.request}</h2>
            <ContactRows phone={data.phone} hours={data.hours} blank={state === "blank"} />
          </div>
          <RequestBox data={data} />
        </div>
      </div>
    </section>
  );
}

function ListRequest({ data, storeName }: { data: QuoteStarter; storeName?: string | null }) {
  const state = starterState(data);
  return (
    <section aria-label={QUOTE_TITLE.request} className="ez:relative ez:mt-20 ez:fx-round-md ez:overflow-hidden ez:border ez:border-solid ez:border-site-line ez:bg-deep">
      <div aria-hidden="true" className={glowFloor} />
      <div className="ez:relative ez:flex ez:flex-wrap ez:items-center ez:gap-x-10 ez:gap-y-6 ez:p-6 ez:md:px-12 ez:md:py-10">
        {storeName && <p className={cn(display, "ez:mr-auto ez:min-w-0")}>{storeName}</p>}
        <div className={cn("ez:flex ez:flex-wrap ez:items-center ez:gap-x-10 ez:gap-y-6", !storeName && "ez:ml-auto")}>
          {data.phone && (
            <span className="ez:grid ez:gap-0.5">
              <span className="ez:text-site-small ez:text-site-off">{QUOTE_TITLE.center}</span>
              <a href={tel(data.phone)} className={cn("ez:text-site-heading ez:text-fg ez:no-underline", figure, focusRing)}>
                {data.phone}
              </a>
            </span>
          )}
          {state === "open" ? (
            <ButtonLink href={data.href ?? QUOTE_HREF} className="ez:h-13 ez:min-h-0 ez:rounded-full ez:px-7 ez:text-site-body">
              {QUOTE_TITLE.request}
            </ButtonLink>
          ) : state === "closed" ? (
            <p className="ez:m-0 ez:text-site-item ez:text-fg">{QUOTE_TITLE.closed}</p>
          ) : (
            <BlankButton variant="outline" className="ez:rounded-full">
              {QUOTE_TITLE.request}
            </BlankButton>
          )}
        </div>
      </div>
    </section>
  );
}

export function List({ title, count, tabs, cases, rating, request, storeName }: QuoteListProps) {
  return (
    <div data-slot="quote-cases" data-variant="night" className="ez:pt-12 ez:text-fg ez:lg:pt-18">
      <div className="ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-x-6 ez:gap-y-2">
        <div className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1">
          <h1 className={display}>{title}</h1>
          <span className={cn("ez:text-site-body ez:text-site-off", figure)}>{count}</span>
        </div>
        {rating && rating.count > 0 && (
          <span className="ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-small ez:text-site-off">
            <Icon name="star" size="sm" className="ez:size-3.5 ez:fill-star ez:text-star" />
            <span className={figure}>{`${average(rating.average)} · ${reviewCount(rating.count)}`}</span>
          </span>
        )}
      </div>
      {tabs.length > 1 && (
        <nav aria-label={QUOTE_TITLE.category} className={cn(hair, "ez:mt-10 ez:flex ez:flex-wrap ez:gap-x-8 ez:gap-y-2 ez:border-b")}>
          {tabs.map((t) => (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={cn("ez:pb-3.5 ez:text-site-body ez:no-underline ez:hover:text-fg", t.on ? "ez:fx-tab ez:text-fg" : "ez:text-site-off", focusRing)}
            >
              {t.label}
              {t.count != null && t.count > 0 && <span className={cn("ez:ml-1.5 ez:text-site-small ez:text-site-off", figure)}>{t.count}</span>}
            </NextLink>
          ))}
        </nav>
      )}
      <ol className={cn(line, "ez:m-0 ez:mt-8 ez:list-none ez:border-b ez:p-0")}>
        {cases.map((c, i) => (
          <CaseRow key={c.id} c={c} index={i} lit={i === 0} />
        ))}
      </ol>
      <ListRequest data={request} storeName={storeName} />
    </div>
  );
}
