import NextLink from "next/link";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Pic } from "../kit";
import { bookingLink, caseHref, LANDING_LABEL, telHref } from "../landing/shared";
import type { PlaceLink } from "../template/data";
import { OfficeNavLinks } from "./nav";
import { OFFICE_ID, OFFICE_TITLE } from "./shared";
import type { OfficeFooterProps, OfficeHeaderProps } from "./types";

const rule = "ez:border-0 ez:border-solid ez:border-site-line";

const bleed = "ez:mx-[calc(50%-50vw)]";

const out = { target: "_blank", rel: "noopener noreferrer" } as const;

const statement =
  "ez:m-0 ez:font-display ez:text-site-section ez:font-normal ez:tracking-tight ez:text-balance ez:text-fg ez:lg:text-site-name ez:lg:font-normal";

const quiet = cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const outline = cn(
  "ez:inline-flex ez:h-10 ez:shrink-0 ez:items-center ez:justify-center ez:whitespace-nowrap ez:rounded-button ez:border ez:border-solid ez:border-site-edge ez:px-5 ez:text-site-small ez:font-medium ez:text-fg ez:no-underline ez:hover:bg-surface-alt",
  focusRing,
);

function Consult({ phone, links }: { phone: string | null; links: PlaceLink[] }) {
  const book = bookingLink(links);
  if (book)
    return (
      <a href={book.href} {...out} className={outline}>
        {LANDING_LABEL.consult}
      </a>
    );
  if (phone)
    return (
      <a href={telHref(phone)} className={outline}>
        {LANDING_LABEL.consult}
      </a>
    );
  return null;
}

