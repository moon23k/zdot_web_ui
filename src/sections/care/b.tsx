import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Lines, Pic } from "../kit";
import { visitRows } from "../landing/parts";
import { bookingLink, menuItems, paragraphs, telHref } from "../landing/shared";
import type { MenuGroup, MenuItem, PlaceLink } from "../template/data";
import { CareNavLinks } from "./nav";
import { CARE_ID, CARE_TITLE } from "./shared";
import type { CareFooterProps, CareHeaderProps } from "./types";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:px-page";

const dotted = "ez:border-0 ez:border-dotted ez:border-site-edge";

const logo = "ez:m-0 ez:font-display ez:font-normal ez:text-fg";

const label = "ez:m-0 ez:whitespace-nowrap ez:font-display ez:text-site-note ez:font-normal ez:text-fg";

const name = "ez:m-0 ez:font-display ez:text-site-heading ez:text-fg";

const price = "ez:m-0 ez:font-display ez:text-site-item ez:font-normal ez:text-fg";

const lead = "ez:m-0 ez:font-display ez:text-site-item ez:font-normal ez:leading-loose ez:text-fg";

const body = "ez:m-0 ez:text-site-small ez:leading-loose ez:text-fg";

const small = "ez:m-0 ez:text-site-small ez:text-muted";

const quiet = cn("ez:text-fg ez:no-underline ez:underline-offset-4 ez:hover:underline", focusRing);

const outline = cn(
  "ez:inline-flex ez:h-11 ez:items-center ez:justify-center ez:whitespace-nowrap ez:border ez:border-solid ez:border-site-edge ez:px-6 ez:font-display ez:text-site-note ez:text-fg ez:no-underline ez:hover:border-site-off",
  focusRing,
);

const out = { target: "_blank", rel: "noopener noreferrer" } as const;

const RATIO = { hero: 4 / 3, item: 1, visit: 4 / 5 } as const;

function Row({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="ez:grid ez:lg:grid-cols-12 ez:lg:gap-x-gutter">
      <div className="ez:grid ez:min-w-0 ez:gap-y-8 ez:lg:col-span-9 ez:lg:col-start-4 ez:xl:grid-cols-9 ez:xl:gap-x-gutter">
        <div className="ez:min-w-0 ez:xl:col-span-1 ez:xl:pt-1">{title}</div>
        <div className="ez:min-w-0 ez:xl:col-span-8">{children}</div>
      </div>
    </div>
  );
}

function Book({ links, phone, className }: { links: PlaceLink[]; phone?: string | null; className?: string }) {
  const book = bookingLink(links);
  if (book)
    return (
      <a href={book.href} {...out} className={cn(outline, className)}>
        {CARE_TITLE.book}
      </a>
    );
  if (phone)
    return (
      <a href={telHref(phone)} className={cn(outline, className)}>
        {CARE_TITLE.call}
      </a>
    );
  return null;
}

