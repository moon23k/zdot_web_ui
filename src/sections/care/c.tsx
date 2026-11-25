import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Lines } from "../kit";
import { visitRows } from "../landing/parts";
import { bookingLink, menuItems, paragraphs, telHref } from "../landing/shared";
import type { PlaceLink } from "../template/data";
import { CareNavLinks } from "./nav";
import { businessLine } from "../quote/shared";
import { CARE_ID, CARE_TITLE } from "./shared";
import type { CareFooterProps, CareHeaderProps } from "./types";

const rule = "ez:border-0 ez:border-solid ez:border-site-line";

const edge = "ez:border-0 ez:border-solid ez:border-site-edge";

const grid = "ez:grid ez:text-fg ez:lg:grid-cols-12 ez:lg:gap-x-gutter";

const h2 = "ez:m-0 ez:font-display ez:text-site-heading ez:font-normal ez:tracking-wide ez:text-fg";

const head = "ez:lg:col-span-2 ez:lg:col-start-1";

const body = "ez:min-w-0 ez:lg:col-span-9 ez:lg:col-start-3";

const button = cn(
  edge,
  "ez:inline-flex ez:h-10 ez:items-center ez:justify-center ez:rounded-button ez:border ez:px-5 ez:text-site-small ez:font-medium ez:tracking-wider ez:whitespace-nowrap ez:text-fg ez:no-underline ez:hover:bg-surface-alt",
  focusRing,
);

const soft = button;

