import NextLink from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { countSup, figure, focusRing, textLink } from "../../utils/styles";
import type { Case, TemplateSectionData } from "./data";
import { Bar, BlankButton, BlankPrice, Chips, Pic } from "../kit";
import { pcCols } from "../../utils/styles";

export function PriceTiers({ data }: SectionProps<"price_tiers">) {
  const items = data.items ?? [];
  return (
    <section data-slot="price-tiers" data-variant="gallery" id="services" data-blank={items.length ? undefined : ""} className="ez:mx-[calc(50%-50vw)] ez:bg-surface-alt ez:text-fg">
      <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:gap-8 ez:px-page ez:py-16 ez:lg:grid-cols-[4fr_8fr] ez:lg:gap-6 ez:lg:py-30">
        <h2 className="ez:m-0 ez:text-site-section">{data.title ?? "서비스"}</h2>
        <ol className="ez:m-0 ez:list-none ez:p-0">
          {(items.length ? items : [null, null, null]).map((it, i) => (
            <li key={i} className="ez:grid ez:grid-cols-[40px_1fr_auto] ez:items-baseline ez:gap-6 ez:border-0 ez:border-t ez:border-solid ez:border-site-field ez:py-7 ez:lg:grid-cols-[56px_1fr_200px]">
              <span className={cn(figure, "ez:text-site-heading ez:text-primary")}>{it ? String(i + 1).padStart(2, "0") : null}</span>
              <span className="ez:text-site-heading ez:font-light ez:tracking-[-0.03em] ez:lg:text-site-logo">{it ? it.label : <Bar />}</span>
              <span className="ez:text-right ez:font-medium ez:tabular-nums">{it ? it.value : <BlankPrice />}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type Pack = NonNullable<TemplateSectionData["package_cards"]["items"]>[number];

const cover = "ez:[&>[data-slot=photo]]:h-full ez:[&>[data-slot=photo]]:aspect-auto";

function Head({ title, count, children }: { title: string; count?: number; children?: ReactNode }) {
  return (
    <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-4">
      <h2 className="ez:m-0 ez:text-site-section">
        {title}
        {count ? <span className={countSup}>{count}</span> : null}
      </h2>
      {children}
    </div>
  );
}

export function PackageCards({ data }: SectionProps<"package_cards">) {
  const items: Pack[] = data.items ?? [];
  const shown: (Pack | null)[] = items.length ? items : [null, null, null];
  return (
    <section data-slot="package-cards" id="services" data-blank={items.length ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg">
      <Head title={data.title ?? "상품 · 가격"}>{items.length > 0 && data.tabs?.length ? <Chips items={data.tabs} /> : null}</Head>
      <div className={cn("ez:grid ez:gap-gutter ez:md:items-stretch", pcCols(3, shown.length))}>
        {shown.map((p, i) => (
          <article key={p ? p.name : i} className="ez:flex ez:flex-col ez:overflow-hidden ez:rounded-lg ez:border ez:border-solid ez:border-site-line">
            {(!p || p.image !== undefined) && <Pic src={p?.image} tone={i} className={cn("ez:aspect-[16/9] ez:lg:aspect-auto ez:lg:h-55", cover, "ez:[&>[data-slot=photo]]:rounded-none")} />}
            <div className="ez:flex ez:flex-1 ez:flex-col ez:gap-6 ez:p-6 ez:lg:p-8">
              <span className="ez:text-site-heading">{p ? p.name : <Bar />}</span>
              {p ? (
                <strong className="ez:text-site-figure-lg ez:font-light ez:tracking-[-0.03em] ez:tabular-nums">{p.price}</strong>
              ) : (
                <BlankPrice className="ez:text-site-figure-lg ez:font-light" />
              )}
              {p?.includes?.length ? (
                <ul className="ez:m-0 ez:flex-1 ez:list-none ez:p-0">
                  {p.includes.map((t) => (
                    <li key={t} className="ez:flex ez:items-center ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:py-3 ez:text-site-note">
                      <Icon name="check" size="sm" className="ez:shrink-0 ez:text-primary" />
                      {t}
                    </li>
                  ))}
                </ul>
              ) : null}
              {p ? (
                <ButtonLink href={p.href ?? "/quote"} variant="outline" block className="ez:mt-auto">
                  예약 문의
                </ButtonLink>
              ) : (
                <BlankButton variant="outline" className="ez:mt-auto ez:w-full">
                  예약 문의
                </BlankButton>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CaseGrid({ data, variant }: SectionProps<"case_grid">) {
  const cases = data.cases ?? [];
  if (variant === "gallery") {
    const tall = ["ez:lg:h-130", "ez:lg:h-105", "ez:lg:h-80"];
    return (
      <section data-slot="case-grid" data-variant="gallery" id="work" data-blank={cases.length ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-9">
        <div className="ez:flex ez:items-end ez:justify-between ez:gap-3">
          <h2 className="ez:m-0 ez:text-site-section">
            {data.title ?? "작업"}
            {cases.length > 0 && <span className={countSup}>{cases.length}</span>}
          </h2>
          {cases.length > 3 && (
            <NextLink href="/cases" className="ez:shrink-0 ez:border-0 ez:border-b ez:border-solid ez:border-site-faint ez:pb-1 ez:text-site-small ez:font-medium ez:text-fg ez:no-underline">
              전체 보기
            </NextLink>
          )}
        </div>
        <div className="ez:grid ez:gap-gutter ez:md:grid-cols-[5fr_4fr_3fr] ez:md:items-start">
          {(cases.length ? cases.slice(0, 3) : [null, null, null]).map((c, i) => {
            const body = (
              <>
                <Pic src={c?.image} tone={i} className={cn("ez:aspect-[4/3] ez:lg:aspect-auto", tall[i], "ez:[&>[data-slot=photo]]:h-full ez:[&>[data-slot=photo]]:aspect-auto")} />
                <span className="ez:grid ez:min-w-0 ez:gap-1">
                  <span className="ez:text-site-heading">{c ? c.title : <Bar />}</span>
                  {c?.meta && <span className="ez:truncate ez:text-site-small ez:text-muted">{c.meta}</span>}
                </span>
              </>
            );
            return c ? (
              <NextLink key={c.id} href={c.href ?? "#"} className="ez:grid ez:gap-3.5 ez:text-fg ez:no-underline">
                {body}
              </NextLink>
            ) : (
              <div key={i} className="ez:grid ez:gap-3.5">
                {body}
              </div>
            );
          })}
        </div>
      </section>
    );
  }
  const shown: (Case | null)[] = cases.length ? cases.slice(0, 3) : [null, null, null];
  return (
    <section data-slot="case-grid" id="work" data-blank={cases.length ? undefined : ""} className="ez:mx-[calc(50%-50vw)] ez:bg-surface-alt ez:text-fg">
      <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:gap-8 ez:px-page ez:py-16 ez:lg:py-24">
        <Head title={data.title ?? "작업 사례"} count={cases.length}>
          {cases.length > 3 && (
            <NextLink href="/cases" className={cn(textLink, "ez:text-site-small")}>
              전체 보기
            </NextLink>
          )}
        </Head>
        <div className="ez:grid ez:gap-x-gutter ez:gap-y-10 ez:md:grid-cols-3">
          {shown.map((c, i) => {
            const body = (
              <>
                <Pic src={c?.image} ratio={4 / 3} tone={i} />
                <span className="ez:grid ez:min-w-0 ez:gap-2">
                  <span className="ez:text-site-heading">{c ? c.title : <Bar />}</span>
                  <span className="ez:flex ez:items-baseline ez:justify-between ez:gap-4 ez:border-0 ez:border-t ez:border-solid ez:border-site-field ez:pt-2.5 ez:text-site-small">
                    <span className="ez:truncate ez:text-muted">{c ? c.meta : <Bar size="long" />}</span>
                    {c?.scope && <span className="ez:shrink-0">{c.scope}</span>}
                  </span>
                </span>
              </>
            );
            return c ? (
              <NextLink key={c.id} href={c.href ?? "#"} className={cn("ez:grid ez:content-start ez:gap-4 ez:text-fg ez:no-underline", focusRing)}>
                {body}
              </NextLink>
            ) : (
              <div key={i} className="ez:grid ez:content-start ez:gap-4">
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function tagsOf(c: Case): string[] {
  return [...(c.meta?.split(" · ") ?? []), c.scope].filter((t): t is string => !!t);
}

const tag = "ez:inline-flex ez:h-7.5 ez:items-center ez:rounded-full ez:border ez:border-solid ez:border-site-line ez:px-3 ez:text-site-small ez:whitespace-nowrap";

export function CaseCards({ data }: SectionProps<"case_cards">) {
  const cases = data.cases ?? [];
  const shown: (Case | null)[] = cases.length ? cases.slice(0, 4) : [null, null];
  return (
    <section data-slot="case-cards" id="work" data-blank={cases.length ? undefined : ""} className="ez:grid ez:gap-8 ez:text-fg">
      <Head title={data.title ?? "프로젝트"} count={cases.length}>
        {cases.length > 0 && data.categories?.length ? <Chips items={data.categories} /> : null}
      </Head>
      <div className="ez:grid ez:gap-x-gutter ez:gap-y-10 ez:md:grid-cols-2 ez:lg:gap-y-14">
        {shown.map((c, i) => {
          const body = (
            <>
              <Pic src={c?.image} ratio={3 / 2} tone={i} />
              <span className="ez:flex ez:items-start ez:justify-between ez:gap-4">
                <span className="ez:grid ez:min-w-0 ez:gap-2.5">
                  <span className="ez:text-site-heading">{c ? c.title : <Bar />}</span>
                  <span className="ez:flex ez:flex-wrap ez:gap-1.5">
                    {c ? (
                      tagsOf(c).map((t) => (
                        <span key={t} className={tag}>
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className={tag}>
                        <Bar size="short" />
                      </span>
                    )}
                  </span>
                </span>
                {c && (
                  <span aria-hidden="true" className="ez:inline-flex ez:size-10 ez:shrink-0 ez:items-center ez:justify-center ez:rounded-full ez:border ez:border-solid ez:border-site-line">
                    <Icon name="right" size="sm" className="ez:-rotate-45" />
                  </span>
                )}
              </span>
            </>
          );
          return c ? (
            <NextLink key={c.id} href={c.href ?? "#"} className={cn("ez:grid ez:content-start ez:gap-5 ez:text-fg ez:no-underline", focusRing)}>
              {body}
            </NextLink>
          ) : (
            <div key={i} className="ez:grid ez:content-start ez:gap-5">
              {body}
            </div>
          );
        })}
      </div>
      {cases.length > 4 && (
        <div className="ez:flex ez:justify-center ez:pt-6">
          <ButtonLink href="/cases" variant="outline">
            더 보기
            <span className="ez:text-muted ez:tabular-nums">
              4 / {cases.length}
            </span>
          </ButtonLink>
        </div>
      )}
    </section>
  );
}

export function BeforeAfter({ data }: SectionProps<"before_after">) {
  const empty = !data.before && !data.after;
  return (
    <section data-slot="before-after" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-8 ez:text-fg">
      <h2 className="ez:m-0 ez:text-site-section">시공 전 · 후</h2>
      <div className="ez:relative ez:grid ez:grid-cols-2 ez:overflow-hidden ez:rounded-lg">
        {(
          [
            ["전", data.before],
            ["후", data.after],
          ] as const
        ).map(([label, src], i) => (
          <figure key={label} className="ez:relative ez:m-0">
            <Pic src={src} tone={i} className={cn("ez:aspect-[4/5] ez:md:aspect-auto ez:md:h-130", cover, "ez:[&>[data-slot=photo]]:rounded-none")} />
            <figcaption
              className={cn(
                "ez:absolute ez:top-5 ez:inline-flex ez:h-8 ez:items-center ez:rounded-full ez:bg-surface ez:px-3.5 ez:text-site-small",
                i ? "ez:right-5 ez:font-medium ez:text-primary" : "ez:left-5",
              )}
            >
              {label}
            </figcaption>
          </figure>
        ))}
        <span aria-hidden="true" className="ez:absolute ez:inset-y-0 ez:left-1/2 ez:w-0.5 ez:-translate-x-1/2 ez:bg-surface" />
      </div>
    </section>
  );
}