export function Header({ name: storeName, logoUrl, phone, nav, links }: CareHeaderProps) {
  const book = bookingLink(links);
  return (
    <header data-slot="site-header" data-variant="catalog" className="ez:bg-surface ez:text-fg">
      <div className={cn(wrap, "ez:flex ez:h-16 ez:items-center ez:gap-6 ez:lg:grid ez:lg:h-24 ez:lg:grid-cols-12 ez:lg:gap-x-gutter")}>
        <NextLink data-script={scriptOf(storeName)} href="/" className={cn("ez:min-w-0 ez:text-site-body ez:no-underline ez:lg:col-span-3", logo, focusRing)}>
          <SiteLogo name={storeName} src={logoUrl} />
        </NextLink>
        <div className="ez:ml-auto ez:flex ez:min-w-0 ez:items-center ez:justify-end ez:gap-8 ez:lg:col-span-9 ez:lg:col-start-4 ez:lg:ml-0">
          <nav aria-label="주요 메뉴" className="ez:flex ez:items-center ez:gap-8 ez:font-display ez:text-site-body ez:max-lg:hidden">
            <CareNavLinks items={nav} className={cn("ez:whitespace-nowrap", quiet)} />
          </nav>
          {book ? (
            <a href={book.href} {...out} className={outline}>
              {CARE_TITLE.book}
            </a>
          ) : (
            phone && (
              <a href={telHref(phone)} className={cn("ez:inline-flex ez:items-center ez:whitespace-nowrap ez:text-site-small", quiet)}>
                <Icon name="phone" size="sm" className="ez:text-muted ez:sm:hidden" />
                <span className="ez:max-sm:sr-only">{phone}</span>
              </a>
            )
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer({ storeName, phone, hours, address, business, links, terms }: CareFooterProps) {
  const contact = [address, phone, hours && `${CARE_TITLE.hours} ${hours}`].filter((v): v is string => Boolean(v));
  const list = "ez:m-0 ez:grid ez:list-none ez:gap-1 ez:p-0 ez:text-site-small ez:leading-relaxed";
  return (
    <footer data-slot="site-footer" data-variant="catalog" className="ez:text-fg">
      <div className={cn(wrap, "ez:grid ez:gap-y-10 ez:pt-24 ez:pb-12 ez:lg:grid-cols-12 ez:lg:gap-x-gutter")}>
        <p data-script={scriptOf(storeName)} className={cn("ez:min-w-0 ez:text-site-body ez:lg:col-span-3", logo)}>{storeName}</p>
        <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-6 ez:lg:col-span-4 ez:lg:col-start-5">
          {contact.length > 0 && (
            <ul className={list}>
              {contact.map((c) => (
                <li key={c}>
                  {c}
                </li>
              ))}
            </ul>
          )}
          {links.length > 0 && (
            <ul aria-label={CARE_TITLE.links} className={list}>
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
        <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-6 ez:lg:col-span-4 ez:lg:col-start-9">
          {business.length > 0 && (
            <ul aria-label={CARE_TITLE.business} className={cn(list, "ez:text-muted")}>
              {business.map((r) => (
                <li key={r.label}>{`${r.label} ${r.value}`}</li>
              ))}
            </ul>
          )}
          {terms.length > 0 && (
            <nav aria-label={CARE_TITLE.terms} className="ez:flex ez:flex-wrap ez:gap-x-4 ez:gap-y-1 ez:text-site-small">
              {terms.map((t) => (
                <NextLink key={t.href} href={t.href} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", t.strong && "ez:font-medium ez:text-fg", focusRing)}>
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
  const title = data.title?.trim() || null;
  const sub = title ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const store = context.storeName?.trim() || null;
  const blank = !title && !image;
  const mark = "ez:text-site-heading ez:lg:text-site-title";
  const hours = data.hours?.trim() || null;
  const phone = data.phone?.trim() || null;
  const links = data.links ?? [];
  return (
    <section
      data-slot="hero"
      data-blank={blank ? "" : undefined}
      className="ez:grid ez:gap-y-10 ez:text-fg ez:lg:grid-cols-12 ez:lg:grid-rows-[auto_minmax(0,1fr)] ez:lg:gap-x-gutter ez:lg:gap-y-0"
    >
      <div className="ez:min-w-0 ez:text-center ez:lg:col-span-3 ez:lg:row-start-1 ez:lg:pt-14">
        {title ? <h1 data-script={scriptOf(title)} className={cn(logo, mark)}>{title}</h1> : store ? <p data-script={scriptOf(store)} className={cn(logo, mark)}>{store}</p> : <Bar className={mark} />}
      </div>
      <div style={{ aspectRatio: RATIO.hero }} className="ez:relative ez:min-w-0 ez:lg:col-span-9 ez:lg:col-start-4 ez:lg:row-span-2 ez:lg:row-start-1">
        <Photo src={image} alt="" preload sizes="(max-width: 1024px) 100vw, 75vw" tone={0} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
      </div>
      {(sub || hours || phone || bookingLink(links)) && (
        <div className="ez:grid ez:min-w-0 ez:gap-6 ez:lg:col-span-3 ez:lg:row-start-2 ez:lg:self-end">
          {sub && (
            <p data-slot="hero-sub" className={cn(dotted, body, "ez:border-y ez:py-3")}>
              {sub}
            </p>
          )}
          {(hours || phone) && (
            <dl className={cn(dotted, "ez:m-0 ez:grid ez:border-t")}>
              {hours && (
                <div className={cn(dotted, "ez:grid ez:grid-cols-[minmax(0,5rem)_minmax(0,1fr)] ez:gap-3 ez:border-b ez:py-3")}>
                  <dt className={small}>{CARE_TITLE.hours}</dt>
                  <dd data-script={scriptOf(hours)} className={body}>{hours}</dd>
                </div>
              )}
              {phone && (
                <div className={cn(dotted, "ez:grid ez:grid-cols-[minmax(0,5rem)_minmax(0,1fr)] ez:gap-3 ez:border-b ez:py-3")}>
                  <dt className={small}>{CARE_TITLE.phone}</dt>
                  <dd className={body}>
                    <a href={telHref(phone)} className={quiet}>
                      {phone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
          <Book links={links} phone={phone} className="ez:justify-self-start" />
        </div>
      )}
    </section>
  );
}

export function Intro({ data }: SectionProps<"intro">) {
  const text = paragraphs(data.body);
  const image = data.image ?? data.images?.[0] ?? null;
  const [first, ...rest] = text;
  return (
    <section data-slot="intro" id={CARE_ID.intro} data-blank={text.length ? undefined : ""} className="ez:text-fg">
      <Row title={<h2 className={label}>{CARE_TITLE.intro}</h2>}>
        <div className="ez:grid ez:gap-x-gutter ez:gap-y-10 ez:md:grid-cols-2">
          <Pic src={image} ratio={RATIO.item} tone={1} />
          <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-10">
            {first ? (
              <>
                <p className={cn(lead, "ez:whitespace-pre-line")}>{first}</p>
                {rest.length > 0 && (
                  <div className="ez:grid ez:gap-6">
                    {rest.map((p, i) => (
                      <p data-script={scriptOf(p)} key={i} className={cn(body, "ez:whitespace-pre-line")}>
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <Lines />
                <Lines />
              </>
            )}
          </div>
        </div>
      </Row>
    </section>
  );
}

function Item({ item, photos, tone, heading: Heading }: { item: MenuItem; photos: boolean; tone: number; heading: "h3" | "h4" }) {
  return (
    <li className={cn("ez:grid ez:min-w-0 ez:content-start", !photos && cn(dotted, "ez:border-b ez:py-6"))}>
      {photos && <Pic src={item.image} ratio={RATIO.item} tone={tone} className="ez:mb-8" />}
      <Heading data-script={scriptOf(item.name)} className={name}>{item.name}</Heading>
      <p className={cn(price, "ez:mt-3")}><Won value={item.price} /></p>
    </li>
  );
}

function Group({ group, photos, titled }: { group: MenuGroup; photos: boolean; titled: boolean }) {
  return (
    <div className="ez:grid ez:gap-8">
      {titled && group.name && <h3 data-script={scriptOf(group.name)} className={cn(small, "ez:font-display")}>{group.name}</h3>}
      <ul className={cn("ez:m-0 ez:grid ez:list-none ez:gap-x-gutter ez:p-0 ez:sm:grid-cols-2", photos ? "ez:gap-y-16" : cn(dotted, "ez:border-t"))}>
        {group.items.map((m, i) => (
          <Item key={m.id} item={m} photos={photos} tone={i} heading={titled && group.name ? "h4" : "h3"} />
        ))}
      </ul>
    </div>
  );
}

function BlankMenu() {
  return (
    <ul aria-hidden="true" className="ez:m-0 ez:grid ez:list-none ez:gap-x-gutter ez:gap-y-16 ez:p-0 ez:sm:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="ez:grid ez:content-start">
          <Pic ratio={RATIO.item} tone={i} className="ez:mb-8" />
          <Bar className="ez:text-site-heading" />
          <Bar size="short" className="ez:mt-3 ez:text-site-item" />
        </li>
      ))}
    </ul>
  );
}

export function Menu({ data }: SectionProps<"menu">) {
  const groups = (data.groups ?? []).filter((g) => g.items.length);
  const items = menuItems(groups);
  const titled = groups.length > 1;
  return (
    <section data-slot="menu" id={CARE_ID.menu} data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Row title={<h2 className={label}>{CARE_TITLE.prices}</h2>}>
        {items.length ? (
          <div className="ez:grid">
            {groups.map((g, i) => (
              <div key={g.id ?? "all"} className={cn(i > 0 && cn(dotted, "ez:mt-16 ez:border-t ez:pt-16"))}>
                <Group group={g} photos={g.items.every((m) => m.image)} titled={titled} />
              </div>
            ))}
          </div>
        ) : (
          <BlankMenu />
        )}
      </Row>
    </section>
  );
}

export function Location({ data }: SectionProps<"location">) {
  const blank = !data.address;
  const rows = visitRows(data);
  const others = (data.links ?? []).filter((l) => l.key !== bookingLink(data.links)?.key);
  const book = Boolean(bookingLink(data.links) || data.phone);
  const actions = book || data.href || others.length > 0;
  return (
    <section data-slot="location" id={CARE_ID.location} data-blank={blank ? "" : undefined} className="ez:text-fg">
      <Row title={<h2 className={label}>{CARE_TITLE.location}</h2>}>
        <div className="ez:grid ez:gap-x-gutter ez:gap-y-10 ez:md:grid-cols-2">
          <Pic src={data.image} ratio={RATIO.visit} tone={2} />
          <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-12">
            <dl className={cn(dotted, "ez:m-0 ez:grid ez:border-t")}>
              {rows.map((r) => (
                <div key={r.label} className={cn(dotted, "ez:grid ez:grid-cols-4 ez:items-baseline ez:gap-x-6 ez:border-b ez:py-4")}>
                  <dt className={small}>{r.label}</dt>
                  <dd className={cn(body, "ez:col-span-3 ez:min-w-0 ez:whitespace-pre-line")}>{r.value}</dd>
                </div>
              ))}
            </dl>
            {actions && (
              <div className="ez:flex ez:flex-wrap ez:gap-4">
                <Book links={data.links ?? []} phone={data.phone} />
                {data.href && (
                  <a href={data.href} {...out} className={outline}>
                    {CARE_TITLE.directions}
                  </a>
                )}
                {others.map((l) => (
                  <a key={l.key} href={l.href} {...out} className={outline}>
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Row>
    </section>
  );
}
