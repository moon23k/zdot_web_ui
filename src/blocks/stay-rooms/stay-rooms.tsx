import { STAY_DESIGNS } from "../../sections/stay";
import type { StayListProps } from "../../sections/stay/types";
import type { ShopSkin } from "../../templates/types";

export function StayRooms({ skin, ...props }: StayListProps & { skin?: ShopSkin }) {
  const List = STAY_DESIGNS[skin ?? "editorial"].List;
  return <List {...props} />;
}
