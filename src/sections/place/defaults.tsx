import type { SectionProps } from "../../renderer/registry";
import { IntroBlock, LocationBlock, MenuBlock, StoreBlock } from "../landing/parts";
import { PLACE_ID, PLACE_TITLE } from "./shared";

export {
  InfoList,
  OutLinks as PlaceLinks,
  StandInFooter,
  StandInHeader,
  StandInHero,
  VisitActions as PlaceActions,
  visitRows as placeRows,
} from "../landing/parts";

export function Intro(props: SectionProps<"intro">) {
  return <IntroBlock {...props} title={PLACE_TITLE.intro} id={PLACE_ID.intro} />;
}

export function Menu(props: SectionProps<"menu">) {
  return <MenuBlock {...props} title={PLACE_TITLE.menu} id={PLACE_ID.menu} />;
}

export function StandInStore(props: SectionProps<"store_info">) {
  return <StoreBlock {...props} title={PLACE_TITLE.store} id={PLACE_ID.store} />;
}

export function StandInLocation(props: SectionProps<"location">) {
  return <LocationBlock {...props} title={PLACE_TITLE.location} id={PLACE_ID.location} />;
}