const quiet = cn("ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing);

const label = "ez:text-site-small ez:font-normal ez:tracking-wider ez:text-fg";

const value = "ez:m-0 ez:min-w-0 ez:text-site-body ez:tracking-wide ez:break-words ez:text-fg";

type Visit = { hours?: string | null; phone?: string | null; links?: PlaceLink[] };

function Actions({ phone, links, className }: { phone: string | null; links: PlaceLink[]; className?: string }) {
  const booking = bookingLink(links);
  if (!booking && !phone) return null;
  return (
    <div className={cn("ez:flex ez:flex-wrap ez:items-center ez:gap-2", className)}>
      {phone && (
        <a href={telHref(phone)} className={button}>
          {CARE_TITLE.call}
        </a>
      )}
      {booking && (
        <a href={booking.href} target="_blank" rel="noopener noreferrer" className={soft}>
          {CARE_TITLE.book}
        </a>
      )}
    </div>
  );
}

export function Header({ name, logoUrl, phone, nav, links }: CareHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="showroom" className="ez:bg-transparent">
      <div className="ez:mx-auto ez:flex ez:min-h-16 ez:max-w-wrap ez:items-center ez:gap-6 ez:px-page ez:lg:min-h-24">
        <NextLink href="/" className={cn("ez:min-w-0 ez:text-site-counter ez:font-normal ez:tracking-wide ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:ml-auto ez:flex ez:min-w-0 ez:gap-7 ez:overflow-hidden ez:whitespace-nowrap ez:text-site-body ez:tracking-wider ez:max-lg:hidden">
          <CareNavLinks items={nav} className={quiet} />
        </nav>
        <Actions phone={phone} links={links} className="ez:ml-auto ez:shrink-0 ez:flex-nowrap ez:lg:ml-4" />
      </div>
    </header>
  );
}

export function Footer({ storeName, phone, hours, address, legal, business, nav, links, terms }: CareFooterProps) {
  const line = business.length ? businessLine(business) : legal;
  const muted = cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);
  return (
    <footer data-slot="site-footer" data-variant="showroom" className="ez:text-site-small ez:text-muted">
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-16 ez:pb-12">
        <div className={cn(rule, grid, "ez:gap-y-8 ez:border-t ez:pt-12")}>
          <p className="ez:m-0 ez:min-w-0 ez:text-site-counter ez:font-normal ez:tracking-wide ez:text-fg ez:lg:col-span-4">{storeName}</p>
          {nav.length > 0 && (
            <nav aria-label="사이트 메뉴" className="ez:grid ez:content-start ez:justify-items-start ez:gap-2 ez:lg:col-span-2 ez:lg:col-start-5">
              <CareNavLinks items={nav} className={cn("ez:tracking-wide", quiet)} />
            </nav>
          )}
          {(address || phone || hours || links.length > 0) && (
            <div className="ez:grid ez:min-w-0 ez:content-start ez:justify-items-start ez:gap-2 ez:leading-relaxed ez:lg:col-span-3 ez:lg:col-start-7">
              {address && <span className="ez:break-words">{address}</span>}
              {phone && (
                <a href={telHref(phone)} className={cn(muted, "ez:tabular-nums")}>
                  {phone}
                </a>
              )}
              {hours && <span>{`${CARE_TITLE.hours} ${hours}`}</span>}
              {links.length > 0 && (
                <ul aria-label={CARE_TITLE.links} className="ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-x-6 ez:gap-y-2 ez:p-0">
                  {links.map((l) => (
                    <li key={l.key}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={muted}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <nav aria-label={CARE_TITLE.terms} className="ez:grid ez:content-start ez:justify-items-start ez:gap-2 ez:lg:col-span-2 ez:lg:col-start-11">
            {terms.map((t) => (
              <NextLink key={t.href} href={t.href} className={cn(muted, t.strong && "ez:font-medium ez:text-fg")}>
                {t.label}
              </NextLink>
            ))}
          </nav>
        </div>
        <div className="ez:mt-12 ez:flex ez:flex-col ez:gap-3 ez:text-site-small ez:leading-relaxed ez:md:flex-row ez:md:justify-between ez:md:gap-10">
          <p className="ez:m-0 ez:min-w-0 ez:break-words">{line}</p>
          <p className="ez:m-0 ez:shrink-0 ez:tracking-wider">© {storeName}</p>
        </div>
      </div>
    </footer>
  );
}

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className={cn(rule, "ez:grid ez:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] ez:items-baseline ez:gap-4 ez:border-b ez:py-3 ez:last:border-b-0")}>
      <dt className={label}>{term}</dt>
      <dd className={value}>{children}</dd>
    </div>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const visit = data as SectionProps<"hero">["data"] & Visit;
  const title = data.title?.trim() || null;
  const sub = title ? data.sub?.trim() || null : null;
  const name = context.storeName?.trim() || null;
  const image = data.image ?? data.images?.[0] ?? null;
  const hours = visit.hours?.trim() || null;
  const phone = visit.phone?.trim() || null;
  const links = visit.links ?? [];
  return (
    <section data-slot="hero" data-variant="showroom" data-blank={image || title ? undefined : ""} className={cn(grid, "ez:gap-y-6")}>
      <Photo
        src={image}
        alt={title ?? ""}
        preload
        tone={0}
        sizes="(max-width: 1440px) 100vw, 1344px"
        className="ez:aspect-[4/3] ez:lg:col-span-12 ez:lg:col-start-1 ez:lg:row-start-1 ez:lg:aspect-[28/15]"
      />
      <div className="ez:relative ez:grid ez:min-w-0 ez:gap-5 ez:bg-surface ez:lg:z-10 ez:lg:col-span-6 ez:lg:col-start-7 ez:lg:row-start-1 ez:lg:self-end ez:lg:rounded-tl-lg ez:lg:px-6 ez:lg:pt-8 ez:lg:pb-6">
        {(title || name) && (
          <div className="ez:grid ez:gap-1">
            {title ? (
              <h1 className="ez:m-0 ez:font-display ez:text-site-heading ez:font-normal ez:tracking-wide ez:text-balance ez:text-fg">{title}</h1>
            ) : (
              <p className="ez:m-0 ez:font-display ez:text-site-heading ez:font-normal ez:tracking-wide ez:text-fg">{name}</p>
            )}
            {sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:tracking-wide ez:text-muted">
                {sub}
              </p>
            )}
          </div>
        )}
        <dl className={cn(edge, "ez:m-0 ez:grid ez:border-y")}>
          <Row term={CARE_TITLE.hours}>{hours ?? <Bar />}</Row>
          <Row term={CARE_TITLE.phone}>
            {phone ? (
              <a href={telHref(phone)} className={cn(quiet, "ez:tabular-nums")}>
                {phone}
              </a>
            ) : (
              <Bar size="short" />
            )}
          </Row>
        </dl>
        <Actions phone={phone} links={links} />
      </div>
    </section>
  );
}

export function Intro({ data }: SectionProps<"intro">) {
  const text = paragraphs(data.body);
  const left = data.image ?? data.images?.[0] ?? null;
  const right = (data.images ?? []).find((src) => src !== left) ?? null;
  return (
    <section
      data-slot="intro"
      data-variant="showroom"
      id={CARE_ID.intro}
      data-blank={text.length ? undefined : ""}
      className={cn(grid, "ez:grid-cols-2 ez:gap-x-gutter ez:gap-y-10")}
    >
      <Photo src={left} alt="" tone={1} className="ez:aspect-[3/4] ez:lg:col-span-3 ez:lg:col-start-1" />
      <div className="ez:order-first ez:col-span-2 ez:grid ez:content-start ez:justify-items-center ez:gap-10 ez:text-center ez:lg:order-none ez:lg:col-span-6 ez:lg:col-start-4 ez:lg:self-center">
        <h2 className={h2}>{CARE_TITLE.intro}</h2>
        <div className="ez:grid ez:w-full ez:max-w-prose ez:justify-items-center ez:gap-6">
          {text.length ? (
            text.map((p, i) => (
              <p key={i} className="ez:m-0 ez:whitespace-pre-line ez:text-site-body ez:leading-loose ez:tracking-wide ez:text-fg">
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
      <Photo src={right} alt="" tone={2} className="ez:aspect-[3/4] ez:lg:col-span-3 ez:lg:col-start-10" />
    </section>
  );
}

const priceRow = cn(rule, "ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-gutter ez:gap-y-1 ez:border-b ez:py-5 ez:md:grid-cols-9");

const note = "ez:m-0 ez:min-w-0 ez:text-site-small ez:tracking-wider ez:text-muted ez:max-md:col-span-2 ez:max-md:row-start-2 ez:md:col-span-3";

const price = "ez:m-0 ez:text-right ez:text-site-item ez:tracking-wide ez:tabular-nums ez:text-fg ez:md:col-span-3";

export function Menu({ data }: SectionProps<"menu">) {
  const items = menuItems((data.groups ?? []).filter((g) => g.items.length));
  const withNote = items.some((item) => item.category?.trim());
  const name = (wide: boolean) => cn("ez:min-w-0 ez:text-site-item ez:tracking-wide ez:text-fg", wide ? "ez:md:col-span-6" : "ez:md:col-span-3");
  return (
    <section data-slot="menu" data-variant="showroom" id={CARE_ID.menu} data-blank={items.length ? undefined : ""} className={cn(grid, "ez:gap-y-8")}>
      <h2 className={cn(h2, head)}>{CARE_TITLE.prices}</h2>
      <dl className={cn(rule, body, "ez:m-0 ez:border-t")}>
        {items.length
          ? items.map((item) => (
              <div key={item.id} className={priceRow}>
                <dt className={name(!withNote)}>{item.name}</dt>
                {withNote && <dd className={note}>{item.category?.trim() || null}</dd>}
                <dd className={price}>{item.price}</dd>
              </div>
            ))
          : [0, 1, 2].map((i) => (
              <div key={i} className={priceRow}>
                <dt className={name(false)}>
                  <Bar size="long" />
                </dt>
                <dd className={note}>
                  <Bar />
                </dd>
                <dd className={price}>
                  <Bar size="short" />
                </dd>
              </div>
            ))}
      </dl>
    </section>
  );
}

export function Location({ data }: SectionProps<"location">) {
  const address = data.address?.trim() || null;
  const links = data.links ?? [];
  const href = address ? data.href : null;
  return (
    <section data-slot="location" data-variant="showroom" id={CARE_ID.location} data-blank={address ? undefined : ""} className={cn(grid, "ez:gap-y-8")}>
      <h2 className={cn(h2, head)}>{CARE_TITLE.location}</h2>
      <Photo src={data.image} alt="" tone={3} className="ez:aspect-[4/3] ez:lg:col-span-3 ez:lg:col-start-3 ez:lg:aspect-[19/25]" />
      <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-10 ez:lg:col-span-5 ez:lg:col-start-7">
        <dl className="ez:m-0 ez:grid ez:gap-8">
          {visitRows({ ...data, address }).map((r) => (
            <div key={r.label} className="ez:grid ez:gap-2">
              <dt className={label}>{r.label}</dt>
              <dd className={cn(value, "ez:whitespace-pre-line")}>{r.value}</dd>
            </div>
          ))}
        </dl>
        {(href || links.length > 0) && (
          <div className="ez:flex ez:flex-wrap ez:gap-2">
            {href && (
              <a href={href} target="_blank" rel="noopener noreferrer" className={button}>
                {CARE_TITLE.directions}
              </a>
            )}
            {links.map((l) => (
              <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer" className={button}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const fold = cn(rule, "ez:border-b");

const summary = cn(
  "ez:flex ez:min-h-14 ez:cursor-pointer ez:list-none ez:items-center ez:justify-between ez:gap-6 ez:py-4 ez:text-site-body ez:font-normal ez:tracking-wide ez:text-fg ez:[&::-webkit-details-marker]:hidden",
  focusRing,
);

export function Faq({ context }: SectionProps<"faq">) {
  const faqs = context.faqs;
  return (
    <section data-slot="faq" data-variant="showroom" id={CARE_ID.faq} data-blank={faqs.length ? undefined : ""} className={cn(grid, "ez:gap-y-8")}>
      <h2 className={cn(h2, head)}>{CARE_TITLE.faq}</h2>
      <div className={cn(rule, body, "ez:border-t")}>
        {faqs.length
          ? faqs.map((f, i) => (
              <details key={f.id} open={i === 0} className={cn(fold, "ez:group")}>
                <summary className={summary}>
                  <span className="ez:min-w-0 ez:break-words">{f.question}</span>
                  <Icon name="down" size="sm" className="ez:shrink-0 ez:text-muted ez:transition-transform ez:group-open:rotate-180" />
                </summary>
                <p className="ez:m-0 ez:pb-6 ez:whitespace-pre-line ez:text-site-body ez:leading-loose ez:tracking-wide ez:break-words ez:text-fg">{f.answer}</p>
              </details>
            ))
          : [0, 1, 2].map((i) => (
              <div key={i} className={cn(fold, "ez:grid ez:gap-4 ez:py-5")}>
                <Bar size="long" />
                {i === 0 && <Lines />}
              </div>
            ))}
      </div>
    </section>
  );
}
