import { STAY_DESIGNS } from "../../sections/stay";
import type { StayListProps } from "../../sections/stay/types";
import { bySkin } from "../../templates/skin";
import type { ShopSkin } from "../../templates/types";

export function StayRooms({ skin, ...props }: StayListProps & { skin?: ShopSkin }) {
  const List = (bySkin(STAY_DESIGNS, skin) ?? STAY_DESIGNS.editorial).List;
  return <List {...props} />;
}
