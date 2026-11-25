import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Lines, Pic } from "../kit";
import type { PlaceLink } from "../template/data";
import { PlaceNavLinks } from "./nav";
import { businessLine } from "../quote/shared";
import { menuItems, paragraphs, PLACE_ID, PLACE_TITLE, telHref } from "./shared";
import type { PlaceFooterProps, PlaceHeaderProps } from "./types";

const rule = "ez:border-0 ez:border-solid ez:border-site-line";

const edge = "ez:border-0 ez:border-solid ez:border-site-edge";

const h2 = "ez:m-0 ez:shrink-0 ez:font-display ez:text-site-note ez:font-normal ez:tracking-widest ez:text-fg";

const small = "ez:text-site-small ez:font-normal ez:tracking-wider ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4";

const boxed = cn(
  edge,
  "ez:inline-flex ez:h-12 ez:items-center ez:rounded-button ez:border ez:px-6 ez:text-site-note ez:font-medium ez:tracking-wider ez:text-fg ez:no-underline ez:hover:bg-surface-alt",
  focusRing,
);

const label = "ez:text-site-note ez:font-normal ez:tracking-wider ez:text-fg ez:underline ez:decoration-1 ez:underline-offset-4";

const grid = "ez:grid ez:text-fg ez:lg:grid-cols-12 ez:lg:gap-x-gutter";

function External({ link, className }: { link: PlaceLink; className: string }) {
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {link.label}
    </a>
  );
}

