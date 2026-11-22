import type { SectionProps } from "../../renderer/registry";
import { CasesBlock, IntroBlock, MenuBlock, StoreBlock } from "../landing/parts";
import { OFFICE_ID, OFFICE_TITLE } from "./shared";

export { StandInFooter, StandInHeader, StandInHero } from "../landing/parts";

export function StandInCases(props: SectionProps<"case_grid">) {
  return <CasesBlock {...props} title={OFFICE_TITLE.cases} id={OFFICE_ID.cases} />;
}

export function StandInIntro(props: SectionProps<"intro">) {
  return <IntroBlock {...props} title={OFFICE_TITLE.intro} id={OFFICE_ID.intro} />;
}

export function StandInServices(props: SectionProps<"menu">) {
  return <MenuBlock {...props} title={OFFICE_TITLE.services} id={OFFICE_ID.services} />;
}

export function StandInCompany(props: SectionProps<"store_info">) {
  return <StoreBlock {...props} title={OFFICE_TITLE.company} id={OFFICE_ID.company} />;
}
