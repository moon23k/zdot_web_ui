import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Lines, Pic } from "../kit";
import { LandingNavLinks } from "../landing/nav";
import { visitRows } from "../landing/parts";
import {
  bookingLink,
  LANDING_LABEL,
  menuItems,
  paragraphs,
  telHref,
} from "../landing/shared";
import type { LandingFooterProps, LandingHeaderProps } from "../landing/types";
import type { MenuGroup, MenuItem, PlaceLink } from "../template/data";
import { PLACE_ID, PLACE_TITLE } from "./shared";

export const nightRule = "ez:border-0 ez:border-solid ez:border-site-line";

export const nightHair = "ez:border-0 ez:border-solid ez:border-hairline";

export const nightWrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:px-page";

export const nightHeading =
  "ez:m-0 ez:font-display ez:text-site-name ez:font-extralight ez:leading-tight ez:tracking-tight ez:text-fg ez:lg:text-site-display-md";

export const nightOut = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

const bleed = "ez:mx-[calc(50%-50vw)]";

const button =
  "ez:inline-flex ez:h-12 ez:items-center ez:justify-center ez:gap-2 ez:whitespace-nowrap ez:rounded-full ez:px-7 ez:text-site-body ez:font-medium ez:no-underline";

export const nightSolid = cn(
  button,
  "ez:bg-primary ez:text-on-primary ez:hover:bg-primary-hover",
  focusRing
);

export const nightGhost = cn(
  button,
  "ez:border ez:border-solid ez:border-site-line ez:bg-transparent ez:text-fg ez:hover:bg-raised",
  focusRing
);

const quiet = cn(
  "ez:text-site-off ez:no-underline ez:hover:text-fg",
  focusRing
);

export type NightAction = {
  key: string;
  label: string;
  href: string;
  external?: boolean;
  icon?: "phone";
};

export function NightActions({
  actions,
  className,
}: {
  actions: NightAction[];
  className?: string;
}) {
  if (!actions.length) return null;
  return (
    <div className={cn("ez:flex ez:flex-wrap ez:gap-2.5", className)}>
      {actions.map((a, i) => (
        <a
          key={a.key}
          href={a.href}
          {...(a.external ? nightOut : {})}
          className={i === 0 ? nightSolid : nightGhost}
        >
          {a.icon && <Icon name={a.icon} size="sm" />}
          {a.label}
        </a>
      ))}
    </div>
  );
}

export function NightHead({
  title,
  aside,
}: {
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-x-8 ez:gap-y-3">
      <h2 className={nightHeading}>{title}</h2>
      {aside}
    </div>
  );
}

