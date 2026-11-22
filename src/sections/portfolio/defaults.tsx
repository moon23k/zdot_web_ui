import type { SectionProps } from "../../renderer/registry";
import { CasesBlock, IntroBlock, StoreBlock } from "../landing/parts";
import { PORTFOLIO_ID, PORTFOLIO_TITLE } from "./shared";

export { StandInFooter, StandInHeader, StandInHero } from "../landing/parts";

export function StandInWork(props: SectionProps<"case_grid">) {
  return <CasesBlock {...props} title={PORTFOLIO_TITLE.work} id={PORTFOLIO_ID.work} />;
}

export function StandInIntro(props: SectionProps<"intro">) {
  return <IntroBlock {...props} title={PORTFOLIO_TITLE.intro} id={PORTFOLIO_ID.intro} />;
}

export function StandInContact(props: SectionProps<"store_info">) {
  return <StoreBlock {...props} title={PORTFOLIO_TITLE.contact} id={PORTFOLIO_ID.contact} />;
}
