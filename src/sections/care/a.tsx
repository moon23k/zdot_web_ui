import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Lines, Pic } from "../kit";
import { bookingLink, menuItems, paragraphs, telHref } from "../landing/shared";
import type { MenuGroup, PlaceLink } from "../template/data";
import { CareNavLinks } from "./nav";
import { CARE_ID, CARE_TITLE } from "./shared";
import type { CareFooterProps, CareHeaderProps } from "./types";

const rule = "ez:border-0 ez:border-solid ez:border-site-line";

const bleed = "ez:mx-[calc(50%-50vw)]";

const grid = "ez:grid ez:gap-y-10 ez:lg:grid-cols-12 ez:lg:gap-x-gutter";

const vertical = "ez:[writing-mode:vertical-rl]";

const title = "ez:m-0 ez:font-display ez:text-site-heading ez:font-normal ez:leading-relaxed ez:tracking-widest ez:text-fg ez:lg:text-site-title";

const label = "ez:text-site-small ez:tracking-widest ez:text-muted";

const quiet = cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const out = { target: "_blank", rel: "noopener noreferrer" } as const;

function Box({ href, external, more, children }: { href: string; external?: boolean; more?: boolean; children: ReactNode }) {
  return (
    <a
      href={href}
      {...(external ? out : {})}
      className={cn(
        rule,
        "ez:inline-flex ez:h-10 ez:shrink-0 ez:items-center ez:gap-3 ez:border ez:px-5 ez:text-site-small ez:tracking-widest ez:text-fg ez:no-underline ez:hover:text-muted",
        focusRing,
      )}
    >
      {children}
      {more && (
        <span aria-hidden="true" className="ez:text-muted">
          &gt;
        </span>
      )}
    </a>
  );
}

function Reserve({ links, phone }: { links: PlaceLink[]; phone?: string | null }) {
  const book = bookingLink(links);
  if (book)
    return (
      <Box href={book.href} external>
        {CARE_TITLE.book}
      </Box>
    );
  if (phone) return <Box href={telHref(phone)}>{CARE_TITLE.call}</Box>;
  return null;
}

function VerticalBlank() {
  return <span aria-hidden="true" data-slot="blank-bar" className="ez:block ez:h-32 ez:w-[0.62em] ez:shrink-0 ez:rounded-sm ez:bg-tile-blank ez:text-site-title" />;
}

