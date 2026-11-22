import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Lines, Pic } from "../kit";
import type { MenuGroup, PlaceLink } from "../template/data";
import { PlaceNavLinks } from "./nav";
import {
  menuItems,
  paragraphs,
  PLACE_ID,
  PLACE_TITLE,
  telHref,
} from "./shared";
import type { PlaceFooterProps, PlaceHeaderProps } from "./types";

const rule = "ez:border-0 ez:border-solid ez:border-site-line";

const bleed = "ez:mx-[calc(50%-50vw)]";

const grid = "ez:grid ez:gap-y-10 ez:lg:grid-cols-12 ez:lg:gap-x-gutter";

const display =
  "ez:m-0 ez:font-display ez:text-site-name ez:font-semibold ez:tracking-tight ez:text-fg ez:lg:text-site-display-md";

const title =
  "ez:m-0 ez:font-display ez:text-site-heading ez:font-semibold ez:tracking-tight ez:text-fg ez:lg:text-site-title";

const quiet = cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const out = { target: "_blank", rel: "noopener noreferrer" } as const;

function Go({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? out : {})}
      className={cn(
        "ez:inline-flex ez:items-center ez:gap-3 ez:justify-self-start ez:py-1 ez:text-site-small ez:font-medium ez:text-fg ez:no-underline ez:hover:text-muted",
        focusRing
      )}
    >
      {children}
      <span aria-hidden="true" className="ez:h-px ez:w-6 ez:bg-current" />
    </a>
  );
}

