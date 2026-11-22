import { anchorNav, LANDING_LABEL, landingFooter, landingLinks, type LandingFooterInput } from "../landing/shared";
import type { LandingAnchor } from "../landing/types";
import type { PlaceFooterProps, PlaceNavItem } from "./types";

export { menuItems, paragraphs, telHref, type StoreLinks } from "../landing/shared";

export const PLACE_TITLE = {
  intro: "소개",
  menu: "메뉴",
  store: "매장 안내",
  location: "오시는 길",
  faq: "자주 묻는 질문",
  address: LANDING_LABEL.address,
  hours: LANDING_LABEL.hours,
  phone: LANDING_LABEL.phone,
  call: LANDING_LABEL.call,
  directions: LANDING_LABEL.directions,
  business: LANDING_LABEL.business,
  terms: LANDING_LABEL.terms,
  links: LANDING_LABEL.links,
  all: LANDING_LABEL.all,
} as const;

export const PLACE_ID = {
  intro: "intro",
  menu: "menu",
  store: "store",
  location: "location",
  faq: "faq",
} as const;

export const placeLinks = landingLinks;

export const PLACE_ANCHORS: LandingAnchor[] = [
  { kind: "intro", label: PLACE_TITLE.intro, href: `/#${PLACE_ID.intro}` },
  { kind: "menu", label: PLACE_TITLE.menu, href: `/#${PLACE_ID.menu}` },
  { kind: "store_info", label: PLACE_TITLE.store, href: `/#${PLACE_ID.store}` },
  { kind: "location", label: PLACE_TITLE.location, href: `/#${PLACE_ID.location}` },
  { kind: "faq", label: PLACE_TITLE.faq, href: `/#${PLACE_ID.faq}` },
];

export function placeNav(kinds?: string[] | null): PlaceNavItem[] {
  return anchorNav(PLACE_ANCHORS, kinds);
}

export function placeFooter({ kinds, ...input }: Omit<LandingFooterInput, "nav"> & { kinds?: string[] | null }): PlaceFooterProps {
  return landingFooter({ ...input, nav: placeNav(kinds) });
}
