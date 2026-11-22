import { anchorNav, LANDING_LABEL } from "../landing/shared";
import type { LandingAnchor, LandingNavItem } from "../landing/types";

export const PORTFOLIO_TITLE = {
  work: "작업",
  intro: "소개",
  contact: "문의",
  ...LANDING_LABEL,
} as const;

export const PORTFOLIO_ID = {
  work: "work",
  intro: "intro",
  contact: "contact",
} as const;

const ANCHORS: LandingAnchor[] = [
  { kind: "case_grid", label: PORTFOLIO_TITLE.work, href: `/#${PORTFOLIO_ID.work}` },
  { kind: "intro", label: PORTFOLIO_TITLE.intro, href: `/#${PORTFOLIO_ID.intro}` },
  { kind: "store_info", label: PORTFOLIO_TITLE.contact, href: `/#${PORTFOLIO_ID.contact}` },
];

export function portfolioNav(kinds?: string[] | null): LandingNavItem[] {
  return anchorNav(ANCHORS, kinds);
}
