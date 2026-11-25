import type { ShopSkin } from "../../templates/types";
import { anchorNav, LANDING_LABEL } from "../landing/shared";
import type { LandingAnchor, LandingNavItem } from "../landing/types";

export const CARE_TITLE = {
  intro: "소개",
  prices: "가격 안내",
  store: "매장 안내",
  location: "오시는 길",
  faq: "자주 묻는 질문",
  ...LANDING_LABEL,
} as const;

export const CARE_ID = {
  intro: "intro",
  menu: "menu",
  store: "store",
  location: "location",
  faq: "faq",
} as const;

export const CARE_MENU_TITLE: Record<ShopSkin, string> = {
  editorial: CARE_TITLE.prices,
  catalog: CARE_TITLE.prices,
  showroom: CARE_TITLE.prices,
  aurora: CARE_TITLE.prices,
  night: CARE_TITLE.prices,
  stage: CARE_TITLE.prices,
};

export function careMenuTitle(skin?: ShopSkin | null): string {
  return CARE_MENU_TITLE[skin ?? "catalog"];
}

export function careNav(kinds?: string[] | null, skin?: ShopSkin | null): LandingNavItem[] {
  const anchors: LandingAnchor[] = [
    { kind: "intro", label: CARE_TITLE.intro, href: `/#${CARE_ID.intro}` },
    { kind: "menu", label: careMenuTitle(skin), href: `/#${CARE_ID.menu}` },
    { kind: "store_info", label: CARE_TITLE.store, href: `/#${CARE_ID.store}` },
    { kind: "location", label: CARE_TITLE.location, href: `/#${CARE_ID.location}` },
    { kind: "faq", label: CARE_TITLE.faq, href: `/#${CARE_ID.faq}` },
  ];
  return anchorNav(anchors, kinds);
}
