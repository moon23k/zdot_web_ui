import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { Pic } from "../kit";
import { menuItems } from "../landing/shared";
import { NightBox, NightHead, NightHero, nightHair, nightHours, NightTable, NightVisit } from "../place/e";
import { CARE_ID, CARE_TITLE, careMenuTitle } from "./shared";

export { Footer, Header } from "../place/e";

export function Hero(props: SectionProps<"hero">) {
  const rows = nightHours(props.data);
  return <NightHero {...props} jump={{ key: "menu", label: careMenuTitle("night"), href: `/#${CARE_ID.menu}` }} box={rows.length ? <NightBox rows={rows} /> : null} />;
}

export function Menu({ data }: SectionProps<"menu">) {
  const groups = (data.groups ?? []).filter((g) => g.items.length);
  const empty = !menuItems(groups).length;
  return (
    <section data-slot="menu" id={CARE_ID.menu} data-blank={empty ? "" : undefined} className="ez:grid ez:gap-7 ez:text-fg">
      <NightHead title={careMenuTitle("night")} />
      <NightTable groups={groups} />
    </section>
  );
}

export function Band({ data }: SectionProps<"photo_band">) {
  const images = data.images?.length ? data.images : data.image ? [data.image] : [];
  const tiles = [0, 1, 2].map((i) => images[i] ?? null);
  return (
    <section data-slot="photo-band" data-blank={images.length ? undefined : ""} className="ez:grid ez:gap-gutter ez:md:grid-cols-3">
      {tiles.map((src, i) => (
        <div key={i} className={cn(nightHair, "ez:min-w-0 ez:overflow-hidden ez:rounded-lg ez:border ez:bg-surface-alt")}>
          <Pic src={src} ratio={4 / 3} tone={i + 1} />
        </div>
      ))}
    </section>
  );
}

export function Store(props: SectionProps<"store_info">) {
  return <NightVisit {...props} title={CARE_TITLE.store} id={CARE_ID.store} />;
}
