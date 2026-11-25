import NextLink from "next/link";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Pic } from "../kit";
import { caseHref, menuItems } from "../landing/shared";
import { NightAbout, NightBox, NightHead, NightHero, nightHair, nightHours, nightRule, NightVisit } from "../place/e";
import type { Case, MenuItem } from "../template/data";
import { OFFICE_ID, OFFICE_TITLE } from "./shared";

export { Footer, Header } from "../place/e";

export function Hero(props: SectionProps<"hero">) {
  const rows = nightHours(props.data).reverse();
  return <NightHero {...props} jump={{ key: "services", label: OFFICE_TITLE.services, href: `/#${OFFICE_ID.services}` }} box={rows.length ? <NightBox rows={rows} /> : null} />;
}

const plan = cn(
  nightRule,
  "ez:flex ez:min-w-0 ez:flex-col ez:py-7 ez:max-lg:border-t ez:max-lg:first:border-t-0 ez:lg:min-h-70 ez:lg:border-l ez:lg:px-7 ez:lg:pb-8 ez:lg:nth-[4n+1]:border-l-0 ez:lg:nth-[4n+1]:pl-0 ez:lg:nth-[n+5]:border-t",
);

const planNo = "ez:text-site-note ez:text-site-off ez:tabular-nums";

const planName = "ez:m-0 ez:mt-6 ez:font-display ez:text-site-heading ez:font-light ez:text-fg ez:lg:mt-10";

const planPrice = "ez:m-0 ez:mt-2.5 ez:font-display ez:text-site-name ez:font-extralight ez:tracking-tight ez:text-fg ez:tabular-nums ez:lg:text-site-display-md";

export function Menu({ data }: SectionProps<"menu">) {
  const items = menuItems((data.groups ?? []).filter((g) => g.items.length));
  const shown: (MenuItem | null)[] = items.length ? items : [null, null, null, null];
  return (
    <section data-slot="menu" id={OFFICE_ID.services} data-blank={items.length ? undefined : ""} className="ez:grid ez:gap-7 ez:text-fg">
      <NightHead title={OFFICE_TITLE.services} />
      <ul className={cn(nightRule, "ez:m-0 ez:grid ez:list-none ez:border-y ez:p-0 ez:lg:grid-cols-4")}>
        {shown.map((m, i) => (
          <li key={m ? m.id : i} aria-hidden={m ? undefined : "true"} className={plan}>
            <span className={planNo}>{String(i + 1).padStart(2, "0")}</span>
            {m ? (
              <>
                <h3 className={planName}>{m.name}</h3>
                {m.price && <p className={planPrice}>{m.price}</p>}
              </>
            ) : (
              <>
                <span className={planName}>
                  <Bar />
                </span>
                <span className={planPrice}>
                  <Bar size="short" />
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CaseCard({ item, index }: { item: Case | null; index: number }) {
  const image = (
    <div className={cn(nightHair, "ez:overflow-hidden ez:rounded-lg ez:border ez:bg-surface-alt")}>
      <Pic src={item?.image} ratio={4 / 3} tone={index} />
    </div>
  );
  if (!item)
    return (
      <li className="ez:grid ez:min-w-0 ez:content-start ez:gap-2">
        {image}
        <span className="ez:pt-2 ez:text-site-item">
          <Bar size="long" />
        </span>
        <span className="ez:text-site-small">
          <Bar size="short" />
        </span>
      </li>
    );
  const meta = [item.category, item.meta].filter((v): v is string => Boolean(v?.trim())).join(" · ");
  return (
    <li className="ez:min-w-0">
      <NextLink href={caseHref(item.id)} className={cn("ez:group ez:grid ez:content-start ez:text-fg ez:no-underline", focusRing)}>
        {image}
        <span className="ez:px-0.5 ez:pt-4 ez:text-site-item ez:font-light ez:text-fg ez:group-hover:text-muted">{item.title}</span>
        {meta && <span className="ez:px-0.5 ez:pt-1 ez:text-site-small ez:text-site-off">{meta}</span>}
      </NextLink>
    </li>
  );
}

export function Cases({ data }: SectionProps<"case_grid">) {
  const cases = data.cases ?? [];
  const shown: (Case | null)[] = cases.length ? cases : [null, null, null];
  return (
    <section data-slot="case-grid" id={OFFICE_ID.cases} data-blank={cases.length ? undefined : ""} className="ez:grid ez:gap-7 ez:text-fg">
      <NightHead title={OFFICE_TITLE.cases} />
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-gutter ez:gap-y-11 ez:p-0 ez:sm:grid-cols-2 ez:lg:grid-cols-3">
        {shown.map((c, i) => (
          <CaseCard key={c ? c.id : i} item={c} index={i} />
        ))}
      </ul>
    </section>
  );
}

export function Intro(props: SectionProps<"intro">) {
  return <NightAbout {...props} title={OFFICE_TITLE.intro} id={OFFICE_ID.intro} />;
}

export function Store(props: SectionProps<"store_info">) {
  return <NightVisit {...props} title={OFFICE_TITLE.contact} id={OFFICE_ID.company} blank={!props.data.address && !props.data.company?.length} />;
}
