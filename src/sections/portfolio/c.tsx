import NextLink from "next/link";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Lines, Pic } from "../kit";
import { visitRows } from "../landing/parts";
import { caseHref, LANDING_LABEL, paragraphs, telHref } from "../landing/shared";
import type { Case, PlaceLink } from "../template/data";
import { PortfolioNavLinks } from "./nav";
import { businessLine } from "../quote/shared";
import { PORTFOLIO_ID, PORTFOLIO_TITLE } from "./shared";
import type { PortfolioFooterProps, PortfolioHeaderProps } from "./types";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:px-page";

const grid = "ez:grid ez:text-fg ez:lg:grid-cols-12 ez:lg:gap-x-gutter";

const main = "ez:min-w-0 ez:lg:col-span-7";

const side = "ez:min-w-0 ez:lg:col-span-4 ez:lg:col-start-9";

const title = "ez:m-0 ez:font-display ez:text-site-heading ez:font-normal ez:text-fg";

const top = "ez:border-0 ez:border-t ez:border-solid ez:border-site-off";

const row = "ez:border-0 ez:border-b ez:border-solid ez:border-site-edge";

const outline = cn(
  "ez:inline-flex ez:h-12 ez:items-center ez:gap-4 ez:whitespace-nowrap ez:border ez:border-solid ez:border-site-field ez:px-6 ez:text-site-body ez:font-normal ez:text-fg ez:no-underline ez:hover:border-site-off",
  focusRing,
);

const plain = cn("ez:text-fg ez:no-underline ez:hover:text-muted", focusRing);

const quiet = cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const out = { target: "_blank", rel: "noopener noreferrer" } as const;

function caseLine(c: Case): string {
  return [c.category, c.meta].filter((v): v is string => Boolean(v?.trim())).join(" · ");
}

export function Header({ name, logoUrl, nav }: PortfolioHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="showroom" className="ez:bg-transparent">
      <div className={cn(wrap, "ez:flex ez:min-h-16 ez:items-center ez:gap-8 ez:lg:min-h-24")}>
        <NextLink href="/" className={cn("ez:min-w-0 ez:font-display ez:text-site-heading ez:font-normal ez:tracking-wider ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        {nav.length > 0 && (
          <nav aria-label="주요 메뉴" className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-6 ez:whitespace-nowrap ez:text-site-body ez:font-normal ez:md:gap-8">
            <PortfolioNavLinks items={nav} className={cn(plain, "ez:py-2")} currentClassName="ez:underline ez:underline-offset-8" />
          </nav>
        )}
      </div>
    </header>
  );
}

