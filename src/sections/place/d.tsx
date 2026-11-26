import type { SectionProps } from "../../renderer/registry";
import { Pic } from "../kit";
import type { MenuGroup } from "../template/data";
import { AuroraHero, AuroraIntro, AuroraStore, card, Head, MenuPanel } from "./d-parts";
import { menuItems, PLACE_ID, PLACE_TITLE } from "./shared";
import { Won } from "../../components/price";

export { AuroraFooter as Footer, AuroraHeader as Header } from "./d-parts";

export function Hero(props: SectionProps<"hero">) {
  return <AuroraHero {...props} more={{ href: `/#${PLACE_ID.menu}`, label: PLACE_TITLE.menu }} />;
}

export function Menu({ data }: SectionProps<"menu">) {
  const groups = (data.groups ?? []).filter((g) => g.items.length);
  const items = menuItems(groups);
  const empty = !items.length;
  const cards = items.filter((i) => i.image);
  const rest: (MenuGroup | null)[] = empty ? [null, null, null] : groups.map((g) => ({ ...g, items: g.items.filter((i) => !i.image) })).filter((g) => g.items.length);
  return (
    <section data-slot="menu" id={PLACE_ID.menu} data-blank={empty ? "" : undefined} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={PLACE_TITLE.menu} />
      <div className="ez:grid ez:gap-16">
        {cards.length > 0 && (
          <ul className="ez:m-0 ez:grid ez:list-none ez:grid-cols-2 ez:gap-x-4 ez:gap-y-8 ez:p-0 ez:md:gap-x-6 ez:lg:grid-cols-4 ez:lg:gap-y-10">
            {cards.map((item, i) => (
              <li key={item.id} className="ez:grid ez:min-w-0 ez:content-start">
                <Pic src={item.image} ratio={1} tone={i} className={card} />
                <div className="ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-x-3 ez:px-1.5 ez:pt-4 ez:text-site-item ez:font-normal">
                  <span className="ez:min-w-0">{item.name}</span>
                  <span className="ez:shrink-0 ez:tabular-nums"><Won value={item.price} /></span>
                </div>
              </li>
            ))}
          </ul>
        )}
        {rest.length > 0 && <MenuPanel groups={rest} />}
      </div>
    </section>
  );
}

export function Intro(props: SectionProps<"intro">) {
  return <AuroraIntro {...props} title={PLACE_TITLE.intro} id={PLACE_ID.intro} />;
}

export function Store(props: SectionProps<"store_info">) {
  return <AuroraStore {...props} title={PLACE_TITLE.store} id={PLACE_ID.store} photo />;
}
