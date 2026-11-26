import NextLink from "next/link";
import type { ReactNode } from "react";
import { Button, ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import { StarRow } from "../../components/star-row";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing, textLink } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, BlankStars, Lines, Pic } from "../kit";
import type { Case, QuoteFigures, QuoteStarter } from "../template/data";
import { QuoteNavLinks } from "./nav";
import { average, CASES_HREF, caseView, includesOf, leadCase, QUOTE_CONSENT, QUOTE_HREF, QUOTE_TITLE, reviewCount } from "./shared";
import { OPTION_GRID, OptionCell, StarterForm, starterState } from "./starter";
import type { QuoteFooterProps, QuoteHeaderProps, QuoteListProps } from "./types";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const line = "ez:border-0 ez:border-solid ez:border-site-line";

const edge = "ez:border-0 ez:border-solid ez:border-site-edge";

const big = "ez:h-14 ez:px-8 ez:text-site-item";

const MD_COLS: Record<number, string> = {
  1: "ez:md:grid-cols-1",
  2: "ez:md:grid-cols-2",
  3: "ez:md:grid-cols-3",
  4: "ez:md:grid-cols-4",
  5: "ez:md:grid-cols-5",
  6: "ez:md:grid-cols-6",
};

const AREA_HEAD = `${QUOTE_TITLE.category} · ${QUOTE_TITLE.area}`;

function ruled(index: number, cols: number) {
  return cn(line, "ez:border-l ez:pl-7", index % 2 === 0 && "ez:max-md:border-l-0 ez:max-md:pl-0", index % cols === 0 && "ez:md:border-l-0 ez:md:pl-0");
}