export function Header({
  name,
  logoUrl,
  phone,
  nav,
  links,
}: LandingHeaderProps) {
  const book = bookingLink(links);
  const rest = links.filter((l) => l.key !== book?.key);
  return (
    <header
      data-slot="site-header"
      data-variant="float"
      className="ez:bg-surface ez:text-fg"
    >
      <div
        className={cn(
          nightWrap,
          "ez:flex ez:min-h-16 ez:items-center ez:gap-9 ez:lg:min-h-22"
        )}
      >
        <NextLink
          href="/"
          className={cn(
            "ez:min-w-0 ez:font-display ez:text-site-counter ez:font-normal ez:leading-none ez:text-fg ez:no-underline ez:lg:w-51 ez:lg:shrink-0",
            focusRing
          )}
        >
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav
          aria-label="주요 메뉴"
          className="ez:flex ez:min-w-0 ez:gap-9 ez:whitespace-nowrap ez:text-site-body ez:max-lg:hidden"
        >
          <LandingNavLinks
            items={nav}
            className={cn(
              "ez:py-1.5 ez:text-muted ez:no-underline ez:hover:text-fg",
              focusRing
            )}
            currentClassName="ez:text-fg"
          />
        </nav>
        {(rest.length > 0 || phone || book) && (
          <div className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-6 ez:whitespace-nowrap ez:text-site-small ez:text-muted">
            {rest.map((l) => (
              <a
                key={l.key}
                href={l.href}
                {...nightOut}
                className={cn(
                  "ez:py-1.5 ez:text-muted ez:no-underline ez:hover:text-fg ez:max-md:hidden",
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
                  "ez:py-1.5 ez:text-muted ez:no-underline ez:tabular-nums ez:hover:text-fg",
                  book && "ez:max-sm:hidden",
                  focusRing
                )}
              >
                {phone}
              </a>
            )}
            {book && (
              <a
                href={book.href}
                {...nightOut}
                className={cn(nightSolid, "ez:h-11 ez:px-5 ez:text-site-small")}
              >
                {LANDING_LABEL.book}
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export function nightReach(
  links: PlaceLink[] | null | undefined,
  phone: string | null | undefined
): NightAction | null {
  const book = bookingLink(links);
  if (book)
    return {
      key: book.key,
      label: LANDING_LABEL.book,
      href: book.href,
      external: true,
    };
  if (phone)
    return { key: "call", label: LANDING_LABEL.call, href: telHref(phone) };
  return null;
}

export type NightRow = { label: string; value: ReactNode };

export function NightBox({
  title,
  rows,
  href,
}: {
  title?: string | null;
  rows: NightRow[];
  href?: string | null;
}) {
  const body = (
    <>
      {title && (
        <b className="ez:block ez:font-display ez:text-site-heading ez:font-light ez:text-fg">
          {title}
        </b>
      )}
      {rows.length > 0 && (
        <dl
          className={cn(
            "ez:m-0 ez:grid ez:text-site-small",
            title && "ez:mt-3"
          )}
        >
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={cn(
                nightHair,
                "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:py-2.5",
                (title || i > 0) && "ez:border-t"
              )}
            >
              <dt className="ez:shrink-0 ez:whitespace-nowrap ez:text-site-off">
                {r.label}
              </dt>
              <dd className="ez:m-0 ez:min-w-0 ez:text-right ez:text-fg ez:tabular-nums">
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
  const box =
    "ez:fx-glass ez:absolute ez:inset-x-4 ez:bottom-4 ez:rounded-lg ez:px-5.5 ez:pt-5 ez:pb-2.5 ez:text-fg ez:md:inset-x-auto ez:md:bottom-7 ez:md:left-7 ez:md:w-75";
  if (href)
    return (
      <NextLink href={href} className={cn(box, "ez:no-underline", focusRing)}>
        {body}
      </NextLink>
    );
  return <div className={box}>{body}</div>;
}

export function nightHours(data: {
  hours?: string | null;
  phone?: string | null;
}): NightRow[] {
  const hours = data.hours?.trim();
  const phone = data.phone?.trim();
  return [
    ...(hours
      ? [
          {
            label: LANDING_LABEL.hours,
            value: <span className="ez:whitespace-pre-line">{hours}</span>,
          },
        ]
      : []),
    ...(phone ? [{ label: LANDING_LABEL.phone, value: phone }] : []),
  ];
}

export function NightHero({
  data,
  context,
  jump,
  box,
}: SectionProps<"hero"> & { jump?: NightAction; box?: ReactNode }) {
  const heading = data.title?.trim() || null;
  const sub = heading ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const name = context.storeName?.trim() || null;
  const reach = nightReach(data.links, data.phone);
  const actions = [reach, jump].filter((a): a is NightAction => Boolean(a));
  const big =
    "ez:fx-fade ez:fx-title-xl ez:m-0 ez:mt-5 ez:max-w-full ez:font-display ez:text-balance ez:break-words";
  return (
    <section
      data-slot="hero"
      data-variant="full"
      data-blank={heading || image ? undefined : ""}
      data-bleed=""
      data-flush=""
      className={cn(
        "ez:relative ez:overflow-clip ez:pt-16 ez:text-fg ez:lg:pt-22",
        bleed
      )}
    >
      <div
        aria-hidden="true"
        className="ez:fx-sky ez:absolute ez:inset-x-0 ez:top-0 ez:h-176 ez:lg:h-222"
      />
      <div className="ez:relative ez:grid">
        <div aria-hidden="true" className="ez:fx-halo ez:z-1" />
        <div aria-hidden="true" className="ez:fx-orb ez:z-1" />
        <div
          className={cn(
            nightWrap,
            "ez:relative ez:z-2 ez:flex ez:h-160 ez:flex-col ez:items-center ez:pt-14 ez:text-center ez:lg:h-200 ez:lg:pt-21"
          )}
        >
          {name ? (
            <p className={big}>{name}</p>
          ) : heading ? (
            <h1 className={big}>{heading}</h1>
          ) : (
            <Bar size="long" className="ez:fx-title-xl ez:mt-5" />
          )}
          {name && heading && (
            <h1 className="ez:m-0 ez:mt-5 ez:max-w-140 ez:text-site-item ez:font-normal ez:leading-relaxed ez:text-muted">
              {heading}
            </h1>
          )}
          {sub && (
            <p
              data-slot="hero-sub"
              className="ez:m-0 ez:mt-2 ez:max-w-140 ez:text-site-body ez:leading-relaxed ez:text-site-off"
            >
              {sub}
            </p>
          )}
          <NightActions
            actions={actions}
            className="ez:mt-9 ez:justify-center"
          />
        </div>
        <div className={cn(nightWrap, "ez:relative ez:z-2")}>
          <div
            className={cn(
              nightRule,
              "ez:fx-round-md ez:relative ez:overflow-hidden ez:border ez:bg-surface-alt"
            )}
          >
            <Photo
              src={image}
              alt=""
              preload
              sizes="100vw"
              tone={0}
              className="ez:aspect-auto ez:h-100 ez:rounded-none ez:md:h-140 ez:lg:h-175"
            />
            {box}
          </div>
        </div>
      </div>
    </section>
  );
}

export function NightAbout({
  data,
  title,
  id,
}: SectionProps<"intro"> & { title: string; id: string }) {
  const body = paragraphs(data.body);
  const image = data.image ?? data.images?.[0] ?? null;
  const [first, ...rest] = body;
  return (
    <section
      data-slot="intro"
      id={id}
      data-blank={body.length ? undefined : ""}
      className="ez:grid ez:gap-7 ez:text-fg"
    >
      <NightHead title={title} />
      <div className="ez:grid ez:items-center ez:gap-y-10 ez:lg:grid-cols-12 ez:lg:gap-x-gutter">
        <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-6 ez:lg:col-span-5 ez:lg:pr-18">
          {first ? (
            <>
              <p className="ez:m-0 ez:whitespace-pre-line ez:font-display ez:text-site-heading ez:font-extralight ez:leading-normal ez:tracking-tight ez:text-fg ez:lg:text-site-title ez:lg:leading-normal">
                {first}
              </p>
              {rest.map((p, i) => (
                <p
                  key={i}
                  className="ez:m-0 ez:whitespace-pre-line ez:text-site-body ez:leading-loose ez:text-muted"
                >
                  {p}
                </p>
              ))}
            </>
          ) : (
            <>
              <Lines />
              <Lines />
            </>
          )}
        </div>
        <div
          className={cn(
            nightHair,
            "ez:fx-round-md ez:min-w-0 ez:overflow-hidden ez:border ez:lg:col-span-7"
          )}
        >
          <Photo
            src={image}
            alt=""
            sizes="(max-width: 1024px) 100vw, 800px"
            tone={1}
            className="ez:aspect-auto ez:h-80 ez:rounded-none ez:lg:h-120"
          />
        </div>
      </div>
    </section>
  );
}

export function NightVisit({
  data,
  title,
  id,
  blank,
}: SectionProps<"store_info"> & {
  title: string;
  id: string;
  blank?: boolean;
}) {
  const rows: NightRow[] = [
    ...visitRows(data),
    ...(data.company ?? []).map((r) => ({ label: r.label, value: r.value })),
  ];
  const links = data.links ?? [];
  const book = bookingLink(links);
  const actions: NightAction[] = [
    ...(data.href
      ? [
          {
            key: "directions",
            label: LANDING_LABEL.directions,
            href: data.href,
            external: true,
          },
        ]
      : []),
    ...(book
      ? [
          {
            key: book.key,
            label: LANDING_LABEL.book,
            href: book.href,
            external: true,
          },
        ]
      : []),
    ...(data.phone
      ? [
          {
            key: "call",
            label: LANDING_LABEL.call,
            href: telHref(data.phone),
            icon: "phone" as const,
          },
        ]
      : []),
    ...links
      .filter((l) => l.key !== book?.key)
      .map((l) => ({
        key: l.key,
        label: l.label,
        href: l.href,
        external: true,
      })),
  ];
  return (
    <section
      data-slot="store-info"
      id={id}
      data-blank={blank ?? !data.address ? "" : undefined}
      className="ez:grid ez:gap-7 ez:text-fg"
    >
      <NightHead title={title} />
      <div className="ez:grid ez:gap-y-10 ez:lg:grid-cols-12 ez:lg:gap-x-gutter">
        <div className="ez:flex ez:min-w-0 ez:flex-col ez:lg:col-span-5">
          <dl className={cn(nightRule, "ez:m-0 ez:grid ez:border-t")}>
            {rows.map((r) => (
              <div
                key={r.label}
                className={cn(
                  nightRule,
                  "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-b ez:py-4.5 ez:text-site-item ez:font-light"
                )}
              >
                <dt className="ez:shrink-0 ez:whitespace-nowrap ez:text-site-off">
                  {r.label}
                </dt>
                <dd className="ez:m-0 ez:min-w-0 ez:whitespace-pre-line ez:text-right ez:break-words ez:text-fg">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
          <NightActions actions={actions} className="ez:pt-7 ez:lg:mt-auto" />
        </div>
        <div
          className={cn(
            nightRule,
            "ez:fx-round-md ez:relative ez:min-h-75 ez:min-w-0 ez:overflow-hidden ez:border ez:bg-deep ez:lg:col-span-7 ez:lg:min-h-100"
          )}
        >
          <Photo
            src={data.image}
            alt=""
            sizes="(max-width: 1024px) 100vw, 800px"
            tone={3}
            className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none"
          />
        </div>
      </div>
    </section>
  );
}

const groupCell = cn(
  nightRule,
  "ez:min-w-0 ez:py-6 ez:max-lg:border-t ez:max-lg:first:border-t-0 ez:lg:border-l ez:lg:px-7 ez:lg:nth-[3n+1]:border-l-0 ez:lg:nth-[3n+1]:pl-0 ez:lg:nth-[n+4]:border-t"
);

const leaderRow =
  "ez:flex ez:items-baseline ez:gap-3 ez:py-3 ez:text-site-item";

function Leader() {
  return (
    <span
      aria-hidden="true"
      className="ez:min-w-4 ez:flex-1 ez:-translate-y-1 ez:border-0 ez:border-b ez:border-dotted ez:border-select"
    />
  );
}

export function NightTable({ groups }: { groups: MenuGroup[] }) {
  const shown: (MenuGroup | null)[] = groups.length
    ? groups
    : [null, null, null];
  return (
    <div className={cn(nightRule, "ez:grid ez:border-y ez:lg:grid-cols-3")}>
      {shown.map((g, i) => (
        <div key={g ? g.id ?? "rest" : i} className={groupCell}>
          {g ? (
            g.name && (
              <h3 className="ez:m-0 ez:pb-3.5 ez:text-site-small ez:font-normal ez:text-site-off">
                {g.name}
              </h3>
            )
          ) : (
            <span className="ez:block ez:pb-3.5 ez:text-site-small">
              <Bar size="short" />
            </span>
          )}
          <dl className="ez:m-0 ez:grid">
            {g
              ? g.items.map((item) => (
                  <div key={item.id} className={leaderRow}>
                    <dt className="ez:flex ez:min-w-0 ez:flex-1 ez:items-baseline ez:gap-3">
                      <span className="ez:min-w-0 ez:font-light ez:text-fg">
                        {item.name}
                      </span>
                      <Leader />
                    </dt>
                    <dd className="ez:m-0 ez:shrink-0 ez:text-site-body ez:text-muted ez:tabular-nums">
                      {item.price}
                    </dd>
                  </div>
                ))
              : [0, 1, 2].map((j) => (
                  <div key={j} className={leaderRow}>
                    <dt className="ez:flex ez:min-w-0 ez:flex-1 ez:items-baseline ez:gap-3">
                      <Bar size="long" />
                      <Leader />
                    </dt>
                    <dd className="ez:m-0 ez:shrink-0 ez:text-site-body">
                      <Bar size="short" />
                    </dd>
                  </div>
                ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <li className="ez:grid ez:min-w-0 ez:content-start">
      <div
        className={cn(
          nightHair,
          "ez:overflow-hidden ez:rounded-lg ez:border ez:bg-surface-alt"
        )}
      >
        <Pic src={item.image} ratio={1} tone={index} />
      </div>
      <div className="ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:px-0.5 ez:pt-4">
        <span className="ez:min-w-0 ez:text-site-item ez:font-light ez:text-fg">
          {item.name}
        </span>
        {item.price && (
          <span className="ez:shrink-0 ez:text-site-body ez:text-fg ez:tabular-nums">
            {item.price}
          </span>
        )}
      </div>
    </li>
  );
}

export function Menu({ data }: SectionProps<"menu">) {
  const groups = (data.groups ?? []).filter((g) => g.items.length);
  const items = menuItems(groups);
  const empty = !items.length;
  const pictured = items.filter((i) => i.image);
  const listed = groups
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.image) }))
    .filter((g) => g.items.length);
  return (
    <section
      data-slot="menu"
      id={PLACE_ID.menu}
      data-blank={empty ? "" : undefined}
      className="ez:grid ez:gap-7 ez:text-fg"
    >
      <NightHead title={PLACE_TITLE.menu} />
      {pictured.length > 0 && (
        <ul className="ez:m-0 ez:grid ez:list-none ez:grid-cols-2 ez:gap-x-gutter ez:gap-y-11 ez:p-0 ez:lg:grid-cols-4">
          {pictured.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} />
          ))}
        </ul>
      )}
      {(empty || listed.length > 0) && <NightTable groups={listed} />}
    </section>
  );
}

export function Hero(props: SectionProps<"hero">) {
  const rows = nightHours(props.data);
  return (
    <NightHero
      {...props}
      jump={{
        key: "menu",
        label: PLACE_TITLE.menu,
        href: `/#${PLACE_ID.menu}`,
      }}
      box={rows.length ? <NightBox rows={rows} /> : null}
    />
  );
}

export function Intro(props: SectionProps<"intro">) {
  return (
    <NightAbout {...props} title={PLACE_TITLE.intro} id={PLACE_ID.intro} />
  );
}

export function Store(props: SectionProps<"store_info">) {
  return (
    <NightVisit {...props} title={PLACE_TITLE.store} id={PLACE_ID.store} />
  );
}

export function Footer({
  storeName,
  phone,
  hours,
  address,
  business,
  nav,
  links,
  terms,
}: LandingFooterProps) {
  const contact = [address, hours && `${LANDING_LABEL.hours} ${hours}`].filter(
    (c): c is string => Boolean(c)
  );
  return (
    <footer
      data-slot="site-footer"
      data-variant="night"
      className="ez:text-site-off"
    >
      <div className={nightWrap}>
        <div
          className={cn(
            nightRule,
            "ez:grid ez:gap-10 ez:border-t ez:pt-14 ez:pb-16 ez:text-site-small ez:leading-loose ez:md:grid-cols-12 ez:md:gap-x-gutter"
          )}
        >
          <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-3 ez:md:col-span-4">
            <p className="ez:m-0 ez:font-display ez:text-site-item ez:font-normal ez:text-fg">
              {storeName}
            </p>
            {(phone || contact.length > 0) && (
              <div className="ez:grid">
                {phone && (
                  <a
                    href={telHref(phone)}
                    className={cn(
                      quiet,
                      "ez:justify-self-start ez:tabular-nums"
                    )}
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
          {(nav.length > 0 || links.length > 0) && (
            <nav
              aria-label={LANDING_LABEL.links}
              className="ez:grid ez:min-w-0 ez:content-start ez:md:col-span-2"
            >
              {nav.map((n) => (
                <NextLink
                  key={n.href}
                  href={n.href}
                  className={cn(quiet, "ez:justify-self-start")}
                >
                  {n.label}
                </NextLink>
              ))}
              {links.map((l) => (
                <a
                  key={l.key}
                  href={l.href}
                  {...nightOut}
                  className={cn(quiet, "ez:justify-self-start")}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          )}
          {terms.length > 0 && (
            <nav
              aria-label={LANDING_LABEL.terms}
              className="ez:grid ez:min-w-0 ez:content-start ez:md:col-span-2"
            >
              {terms.map((t) => (
                <NextLink
                  key={t.href}
                  href={t.href}
                  className={cn(
                    quiet,
                    "ez:justify-self-start",
                    t.strong && "ez:text-muted"
                  )}
                >
                  {t.label}
                </NextLink>
              ))}
            </nav>
          )}
          {business.length > 0 && (
            <div className="ez:grid ez:min-w-0 ez:content-start ez:md:col-span-4 ez:md:col-start-9">
              <p className="ez:m-0 ez:mb-2.5 ez:text-site-small ez:font-normal ez:text-muted">
                {LANDING_LABEL.business}
              </p>
              {business.map((r) => (
                <span key={r.label} className="ez:break-words">
                  {`${r.label} ${r.value}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