export function Header({ name, logoUrl, phone, nav, links }: OfficeHeaderProps) {
  return (
    <header data-slot="site-header" className="ez:bg-surface">
      <div className="ez:mx-auto ez:flex ez:min-h-16 ez:max-w-wrap ez:items-center ez:gap-8 ez:px-page ez:lg:grid ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <NextLink
          href="/"
          className={cn(
            "ez:min-w-0 ez:justify-self-start ez:font-display ez:text-site-heading ez:font-medium ez:leading-none ez:text-fg ez:no-underline",
            focusRing,
          )}
        >
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:gap-12 ez:whitespace-nowrap ez:text-site-body ez:max-lg:hidden">
          <OfficeNavLinks items={nav} className={cn("ez:py-1.5 ez:text-fg ez:no-underline ez:hover:text-muted", focusRing)} />
        </nav>
        <div className="ez:ml-auto ez:flex ez:justify-self-end ez:lg:ml-0">
          <Consult phone={phone} links={links} />
        </div>
      </div>
    </header>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const heading = data.title?.trim() || null;
  const sub = heading ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const name = context.storeName?.trim() || null;
  const first = data.cases?.find((c) => c.title.trim()) ?? null;
  return (
    <section data-slot="hero" data-blank={heading || image ? undefined : ""} data-flush="" className="ez:grid ez:gap-24 ez:text-fg ez:lg:gap-32">
      <div className={cn("ez:relative ez:h-130 ez:overflow-hidden ez:lg:h-184", bleed)}>
        <Photo src={image} alt="" preload sizes="100vw" tone={0} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
        {first && (
          <>
            <span aria-hidden="true" className="ez:absolute ez:inset-x-0 ez:bottom-0 ez:h-40 ez:bg-linear-to-t ez:from-surface/85 ez:to-transparent" />
            <div className="ez:absolute ez:inset-x-0 ez:bottom-10 ez:flex ez:justify-center ez:px-page ez:lg:bottom-16">
              <NextLink
                href={caseHref(first.id)}
                className={cn("ez:flex ez:min-w-0 ez:items-center ez:gap-5 ez:text-site-body ez:text-fg ez:no-underline ez:hover:text-muted", focusRing)}
              >
                <span className="ez:shrink-0">{OFFICE_TITLE.cases}</span>
                <span aria-hidden="true" className="ez:h-3.5 ez:w-px ez:shrink-0 ez:bg-current" />
                <span className="ez:min-w-0 ez:truncate">{first.title}</span>
                <Icon name="right" size="sm" className="ez:shrink-0" />
              </NextLink>
            </div>
          </>
        )}
      </div>
      <div className="ez:mx-auto ez:grid ez:w-full ez:max-w-165 ez:justify-items-center ez:gap-6 ez:text-center">
        {heading ? (
          <h1 className={statement}>{heading}</h1>
        ) : name ? (
          <p className={statement}>{name}</p>
        ) : (
          <Bar size="long" className="ez:text-site-section ez:lg:text-site-name" />
        )}
        {sub && (
          <p data-slot="hero-sub" className="ez:m-0 ez:whitespace-pre-line ez:leading-loose ez:text-muted">
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}

export function Cases({ data }: SectionProps<"case_grid">) {
  const cases = data.cases ?? [];
  const caption = "ez:flex ez:items-center ez:justify-between ez:gap-4 ez:pt-6";
  return (
    <section data-slot="case-grid" id={OFFICE_ID.cases} data-blank={cases.length ? undefined : ""} className="ez:grid ez:gap-12 ez:text-fg">
      <h2 className={cn(statement, "ez:text-center")}>{OFFICE_TITLE.cases}</h2>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-gutter ez:gap-y-12 ez:p-0 ez:sm:grid-cols-2 ez:lg:grid-cols-3">
        {cases.length
          ? cases.map((c, i) => {
              const meta = [c.category, c.meta].filter(Boolean).join(" · ");
              return (
                <li key={c.id} className="ez:min-w-0">
                  <NextLink href={caseHref(c.id)} className={cn("ez:group ez:grid ez:text-fg ez:no-underline", focusRing)}>
                    <Pic src={c.image} ratio={0.8} tone={i} />
                    <span className={caption}>
                      <span className="ez:grid ez:min-w-0">
                        <span className="ez:text-site-item ez:font-medium ez:text-fg">{c.title}</span>
                        {meta && <span className="ez:text-site-small ez:text-muted">{meta}</span>}
                      </span>
                      <Icon name="right" size="sm" className="ez:shrink-0 ez:text-muted ez:group-hover:text-fg" />
                    </span>
                  </NextLink>
                </li>
              );
            })
          : [0, 1, 2].map((i) => (
              <li key={i} className="ez:min-w-0">
                <Pic ratio={0.8} tone={i} />
                <span className={caption}>
                  <span className="ez:grid ez:gap-2">
                    <Bar size="long" className="ez:text-site-item" />
                    <Bar size="short" className="ez:text-site-small" />
                  </span>
                </span>
              </li>
            ))}
      </ul>
    </section>
  );
}

export function Faq({ context }: SectionProps<"faq">) {
  const faqs = context.faqs;
  const row = "ez:flex ez:min-h-18 ez:items-center ez:justify-between ez:gap-6 ez:py-6";
  return (
    <section data-slot="faq" id={OFFICE_ID.faq} data-blank={faqs.length ? undefined : ""} className="ez:grid ez:gap-12 ez:text-fg">
      <h2 className={cn(statement, "ez:text-center")}>{OFFICE_TITLE.faq}</h2>
      <div className={cn(rule, "ez:mx-auto ez:w-full ez:max-w-165 ez:border-t")}>
        {faqs.length
          ? faqs.map((f) => (
              <details key={f.id} className={cn(rule, "ez:group ez:border-b")}>
                <summary className={cn(row, "ez:cursor-pointer ez:list-none ez:text-site-item ez:font-normal ez:text-fg ez:[&::-webkit-details-marker]:hidden", focusRing)}>
                  {f.question}
                  <Icon name="plus" size="sm" className="ez:shrink-0 ez:text-muted ez:group-open:hidden" />
                  <Icon name="minus" size="sm" className="ez:hidden ez:shrink-0 ez:text-muted ez:group-open:inline-block" />
                </summary>
                <p className="ez:m-0 ez:pb-6 ez:whitespace-pre-line ez:leading-loose ez:text-muted">{f.answer}</p>
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

export function Footer({ storeName, phone, hours, address, business, nav, links, terms }: OfficeFooterProps) {
  const contact = [hours && `${OFFICE_TITLE.hours} ${hours}`, address].filter((c): c is string => Boolean(c));
  return (
    <footer data-slot="site-footer" className={cn(rule, "ez:border-t ez:text-fg")}>
      <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:gap-10 ez:px-page ez:pt-16 ez:pb-24 ez:text-site-body ez:md:grid-cols-12 ez:md:gap-x-gutter">
        <div className="ez:grid ez:content-between ez:gap-10 ez:md:col-span-6 ez:lg:col-span-4 ez:lg:col-start-3">
          <p className="ez:m-0 ez:font-display ez:text-site-heading ez:font-medium ez:text-fg">{storeName}</p>
          {links.length > 0 && (
            <ul className="ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-x-6 ez:gap-y-2 ez:p-0 ez:text-site-small">
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
        {(nav.length > 0 || phone || contact.length > 0) && (
          <div className="ez:grid ez:content-start ez:gap-10 ez:md:col-span-6 ez:lg:col-span-3 ez:lg:col-start-8">
            {nav.length > 0 && (
              <nav aria-label={OFFICE_TITLE.links}>
                <ul className="ez:m-0 ez:grid ez:list-none ez:gap-2 ez:p-0">
                  {nav.map((n) => (
                    <li key={n.href}>
                      <NextLink href={n.href} className={cn("ez:text-fg ez:no-underline ez:hover:text-muted", focusRing)}>
                        {n.label}
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {(phone || contact.length > 0) && (
              <div className="ez:grid ez:gap-2">
                {phone && (
                  <a href={telHref(phone)} className={cn("ez:justify-self-start ez:text-fg ez:no-underline ez:tabular-nums ez:hover:text-muted", focusRing)}>
                    {phone}
                  </a>
                )}
                {contact.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            )}
          </div>
        )}
        <div className={cn(rule, "ez:grid ez:gap-6 ez:border-t ez:pt-8 ez:text-site-small ez:text-muted ez:md:col-span-12 ez:md:mt-6 ez:lg:col-span-8 ez:lg:col-start-3")}>
          <nav aria-label={OFFICE_TITLE.terms} className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2">
            {terms.map((t) => (
              <NextLink key={t.href} href={t.href} className={cn(quiet, t.strong && "ez:font-medium ez:text-fg")}>
                {t.label}
              </NextLink>
            ))}
          </nav>
          {business.length > 0 && <p className="ez:m-0 ez:leading-relaxed">{business.map((r) => `${r.label} ${r.value}`).join(" · ")}</p>}
        </div>
      </div>
    </footer>
  );
}
