import NextLink from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing, pcCols } from "../../utils/styles";
import { Bar, Lines } from "../kit";
import { visitRows } from "../landing/parts";
import { LandingNavLinks } from "../landing/nav";
import { bookingLink, LANDING_LABEL, paragraphs, telHref } from "../landing/shared";
import type { LandingFooterProps, LandingHeaderProps } from "../landing/types";
import type { MenuGroup } from "../template/data";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

export const glass = "ez:fx-glass";

export const hair = "ez:border-0 ez:border-solid ez:border-hairline";

export const heading = "ez:m-0 ez:font-display ez:text-site-page-sm ez:text-fg ez:lg:text-site-display-md";

export const wash = "ez:fx-aurora-wash ez:fx-round-xl ez:p-4 ez:lg:p-10";

export const card = "ez:fx-round-lg ez:overflow-hidden";

export const big = "ez:fx-round-xl ez:overflow-hidden";

const box = "ez:fx-round-md";

const pill = "ez:inline-flex ez:shrink-0 ez:items-center ez:justify-center ez:gap-2 ez:rounded-full ez:whitespace-nowrap ez:font-medium ez:no-underline";

const tall = "ez:h-13 ez:px-7 ez:text-site-body";

const small = "ez:h-11 ez:px-5 ez:text-site-body";

const solid = cn(pill, "ez:fx-press ez:bg-primary ez:text-on-primary ez:hover:bg-primary-hover", focusRing);

const clear = cn(pill, glass, "ez:text-fg ez:hover:bg-surface-alt", focusRing);

const quiet = cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const out = { target: "_blank", rel: "noopener noreferrer" } as const;

export type Act = { key: string; href: string; label: string; external?: boolean };

export function Go({ act, primary, size = "big" }: { act: Act; primary?: boolean; size?: "big" | "small" }) {
  return (
    <a href={act.href} {...(act.external ? out : {})} className={cn(primary ? solid : clear, size === "big" ? tall : small)}>
      {act.label}
    </a>
  );
}

export function Head({ title, aside }: { title: ReactNode; aside?: ReactNode }) {
  return (
    <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-x-6 ez:gap-y-4">
      <h2 data-script={scriptOf(title)} className={heading}>{title}</h2>
      {aside}
    </div>
  );
}

function reach(links: LandingHeaderProps["links"], phone: string | null | undefined): Act | null {
  const book = bookingLink(links);
  if (book) return { key: book.key, href: book.href, label: LANDING_LABEL.book, external: true };
  if (phone) return { key: "call", href: telHref(phone), label: LANDING_LABEL.call };
  return null;
}

export function AuroraHeader({ name, logoUrl, phone, nav, links }: LandingHeaderProps) {
  const cta = reach(links, phone);
  const rest = links.filter((l) => l.key !== cta?.key);
  return (
    <header data-slot="site-header" data-variant="aurora" className="ez:relative ez:z-10">
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-4 ez:lg:pt-6">
        <div className={cn(glass, "ez:flex ez:h-14 ez:items-center ez:gap-6 ez:rounded-full ez:pr-2 ez:pl-5 ez:text-site-body ez:lg:grid ez:lg:h-17 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] ez:lg:pr-3 ez:lg:pl-8")}>
          <NextLink data-script={scriptOf(name)} href="/" className={cn("ez:min-w-0 ez:justify-self-start ez:text-site-item ez:font-normal ez:text-fg ez:no-underline", focusRing)}>
            <SiteLogo name={name} src={logoUrl} />
          </NextLink>
          <nav aria-label="주요 메뉴" className="ez:flex ez:gap-9 ez:whitespace-nowrap ez:max-lg:hidden">
            <LandingNavLinks items={nav} className={quiet} currentClassName="ez:text-fg" />
          </nav>
          <div className="ez:ml-auto ez:flex ez:min-w-0 ez:items-center ez:justify-end ez:gap-6 ez:whitespace-nowrap ez:lg:ml-0">
            {rest.map((l) => (
              <a key={l.key} href={l.href} {...out} className={cn(quiet, "ez:max-xl:hidden")}>
                {l.label}
              </a>
            ))}
            {phone && (
              <a href={telHref(phone)} className={cn(quiet, "ez:tabular-nums ez:max-md:hidden")}>
                {phone}
              </a>
            )}
            {cta && <Go act={cta} primary size="small" />}
          </div>
        </div>
      </div>
    </header>
  );
}