export function Footer({ storeName, phone, hours, address, legal, business, nav, links, terms }: PortfolioFooterProps) {
  const line = business.length ? businessLine(business) : legal;
  const contact = Boolean(address || phone || hours);
  return (
    <footer data-slot="site-footer" data-variant="showroom" className="ez:bg-surface-alt ez:text-fg">
      <div className={cn(wrap, "ez:grid ez:gap-8 ez:py-16")}>
        <p className="ez:m-0 ez:text-site-body ez:font-normal">{storeName}</p>
        {nav.length > 0 && (
          <nav aria-label="바닥글 메뉴" className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2 ez:text-site-body">
            <PortfolioNavLinks items={nav} className={plain} currentClassName="ez:font-medium" />
          </nav>
        )}
        {(contact || links.length > 0) && (
          <div className="ez:grid ez:gap-3 ez:text-site-note">
            {contact && (
              <div className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-1 ez:text-muted">
                {address && <span>{address}</span>}
                {phone && (
                  <a href={telHref(phone)} className={cn(quiet, "ez:tabular-nums")}>
                    {phone}
                  </a>
                )}
                {hours && <span>{`${LANDING_LABEL.hours} ${hours}`}</span>}
              </div>
            )}
            {links.length > 0 && (
              <ul aria-label={LANDING_LABEL.links} className="ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-x-6 ez:gap-y-1 ez:p-0">
                {links.map((l) => (
                  <li key={l.key}>
                    <a href={l.href} {...out} className={quiet}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="ez:grid ez:gap-3 ez:text-site-small">
          <nav aria-label={LANDING_LABEL.terms} className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2">
            {terms.map((t) => (
              <NextLink
                key={t.href}
                href={t.href}
                className={cn(t.strong ? "ez:text-fg ez:underline ez:underline-offset-4" : "ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}
              >
                {t.label}
              </NextLink>
            ))}
          </nav>
          <p className="ez:m-0 ez:break-words ez:text-muted">{line}</p>
          <p className="ez:m-0 ez:text-muted">© {storeName}</p>
        </div>
      </div>
    </footer>
  );
}

function IntroText({ body }: { body: string[] }) {
  return body.length ? (
    body.map((p, i) => (
      <p key={i} className="ez:m-0 ez:whitespace-pre-line ez:leading-loose ez:text-fg">
        {p}
      </p>
    ))
  ) : (
    <>
      <Lines />
      <Lines />
      <Lines />
    </>
  );
}

function LinkButtons({ links }: { links: PlaceLink[] }) {
  if (!links.length) return null;
  return (
    <ul className="ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-4 ez:p-0">
      {links.map((l) => (
        <li key={l.key}>
          <a href={l.href} {...out} className={outline}>
            {l.label}
            <span aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const heading = data.title?.trim() || null;
  const sub = heading ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const storeName = context.storeName?.trim() || null;
  const intro = data.intro;
  const body = paragraphs(intro?.body);
  return (
    <section data-slot="hero" data-variant="showroom" data-blank={heading || image ? undefined : ""} className={cn(grid, "ez:gap-y-10 ez:lg:items-start")}>
      <div className={cn(main, "ez:grid ez:content-start ez:gap-10 ez:lg:row-start-1")}>
        {(heading || storeName) && (
          <div className="ez:grid ez:content-start ez:gap-2">
            {heading ? <h1 className={cn(title, "ez:text-balance")}>{heading}</h1> : <p className={title}>{storeName}</p>}
            {sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:text-site-body ez:text-muted">
                {sub}
              </p>
            )}
          </div>
        )}
        {intro !== undefined && (
          <div data-slot="intro" id={PORTFOLIO_ID.intro} data-blank={body.length ? undefined : ""} className="ez:grid ez:max-w-prose ez:content-start ez:gap-6">
            <h2 className="ez:sr-only">{PORTFOLIO_TITLE.intro}</h2>
            <IntroText body={body} />
          </div>
        )}
        <LinkButtons links={data.links ?? []} />
      </div>
      <Photo src={image} alt="" preload tone={0} sizes="(max-width: 1024px) 100vw, 440px" className={cn(side, "ez:aspect-[4/5] ez:rounded-none ez:max-lg:-order-1 ez:lg:row-start-1")} />
    </section>
  );
}

export function Intro({ data }: SectionProps<"intro">) {
  const body = paragraphs(data.body);
  return (
    <section data-slot="intro" data-variant="showroom" id={PORTFOLIO_ID.intro} data-blank={body.length ? undefined : ""} className={cn(grid, "ez:gap-y-6")}>
      <h2 className={cn(title, main)}>{PORTFOLIO_TITLE.intro}</h2>
      <div className={cn(main, "ez:grid ez:max-w-prose ez:content-start ez:gap-6 ez:lg:row-start-2")}>
        <IntroText body={body} />
      </div>
    </section>
  );
}

export function Work({ data }: SectionProps<"case_grid">) {
  const cases = data.cases ?? [];
  return (
    <section data-slot="case-grid" data-variant="showroom" id={PORTFOLIO_ID.work} data-blank={cases.length ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg">
      <h2 className={title}>{PORTFOLIO_TITLE.work}</h2>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-gutter ez:gap-y-10 ez:p-0 ez:sm:grid-cols-3">
        {!cases.length &&
          [0, 1, 2].map((i) => (
            <li key={i} className="ez:grid ez:min-w-0 ez:gap-3">
              <Pic ratio={0.8} tone={i} />
              <Bar size="long" />
            </li>
          ))}
        {cases.map((c, i) => {
          const sub = caseLine(c);
          return (
            <li key={c.id} className="ez:min-w-0">
              <NextLink href={caseHref(c.id)} className={cn("ez:grid ez:gap-3 ez:text-fg ez:no-underline ez:hover:text-muted", focusRing)}>
                <Pic src={c.image} ratio={0.8} tone={i} />
                <span className="ez:grid ez:gap-1">
                  <span className="ez:text-site-body">{c.title}</span>
                  {sub && <span className="ez:text-site-note ez:text-muted">{sub}</span>}
                </span>
              </NextLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Contact({ data }: SectionProps<"store_info">) {
  return (
    <section data-slot="store-info" data-variant="showroom" id={PORTFOLIO_ID.contact} data-blank={data.address ? undefined : ""} className={cn(grid, "ez:gap-y-6")}>
      <h2 className={cn(title, main)}>{PORTFOLIO_TITLE.contact}</h2>
      <dl className={cn(main, top, "ez:m-0 ez:grid ez:content-start ez:lg:row-start-2")}>
        {visitRows(data).map((r) => (
          <div key={r.label} className={cn(row, "ez:grid ez:grid-cols-[minmax(0,5rem)_minmax(0,1fr)] ez:gap-6 ez:py-4")}>
            <dt className="ez:font-normal ez:text-fg">{r.label}</dt>
            <dd className="ez:m-0 ez:min-w-0 ez:break-words ez:text-fg">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
