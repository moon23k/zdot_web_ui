import type { ComponentType } from "react";
import type { SectionKind, SectionProps } from "../../renderer/registry";
import type { BusinessRow } from "../quote/types";
import type { FooterLink } from "../shop/types";
import type { PlaceLink } from "../template/data";

export type LandingNavItem = { label: string; href: string };

export type LandingAnchor = { kind: string; label: string; href: string };

export type LandingHeaderProps = {
  name: string;
  logoUrl?: string | null;
  phone: string | null;
  address?: string | null;
  nav: LandingNavItem[];
  links: PlaceLink[];
};

export type LandingFooterProps = {
  storeName: string;
  phone: string | null;
  hours: string | null;
  address: string | null;
  legal: string;
  business: BusinessRow[];
  nav: LandingNavItem[];
  links: PlaceLink[];
  terms: FooterLink[];
};

export type LandingSections = { [K in SectionKind]?: ComponentType<SectionProps<K>> };

export type LandingDesign = {
  Header: ComponentType<LandingHeaderProps>;
  Footer: ComponentType<LandingFooterProps>;
  sections: LandingSections;
  join?: SectionKind[];
  into?: SectionKind;
};
