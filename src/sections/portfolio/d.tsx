import NextLink from "next/link";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, Pic } from "../kit";
import { caseHref } from "../landing/shared";
import { AuroraHero, AuroraIntro, AuroraStore, card, glass, heading } from "../place/d-parts";
import { CaseTabs } from "./d-tabs";
import { PORTFOLIO_ID, PORTFOLIO_TITLE } from "./shared";

export { AuroraFooter as Footer, AuroraHeader as Header } from "../place/d-parts";

const list = "ez:m-0 ez:grid ez:list-none ez:gap-4 ez:p-0 ez:md:grid-cols-2 ez:md:gap-6 ez:lg:grid-cols-3";

const caption = cn(glass, "ez:absolute ez:inset-x-3 ez:bottom-3 ez:flex ez:h-14 ez:items-center ez:gap-3 ez:fx-round-md ez:px-5 ez:text-site-body");

export function Hero(props: SectionProps<"hero">) {
  return <AuroraHero {...props} more={{ href: `/#${PORTFOLIO_ID.work}`, label: PORTFOLIO_TITLE.work }} />;
}

export function Cases({ data }: SectionProps<"case_grid">) {
  const cases = data.cases ?? [];
  const title = <h2 className={heading}>{PORTFOLIO_TITLE.work}</h2>;
  return (
    <section data-slot="case-grid" id={PORTFOLIO_ID.work} data-blank={cases.length ? undefined : ""} className="ez:grid ez:gap-9 ez:text-fg">
      {cases.length ? (
        <CaseTabs
          title={title}
          all={PORTFOLIO_TITLE.all}
          className={list}
          items={cases.map((c, i) => ({
            key: c.id,
            cat: c.category ?? null,
            node: (
              <li className="ez:relative ez:min-w-0">
                <NextLink href={caseHref(c.id)} className={cn("ez:group ez:block ez:text-fg ez:no-underline", focusRing)}>
                  <Pic src={c.image} ratio={1} tone={i} className={card} />
                  <span className={caption}>
                    <span className="ez:min-w-0 ez:truncate">{c.title}</span>
                    {(c.category || c.meta) && (
                      <span className="ez:ml-auto ez:flex ez:shrink-0 ez:gap-3 ez:text-site-small ez:text-muted">
                        {c.category && <span>{c.category}</span>}
                        {c.meta && <span>{c.meta}</span>}
                      </span>
                    )}
                  </span>
                </NextLink>
              </li>
            ),
          }))}
        />
      ) : (
        <>
          {title}
          <ul className={list}>
            {[0, 1, 2].map((i) => (
              <li key={i} className="ez:relative ez:min-w-0">
                <Pic ratio={1} tone={i} className={card} />
                <span className={caption}>
                  <Bar size="long" />
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function Intro(props: SectionProps<"intro">) {
  return <AuroraIntro {...props} title={PORTFOLIO_TITLE.intro} id={PORTFOLIO_ID.intro} />;
}

export function Store(props: SectionProps<"store_info">) {
  return <AuroraStore {...props} title={PORTFOLIO_TITLE.contact} id={PORTFOLIO_ID.contact} photo={false} />;
}