export function Header({ name, logoUrl, phone, nav, links }: PlaceHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="showroom" className="ez:bg-transparent">
      <div className="ez:mx-auto ez:grid ez:min-h-16 ez:max-w-wrap ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-6 ez:px-page ez:lg:min-h-24 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:gap-6 ez:overflow-hidden ez:whitespace-nowrap ez:max-lg:hidden">
          <PlaceNavLinks items={nav} className={cn(small, focusRing)} />
        </nav>
        <NextLink
          href="/"
          className={cn("ez:min-w-0 ez:justify-self-start ez:text-site-counter ez:font-normal ez:tracking-widest ez:text-fg ez:no-underline ez:lg:justify-self-center", focusRing)}
        >
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <div className="ez:flex ez:min-w-0 ez:items-center ez:justify-self-end ez:gap-6 ez:whitespace-nowrap">
          {links.map((l) => (
            <External key={l.key} link={l} className={cn(small, "ez:max-md:hidden", focusRing)} />
          ))}
          {phone && (
            <a href={telHref(phone)} className={cn(small, "ez:tabular-nums", focusRing)}>
              {phone}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer({ storeName, phone, hours, address, legal, business, links, terms }: PlaceFooterProps) {
  const line = business.length ? businessLine(business) : legal;
  const contact = Boolean(address || phone || hours);
  return (
    <footer data-slot="site-footer" data-variant="showroom" className="ez:text-site-small ez:text-muted">
      <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:gap-8 ez:px-page ez:py-16">
        <div className="ez:flex ez:flex-wrap ez:items-start ez:justify-between ez:gap-x-12 ez:gap-y-6">
          {contact && (
            <div className="ez:grid ez:gap-1 ez:leading-relaxed">
              {address && <span>{address}</span>}
              {phone && (
                <a href={telHref(phone)} className={cn("ez:justify-self-start ez:text-muted ez:no-underline ez:tabular-nums ez:hover:text-fg", focusRing)}>
                  {phone}
                </a>
              )}
              {hours && <span>{`${PLACE_TITLE.hours} ${hours}`}</span>}
            </div>
          )}
          <div className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2">
            {links.length > 0 && (
              <nav aria-label={PLACE_TITLE.links} className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2">
                {links.map((l) => (
                  <External key={l.key} link={l} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)} />
                ))}
              </nav>
            )}
            <nav aria-label={PLACE_TITLE.terms} className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2">
              {terms.map((t) => (
                <NextLink key={t.href} href={t.href} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", t.strong && "ez:font-medium ez:text-fg", focusRing)}>
                  {t.label}
                </NextLink>
              ))}
            </nav>
          </div>
        </div>
        <div className="ez:flex ez:flex-col ez:gap-3 ez:leading-relaxed ez:md:flex-row ez:md:justify-between ez:md:gap-10">
          <p className="ez:m-0 ez:min-w-0 ez:break-words">{line}</p>
          <p className="ez:m-0 ez:shrink-0 ez:tracking-wider">© {storeName}</p>
        </div>
      </div>
    </footer>
  );
}

export function Hero({ data }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const sub = title ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  return (
    <section data-slot="hero" data-variant="showroom" data-blank={image || title ? undefined : ""} className={cn(grid, "ez:gap-y-8")}>
      <Photo src={image} alt={title ?? ""} preload tone={0} sizes="(max-width: 1024px) 100vw, 1120px" className="ez:aspect-video ez:lg:col-span-10 ez:lg:col-start-2" />
      {title && (
        <div className="ez:grid ez:gap-2 ez:text-center ez:lg:col-span-10 ez:lg:col-start-2">
          <h1 className="ez:m-0 ez:font-display ez:text-site-heading ez:font-normal ez:tracking-wide ez:text-balance ez:text-fg">{title}</h1>
          {sub && (
            <p data-slot="hero-sub" className="ez:m-0 ez:text-muted">
              {sub}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export function Intro({ data }: SectionProps<"intro">) {
  const body = paragraphs(data.body);
  const image = data.image ?? data.images?.[0] ?? null;
  return (
    <section data-slot="intro" data-variant="showroom" id={PLACE_ID.intro} data-blank={body.length ? undefined : ""} className={cn(grid, "ez:gap-y-10")}>
      <div className="ez:lg:col-span-6 ez:lg:row-span-2">
        <Pic src={image} ratio={1.5} tone={1} />
      </div>
      <span aria-hidden="true" className={cn(edge, "ez:mt-2.5 ez:self-start ez:border-t ez:max-lg:hidden ez:lg:col-start-7 ez:lg:row-start-1 ez:lg:-ml-gutter")} />
      <h2 className={cn(h2, "ez:lg:col-span-5 ez:lg:col-start-8 ez:lg:row-start-1")}>{PLACE_TITLE.intro}</h2>
      <div className="ez:grid ez:max-w-prose ez:content-start ez:gap-8 ez:lg:col-span-5 ez:lg:col-start-8 ez:lg:row-start-2 ez:lg:pt-2">
        {body.length ? (
          body.map((p, i) => (
            <p key={i} className="ez:m-0 ez:whitespace-pre-line ez:leading-loose ez:tracking-wide ez:text-fg">
              {p}
            </p>
          ))
        ) : (
          <>
            <Lines />
            <Lines />
            <Lines />
          </>
        )}
      </div>
    </section>
  );
}

function Lead({ title }: { title: string }) {
  return (
    <div className="ez:flex ez:items-center ez:gap-6">
      <h2 className={h2}>{title}</h2>
      <span aria-hidden="true" className={cn(edge, "ez:min-w-8 ez:flex-1 ez:border-t ez:lg:-mr-gutter")} />
    </div>
  );
}

function Pair({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="ez:grid ez:gap-1">
      <dt className={label}>{term}</dt>
      <dd className="ez:m-0 ez:min-w-0 ez:whitespace-pre-line ez:text-site-note ez:leading-relaxed ez:tracking-wide ez:break-words ez:text-fg">{children}</dd>
    </div>
  );
}

export function Store({ data }: SectionProps<"store_info">) {
  const address = data.address?.trim() || null;
  const blank = !address;
  const hours = data.hours?.trim() || null;
  const phone = data.phone?.trim() || null;
  const links = data.links ?? [];
  const href = address ? data.href : null;
  return (
    <section data-slot="store-info" data-variant="showroom" id={PLACE_ID.store} data-blank={blank ? "" : undefined} className={cn(grid, "ez:gap-y-12")}>
      <div className="ez:grid ez:min-w-0 ez:content-start ez:lg:col-span-6">
        <Lead title={PLACE_TITLE.store} />
        <dl className="ez:m-0 ez:mt-12 ez:grid ez:gap-5">
          <Pair term={PLACE_TITLE.address}>{address ?? <Bar size="long" />}</Pair>
          {(hours || blank) && <Pair term={PLACE_TITLE.hours}>{hours ?? <Bar />}</Pair>}
          {(phone || blank) && (
            <Pair term={PLACE_TITLE.phone}>
              {phone ? (
                <a href={telHref(phone)} className={cn("ez:text-fg ez:no-underline ez:tabular-nums ez:hover:underline ez:underline-offset-4", focusRing)}>
                  {phone}
                </a>
              ) : (
                <Bar size="short" />
              )}
            </Pair>
          )}
        </dl>
        {(href || links.length > 0) && (
          <div className="ez:mt-8 ez:flex ez:flex-wrap ez:gap-2">
            {href && (
              <a href={href} target="_blank" rel="noopener noreferrer" className={boxed}>
                {PLACE_TITLE.directions}
              </a>
            )}
            {links.map((l) => (
              <External key={l.key} link={l} className={boxed} />
            ))}
          </div>
        )}
      </div>
      <div className="ez:lg:col-span-6">
        <Pic src={data.image} ratio={1.5} tone={2} />
      </div>
    </section>
  );
}

export function Menu({ data }: SectionProps<"menu">) {
  const groups = (data.groups ?? []).filter((g) => g.items.length);
  const empty = !menuItems(groups).length;
  return (
    <section data-slot="menu" data-variant="showroom" id={PLACE_ID.menu} data-blank={empty ? "" : undefined} className="ez:grid ez:gap-12 ez:text-fg">
      <Lead title={PLACE_TITLE.menu} />
      {empty ? (
        <dl className="ez:m-0 ez:grid ez:gap-x-gutter ez:gap-y-10 ez:sm:grid-cols-2 ez:lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="ez:grid ez:content-start ez:gap-3">
              <dt className="ez:text-site-note">
                <Bar size="short" />
              </dt>
              <dd className="ez:m-0 ez:grid ez:gap-2.5 ez:text-site-note">
                <Bar size="long" />
                <Bar />
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="ez:grid ez:gap-x-gutter ez:gap-y-12 ez:sm:grid-cols-2 ez:lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.id ?? "rest"} className="ez:grid ez:min-w-0 ez:content-start ez:gap-3">
              {g.name && <h3 className={cn(label, "ez:m-0")}>{g.name}</h3>}
              <dl className="ez:m-0 ez:grid ez:gap-1.5">
                {g.items.map((item) => (
                  <div key={item.id} className="ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:text-site-note ez:leading-relaxed ez:tracking-wide">
                    <dt className="ez:min-w-0 ez:text-fg">{item.name}</dt>
                    <dd className="ez:m-0 ez:shrink-0 ez:text-fg ez:tabular-nums">{item.price}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const qaRow = cn(rule, "ez:grid ez:gap-2 ez:border-b ez:py-6 ez:md:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] ez:md:gap-6");

export function Faq({ context }: SectionProps<"faq">) {
  const faqs = context.faqs;
  return (
    <section data-slot="faq" data-variant="showroom" id={PLACE_ID.faq} data-blank={faqs.length ? undefined : ""} className={cn(grid, "ez:gap-y-10")}>
      <h2 className={cn(h2, "ez:lg:col-span-4")}>{PLACE_TITLE.faq}</h2>
      <dl className={cn(edge, "ez:m-0 ez:min-w-0 ez:border-t ez:lg:col-span-8 ez:lg:col-start-5")}>
        {faqs.length
          ? faqs.map((f) => (
              <div key={f.id} className={qaRow}>
                <dt className="ez:flex ez:min-w-0 ez:gap-2 ez:font-normal ez:leading-relaxed ez:tracking-wide ez:text-fg">
                  <span aria-hidden="true" className="ez:shrink-0 ez:text-muted">
                    Q.
                  </span>
                  <span className="ez:min-w-0 ez:break-words">{f.question}</span>
                </dt>
                <dd className="ez:m-0 ez:min-w-0 ez:whitespace-pre-line ez:leading-relaxed ez:tracking-wide ez:break-words ez:text-fg">{f.answer}</dd>
              </div>
            ))
          : [0, 1, 2].map((i) => (
              <div key={i} className={qaRow}>
                <dt>
                  <Bar size="long" />
                </dt>
                <dd className="ez:m-0">
                  <Lines />
                </dd>
              </div>
            ))}
      </dl>
    </section>
  );
}

export function Band({ data }: SectionProps<"photo_band">) {
  const image = data.image ?? data.images?.[0] ?? null;
  return (
    <section data-slot="photo-band" data-variant="showroom" data-blank={image ? undefined : ""} className="ez:grid">
      <Photo src={image} alt="" tone={3} sizes="(max-width: 1440px) 100vw, 1344px" className="ez:aspect-[3/2] ez:md:aspect-[9/4]" />
    </section>
  );
}