export function Header({ name, logoUrl, phone, nav, links }: CareHeaderProps) {
  const book = bookingLink(links);
  return (
    <header data-slot="site-header" data-variant="float" className="ez:bg-surface">
      <div className="ez:mx-auto ez:flex ez:min-h-20 ez:max-w-wrap ez:items-center ez:gap-8 ez:px-page ez:lg:min-h-40">
        <NextLink
          href="/"
          className={cn("ez:min-w-0 ez:font-display ez:text-site-heading ez:font-normal ez:leading-none ez:tracking-widest ez:text-fg ez:no-underline ez:lg:text-site-title", focusRing)}
        >
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:ml-auto ez:flex ez:min-w-0 ez:gap-8 ez:whitespace-nowrap ez:font-display ez:text-site-item ez:tracking-wider ez:max-lg:hidden">
          <CareNavLinks items={nav} className={cn("ez:py-1.5 ez:text-fg ez:no-underline ez:hover:text-muted", focusRing)} />
        </nav>
        {book ? (
          <div className="ez:ml-auto ez:shrink-0 ez:lg:ml-4">
            <Box href={book.href} external>
              {CARE_TITLE.book}
            </Box>
          </div>
        ) : (
          phone && (
            <a
              href={telHref(phone)}
              className={cn("ez:ml-auto ez:shrink-0 ez:py-1.5 ez:text-site-small ez:tracking-widest ez:text-fg ez:no-underline ez:tabular-nums ez:hover:text-muted ez:lg:ml-4", focusRing)}
            >
              {phone}
            </a>
          )
        )}
      </div>
    </header>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const heading = data.title?.trim() || null;
  const sub = heading ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const side = data.images?.find((src) => src !== image) ?? null;
  const name = context.storeName?.trim() || null;
  const blank = !heading && !image;
  const phone = data.phone?.trim() || null;
  const links = data.links ?? [];
  const book = bookingLink(links);
  return (
    <section
      data-slot="hero"
      data-variant="split"
      data-blank={blank ? "" : undefined}
      className={cn(grid, "ez:items-start ez:text-fg ez:lg:grid-rows-[min-content_1fr]")}
    >
      <div className="ez:flex ez:min-w-0 ez:items-start ez:gap-gutter ez:lg:col-span-5 ez:lg:col-start-8 ez:lg:row-start-1">
        <div className="ez:grid ez:min-w-0 ez:flex-1 ez:content-start ez:gap-6">
          {heading ? (
            <>
              <h1 className="ez:m-0 ez:font-display ez:text-site-heading ez:font-normal ez:leading-relaxed ez:tracking-widest ez:text-balance">{heading}</h1>
              {sub && (
                <p data-slot="hero-sub" className="ez:m-0 ez:whitespace-pre-line ez:leading-loose ez:tracking-wide">
                  {sub}
                </p>
              )}
            </>
          ) : (
            blank && (
              <>
                <Lines />
                <Lines />
              </>
            )
          )}
        </div>
        {name ? (
          <p className={cn(vertical, "ez:m-0 ez:shrink-0 ez:font-display ez:text-site-title ez:font-normal ez:leading-relaxed ez:tracking-widest")}>{name}</p>
        ) : (
          blank && <VerticalBlank />
        )}
      </div>
      <div className="ez:min-w-0 ez:lg:col-span-8 ez:lg:col-start-5 ez:lg:row-start-2 ez:lg:mt-12">
        <Pic src={image} ratio={1.6} tone={0} />
      </div>
      <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-6 ez:lg:col-span-4 ez:lg:col-start-1 ez:lg:row-span-2 ez:lg:row-start-1">
        <Pic src={side} ratio={0.72} tone={1} />
        {(phone || book) && (
          <div className="ez:grid ez:justify-items-start ez:gap-4 ez:pt-10">
            {phone && (
              <a href={telHref(phone)} aria-label={`${CARE_TITLE.phone} ${phone}`} className={cn("ez:font-display ez:text-site-name ez:font-normal ez:tracking-wide ez:text-fg ez:no-underline ez:tabular-nums ez:hover:text-muted", focusRing)}>
                {phone}
              </a>
            )}
            <Reserve links={links} phone={phone} />
          </div>
        )}
      </div>
    </section>
  );
}

export function Intro({ data }: SectionProps<"intro">) {
  const body = paragraphs(data.body);
  const images = data.images?.length ? data.images : data.image ? [data.image] : [];
  const pair = [images[0] ?? null, images[1] ?? null];
  return (
    <section data-slot="intro" id={CARE_ID.intro} data-blank={body.length ? undefined : ""} className={cn(grid, "ez:text-fg")}>
      <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-12 ez:lg:col-span-6">
        <div className="ez:grid ez:lg:grid-cols-6 ez:lg:gap-x-gutter">
          <h2 className={cn(title, "ez:lg:col-span-5 ez:lg:col-start-2")}>{CARE_TITLE.intro}</h2>
        </div>
        <div className="ez:grid ez:grid-cols-2 ez:gap-gutter">
          {pair.map((src, i) => (
            <Pic key={i} src={src} ratio={4 / 3} tone={i + 2} />
          ))}
        </div>
      </div>
      <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-6 ez:lg:col-span-4 ez:lg:col-start-8 ez:lg:pt-2">
        {body.length ? (
          body.map((p, i) => (
            <p key={i} className="ez:m-0 ez:whitespace-pre-line ez:leading-loose ez:tracking-wide">
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

const row = cn(rule, "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-b ez:py-3");

function MenuCard({ group }: { group: MenuGroup | null }) {
  return (
    <div className={cn(rule, "ez:grid ez:min-w-0 ez:content-start ez:border ez:px-8 ez:pt-12 ez:pb-8")}>
      {group ? (
        <h3 className={cn(rule, "ez:m-0 ez:justify-self-start ez:border-b ez:pb-1 ez:font-display ez:text-site-item ez:font-normal ez:tracking-widest ez:text-fg")}>
          {group.name ?? CARE_TITLE.all}
        </h3>
      ) : (
        <span className="ez:text-site-item">
          <Bar size="short" />
        </span>
      )}
      <dl className="ez:m-0 ez:mt-6 ez:grid ez:text-site-note">
        {group
          ? group.items.map((item) => (
              <div key={item.id} className={row}>
                <dt className="ez:min-w-0 ez:leading-relaxed ez:tracking-wide ez:text-fg">{item.name}</dt>
                <dd className="ez:m-0 ez:shrink-0 ez:text-muted ez:tabular-nums">{item.price}</dd>
              </div>
            ))
          : [0, 1, 2].map((i) => (
              <div key={i} className={row}>
                <dt>
                  <Bar size="long" />
                </dt>
                <dd className="ez:m-0">
                  <Bar size="short" />
                </dd>
              </div>
            ))}
      </dl>
    </div>
  );
}

export function Menu({ data }: SectionProps<"menu">) {
  const groups = (data.groups ?? []).filter((g) => g.items.length);
  const empty = !menuItems(groups).length;
  const shown: (MenuGroup | null)[] = empty ? [null, null, null, null] : groups;
  return (
    <section data-slot="menu" id={CARE_ID.menu} data-blank={empty ? "" : undefined} className="ez:grid ez:gap-12 ez:text-fg">
      <h2 className={title}>{CARE_TITLE.prices}</h2>
      <div className="ez:grid ez:gap-gutter ez:md:grid-cols-2 ez:lg:grid-cols-4">
        {shown.map((g, i) => (
          <MenuCard key={g ? g.id ?? "rest" : i} group={g} />
        ))}
      </div>
    </section>
  );
}

export function Store({ data, context }: SectionProps<"store_info">) {
  const blank = !data.address;
  const name = data.title?.trim() || context.storeName?.trim() || null;
  const links = data.links ?? [];
  const book = bookingLink(links);
  const rest = links.filter((l) => l.key !== book?.key);
  const act = Boolean(book || data.phone || data.href);
  return (
    <section data-slot="store-info" id={CARE_ID.store} data-blank={blank ? "" : undefined} className={cn(grid, "ez:items-start ez:text-fg")}>
      <h2 className={cn(title, "ez:lg:col-start-12 ez:lg:row-start-1 ez:lg:justify-self-end ez:lg:[writing-mode:vertical-rl]")}>{CARE_TITLE.store}</h2>
      <div className="ez:min-w-0 ez:lg:col-span-6 ez:lg:col-start-1 ez:lg:row-start-1">
        <Pic src={data.image} ratio={1.5} tone={3} />
      </div>
      <div className="ez:grid ez:min-w-0 ez:content-start ez:lg:col-span-4 ez:lg:col-start-8 ez:lg:row-start-1">
        {name ? (
          <h3 className={title}>{name}</h3>
        ) : (
          <span className="ez:text-site-heading ez:lg:text-site-title">
            <Bar />
          </span>
        )}
        {act && (
          <div className="ez:mt-8 ez:flex ez:flex-wrap ez:gap-4">
            <Reserve links={links} phone={data.phone} />
            {data.href && (
              <Box href={data.href} external more>
                {CARE_TITLE.directions}
              </Box>
            )}
          </div>
        )}
        <dl className="ez:m-0 ez:mt-8 ez:grid ez:gap-4">
          {(data.phone || blank) && (
            <div className="ez:grid ez:gap-1">
              <dt className={label}>{CARE_TITLE.phone}</dt>
              <dd className="ez:m-0 ez:text-site-figure-lg ez:leading-tight ez:tracking-wider">
                {data.phone ? (
                  <a href={telHref(data.phone)} className={cn("ez:text-fg ez:no-underline ez:tabular-nums ez:hover:text-muted", focusRing)}>
                    {data.phone}
                  </a>
                ) : (
                  <Bar size="short" />
                )}
              </dd>
            </div>
          )}
          <div className="ez:grid ez:gap-1">
            <dt className={label}>{CARE_TITLE.address}</dt>
            <dd className="ez:m-0 ez:leading-relaxed ez:tracking-wide">{data.address ?? <Bar size="long" />}</dd>
          </div>
          {(data.hours || blank) && (
            <div className="ez:grid ez:gap-1">
              <dt className={label}>{CARE_TITLE.hours}</dt>
              <dd className="ez:m-0 ez:leading-relaxed ez:tracking-wide">{data.hours ?? <Bar />}</dd>
            </div>
          )}
        </dl>
        {rest.length > 0 && (
          <ul className="ez:m-0 ez:mt-8 ez:flex ez:list-none ez:flex-wrap ez:gap-x-6 ez:gap-y-2 ez:p-0 ez:text-site-small ez:tracking-widest">
            {rest.map((l) => (
              <li key={l.key}>
                <a href={l.href} {...out} className={quiet}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function Band({ data }: SectionProps<"photo_band">) {
  const images = data.images?.length ? data.images : data.image ? [data.image] : [];
  const tiles = [0, 1, 2].map((i) => images[i] ?? null);
  return (
    <section data-slot="photo-band" data-blank={images.length ? undefined : ""} data-bleed="" className={cn("ez:grid ez:grid-cols-3 ez:gap-2", bleed)}>
      {tiles.map((src, i) => (
        <Pic key={i} src={src} ratio={1.5} tone={i + 1} />
      ))}
    </section>
  );
}

export function Footer({ storeName, phone, hours, address, legal, nav, links, terms }: CareFooterProps) {
  const contact = [address, hours && `${CARE_TITLE.hours} ${hours}`].filter((c): c is string => Boolean(c));
  return (
    <footer data-slot="site-footer" className={cn(rule, "ez:border-t ez:text-fg")}>
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-18 ez:pb-12 ez:lg:pt-24 ez:lg:pb-16">
        <div className="ez:grid ez:gap-10 ez:text-site-small ez:tracking-wide ez:md:grid-cols-12 ez:md:gap-x-gutter">
          <p className="ez:m-0 ez:font-display ez:text-site-heading ez:font-normal ez:tracking-widest ez:text-fg ez:md:col-span-5 ez:lg:text-site-title">{storeName}</p>
          {(nav.length > 0 || links.length > 0) && (
            <nav aria-label={CARE_TITLE.links} className="ez:grid ez:content-start ez:gap-6 ez:md:col-span-3 ez:md:col-start-7">
              {nav.length > 0 && (
                <ul className="ez:m-0 ez:grid ez:list-none ez:gap-1 ez:p-0">
                  {nav.map((n) => (
                    <li key={n.href}>
                      <NextLink href={n.href} className={quiet}>
                        {n.label}
                      </NextLink>
                    </li>
                  ))}
                </ul>
              )}
              {links.length > 0 && (
                <ul className="ez:m-0 ez:grid ez:list-none ez:gap-1 ez:p-0">
                  {links.map((l) => (
                    <li key={l.key}>
                      <a href={l.href} {...out} className={quiet}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          )}
          {(phone || contact.length > 0) && (
            <div className="ez:grid ez:content-start ez:gap-1 ez:text-muted ez:md:col-span-3 ez:md:col-start-10">
              {phone && (
                <a href={telHref(phone)} className={cn(quiet, "ez:justify-self-start ez:tabular-nums")}>
                  {phone}
                </a>
              )}
              {contact.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          )}
        </div>
        <div className={cn(rule, "ez:mt-18 ez:grid ez:gap-4 ez:border-t ez:pt-6 ez:text-site-small ez:text-muted ez:lg:mt-24")}>
          <p className="ez:m-0 ez:max-w-225 ez:leading-relaxed">{legal}</p>
          <nav aria-label={CARE_TITLE.terms} className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2">
            {terms.map((t) => (
              <NextLink key={t.href} href={t.href} className={cn(quiet, t.strong && "ez:font-medium ez:text-fg")}>
                {t.label}
              </NextLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
