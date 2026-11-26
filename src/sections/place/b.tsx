import NextLink from "next/link";
import type { ReactNode } from "react";
import { Icon } from "../../components/icon";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Lines, Pic } from "../kit";
import type { MenuGroup, MenuItem, PlaceLink } from "../template/data";
import { PlaceNavLinks } from "./nav";
import {
  menuItems,
  paragraphs,
  PLACE_ID,
  PLACE_TITLE,
  telHref,
} from "./shared";
import type { PlaceFooterProps, PlaceHeaderProps } from "./types";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const line = "ez:border-0 ez:border-solid ez:border-site-line";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:px-page";

const logo =
  "ez:font-display ez:font-normal ez:uppercase ez:text-fg";

const name =
  "ez:m-0 ez:font-display ez:text-site-heading ez:text-fg";

const item = "ez:m-0 ez:text-site-item ez:font-normal ez:text-fg";

const body =
  "ez:m-0 ez:text-site-small ez:leading-relaxed ez:text-fg";

const label =
  "ez:m-0 ez:text-site-small ez:font-normal ez:text-muted";

const quiet = cn(
  "ez:text-fg ez:no-underline ez:underline-offset-4 ez:hover:underline",
  focusRing
);

const outline = cn(
  "ez:inline-flex ez:h-10 ez:items-center ez:justify-center ez:whitespace-nowrap ez:border ez:border-solid ez:border-site-edge ez:px-6 ez:text-site-small ez:text-fg ez:no-underline ez:hover:border-site-off",
  focusRing
);

const RATIO = { first: 4 / 3, unit: 1.61, item: 1.5 } as const;

