import type { SectionProps } from "../../renderer/registry";
import { IntroBlock, LocationBlock, MenuBlock, StoreBlock } from "../landing/parts";
import { CARE_ID, CARE_TITLE } from "./shared";

export { StandInFooter, StandInHeader, StandInHero } from "../landing/parts";

export function StandInIntro(props: SectionProps<"intro">) {
  return <IntroBlock {...props} title={CARE_TITLE.intro} id={CARE_ID.intro} />;
}

export function StandInMenu({ title, ...props }: SectionProps<"menu"> & { title: string }) {
  return <MenuBlock {...props} title={title} id={CARE_ID.menu} />;
}

export function StandInStore(props: SectionProps<"store_info">) {
  return <StoreBlock {...props} title={CARE_TITLE.store} id={CARE_ID.store} />;
}

export function StandInLocation(props: SectionProps<"location">) {
  return <LocationBlock {...props} title={CARE_TITLE.location} id={CARE_ID.location} />;
}
