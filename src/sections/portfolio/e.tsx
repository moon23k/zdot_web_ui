import NextLink from "next/link";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Pic } from "../kit";
import { caseHref, LANDING_LABEL } from "../landing/shared";
import { NightAbout, NightBox, NightHead, NightHero, nightRule, NightVisit } from "../place/e";
import { caseView, CASES_HREF, QUOTE_TITLE } from "../quote/shared";
import type { Case } from "../template/data";
import { PORTFOLIO_ID, PORTFOLIO_TITLE } from "./shared";

export { Footer, Header } from "../place/e";

const row = "ez:grid ez:grid-cols-[2rem_minmax(0,1fr)_6rem] ez:items-center ez:gap-x-4 ez:py-4 ez:md:h-37 ez:md:grid-cols-[5.5rem_minmax(0,1fr)_12rem_7rem_12.5rem] ez:md:gap-x-6 ez:md:py-0";

const thumb = "ez:overflow-hidden ez:rounded-md ez:border ez:border-solid ez:border-hairline ez:bg-surface-alt";

function meta(c: Case): string {
  return [c.category, c.meta].filter((v): v is string => Boolean(v?.trim())).join(" · ");
}

export function Hero(props: SectionProps<"hero">) {
  const lead = props.data.cases?.[0] ?? null;
  const view = lead ? caseView(lead) : null;
  return (
    <NightHero
      {...props}
      jump={{ key: "work", label: PORTFOLIO_TITLE.work, href: `/#${PORTFOLIO_ID.work}` }}
      box={view ? <NightBox title={view.title} rows={view.facts} href={caseHref(view.id)} /> : null}
    />
  );
}

function Tabs({ cases }: { cases: Case[] }) {
  const names = [...new Set(cases.map((c) => c.category?.trim()).filter((v): v is string => Boolean(v)))];
  if (names.length < 2) return null;
  const tab = cn("ez:py-1 ez:no-underline ez:hover:text-fg", focusRing);
  return (
    <nav aria-label={QUOTE_TITLE.category} className="ez:flex ez:flex-wrap ez:gap-x-7 ez:gap-y-2 ez:text-site-body">
      <NextLink href={CASES_HREF} className={cn(tab, "ez:text-fg")}>
        {LANDING_LABEL.all}
      </NextLink>
      {names.map((n) => (
        <NextLink key={n} href={`${CASES_HREF}?category=${encodeURIComponent(n)}`} className={cn(tab, "ez:text-site-off")}>
          {n}
        </NextLink>
      ))}
    </nav>
  );
}

function Item({ item, index }: { item: Case; index: number }) {
  const first = index === 0;
  const line = meta(item);
  return (
    <li className={cn(nightRule, "ez:border-t", first && "ez:bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--ezd-select)_22%,transparent)_30%,transparent)]")}>
      <NextLink href={caseHref(item.id)} className={cn(row, "ez:group ez:text-site-off ez:no-underline", focusRing)}>
        <span className="ez:text-site-note ez:tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <span className="ez:grid ez:min-w-0 ez:gap-1">
          <span className={cn("ez:flex ez:min-w-0 ez:items-center ez:gap-4 ez:font-display ez:text-site-heading ez:font-extralight ez:tracking-tight ez:md:text-site-title", first ? "ez:text-fg" : "ez:text-fg/55 ez:group-hover:text-fg")}>
            {first && <span aria-hidden="true" className="ez:fx-glow ez:size-2 ez:shrink-0 ez:rounded-full ez:bg-primary" />}
            <span className="ez:min-w-0 ez:truncate">{item.title}</span>
          </span>
          {line && <span className="ez:text-site-small ez:md:hidden">{line}</span>}
        </span>
        <span className="ez:min-w-0 ez:truncate ez:text-site-small ez:max-md:hidden">{item.category}</span>
        <span className="ez:min-w-0 ez:truncate ez:text-site-small ez:tabular-nums ez:max-md:hidden">{item.meta}</span>
        <div className={cn(thumb, !first && "ez:opacity-60 ez:group-hover:opacity-100")}>
          <Pic src={item.image} ratio={200 / 116} tone={index} />
        </div>
      </NextLink>
    </li>
  );
}

function Blank({ index }: { index: number }) {
  return (
    <li className={cn(nightRule, row, "ez:border-t")}>
      <span className="ez:text-site-note ez:text-site-off ez:tabular-nums">{String(index + 1).padStart(2, "0")}</span>
      <span className="ez:text-site-heading ez:md:text-site-title">
        <Bar size="long" />
      </span>
      <span className="ez:text-site-small ez:max-md:hidden">
        <Bar size="short" />
      </span>
      <span className="ez:text-site-small ez:max-md:hidden">
        <Bar size="short" />
      </span>
      <div className={thumb}>
        <Pic ratio={200 / 116} tone={index} />
      </div>
    </li>
  );
}

export function Cases({ data }: SectionProps<"case_grid">) {
  const cases = data.cases ?? [];
  return (
    <section data-slot="case-grid" id={PORTFOLIO_ID.work} data-blank={cases.length ? undefined : ""} className="ez:grid ez:gap-7 ez:text-fg">
      <NightHead title={PORTFOLIO_TITLE.work} aside={<Tabs cases={cases} />} />
      <ul className={cn(nightRule, "ez:m-0 ez:list-none ez:border-b ez:p-0")}>
        {cases.length ? cases.map((c, i) => <Item key={c.id} item={c} index={i} />) : [0, 1, 2, 3].map((i) => <Blank key={i} index={i} />)}
      </ul>
    </section>
  );
}

export function Intro(props: SectionProps<"intro">) {
  return <NightAbout {...props} title={PORTFOLIO_TITLE.intro} id={PORTFOLIO_ID.intro} />;
}

export function Store(props: SectionProps<"store_info">) {
  return <NightVisit {...props} title={PORTFOLIO_TITLE.contact} id={PORTFOLIO_ID.contact} />;
}
