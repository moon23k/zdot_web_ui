import { anchorNav, LANDING_LABEL } from "../landing/shared";
import type { LandingAnchor, LandingNavItem } from "../landing/types";

export const OFFICE_TITLE = {
  cases: "작업 사례",
  intro: "소개",
  services: "서비스",
  company: "회사 개요",
  contact: "문의",
  faq: "자주 묻는 질문",
  ...LANDING_LABEL,
} as const;

export const OFFICE_ID = {
  cases: "cases",
  intro: "intro",
  services: "services",
  company: "company",
  faq: "faq",
} as const;

const ANCHORS: LandingAnchor[] = [
  { kind: "case_grid", label: OFFICE_TITLE.cases, href: `/#${OFFICE_ID.cases}` },
  { kind: "intro", label: OFFICE_TITLE.intro, href: `/#${OFFICE_ID.intro}` },
  { kind: "menu", label: OFFICE_TITLE.services, href: `/#${OFFICE_ID.services}` },
  { kind: "store_info", label: OFFICE_TITLE.company, href: `/#${OFFICE_ID.company}` },
  { kind: "faq", label: OFFICE_TITLE.faq, href: `/#${OFFICE_ID.faq}` },
];

export function officeNav(kinds?: string[] | null): LandingNavItem[] {
  return anchorNav(ANCHORS, kinds);
}
