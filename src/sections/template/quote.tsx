import NextLink from "next/link";
import { ButtonLink } from "../../components/button";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { countSup, figure } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, Block, Card, Chips, Cols, Pic, Rows, Title } from "../kit";

function blankCases(count: number, ratio: number) {
  return Array.from({ length: count }, (_, i) => (
    <Card key={i}>
      <Pic ratio={ratio} tone={i} className="ez:overflow-hidden ez:rounded-lg" />
      <span className="ez:font-display ez:text-site-item">
        <Bar />
      </span>
      <span className="ez:text-site-note">
        <Bar size="long" />
      </span>
    </Card>
  ));
}

export function PriceTiers({ data, variant, blank }: SectionProps<"price_tiers">) {
  const items = data.items ?? [];
  if (!items.length && !blank) return null;
  if (variant === "gallery") {
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
  if (!items.length) {
    return (
      <Block slot="price-tiers" blank>
        <Title>{data.title ?? "가격"}</Title>
        <Rows rows={[0, 1, 2].map(() => ({ label: <Bar />, value: <BlankPrice /> }))} />
      </Block>
    );
  }
  return (
    <Block slot="price-tiers">
      <Title>{data.title ?? "가격"}</Title>
      <Rows rows={items} />
    </Block>
  );
}

export function PackageCards({ data, blank }: SectionProps<"package_cards">) {
  const items = data.items ?? [];
  if (!items.length && !blank) return null;
  if (!items.length) {
    return (
      <Block slot="package-cards" blank>
        <Title>{data.title ?? "상품 · 가격"}</Title>
        <Cols m={1} pc={3}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="ez:grid ez:content-start ez:gap-2 ez:rounded-lg ez:border ez:border-solid ez:border-primary-border ez:p-5 ez:text-fg">
              <span className="ez:text-site-note">
                <Bar />
              </span>
              <BlankPrice className="ez:text-site-figure" />
              <span className="ez:text-site-note">
                <Bar size="long" />
              </span>
              <BlankButton>예약 문의</BlankButton>
            </div>
          ))}
        </Cols>
      </Block>
    );
  }
  return (
    <Block slot="package-cards">
      <Title>{data.title ?? "상품 · 가격"}</Title>
      {data.tabs && <Chips items={data.tabs} />}
      <Cols m={1} pc={3}>
        {items.map((p) => (
          <div key={p.name} className="ez:grid ez:content-start ez:gap-2 ez:rounded-lg ez:border ez:border-solid ez:border-primary-border ez:p-5 ez:text-fg">
            <span className="ez:text-site-note ez:text-muted">{p.name}</span>
            <strong className="ez:text-site-figure ez:text-primary ez:tabular-nums">{p.price}</strong>
            {p.includes && (
              <ul className="ez:m-0 ez:grid ez:gap-1 ez:pl-4 ez:text-site-note">
                {p.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}
            <ButtonLink href={p.href ?? "/quote"}>예약 문의</ButtonLink>
          </div>
        ))}
      </Cols>
    </Block>
  );
}

export function CaseGrid({ data, variant, blank }: SectionProps<"case_grid">) {
  const cases = data.cases ?? [];
  if (!cases.length && !blank) return null;
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
                <span className="ez:flex ez:items-baseline ez:justify-between ez:gap-3">
                  <span className="ez:text-site-heading">{c ? c.title : <Bar />}</span>
                  {c?.meta && <span className="ez:text-site-small ez:text-muted">{c.meta}</span>}
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
  if (!cases.length) {
    return (
      <Block slot="case-grid" blank>
        <Title>{data.title ?? "작업 사례"}</Title>
        <Cols m={2} pc={4}>
          {blankCases(4, 0.75)}
        </Cols>
      </Block>
    );
  }
  return (
    <Block slot="case-grid">
      <Title>{data.title ?? "작업 사례"}</Title>
      {data.categories && <Chips items={data.categories} />}
      <Cols m={2} pc={4}>
        {cases.map((c, i) => (
          <Card key={c.id} href={c.href}>
            <Pic src={c.image} ratio={0.75} tone={i} />
            <strong className="ez:font-display ez:text-site-item">{c.title}</strong>
            {c.meta && <span className="ez:text-site-note ez:text-muted">{c.meta}</span>}
          </Card>
        ))}
      </Cols>
    </Block>
  );
}

export function CaseCards({ data, blank }: SectionProps<"case_cards">) {
  const cases = data.cases ?? [];
  if (!cases.length && !blank) return null;
  if (!cases.length) {
    return (
      <Block slot="case-cards" blank>
        <Title>{data.title ?? "프로젝트"}</Title>
        <Cols m={1} pc={3}>
          {blankCases(3, 1.78)}
        </Cols>
      </Block>
    );
  }
  return (
    <Block slot="case-cards">
      <Title>{data.title ?? "프로젝트"}</Title>
      {data.categories && <Chips items={data.categories} />}
      <Cols m={1} pc={3}>
        {cases.map((c, i) => (
          <Card key={c.id} href={c.href}>
            <Pic src={c.image} ratio={1.78} tone={i} className="ez:overflow-hidden ez:rounded-lg" />
            {c.meta && <span className="ez:text-site-note ez:text-muted">{c.meta}</span>}
            <strong className="ez:font-display ez:text-site-item">{c.title}</strong>
            {c.scope && <span className="ez:text-site-note ez:text-muted">{c.scope}</span>}
          </Card>
        ))}
      </Cols>
    </Block>
  );
}

export function BeforeAfter({ data, blank }: SectionProps<"before_after">) {
  const empty = !data.before && !data.after;
  if (empty && !blank) return null;
  return (
    <section data-slot="before-after" data-blank={empty ? "" : undefined} className="ez:grid ez:grid-cols-2 ez:gap-2 ez:text-fg">
      {(
        [
          ["BEFORE", data.before],
          ["AFTER", data.after],
        ] as const
      ).map(([label, src], i) => (
        <figure key={label} className="ez:m-0 ez:grid ez:gap-1">
          <Pic src={src} ratio={1} tone={i} />
          <figcaption className="ez:text-center ez:text-site-note ez:text-muted">{label}</figcaption>
        </figure>
      ))}
    </section>
  );
}