function tel(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function Doc({ slot, id, title, blank, children }: { slot: string; id: string; title: string; blank?: boolean; children: ReactNode }) {
  return (
    <section
      data-slot={slot}
      id={id}
      data-blank={blank ? "" : undefined}
      className={cn(edge, "ez:grid ez:gap-8 ez:border-t ez:pt-7 ez:text-fg ez:[counter-increment:quote-doc] ez:lg:grid-cols-4 ez:lg:gap-0")}
    >
      <div className="ez:grid ez:content-start ez:gap-2.5 ez:lg:pr-10">
        <span aria-hidden="true" className="ez:text-site-small ez:text-muted ez:before:content-[counter(quote-doc,decimal-leading-zero)]" />
        <h2 data-script={scriptOf(title)} className="ez:m-0 ez:font-display ez:text-site-section ez:text-fg">{title}</h2>
      </div>
      <div className="ez:min-w-0 ez:lg:col-span-3">{children}</div>
    </section>
  );
}

export function Header({ name, logoUrl, phone, nav, links }: QuoteHeaderProps) {
  return (
    <header data-slot="site-header" className={cn(line, "ez:border-b ez:bg-surface")}>
      <div className="ez:mx-auto ez:flex ez:h-16 ez:max-w-wrap ez:items-center ez:gap-6 ez:px-page ez:lg:h-18 ez:lg:gap-12">
        <NextLink data-script={scriptOf(name)} href="/" className={cn("ez:min-w-0 ez:font-display ez:text-site-heading ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:gap-8 ez:text-site-body ez:max-lg:hidden">
          <QuoteNavLinks items={nav} className={cn("ez:whitespace-nowrap ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)} currentClassName="ez:font-medium ez:text-fg" />
        </nav>
        <div className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-4 ez:text-site-body ez:lg:gap-7">
          {phone && (
            <a href={tel(phone)} className={cn("ez:inline-flex ez:items-center ez:text-fg ez:no-underline", focusRing)}>
              <Icon name="phone" size="sm" className="ez:text-muted ez:sm:hidden" />
              <span className="ez:max-sm:sr-only">{phone}</span>
            </a>
          )}
          <span aria-hidden="true" className="ez:h-4 ez:w-px ez:bg-site-edge ez:max-md:hidden" />
          <NextLink href={links.lookup.href} className={cn("ez:whitespace-nowrap ez:text-fg ez:no-underline ez:max-md:hidden", focusRing)}>
            {links.lookup.label}
          </NextLink>
          <ButtonLink href={links.request.href} variant="outline" className="ez:h-10 ez:min-h-0 ez:px-5 ez:text-site-body">
            {links.request.label}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

function Contacts({ phone, hours, className }: { phone?: string | null; hours?: string | null; className?: string }) {
  if (!phone && !hours) return null;
  return (
    <dl className={cn(line, "ez:m-0 ez:flex ez:flex-wrap ez:gap-x-12 ez:gap-y-4 ez:border-t ez:pt-4.5", className)}>
      {phone && (
        <div className="ez:grid ez:gap-1">
          <dt className="ez:text-site-small ez:text-muted">{QUOTE_TITLE.center}</dt>
          <dd className="ez:m-0">
            <a href={tel(phone)} className={cn("ez:text-site-item ez:text-fg ez:no-underline", focusRing)}>
              {phone}
            </a>
          </dd>
        </div>
      )}
      {hours && (
        <div className="ez:grid ez:gap-1">
          <dt className="ez:text-site-small ez:text-muted">{QUOTE_TITLE.hours}</dt>
          <dd data-script={scriptOf(hours)} className="ez:m-0 ez:text-site-item ez:text-fg">{hours}</dd>
        </div>
      )}
    </dl>
  );
}

function PriceSheet({ rows, storeName, blank }: { rows: { label: ReactNode; value?: ReactNode }[]; storeName?: string; blank: boolean }) {
  const shown = rows.slice(0, 5);
  const cell = "ez:w-auto ez:px-6 ez:text-left ez:font-normal";
  return (
    <table className={cn(edge, "ez:w-full ez:border ez:border-collapse ez:self-start")}>
      <thead>
        <tr className={cn(edge, "ez:border-b")}>
          <th scope="col" className={cn(cell, "ez:h-13 ez:text-site-small ez:text-muted")}>
            {QUOTE_TITLE.prices}
          </th>
          <td data-script={scriptOf(blank ? null : storeName)} className={cn(cell, "ez:h-13 ez:text-right ez:text-site-small ez:text-muted")}>{blank ? null : storeName}</td>
        </tr>
      </thead>
      <tbody>
        {shown.length
          ? shown.map((r, i) => (
              <tr key={i} className={cn(line, "ez:border-b")}>
                <th scope="row" className={cn(cell, "ez:py-4 ez:text-site-body ez:text-muted")}>
                  {r.label}
                </th>
                <td className={cn(cell, "ez:py-4 ez:text-right ez:text-site-heading ez:text-fg")}>{r.value ?? null}</td>
              </tr>
            ))
          : [0, 1, 2, 3].map((i) => (
              <tr key={i} className={cn(line, "ez:border-b")}>
                <td className={cn(cell, "ez:py-4")}>
                  <Bar />
                </td>
                <td className={cn(cell, "ez:py-4 ez:text-right ez:text-site-heading")}>
                  <BlankPrice />
                </td>
              </tr>
            ))}
      </tbody>
      {!blank && (
        <tfoot>
          <tr>
            <td colSpan={2} className="ez:p-0">
              <NextLink href={QUOTE_HREF} className={cn("ez:flex ez:h-15 ez:items-center ez:justify-between ez:px-6 ez:font-normal ez:text-fg ez:no-underline", focusRing)}>
                {QUOTE_TITLE.request}
                <Icon name="right" size="sm" />
              </NextLink>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const image = leadCase(data.cases)?.image ?? data.image ?? null;
  const blank = !title && !image;
  const statement = "ez:m-0 ez:font-display ez:text-site-display-sm ez:lg:text-site-display";
  const prices = data.kinds?.includes("package_cards");
  return (
    <section data-slot="hero" data-blank={blank ? "" : undefined} className="ez:grid ez:gap-12 ez:pt-10 ez:text-fg ez:lg:grid-cols-5 ez:lg:gap-20 ez:lg:pt-22">
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:lg:col-span-3">
        {title ? (
          <div>
            <h1 data-script={scriptOf(title)} className={cn(statement, "ez:text-fg")}>{title}</h1>
            {data.sub && (
              <p data-script={scriptOf(data.sub)} data-slot="hero-sub" className={cn(statement, "ez:text-muted")}>
                {data.sub}
              </p>
            )}
          </div>
        ) : blank ? (
          <div className="ez:grid ez:gap-4">
            <Bar size="long" className="ez:text-site-display-sm ez:lg:text-site-display" />
            <Bar className="ez:text-site-display-sm ez:lg:text-site-display" />
          </div>
        ) : (
          <p data-script={scriptOf(context.storeName)} className={cn(statement, "ez:text-fg")}>{context.storeName}</p>
        )}
        {blank ? (
          <div className="ez:mt-12 ez:flex ez:items-center ez:gap-8">
            <BlankButton variant="outline">{QUOTE_TITLE.request}</BlankButton>
          </div>
        ) : (
          <div className="ez:mt-12 ez:flex ez:flex-wrap ez:items-center ez:gap-8">
            <ButtonLink href={QUOTE_HREF} variant="outline" className={big}>
              {QUOTE_TITLE.request}
              <Icon name="right" size="sm" />
            </ButtonLink>
            {prices && (
              <NextLink href="/#packages" className={cn(textLink, focusRing)}>
                {QUOTE_TITLE.prices}
              </NextLink>
            )}
          </div>
        )}
        {blank ? (
          <div className={cn(line, "ez:mt-12 ez:flex ez:gap-12 ez:border-t ez:pt-4.5 ez:lg:mt-auto")}>
            <span className="ez:grid ez:gap-2">
              <span className="ez:text-site-small ez:text-muted">{QUOTE_TITLE.center}</span>
              <Bar size="short" />
            </span>
            <span className="ez:grid ez:gap-2">
              <span className="ez:text-site-small ez:text-muted">{QUOTE_TITLE.hours}</span>
              <Bar />
            </span>
          </div>
        ) : (
          <Contacts phone={data.request?.phone} hours={data.request?.hours} className="ez:mt-12 ez:lg:mt-auto" />
        )}
      </div>
      <div className="ez:min-w-0 ez:lg:col-span-2">
        <PriceSheet rows={data.tiers ?? []} storeName={context.storeName} blank={blank} />
      </div>
    </section>
  );
}

function figureCells(f: QuoteFigures | undefined): { value: string; label: string }[] {
  const cells: { value: string; label: string }[] = [];
  if (f && f.cases > 0) cells.push({ value: String(f.cases), label: QUOTE_TITLE.cases });
  if (f && f.reviews > 0 && f.average != null) cells.push({ value: average(f.average), label: reviewCount(f.reviews) });
  return cells;
}

export function Trust({ data }: SectionProps<"trust_line">) {
  const items = data.items ?? [];
  const figures = figureCells(data.figures);
  const blank = !items.length && !figures.length;
  const cols = Math.min(figures.length + (items.length || 3), 6);
  const cell = (i: number) => cn(ruled(i, cols), "ez:flex ez:flex-col ez:py-6 ez:pr-4");
  const mark = "ez:flex ez:h-16 ez:items-end";
  return (
    <section
      data-slot="trust-line"
      data-blank={blank ? "" : undefined}
      className={cn(edge, "ez:grid ez:grid-cols-2 ez:border-t ez:border-b ez:border-b-site-line ez:text-fg", MD_COLS[cols])}
    >
      {figures.map((f, i) => (
        <div key={f.label} className={cell(i)}>
          <span className={cn(mark, "ez:text-site-display-md")}><Won value={f.value} /></span>
          <span className="ez:mt-3.5 ez:text-site-body ez:text-muted">{f.label}</span>
        </div>
      ))}
      {items.length ? (
        <ul className="ez:contents">
          {items.map((t, i) => (
            <li key={`${t}-${i}`} className={cell(figures.length + i)}>
              <span className={cn(mark, "ez:pb-1.5")}>
                <Icon name="check" size="sm" className="ez:text-muted" />
              </span>
              <span className="ez:mt-3.5 ez:text-site-body ez:text-fg">{t}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div data-slot="trust-line" data-blank="" className="ez:contents">
          {[0, 1, 2].map((n) => (
            <div key={n} className={cell(figures.length + n)}>
              <span className={cn(mark, "ez:pb-1.5")}>
                <Bar size="short" />
              </span>
              <span className="ez:mt-3.5">
                <Bar />
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

type PackageItem = NonNullable<SectionProps<"package_cards">["data"]["items"]>[number];

function Includes({ lines, className, keep }: { lines: string[]; className?: string; keep?: boolean }) {
  if (!lines.length) return keep ? <div aria-hidden="true" data-slot="package-rule" className={className} /> : null;
  return (
    <ul aria-label={QUOTE_TITLE.includes} data-slot="package-includes" className={cn("ez:m-0 ez:grid ez:list-none ez:gap-2 ez:p-0", className)}>
      {lines.map((text, i) => (
        <li key={`${text}-${i}`} className="ez:flex ez:items-start ez:gap-2.5 ez:text-site-note ez:text-muted">
          <Icon name="check" size="sm" className="ez:mt-0.5 ez:text-muted" />
          <span className="ez:min-w-0">{text}</span>
        </li>
      ))}
    </ul>
  );
}

function PackageColumns({ items }: { items: (PackageItem | null)[] }) {
  const cols = items.length === 3 ? 3 : 4;
  return (
    <ul className={cn(line, "ez:m-0 ez:grid ez:list-none ez:grid-cols-2 ez:border-t ez:p-0", MD_COLS[cols])}>
      {items.map((p, i) => (
        <li key={p ? `${p.name}-${i}` : i} className={cn(ruled(i, cols), "ez:flex ez:flex-col ez:items-start ez:border-b ez:py-7 ez:pr-4")}>
          <span data-script={scriptOf(p ? p.name : null)} className="ez:min-h-[2lh] ez:text-site-item ez:font-normal ez:break-keep ez:text-fg">{p ? p.name : <Bar />}</span>
          <span className="ez:mt-2.5 ez:text-site-rank ez:font-normal ez:text-fg ez:break-words">{p ? <Won value={p.price} /> : <BlankPrice />}</span>
          <Includes lines={includesOf(p)} keep={Boolean(p)} className={cn(line, "ez:mt-5 ez:w-full ez:border-t ez:pt-4")} />
          {p && (
            <div className="ez:mt-auto ez:pt-5">
              <NextLink href={QUOTE_HREF} aria-label={`${p.name} ${QUOTE_TITLE.request}`} className={cn(textLink, "ez:text-site-note", focusRing)}>
                {QUOTE_TITLE.request}
              </NextLink>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function PackageRows({ items }: { items: PackageItem[] }) {
  return (
    <ul className={cn(line, "ez:m-0 ez:list-none ez:border-t ez:p-0")}>
      {items.map((p, i) => (
        <li key={`${p.name}-${i}`} className={cn(line, "ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-10 ez:gap-y-2 ez:border-b ez:py-6")}>
          <span data-script={scriptOf(p.name)} className="ez:min-w-0 ez:flex-1 ez:text-site-item ez:font-normal ez:text-fg">{p.name}</span>
          <span className="ez:text-site-rank ez:font-normal ez:text-fg"><Won value={p.price} /></span>
          <NextLink href={QUOTE_HREF} aria-label={`${p.name} ${QUOTE_TITLE.request}`} className={cn(textLink, "ez:text-site-note", focusRing)}>
            {QUOTE_TITLE.request}
          </NextLink>
          <Includes lines={includesOf(p)} className="ez:basis-full ez:sm:flex ez:sm:flex-wrap ez:sm:gap-x-8" />
        </li>
      ))}
    </ul>
  );
}

export function Packages({ data }: SectionProps<"package_cards">) {
  const items = data.items ?? [];
  return (
    <Doc slot="package-cards" id="packages" title={QUOTE_TITLE.packages} blank={!items.length}>
      {!items.length ? <PackageColumns items={[null, null, null, null]} /> : items.length < 3 ? <PackageRows items={items} /> : <PackageColumns items={items} />}
    </Doc>
  );
}

export function Process({ data }: SectionProps<"process_steps">) {
  const steps = data.steps ?? [];
  const shown: (string | null)[] = steps.length ? steps : [null, null, null, null, null];
  return (
    <Doc slot="process-steps" id="process" title={QUOTE_TITLE.process} blank={!steps.length}>
      <ol className={cn(line, "ez:m-0 ez:list-none ez:border-t ez:p-0")}>
        {shown.map((s, i) => (
          <li key={i} className={cn(line, "ez:flex ez:min-h-19 ez:items-center ez:border-b ez:py-3")}>
            <span className="ez:w-18 ez:shrink-0 ez:text-site-small ez:text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span data-script={scriptOf(s)} className="ez:min-w-0 ez:font-display ez:text-site-heading ez:text-fg">{s ?? <Bar />}</span>
          </li>
        ))}
      </ol>
    </Doc>
  );
}

const headCell = "ez:w-auto ez:pb-3 ez:text-left ez:align-bottom ez:text-site-small ez:font-normal ez:text-muted";

function Cell({ row, className, children }: { row: boolean; className: string; children: ReactNode }) {
  return row ? (
    <th scope="row" className={className}>
      {children}
    </th>
  ) : (
    <td className={className}>{children}</td>
  );
}

function LedgerRow({ c, tone }: { c: Case | null; tone: number }) {
  const view = c ? caseView(c) : null;
  return (
    <tr data-slot="case-item" className={cn(line, "ez:border-b ez:max-md:flex ez:max-md:flex-wrap ez:max-md:items-center ez:max-md:gap-x-4 ez:max-md:py-5")}>
      <td className="ez:w-48 ez:py-6 ez:pr-8 ez:align-middle ez:max-md:w-32 ez:max-md:p-0">
        <Pic src={view?.image} ratio={3 / 2} tone={tone} />
      </td>
      <Cell row={Boolean(view)} className="ez:w-auto ez:py-6 ez:pr-8 ez:text-left ez:align-middle ez:font-normal ez:max-md:min-w-0 ez:max-md:flex-1 ez:max-md:p-0">
        {view ? (
          <NextLink data-script={scriptOf(view.title)} href={view.href} className={cn("ez:text-site-item ez:font-normal ez:text-fg ez:no-underline ez:hover:underline", focusRing)}>
            {view.title}
          </NextLink>
        ) : (
          <Bar size="long" />
        )}
        <span data-script={scriptOf(view ? view.line : null)} className="ez:mt-2 ez:block ez:text-site-body ez:text-muted">{view ? view.line : <Bar />}</span>
      </Cell>
      <td data-script={scriptOf(view ? view.scope : null)} className="ez:w-55 ez:py-6 ez:text-right ez:align-middle ez:text-site-body ez:text-fg ez:max-md:w-full ez:max-md:p-0 ez:max-md:pt-1 ez:max-md:pl-36 ez:max-md:text-left">
        {view ? view.scope : <Bar size="short" />}
      </td>
    </tr>
  );
}

export function Cases({ data }: SectionProps<"case_grid">) {
  const all = data.cases ?? [];
  const shown: (Case | null)[] = all.length ? all.slice(0, 4) : [null, null, null];
  return (
    <Doc slot="case-grid" id="cases" title={QUOTE_TITLE.cases} blank={!all.length}>
      <table className="ez:w-full ez:border-collapse ez:max-md:block">
        <thead className="ez:max-md:hidden">
          <tr className={cn(edge, "ez:border-b")}>
            <th scope="col" className={headCell}>
              {QUOTE_TITLE.case}
            </th>
            <th scope="col" className={headCell}>
              {AREA_HEAD}
            </th>
            <th scope="col" className={cn(headCell, "ez:text-right")}>
              {QUOTE_TITLE.scope}
            </th>
          </tr>
        </thead>
        <tbody className={cn(edge, "ez:max-md:block ez:max-md:border-t")}>
          {shown.map((c, i) => (
            <LedgerRow key={c?.id ?? i} c={c} tone={i} />
          ))}
        </tbody>
      </table>
      {all.length > 0 && (
        <div className="ez:mt-7 ez:flex ez:justify-end">
          <NextLink href={CASES_HREF} className={cn(textLink, focusRing)}>
            {QUOTE_TITLE.more}
            <Icon name="right" size="sm" />
          </NextLink>
        </div>
      )}
    </Doc>
  );
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).slice(0, 3);
  const count = data.count ?? items.length;
  const row = cn(line, "ez:grid ez:gap-3 ez:border-b ez:py-7 ez:md:grid-cols-6 ez:md:gap-8");
  return (
    <Doc slot="reviews" id="reviews" title={QUOTE_TITLE.reviews} blank={!items.length}>
      <div className={cn(edge, "ez:flex ez:flex-wrap ez:items-end ez:gap-x-6 ez:gap-y-3 ez:border-b ez:pb-7")}>
        {items.length && data.average != null ? (
          <>
            <span className="ez:text-site-display-md ez:text-fg">{average(data.average)}</span>
            <StarRow rating={data.average} className="ez:pb-1.5 ez:text-muted" />
            <span className="ez:pb-1 ez:text-site-body ez:text-muted">{reviewCount(count)}</span>
          </>
        ) : (
          <>
            <Bar size="short" className="ez:text-site-display-md" />
            <BlankStars />
          </>
        )}
      </div>
      <ul className="ez:m-0 ez:list-none ez:p-0">
        {items.length
          ? items.map((r, i) => {
              const product = r.product ? context.products.find((p) => p.id === r.product) : undefined;
              return (
                <li key={`${r.name}-${i}`} className={row}>
                  <StarRow rating={r.rating} className="ez:text-muted" />
                  <div className="ez:grid ez:content-start ez:gap-2.5 ez:md:col-span-4">
                    <p data-script={scriptOf(r.body)} className="ez:m-0 ez:text-site-item ez:text-fg ez:whitespace-pre-line">{r.body}</p>
                    {product && <span data-script={scriptOf(product.name)} className="ez:text-site-note ez:text-muted">{product.name}</span>}
                  </div>
                  <div className="ez:grid ez:content-start ez:gap-0.5 ez:text-site-note ez:md:text-right">
                    <span className="ez:text-fg">{r.name}</span>
                    {r.date && <span className="ez:text-muted">{r.date}</span>}
                  </div>
                </li>
              );
            })
          : [0, 1, 2].map((i) => (
              <li key={i} className={row}>
                <BlankStars />
                <div className="ez:md:col-span-4">
                  <Lines />
                </div>
                <div className="ez:md:text-right">
                  <Bar size="short" />
                </div>
              </li>
            ))}
      </ul>
    </Doc>
  );
}

export function Faq({ context }: SectionProps<"faq">) {
  const faqs = context.faqs;
  return (
    <Doc slot="faq" id="faq" title={QUOTE_TITLE.faq} blank={!faqs.length}>
      <div className={cn(line, "ez:border-t")}>
        {faqs.length
          ? faqs.map((f) => (
              <details key={f.id} className={cn(line, "ez:group ez:border-b")}>
                <summary
                  className={cn(
                    "ez:flex ez:min-h-18 ez:cursor-pointer ez:list-none ez:items-center ez:justify-between ez:gap-4 ez:py-4 ez:text-site-item ez:text-fg ez:[&::-webkit-details-marker]:hidden",
                    focusRing,
                  )}
                >
                  {f.question}
                  <Icon name="plus" size="sm" className="ez:text-muted ez:group-open:hidden" />
                  <Icon name="minus" size="sm" className="ez:hidden ez:text-muted ez:group-open:inline-block" />
                </summary>
                <p data-script={scriptOf(f.answer)} className="ez:m-0 ez:pb-6 ez:whitespace-pre-line ez:text-site-body ez:text-muted">{f.answer}</p>
              </details>
            ))
          : [0, 1, 2, 3].map((i) => (
              <div key={i} className={cn(line, "ez:flex ez:min-h-18 ez:items-center ez:border-b ez:py-4")}>
                <Bar size="long" />
              </div>
            ))}
      </div>
    </Doc>
  );
}

const formRow = cn(line, "ez:flow-root ez:border-b ez:px-6 ez:py-4");

const formLabel = "ez:m-0 ez:p-0 ez:text-site-body ez:font-normal ez:text-fg ez:md:float-left ez:md:w-22 ez:md:py-2.5 ez:max-md:mb-3";

function RestRow({ rest }: { rest?: string[] }) {
  if (!rest?.length) return null;
  return (
    <div className={cn(formRow, "ez:md:pl-28")}>
      <ul className="ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-x-2.5 ez:gap-y-1 ez:p-0 ez:py-2 ez:text-site-body ez:text-muted">
        {rest.map((r) => (
          <li key={r} className={cn(edge, "ez:border-l ez:pl-2.5 ez:first:border-l-0 ez:first:pl-0")}>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RequestBox({ data }: { data: QuoteStarter }) {
  const state = starterState(data);
  const box = cn(edge, "ez:min-w-0 ez:flex-1 ez:border");
  if (state === "closed") {
    return (
      <div className={box}>
        <p className="ez:m-0 ez:p-6 ez:text-site-item ez:text-fg">{QUOTE_TITLE.closed}</p>
      </div>
    );
  }
  if (state === "blank") {
    return (
      <div className={box}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={formRow}>
            <span className={cn(formLabel, "ez:block")}>
              <Bar size="short" />
            </span>
            <div className={cn(OPTION_GRID, "ez:gap-1.5")}>
              {[0, 1, 2, 3].map((j) => (
                <span key={j} className={cn(edge, "ez:inline-flex ez:h-11 ez:items-center ez:justify-center ez:rounded-button ez:border")}>
                  <Bar size="short" />
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="ez:flex ez:flex-wrap ez:items-center ez:gap-x-7 ez:gap-y-3 ez:p-6">
          <BlankButton variant="outline">{QUOTE_TITLE.request}</BlankButton>
          <p className="ez:m-0 ez:min-w-0 ez:flex-1 ez:text-site-small ez:text-muted">{QUOTE_CONSENT}</p>
        </div>
      </div>
    );
  }
  return (
    <StarterForm data={data} className={box}>
      {(data.questions ?? []).map((q) => (
        <fieldset key={q.id} className={cn(formRow, "ez:m-0 ez:min-w-0")}>
          <legend className={formLabel}>{q.label}</legend>
          <div className={cn(OPTION_GRID, "ez:gap-1.5")}>
            {q.options.map((o) => (
              <OptionCell key={o} name={q.id} value={o} className="ez:min-h-11 ez:border-site-edge ez:text-site-body ez:text-muted" />
            ))}
          </div>
        </fieldset>
      ))}
      <RestRow rest={data.rest} />
      <div className="ez:flex ez:flex-wrap ez:items-center ez:gap-x-7 ez:gap-y-3 ez:p-6">
        <Button type="submit" className={big}>
          {QUOTE_TITLE.request}
          <Icon name="right" size="sm" />
        </Button>
        <p className="ez:m-0 ez:min-w-0 ez:flex-1 ez:text-site-small ez:text-muted">{QUOTE_CONSENT}</p>
      </div>
    </StarterForm>
  );
}

function ContactColumn({ phone, hours, blank }: { phone?: string | null; hours?: string | null; blank: boolean }) {
  if (!blank && !phone && !hours) return null;
  return (
    <dl className={cn(edge, "ez:m-0 ez:grid ez:content-start ez:border-t ez:pt-5 ez:lg:w-50 ez:lg:shrink-0")}>
      {(phone || blank) && (
        <div className="ez:grid ez:gap-1.5">
          <dt className="ez:text-site-small ez:text-muted">{QUOTE_TITLE.center}</dt>
          <dd className="ez:m-0">
            {phone ? (
              <a href={tel(phone)} className={cn("ez:text-site-rank ez:font-normal ez:text-fg ez:no-underline", focusRing)}>
                {phone}
              </a>
            ) : (
              <Bar />
            )}
          </dd>
        </div>
      )}
      {(hours || blank) && (
        <div className={cn(phone || blank ? cn(line, "ez:mt-5 ez:border-t ez:pt-4") : "", "ez:grid ez:gap-1.5")}>
          <dt className="ez:text-site-small ez:text-muted">{QUOTE_TITLE.hours}</dt>
          <dd data-script={scriptOf(hours)} className="ez:m-0 ez:text-site-body ez:text-fg">{hours ?? <Bar />}</dd>
        </div>
      )}
    </dl>
  );
}

export function Request({ data }: SectionProps<"quote_starter">) {
  const state = starterState(data);
  return (
    <Doc slot="quote-starter" id="request" title={QUOTE_TITLE.request} blank={state === "blank"}>
      <div className="ez:flex ez:flex-col ez:gap-10 ez:lg:flex-row">
        <RequestBox data={data} />
        <ContactColumn phone={data.phone} hours={data.hours} blank={state === "blank"} />
      </div>
    </Doc>
  );
}

export function Footer({ storeName, phone, hours, business, nav, guide, account, terms }: QuoteFooterProps) {
  const links = [...nav, ...guide, ...account].filter((l, i, all) => all.findIndex((o) => o.href === l.href) === i);
  return (
    <footer data-slot="site-footer" className={cn(edge, "ez:border-t ez:text-site-note ez:text-fg")}>
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-14 ez:pb-10">
        <div className="ez:grid ez:gap-10 ez:md:grid-cols-2 ez:lg:grid-cols-12 ez:lg:gap-0">
          <p data-script={scriptOf(storeName)} className="ez:m-0 ez:font-display ez:text-site-rank ez:font-normal ez:text-fg ez:lg:col-span-3 ez:lg:pr-10">{storeName}</p>
          <dl aria-label={QUOTE_TITLE.business} className="ez:m-0 ez:grid ez:grid-cols-[auto_1fr] ez:content-start ez:gap-x-10 ez:gap-y-2 ez:lg:col-span-5 ez:lg:pr-10">
            {business.map((r) => (
              <div key={r.label} className="ez:contents">
                <dt className="ez:text-muted">{r.label}</dt>
                <dd className="ez:m-0 ez:min-w-0 ez:break-words ez:text-fg"><Won value={r.value} /></dd>
              </div>
            ))}
          </dl>
          <div className="ez:grid ez:content-start ez:gap-1.5 ez:lg:col-span-2 ez:lg:pr-6">
            <span className="ez:text-site-small ez:text-muted">{QUOTE_TITLE.center}</span>
            {phone && (
              <a href={tel(phone)} className={cn("ez:text-site-heading ez:text-fg ez:no-underline", focusRing)}>
                {phone}
              </a>
            )}
            {hours && <span className="ez:text-muted">{`${QUOTE_TITLE.hours} ${hours}`}</span>}
          </div>
          <nav aria-label={QUOTE_TITLE.guide} className="ez:grid ez:content-start ez:gap-2 ez:lg:col-span-2">
            {links.map((l) => (
              <NextLink key={`${l.label}-${l.href}`} href={l.href} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}>
                {l.label}
              </NextLink>
            ))}
          </nav>
        </div>
        <div className={cn(line, "ez:mt-12 ez:flex ez:flex-wrap ez:items-center ez:gap-x-6 ez:gap-y-3 ez:border-t ez:pt-5 ez:text-site-small")}>
          <nav aria-label={QUOTE_TITLE.terms} className="ez:flex ez:flex-wrap ez:gap-6">
            {terms.map((t) => (
              <NextLink key={t.href} href={t.href} className={cn("ez:no-underline", t.strong ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}>
                {t.label}
              </NextLink>
            ))}
          </nav>
          <span className="ez:ml-auto ez:text-muted">{`© ${storeName}`}</span>
        </div>
      </div>
    </footer>
  );
}

function ListRow({ c, tone }: { c: Case; tone: number }) {
  const view = caseView(c);
  const cell = "ez:py-5 ez:pr-8 ez:align-middle ez:text-site-body ez:max-md:inline ez:max-md:p-0";
  const label = (text: string) => <span className="ez:mr-1.5 ez:text-muted ez:md:hidden">{text}</span>;
  return (
    <tr data-slot="case-item" className={cn(line, "ez:border-b ez:max-md:flex ez:max-md:flex-wrap ez:max-md:gap-x-4 ez:max-md:gap-y-1 ez:max-md:py-5")}>
      <th scope="row" className="ez:w-auto ez:py-5 ez:pr-8 ez:text-left ez:align-middle ez:font-normal ez:max-md:w-full ez:max-md:p-0 ez:max-md:pb-2">
        <NextLink href={view.href} className={cn("ez:flex ez:items-center ez:gap-4 ez:text-fg ez:no-underline ez:md:gap-7", focusRing)}>
          <div className="ez:w-32 ez:shrink-0 ez:md:w-42">
            <Pic src={view.image} ratio={3 / 2} tone={tone} />
          </div>
          <span data-script={scriptOf(view.title)} className="ez:min-w-0 ez:text-site-item ez:font-normal">{view.title}</span>
        </NextLink>
      </th>
      <td className={cn(cell, "ez:w-35 ez:text-muted")}>
        {view.category && label(QUOTE_TITLE.category)}
        {view.category}
      </td>
      <td className={cn(cell, "ez:w-60 ez:text-fg")}>
        {view.area && label(QUOTE_TITLE.area)}
        {view.area}
      </td>
      <td className={cn(cell, "ez:w-50 ez:pr-0 ez:text-fg")}>
        {view.scope && label(QUOTE_TITLE.scope)}
        {view.scope}
      </td>
    </tr>
  );
}

function ListRequest({ data, storeName }: { data: QuoteStarter; storeName?: string | null }) {
  const state = starterState(data);
  return (
    <section
      aria-label={QUOTE_TITLE.request}
      className={cn(edge, "ez:mt-20 ez:flex ez:flex-wrap ez:items-center ez:gap-x-10 ez:gap-y-6 ez:border-t ez:border-b ez:border-b-site-line ez:py-9")}
    >
      {storeName && <p data-script={scriptOf(storeName)} className="ez:m-0 ez:mr-auto ez:min-w-0 ez:font-display ez:text-site-title ez:text-fg">{storeName}</p>}
      <div className={cn("ez:flex ez:flex-wrap ez:items-center ez:gap-x-10 ez:gap-y-6", !storeName && "ez:ml-auto")}>
        {state === "open" ? (
          <ButtonLink href={data.href ?? QUOTE_HREF} variant="outline" className={big}>
            {QUOTE_TITLE.request}
            <Icon name="right" size="sm" />
          </ButtonLink>
        ) : state === "closed" ? (
          <p className="ez:m-0 ez:text-site-item ez:text-fg">{QUOTE_TITLE.closed}</p>
        ) : (
          <BlankButton variant="outline">{QUOTE_TITLE.request}</BlankButton>
        )}
        {data.phone && (
          <span className="ez:grid ez:gap-0.5">
            <span className="ez:text-site-small ez:text-muted">{QUOTE_TITLE.center}</span>
            <a href={tel(data.phone)} className={cn("ez:text-site-heading ez:text-fg ez:no-underline", focusRing)}>
              {data.phone}
            </a>
          </span>
        )}
      </div>
    </section>
  );
}

export function List({ title, count, tabs, cases, request, storeName }: QuoteListProps) {
  return (
    <div data-slot="quote-cases" className="ez:pt-12 ez:text-fg ez:lg:pt-18">
      <div className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-4">
        <h1 data-script={scriptOf(title)} className="ez:m-0 ez:font-display ez:text-site-page ez:text-fg">{title}</h1>
        <span className="ez:text-site-heading ez:text-muted">{count}</span>
      </div>
      {tabs.length > 1 && (
        <nav aria-label={QUOTE_TITLE.category} className={cn(edge, "ez:mt-10 ez:flex ez:flex-wrap ez:gap-x-8 ez:gap-y-2 ez:border-b")}>
          {tabs.map((t) => (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={cn(
                "ez:-mb-px ez:border-0 ez:border-b ez:border-solid ez:border-transparent ez:pb-3.5 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg",
                t.on && "ez:border-muted ez:font-medium ez:text-fg",
                focusRing,
              )}
            >
              {t.label}
              {t.count != null && t.count > 0 && <span className="ez:ml-1.5 ez:text-site-small ez:font-normal ez:text-muted">{t.count}</span>}
            </NextLink>
          ))}
        </nav>
      )}
      <table className="ez:w-full ez:border-collapse ez:max-md:block">
        <thead className="ez:max-md:hidden">
          <tr className={cn(edge, "ez:border-b")}>
            <th scope="col" className={cn(headCell, "ez:pt-5")}>
              {QUOTE_TITLE.case}
            </th>
            <th scope="col" className={cn(headCell, "ez:pt-5")}>
              {QUOTE_TITLE.category}
            </th>
            <th scope="col" className={cn(headCell, "ez:pt-5")}>
              {QUOTE_TITLE.area}
            </th>
            <th scope="col" className={cn(headCell, "ez:pt-5")}>
              {QUOTE_TITLE.scope}
            </th>
          </tr>
        </thead>
        <tbody className="ez:max-md:block">
          {cases.map((c, i) => (
            <ListRow key={c.id} c={c} tone={i} />
          ))}
        </tbody>
      </table>
      <ListRequest data={request} storeName={storeName} />
    </div>
  );
}
