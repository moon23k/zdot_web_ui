import type { ShopSkin } from "../../templates/types";
import { CARE_DESIGNS, careNav } from "../care";
import { OFFICE_DESIGNS, officeNav } from "../office";
import { PLACE_DESIGNS, placeNav } from "../place";
import { PORTFOLIO_DESIGNS, portfolioNav } from "../portfolio";
import type { LandingDesign, LandingNavItem } from "./types";

export type LandingKind = {
  designs: Partial<Record<ShopSkin, LandingDesign>>;
  nav: (kinds?: string[] | null, skin?: ShopSkin | null) => LandingNavItem[];
};

export const LANDINGS: Record<string, LandingKind> = {
  place: { designs: PLACE_DESIGNS, nav: (kinds) => placeNav(kinds) },
  care: { designs: CARE_DESIGNS, nav: careNav },
  portfolio: { designs: PORTFOLIO_DESIGNS, nav: (kinds) => portfolioNav(kinds) },
  office: { designs: OFFICE_DESIGNS, nav: (kinds) => officeNav(kinds) },
};

export function isLanding(main: string | null | undefined): boolean {
  return Boolean(main && main in LANDINGS);
}

export function landingDesign(main: string | null | undefined, skin: string | null | undefined): LandingDesign | undefined {
  if (!main || !skin) return undefined;
  return LANDINGS[main]?.designs[skin as ShopSkin];
}

export { anchorNav, bookingLink, caseHref, LANDING_LABEL, landingFooter, landingLinks, menuItems, paragraphs, telHref } from "./shared";
export type { StoreLinks } from "./shared";
export type * from "./types";