export function AuroraHero({ data, context, more }: SectionProps<"hero"> & { more?: { href: string; label: string } | null }) {
  const title = data.title?.trim() || null;
  const sub = title ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const name = context.storeName?.trim() || null;
  const phone = data.phone?.trim() || null;
  const hours = data.hours?.trim() || null;
  const cta = reach(data.links ?? [], phone);
  const rows = [
    ...(hours ? [{ label: LANDING_LABEL.hours, value: hours }] : []),
    ...(phone ? [{ label: LANDING_LABEL.phone, value: phone }] : []),
  ];
  const display = cn("ez:fx-title ez:m-0 ez:font-display ez:text-balance ez:text-fg", title && name && "ez:mt-4");
  return (
    <section
      data-slot="hero"
      data-variant="aurora"
      data-blank={title || image ? undefined : ""}
      className="ez:relative ez:isolate ez:grid ez:items-center ez:gap-10 ez:pt-4 ez:text-fg ez:lg:grid-cols-2 ez:lg:gap-x-6 ez:lg:pt-10"
    >
      <span aria-hidden="true" className="ez:fx-aurora ez:absolute ez:-top-31 ez:left-1/2 ez:-z-10 ez:h-285 ez:w-screen ez:-translate-x-1/2" />
      <div className="ez:grid ez:min-w-0 ez:content-start">
        {title && name && <p data-script={scriptOf(name)} className="ez:m-0 ez:text-site-body ez:text-muted">{name}</p>}
        {title ? <h1 data-script={scriptOf(title)} className={display}>{title}</h1> : name ? <p data-script={scriptOf(name)} className={display}>{name}</p> : <Bar size="long" className="ez:fx-title" />}
        {sub && (
          <p data-slot="hero-sub" className="ez:m-0 ez:mt-6 ez:max-w-118 ez:text-site-item ez:font-normal ez:leading-relaxed ez:text-muted">
            {sub}
          </p>
        )}
        {(cta || more) && (
          <div className="ez:mt-10 ez:flex ez:flex-wrap ez:gap-3">
            {cta && <Go act={cta} primary />}
            {more && <Go act={{ key: "more", href: more.href, label: more.label }} />}
          </div>
        )}
      </div>
      <div className="ez:relative ez:min-w-0">
        <div className={big}>
          <Photo src={image} alt="" preload sizes="(max-width: 1024px) 100vw, 50vw" tone={0} className="ez:aspect-4/3 ez:lg:aspect-auto ez:lg:h-185" />
        </div>
        {rows.length > 0 && (
          <dl className={cn(glass, box, "ez:m-0 ez:mt-4 ez:px-6 ez:py-1 ez:text-site-body ez:lg:absolute ez:lg:bottom-12 ez:lg:-left-18 ez:lg:mt-0 ez:lg:w-75")}>
            {rows.map((r) => (
              <div key={r.label} className={cn(hair, "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-t ez:py-3 ez:first:border-t-0")}>
                <dt className="ez:shrink-0 ez:text-muted">{r.label}</dt>
                <dd className="ez:m-0 ez:min-w-0 ez:text-right ez:tabular-nums"><Won value={r.value} /></dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

export function MenuPanel({ groups }: { groups: (MenuGroup | null)[] }) {
  return (
    <div className={wash}>
      <div className={cn("ez:grid ez:gap-4", pcCols(3, groups.length))}>
        {groups.map((g, i) => (
          <div key={g ? g.id ?? "rest" : i} className={cn(glass, box, "ez:min-w-0 ez:px-7 ez:pt-7 ez:pb-4")}>
            {g ? (
              g.name && <h3 data-script={scriptOf(g.name)} className="ez:m-0 ez:pb-2.5 ez:text-site-small ez:font-normal ez:text-muted">{g.name}</h3>
            ) : (
              <span className="ez:block ez:pb-2.5 ez:text-site-small">
                <Bar size="short" />
              </span>
            )}
            <ul className="ez:m-0 ez:grid ez:list-none ez:p-0">
              {g
                ? g.items.map((item) => (
                    <li key={item.id} className={cn(hair, "ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:border-t ez:py-4 ez:text-site-item ez:font-normal")}>
                      <span className="ez:min-w-0">{item.name}</span>
                      <span className="ez:shrink-0 ez:tabular-nums"><Won value={item.price} /></span>
                    </li>
                  ))
                : [0, 1, 2].map((n) => (
                    <li key={n} className={cn(hair, "ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:border-t ez:py-4 ez:text-site-item")}>
                      <Bar size="long" />
                      <Bar size="short" />
                    </li>
                  ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuroraIntro({ data, title, id }: SectionProps<"intro"> & { title: string; id: string }) {
  const [first, ...rest] = paragraphs(data.body);
  const image = data.image ?? data.images?.[0] ?? null;
  return (
    <section data-slot="intro" id={id} data-blank={first ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={title} />
      <div className="ez:grid ez:items-center ez:gap-10 ez:lg:grid-cols-12 ez:lg:gap-x-6">
        <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-6 ez:lg:col-span-5 ez:lg:pr-18">
          {first ? (
            <p className="ez:m-0 ez:whitespace-pre-line ez:text-site-heading ez:lg:text-site-page-sm">{first}</p>
          ) : (
            <>
              <Lines />
              <Lines />
            </>
          )}
          {rest.map((p, i) => (
            <p data-script={scriptOf(p)} key={i} className="ez:m-0 ez:whitespace-pre-line ez:text-site-body ez:leading-loose ez:text-muted">
              {p}
            </p>
          ))}
        </div>
        <div className={cn(big, "ez:min-w-0 ez:lg:col-span-7")}>
          <Photo src={image} alt="" sizes="(max-width: 1024px) 100vw, 58vw" tone={1} className="ez:aspect-4/3 ez:lg:aspect-auto ez:lg:h-120" />
        </div>
      </div>
    </section>
  );
}

export function AuroraStore({
  data,
  title,
  id,
  photo,
  extra = [],
}: SectionProps<"store_info"> & { title: string; id: string; photo: boolean; extra?: { label: string; value: ReactNode }[] }) {
  const rows = [...visitRows(data), ...extra];
  const acts: Act[] = [
    ...(data.href ? [{ key: "directions", href: data.href, label: LANDING_LABEL.directions, external: true }] : []),
    ...(data.phone ? [{ key: "call", href: telHref(data.phone), label: LANDING_LABEL.call }] : []),
    ...(data.links ?? []).map((l) => ({ key: l.key, href: l.href, label: l.label, external: true })),
  ];
  return (
    <section data-slot="store-info" id={id} data-blank={data.address ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={title} />
      <div className={cn(wash, "ez:grid ez:gap-4 ez:lg:grid-cols-12")}>
        <div className={cn(glass, box, "ez:flex ez:min-w-0 ez:flex-col ez:px-6 ez:pt-3 ez:pb-6 ez:lg:px-8 ez:lg:pt-4 ez:lg:pb-8", photo ? "ez:lg:col-span-5" : "ez:lg:col-span-12")}>
          <dl className={cn("ez:m-0 ez:grid", !photo && "ez:md:grid-cols-2 ez:md:gap-x-12")}>
            {rows.map((r) => (
              <div key={r.label} className={cn(hair, "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-b ez:py-4")}>
                <dt className="ez:shrink-0 ez:whitespace-nowrap ez:text-muted">{r.label}</dt>
                <dd className="ez:m-0 ez:min-w-0 ez:text-right">{r.value}</dd>
              </div>
            ))}
          </dl>
          {acts.length > 0 && (
            <div className="ez:mt-auto ez:flex ez:flex-wrap ez:gap-2.5 ez:pt-7">
              {acts.map((a, i) => (
                <Go key={a.key} act={a} primary={i === 0} />
              ))}
            </div>
          )}
        </div>
        {photo && (
          <div className={cn(box, "ez:grid ez:min-w-0 ez:overflow-hidden ez:lg:col-span-7")}>
            <Photo src={data.image} alt="" sizes="(max-width: 1024px) 100vw, 58vw" tone={3} className="ez:aspect-4/3 ez:lg:aspect-auto ez:lg:h-full ez:lg:min-h-95" />
          </div>
        )}
      </div>
    </section>
  );
}

function Column({ head, span, children }: { head: string; span: string; children: ReactNode }) {
  return (
    <div className={cn("ez:grid ez:min-w-0 ez:content-start ez:gap-2.5", span)}>
      <p className="ez:m-0 ez:text-fg">{head}</p>
      <div className="ez:grid ez:content-start ez:text-muted">{children}</div>
    </div>
  );
}

export function AuroraFooter({ storeName, phone, hours, address, legal, business, nav, links, terms }: LandingFooterProps) {
  return (
    <footer data-slot="site-footer" data-variant="aurora" className="ez:text-fg">
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-4 ez:pb-16">
        <div className="ez:grid ez:gap-10 ez:text-site-small ez:leading-loose ez:md:grid-cols-12 ez:md:gap-x-6">
          <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-2.5 ez:md:col-span-4">
            <p data-script={scriptOf(storeName)} className="ez:m-0 ez:text-site-item ez:font-normal">{storeName}</p>
            {(address || phone || hours) && (
              <div className="ez:grid ez:content-start ez:text-muted">
                {address && <span>{address}</span>}
                {phone && (
                  <a href={telHref(phone)} className={cn(quiet, "ez:justify-self-start ez:tabular-nums")}>
                    {phone}
                  </a>
                )}
                {hours && <span>{`${LANDING_LABEL.hours} ${hours}`}</span>}
              </div>
            )}
          </div>
          {(nav.length > 0 || links.length > 0) && (
            <Column head={LANDING_LABEL.links} span="ez:md:col-span-2">
              {nav.map((n) => (
                <NextLink key={n.href} href={n.href} className={cn(quiet, "ez:justify-self-start")}>
                  {n.label}
                </NextLink>
              ))}
              {links.map((l) => (
                <a key={l.key} href={l.href} {...out} className={cn(quiet, "ez:justify-self-start")}>
                  {l.label}
                </a>
              ))}
            </Column>
          )}
          {terms.length > 0 && (
            <Column head={LANDING_LABEL.terms} span="ez:md:col-span-2">
              {terms.map((t) => (
                <NextLink key={t.href} href={t.href} className={cn(quiet, "ez:justify-self-start", t.strong && "ez:text-fg")}>
                  {t.label}
                </NextLink>
              ))}
            </Column>
          )}
          <Column head={LANDING_LABEL.business} span="ez:md:col-span-4">
            {business.length > 0 ? business.map((r) => <span key={r.label}>{`${r.label} ${r.value}`}</span>) : <span>{legal}</span>}
          </Column>
        </div>
      </div>
    </footer>
  );
}
