import { CLASS_DESIGNS } from "../../sections/class";
import { StandInList } from "../../sections/class/defaults";
import type { ClassListProps } from "../../sections/class/types";
import { bySkin } from "../../templates/skin";
import type { ShopSkin } from "../../templates/types";

export function ClassCatalog({ skin, tabs, ...props }: ClassListProps & { skin?: ShopSkin }) {
  const List = bySkin(CLASS_DESIGNS, skin)?.List ?? StandInList;
  const shown = tabs.filter((t, i) => i === 0 || t.on || t.count !== 0);
  return <List {...props} tabs={shown} />;
}
