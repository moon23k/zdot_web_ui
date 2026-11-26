import NextLink from "next/link";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Pic } from "../kit";
import { visitRows } from "../landing/parts";
import { caseHref, menuItems } from "../landing/shared";
import type { Case, MenuItem } from "../template/data";
import { AuroraHero, AuroraIntro, AuroraStore, card as photoCard, glass, Head, wash } from "../place/d-parts";
import { OFFICE_ID, OFFICE_TITLE } from "./shared";

export { AuroraFooter as Footer, AuroraHeader as Header } from "../place/d-parts";

const card = cn(glass, "ez:grid ez:min-w-0 ez:content-start ez:gap-3 ez:fx-round-md ez:px-7 ez:pt-7 ez:pb-8");

const price = "ez:m-0 ez:text-site-page-sm ez:tabular-nums";

export function Hero(props: SectionProps<"hero">) {
  return <AuroraHero {...props} more={{ href: `/#${OFFICE_ID.services}`, label: OFFICE_TITLE.services }} />;
}

export function Menu({ data }: SectionProps<"menu">) {
  const items = menuItems((data.groups ?? []).filter((g) => g.items.length));
  const shown: (MenuItem | null)[] = items.length ? items : [null, null, null, null];
  return (
    <section data-slot="menu" id={OFFICE_ID.services} data-blank={items.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={OFFICE_TITLE.services} />
      <div className={wash}>
        <ul className="ez:m-0 ez:grid ez:list-none ez:gap-4 ez:p-0 ez:md:grid-cols-2 ez:lg:grid-cols-4">
          {shown.map((m, i) =>
            m ? (
              <li key={m.id} className={card}>
                <h3 className="ez:m-0 ez:text-site-item ez:font-normal">{m.name}</h3>
                {m.price && <p className={price}>{m.price}</p>}
              </li>
            ) : (
              <li key={i} aria-hidden="true" className={card}>
                <span className="ez:text-site-item">
                  <Bar />
                </span>
                <span className="ez:text-site-page-sm">
                  <Bar size="short" />
                </span>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}

function caseLine(c: Case): string {
  return [c.category, c.scope ?? c.meta].filter((v): v is string => Boolean(v?.trim())).join(" · ");
}

export function Cases({ data }: SectionProps<"case_grid">) {
  const cases = data.cases ?? [];
  const shown: (Case | null)[] = cases.length ? cases : [null, null, null];
  return (
    <section data-slot="case-grid" id={OFFICE_ID.cases} data-blank={cases.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={OFFICE_TITLE.cases} />
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-6 ez:gap-y-10 ez:p-0 ez:md:grid-cols-2 ez:lg:grid-cols-3">
        {shown.map((c, i) => {
          if (!c)
            return (
              <li key={i} className="ez:grid ez:min-w-0 ez:content-start">
                <Pic ratio={4 / 3} tone={i} className={photoCard} />
                <span className="ez:px-1.5 ez:pt-4 ez:text-site-item">
                  <Bar size="long" />
                </span>
              </li>
            );
          const line = caseLine(c);
          return (
            <li key={c.id} className="ez:min-w-0">
              <NextLink href={caseHref(c.id)} className={cn("ez:group ez:grid ez:content-start ez:text-fg ez:no-underline", focusRing)}>
                <Pic src={c.image} ratio={4 / 3} tone={i} className={photoCard} />
                <span className="ez:px-1.5 ez:pt-4 ez:text-site-item ez:font-normal ez:group-hover:text-muted">{c.title}</span>
                {line && <span className="ez:px-1.5 ez:pt-1 ez:text-site-body ez:text-muted">{line}</span>}
              </NextLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Intro(props: SectionProps<"intro">) {
  return <AuroraIntro {...props} title={OFFICE_TITLE.intro} id={OFFICE_ID.intro} />;
}

export function Store(props: SectionProps<"store_info">) {
  const shown = new Set(visitRows(props.data).map((r) => r.label));
  const extra = (props.data.company ?? []).filter((r) => !shown.has(r.label));
  return <AuroraStore {...props} title={OFFICE_TITLE.contact} id={OFFICE_ID.company} photo={false} extra={extra} />;
}
