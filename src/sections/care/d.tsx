import type { SectionProps } from "../../renderer/registry";
import { Pic } from "../kit";
import { menuItems } from "../landing/shared";
import type { MenuGroup } from "../template/data";
import { AuroraHero, AuroraStore, big, Head, MenuPanel } from "../place/d-parts";
import { CARE_ID, CARE_TITLE, careMenuTitle } from "./shared";

export { AuroraFooter as Footer, AuroraHeader as Header } from "../place/d-parts";

const SKIN = "aurora";

export function Hero(props: SectionProps<"hero">) {
  return <AuroraHero {...props} more={{ href: `/#${CARE_ID.menu}`, label: careMenuTitle(SKIN) }} />;
}

export function Menu({ data }: SectionProps<"menu">) {
  const groups = (data.groups ?? []).filter((g) => g.items.length);
  const empty = !menuItems(groups).length;
  const shown: (MenuGroup | null)[] = empty ? [null, null, null] : groups;
  return (
    <section data-slot="menu" id={CARE_ID.menu} data-blank={empty ? "" : undefined} className="ez:grid ez:gap-9 ez:text-fg">
      <Head title={careMenuTitle(SKIN)} />
      <MenuPanel groups={shown} />
    </section>
  );
}

export function Band({ data }: SectionProps<"photo_band">) {
  const images = data.images?.length ? data.images : data.image ? [data.image] : [];
  const tiles = [0, 1, 2].map((i) => images[i] ?? null);
  return (
    <section data-slot="photo-band" data-blank={images.length ? undefined : ""} className="ez:grid ez:grid-cols-3 ez:gap-2 ez:md:gap-6">
      {tiles.map((src, i) => (
        <Pic key={i} src={src} ratio={4 / 3} tone={i + 1} className={big} />
      ))}
    </section>
  );
}

export function Store(props: SectionProps<"store_info">) {
  return <AuroraStore {...props} title={CARE_TITLE.store} id={CARE_ID.store} photo />;
}