function Pair({
  head,
  children,
  className,
}: {
  head: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("ez:grid ez:gap-6 ez:md:grid-cols-12", className)}>
      <div className="ez:min-w-0 ez:md:col-span-4 ez:lg:col-span-3 ez:lg:col-start-3">
        {head}
      </div>
      {children ? (
        <div className="ez:min-w-0 ez:md:col-span-8 ez:md:col-start-5 ez:lg:col-span-6 ez:lg:col-start-6">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function OutLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      data-script={scriptOf(children)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? quiet}
    >
      {children}
    </a>
  );
}

export function Header({
  name: storeName,
  logoUrl,
  phone,
  nav,
  links,
}: PlaceHeaderProps) {
  return (
    <header
      data-slot="site-header"
      data-variant="catalog"
      className={cn(line, "ez:border-b ez:bg-surface ez:text-fg")}
    >
      <div
        className={cn(
          wrap,
          "ez:flex ez:h-16 ez:items-center ez:gap-6 ez:lg:grid ez:lg:h-19 ez:lg:grid-cols-[1fr_auto_1fr]"
        )}
      >
        <NextLink
          data-script={scriptOf(storeName)}
          href="/"
          className={cn(
            "ez:min-w-0 ez:justify-self-start ez:text-site-body ez:no-underline",
            logo,
            focusRing
          )}
        >
          <SiteLogo name={storeName} src={logoUrl} />
        </NextLink>
        <nav
          aria-label="주요 메뉴"
          className="ez:flex ez:items-center ez:justify-center ez:gap-6 ez:text-site-small ez:max-lg:hidden"
        >
          <PlaceNavLinks
            items={nav}
            className={cn("ez:whitespace-nowrap", quiet)}
          />
        </nav>
        <div className="ez:ml-auto ez:flex ez:min-w-0 ez:items-center ez:justify-end ez:gap-6 ez:text-site-small ez:lg:ml-0">
          {links.length > 0 && (
            <ul className="ez:m-0 ez:flex ez:list-none ez:gap-6 ez:p-0 ez:max-md:hidden">
              {links.map((l) => (
                <li key={l.key}>
                  <OutLink
                    href={l.href}
                    className={cn("ez:whitespace-nowrap", quiet)}
                  >
                    {l.label}
                  </OutLink>
                </li>
              ))}
            </ul>
          )}
          {phone && (
            <a
              href={telHref(phone)}
              className={cn(
                "ez:inline-flex ez:items-center ez:whitespace-nowrap ez:tabular-nums",
                quiet
              )}
            >
              <Icon
                name="phone"
                size="sm"
                className="ez:text-muted ez:sm:hidden"
              />
              <span className="ez:max-sm:sr-only">{phone}</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer({
  storeName,
  phone,
  hours,
  address,
  business,
  links,
  terms,
}: PlaceFooterProps) {
  const contact = [
    address,
    phone,
    hours && `${PLACE_TITLE.hours} ${hours}`,
  ].filter((v): v is string => Boolean(v));
  const small =
    "ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-x-4 ez:gap-y-1 ez:p-0 ez:text-site-small ez:leading-relaxed";
  return (
    <footer
      data-slot="site-footer"
      data-variant="catalog"
      className="ez:bg-surface-alt ez:text-fg"
    >
      <div
        className={cn(
          wrap,
          "ez:grid ez:gap-x-6 ez:gap-y-10 ez:py-16 ez:md:grid-cols-12"
        )}
      >
        <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-6 ez:md:col-span-8 ez:lg:col-span-6">
          <p data-script={scriptOf(storeName)} className={cn("ez:m-0 ez:text-site-body", logo)}>{storeName}</p>
          {contact.length > 0 && (
            <ul className={small}>
              {contact.map((c) => (
                <li key={c} className="ez:tabular-nums">
                  {c}
                </li>
              ))}
            </ul>
          )}
          {business.length > 0 && (
            <ul
              aria-label={PLACE_TITLE.business}
              className={cn(small, "ez:text-muted")}
            >
              {business.map((r) => (
                <li key={r.label}>{`${r.label} ${r.value}`}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-6 ez:text-site-small ez:leading-relaxed ez:md:col-span-4 ez:md:col-start-9 ez:lg:col-span-3 ez:lg:col-start-10">
          {links.length > 0 && (
            <ul
              aria-label={PLACE_TITLE.links}
              className="ez:m-0 ez:grid ez:list-none ez:gap-1 ez:p-0"
            >
              {links.map((l) => (
                <li key={l.key}>
                  <OutLink href={l.href}>{l.label}</OutLink>
                </li>
              ))}
            </ul>
          )}
          {terms.length > 0 && (
            <nav
              aria-label={PLACE_TITLE.terms}
              className="ez:flex ez:flex-wrap ez:gap-x-4 ez:gap-y-1"
            >
              {terms.map((t) => (
                <NextLink
                  key={t.href}
                  href={t.href}
                  className={cn(
                    "ez:text-muted ez:no-underline ez:hover:text-fg",
                    t.strong && "ez:font-medium ez:text-fg",
                    focusRing
                  )}
                >
                  {t.label}
                </NextLink>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const title = data.title?.trim();
  const sub = data.sub?.trim();
  const blank = !title && !data.image;
  return (
    <section
      data-slot="hero"
      data-blank={blank ? "" : undefined}
      className="ez:grid ez:gap-10 ez:text-fg ez:lg:gap-16"
    >
      <Pic src={data.image} ratio={RATIO.first} />
      <Pair
        head={
          title ? (
            <h1 data-script={scriptOf(title)} className={name}>{title}</h1>
          ) : context.storeName ? (
            <p data-script={scriptOf(context.storeName)} className={name}>{context.storeName}</p>
          ) : (
            <Bar className="ez:text-site-heading" />
          )
        }
      >
        {title && sub && (
          <p data-slot="hero-sub" className={body}>
            {sub}
          </p>
        )}
      </Pair>
    </section>
  );
}

export function Intro({ data }: SectionProps<"intro">) {
  const text = paragraphs(data.body);
  return (
    <section
      data-slot="intro"
      id={PLACE_ID.intro}
      data-blank={text.length ? undefined : ""}
      className="ez:text-fg"
    >
      <Pair head={<h2 className={name}>{PLACE_TITLE.intro}</h2>}>
        <div className="ez:grid ez:gap-5">
          {text.length ? (
            text.map((p, i) => (
              <p data-script={scriptOf(p)} key={i} className={cn(body, "ez:whitespace-pre-line")}>
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
      </Pair>
    </section>
  );
}

function signature(items: MenuItem[]): MenuItem[] {
  return [
    ...items.filter((i) => i.image),
    ...items.filter((i) => !i.image),
  ].slice(0, 4);
}

function Signature({ items }: { items: MenuItem[] }) {
  const photos = items.some((i) => i.image);
  return (
    <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-6 ez:gap-y-12 ez:p-0 ez:sm:grid-cols-2">
      {items.map((m, i) => (
        <li key={m.id} className="ez:grid ez:min-w-0 ez:content-start">
          {photos && (
            <Pic
              src={m.image}
              ratio={RATIO.item}
              tone={i}
              className="ez:mb-5"
            />
          )}
          <h3 data-script={scriptOf(m.name)} className={item}>{m.name}</h3>
          <p className={cn(body, "ez:mt-4 ez:tabular-nums")}><Won value={m.price} /></p>
        </li>
      ))}
    </ul>
  );
}

function FullMenu({ groups }: { groups: MenuGroup[] }) {
  return (
    <div className="ez:grid ez:gap-x-6 ez:gap-y-12 ez:sm:grid-cols-2 ez:xl:grid-cols-3">
      {groups.map((g) => (
        <div
          key={g.id ?? "all"}
          className="ez:grid ez:min-w-0 ez:content-start ez:gap-4"
        >
          {g.name && <h4 data-script={scriptOf(g.name)} className={item}>{g.name}</h4>}
          <dl className="ez:m-0 ez:grid ez:gap-2">
            {g.items.map((m) => (
              <div
                key={m.id}
                className="ez:flex ez:items-baseline ez:justify-between ez:gap-4"
              >
                <dt data-script={scriptOf(m.name)} className={cn(body, "ez:min-w-0")}>{m.name}</dt>
                <dd className={cn(body, "ez:shrink-0 ez:tabular-nums")}>
                  <Won value={m.price} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function BlankSignature() {
  return (
    <div
      aria-hidden="true"
      className="ez:grid ez:gap-x-6 ez:gap-y-12 ez:sm:grid-cols-2"
    >
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="ez:grid ez:content-start ez:gap-4">
          <Bar className="ez:text-site-item" />
          <Bar size="short" />
        </span>
      ))}
    </div>
  );
}

function BlankList() {
  return (
    <div
      aria-hidden="true"
      className="ez:grid ez:gap-x-6 ez:gap-y-12 ez:sm:grid-cols-2 ez:xl:grid-cols-3"
    >
      {[0, 1, 2].map((c) => (
        <span key={c} className="ez:grid ez:content-start ez:gap-4">
          <Bar size="short" className="ez:text-site-item" />
          {[0, 1, 2].map((r) => (
            <span key={r} className="ez:flex ez:justify-between ez:gap-4">
              <Bar />
              <Bar size="short" />
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

export function Menu({ data }: SectionProps<"menu">) {
  const groups = (data.groups ?? []).filter((g) => g.items.length);
  const items = menuItems(groups);
  const empty = !items.length;
  return (
    <section
      data-slot="menu"
      id={PLACE_ID.menu}
      data-blank={empty ? "" : undefined}
      className="ez:grid ez:min-w-0 ez:gap-10 ez:text-fg ez:lg:gap-16"
    >
      <Pic src={data.image} ratio={RATIO.unit} tone={1} />
      <Pair head={<h2 className={name}>{PLACE_TITLE.menu}</h2>}>
        {empty ? <BlankSignature /> : <Signature items={signature(items)} />}
      </Pair>
      <Pair
        head={
          <h3 className={label}>{`${PLACE_TITLE.all} ${PLACE_TITLE.menu}`}</h3>
        }
        className="ez:mt-6 ez:lg:mt-16"
      >
        {empty ? <BlankList /> : <FullMenu groups={groups} />}
      </Pair>
    </section>
  );
}

function VisitRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="ez:grid ez:gap-3">
      <dt data-script={scriptOf(term)} className={item}>{term}</dt>
      <dd data-script={scriptOf(children)} className={body}>{children}</dd>
    </div>
  );
}

function VisitActions({
  href,
  phone,
  links,
}: {
  href?: string | null;
  phone?: string | null;
  links: PlaceLink[];
}) {
  if (!href && !phone && !links.length) return null;
  return (
    <div className="ez:mt-12 ez:flex ez:flex-wrap ez:gap-2">
      {href && (
        <OutLink href={href} className={outline}>
          {PLACE_TITLE.directions}
        </OutLink>
      )}
      {phone && (
        <a href={telHref(phone)} className={outline}>
          {PLACE_TITLE.call}
        </a>
      )}
      {links.map((l) => (
        <OutLink key={l.key} href={l.href} className={outline}>
          {l.label}
        </OutLink>
      ))}
    </div>
  );
}

export function Location({ data }: SectionProps<"location">) {
  const blank = !data.address;
  return (
    <section
      data-slot="location"
      id={PLACE_ID.location}
      data-blank={blank ? "" : undefined}
      className="ez:grid ez:gap-10 ez:text-fg ez:lg:gap-16"
    >
      <Pic src={data.image} ratio={RATIO.unit} tone={2} />
      <Pair head={<h2 className={name}>{PLACE_TITLE.location}</h2>}>
        <dl className="ez:m-0 ez:grid ez:gap-8">
          <VisitRow term={PLACE_TITLE.address}>
            {data.address ?? <Bar size="long" />}
          </VisitRow>
          {(data.phone || blank) && (
            <VisitRow term={PLACE_TITLE.phone}>
              {data.phone ? (
                <span className="ez:tabular-nums">{data.phone}</span>
              ) : (
                <Bar size="short" />
              )}
            </VisitRow>
          )}
          {(data.hours || blank) && (
            <VisitRow term={PLACE_TITLE.hours}>
              {data.hours ? (
                <span className="ez:whitespace-pre-line">{data.hours}</span>
              ) : (
                <Bar />
              )}
            </VisitRow>
          )}
        </dl>
        <VisitActions
          href={data.href}
          phone={data.phone}
          links={data.links ?? []}
        />
      </Pair>
    </section>
  );
}