function LinkList({ links }: { links: PlaceLink[] }) {
  if (!links.length) return null;
  return (
    <ul className="ez:m-0 ez:grid ez:list-none ez:content-start ez:gap-1 ez:p-0">
      {links.map((l) => (
        <li key={l.key}>
          <a href={l.href} {...out} className={quiet}>
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Header({ name, logoUrl, phone, nav, links }: PlaceHeaderProps) {
  return (
    <header
      data-slot="site-header"
      data-variant="float"
      className="ez:bg-surface"
    >
      <div className={cn(rule, "ez:border-b")}>
        <div className="ez:mx-auto ez:flex ez:min-h-16 ez:max-w-wrap ez:items-center ez:gap-8 ez:px-page ez:lg:min-h-22">
          <NextLink
            href="/"
            className={cn(
              "ez:min-w-0 ez:font-display ez:text-site-counter ez:font-medium ez:leading-none ez:text-fg ez:no-underline",
              focusRing
            )}
          >
            <SiteLogo name={name} src={logoUrl} />
          </NextLink>
          <nav
            aria-label="주요 메뉴"
            className="ez:ml-auto ez:flex ez:min-w-0 ez:gap-8 ez:whitespace-nowrap ez:text-site-small ez:font-medium ez:max-lg:hidden"
          >
            <PlaceNavLinks
              items={nav}
              className={cn(
                "ez:py-1.5 ez:text-fg ez:no-underline ez:hover:text-muted",
                focusRing
              )}
            />
          </nav>
          {(links.length > 0 || phone) && (
            <div className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-8 ez:whitespace-nowrap ez:text-site-small ez:font-medium ez:lg:ml-0">
              {links.map((l) => (
                <a
                  key={l.key}
                  href={l.href}
                  {...out}
                  className={cn(
                    "ez:py-1.5 ez:text-fg ez:no-underline ez:hover:text-muted ez:max-md:hidden",
                    focusRing
                  )}
                >
                  {l.label}
                </a>
              ))}
              {phone && (
                <a
                  href={telHref(phone)}
                  className={cn(
                    "ez:py-1.5 ez:text-fg ez:no-underline ez:tabular-nums ez:hover:text-muted",
                    focusRing
                  )}
                >
                  {phone}
                </a>
              )}
            </div>
          )}
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
  const blank = !heading && !image;
  const over = Boolean(image);
  const logo =
    "ez:m-0 ez:max-w-4xl ez:font-display ez:text-site-page ez:font-medium ez:leading-none ez:text-balance ez:text-fg ez:lg:text-site-hero";
  return (
    <section
      data-slot="hero"
      data-variant={over ? "full" : "plain"}
      data-blank={blank ? "" : undefined}
      data-bleed=""
      className={cn(
        "ez:relative ez:h-130 ez:overflow-hidden ez:lg:h-210",
        bleed
      )}
    >
      <Photo
        src={image}
        alt=""
        preload
        sizes="100vw"
        tone={0}
        className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none"
      />
      {over && (
        <span
          aria-hidden="true"
          className="ez:absolute ez:inset-x-0 ez:top-0 ez:h-32 ez:bg-linear-to-b ez:from-surface/85 ez:to-transparent ez:lg:h-40"
        />
      )}
      {over && (heading || name) && (
        <span
          aria-hidden="true"
          className="ez:absolute ez:inset-x-0 ez:bottom-0 ez:h-3/5 ez:bg-linear-to-t ez:from-surface/90 ez:via-surface/60 ez:to-transparent"
        />
      )}
      <div className="ez:absolute ez:inset-x-0 ez:bottom-12 ez:mx-auto ez:max-w-wrap ez:px-page ez:lg:bottom-24">
        <div className="ez:flex ez:flex-col ez:items-start ez:text-fg">
          {heading ? (
            <>
              {name && (
                <p className="ez:m-0 ez:mb-6 ez:text-site-small ez:font-medium ez:tracking-widest ez:text-muted">
                  {name}
                </p>
              )}
              <h1 className={logo}>{heading}</h1>
              {sub && (
                <p
                  data-slot="hero-sub"
                  className="ez:m-0 ez:mt-8 ez:max-w-110 ez:text-site-body ez:leading-relaxed ez:lg:text-site-counter"
                >
                  {sub}
                </p>
              )}
            </>
          ) : name ? (
            <p className={logo}>{name}</p>
          ) : (
            <Bar
              size="long"
              className="ez:text-site-page ez:lg:text-site-hero"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export function Intro({ data }: SectionProps<"intro">) {
  const body = paragraphs(data.body);
  const image = data.image ?? data.images?.[0] ?? null;
  return (
    <section
      data-slot="intro"
      id={PLACE_ID.intro}
      data-blank={body.length ? undefined : ""}
      className={cn(grid, "ez:text-fg")}
    >
      <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-8 ez:lg:col-span-6">
        <h2 className={title}>{PLACE_TITLE.intro}</h2>
        <div className="ez:grid ez:max-w-150 ez:gap-6">
          {body.length ? (
            body.map((p, i) => (
              <p
                key={i}
                className="ez:m-0 ez:whitespace-pre-line ez:leading-loose"
              >
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
      <div className="ez:min-w-0 ez:lg:col-span-5 ez:lg:col-start-8">
        <Pic src={image} ratio={1.5} tone={1} />
      </div>
    </section>
  );
}

export function Band({ data }: SectionProps<"photo_band">) {
  const image = data.image ?? data.images?.[0] ?? null;
  return (
    <section
      data-slot="photo-band"
      data-blank={image ? undefined : ""}
      data-bleed=""
      className={cn("ez:grid", bleed)}
    >
      <Photo
        src={image}
        alt=""
        sizes="100vw"
        tone={2}
        className="ez:aspect-auto ez:h-80 ez:rounded-none ez:md:h-110 ez:lg:h-140"
      />
    </section>
  );
}

const row = cn(
  rule,
  "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-b ez:py-4"
);

function MenuColumn({
  group,
  index,
}: {
  group: MenuGroup | null;
  index: number;
}) {
  const cover = group?.items.find((i) => i.image)?.image ?? null;
  return (
    <div className="ez:grid ez:min-w-0 ez:content-start">
      <Pic src={cover} ratio={1.5} tone={index} />
      {group ? (
        group.name && <h3 className={cn(title, "ez:mt-8")}>{group.name}</h3>
      ) : (
        <span className="ez:mt-8 ez:text-site-heading ez:lg:text-site-title">
          <Bar size="short" />
        </span>
      )}
      <dl className="ez:m-0 ez:mt-4 ez:grid">
        {group
          ? group.items.map((item) => (
              <div key={item.id} className={row}>
                <dt className="ez:min-w-0 ez:text-fg">{item.name}</dt>
                <dd className="ez:m-0 ez:shrink-0 ez:text-muted ez:tabular-nums">
                  {item.price}
                </dd>
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
  const shown: (MenuGroup | null)[] = empty ? [null, null, null] : groups;
  return (
    <section
      data-slot="menu"
      id={PLACE_ID.menu}
      data-blank={empty ? "" : undefined}
      className="ez:grid ez:gap-12 ez:text-fg ez:lg:gap-16"
    >
      <h2 className={display}>{PLACE_TITLE.menu}</h2>
      <div className="ez:grid ez:gap-x-gutter ez:gap-y-16 ez:md:grid-cols-2 ez:lg:grid-cols-3">
        {shown.map((g, i) => (
          <MenuColumn key={g ? g.id ?? "rest" : i} group={g} index={i} />
        ))}
      </div>
    </section>
  );
}

export function Store({ data, context }: SectionProps<"store_info">) {
  const blank = !data.address;
  const name = data.title?.trim() || context.storeName?.trim() || null;
  const links = data.links ?? [];
  const rows: { label: string; value: ReactNode }[] = [
    { label: PLACE_TITLE.address, value: data.address ?? <Bar size="long" /> },
    ...(data.phone || blank
      ? [
          {
            label: PLACE_TITLE.phone,
            value: data.phone ? (
              <span className="ez:tabular-nums">{data.phone}</span>
            ) : (
              <Bar size="short" />
            ),
          },
        ]
      : []),
    ...(data.hours || blank
      ? [{ label: PLACE_TITLE.hours, value: data.hours ?? <Bar /> }]
      : []),
  ];
  const go = Boolean(data.href || data.phone || links.length);
  return (
    <section
      data-slot="store-info"
      id={PLACE_ID.store}
      data-blank={blank ? "" : undefined}
      className="ez:grid ez:gap-12 ez:text-fg"
    >
      <h2 className={display}>{PLACE_TITLE.store}</h2>
      <article className={cn(rule, grid, "ez:border-y ez:py-12")}>
        <div className="ez:min-w-0 ez:lg:col-span-6">
          <Pic src={data.image} ratio={1.5} tone={3} />
        </div>
        <div className="ez:grid ez:min-w-0 ez:content-start ez:lg:col-span-5 ez:lg:col-start-8">
          {name ? (
            <h3 className={title}>{name}</h3>
          ) : (
            <span className="ez:text-site-heading ez:lg:text-site-title">
              <Bar />
            </span>
          )}
          <dl
            className={cn(
              rule,
              "ez:m-0 ez:mt-8 ez:grid ez:gap-2 ez:border-t ez:pt-6"
            )}
          >
            {rows.map((r) => (
              <div
                key={r.label}
                className="ez:grid ez:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] ez:gap-4"
              >
                <dt className="ez:text-site-small ez:font-medium ez:leading-relaxed ez:text-muted">
                  {r.label}
                </dt>
                <dd className="ez:m-0 ez:min-w-0 ez:text-site-note ez:leading-relaxed ez:text-fg">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
          {go && (
            <div className="ez:mt-8 ez:grid ez:gap-2">
              {data.href && (
                <Go href={data.href} external>
                  {PLACE_TITLE.directions}
                </Go>
              )}
              {data.phone && (
                <Go href={telHref(data.phone)}>{PLACE_TITLE.call}</Go>
              )}
              {links.map((l) => (
                <Go key={l.key} href={l.href} external>
                  {l.label}
                </Go>
              ))}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

export function Footer({
  storeName,
  phone,
  hours,
  address,
  legal,
  nav,
  links,
  terms,
}: PlaceFooterProps) {
  const contact = [address, hours && `${PLACE_TITLE.hours} ${hours}`].filter(
    (c): c is string => Boolean(c)
  );
  return (
    <footer
      data-slot="site-footer"
      className={cn(rule, "ez:border-t ez:text-fg")}
    >
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-18 ez:pb-12 ez:lg:pt-24 ez:lg:pb-16">
        <div className="ez:grid ez:gap-10 ez:text-site-small ez:md:grid-cols-12 ez:md:gap-x-gutter">
          <p className="ez:m-0 ez:font-display ez:text-site-heading ez:font-medium ez:text-fg ez:md:col-span-5 ez:lg:text-site-title">
            {storeName}
          </p>
          {(nav.length > 0 || links.length > 0) && (
            <nav
              aria-label={PLACE_TITLE.links}
              className="ez:grid ez:content-start ez:gap-6 ez:md:col-span-3 ez:md:col-start-7"
            >
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
              <LinkList links={links} />
            </nav>
          )}
          {(phone || contact.length > 0) && (
            <div className="ez:grid ez:content-start ez:gap-1 ez:text-muted ez:md:col-span-3 ez:md:col-start-10">
              {phone && (
                <a
                  href={telHref(phone)}
                  className={cn(quiet, "ez:justify-self-start ez:tabular-nums")}
                >
                  {phone}
                </a>
              )}
              {contact.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          )}
        </div>
        <div
          className={cn(
            rule,
            "ez:mt-18 ez:grid ez:gap-4 ez:border-t ez:pt-6 ez:text-site-small ez:text-muted ez:lg:mt-24"
          )}
        >
          <p className="ez:m-0 ez:max-w-225 ez:leading-relaxed">{legal}</p>
          <nav
            aria-label={PLACE_TITLE.terms}
            className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2"
          >
            {terms.map((t) => (
              <NextLink
                key={t.href}
                href={t.href}
                className={cn(quiet, t.strong && "ez:font-medium ez:text-fg")}
              >
                {t.label}
              </NextLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
