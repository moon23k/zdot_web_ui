import type { ComponentType } from "react";
import type { SectionKind, SectionProps } from "../../renderer/registry";
import type { BusinessRow } from "../quote/types";
import type { FooterLink } from "../shop/types";
import type { PlaceLink } from "../template/data";

export type PlaceNavItem = { label: string; href: string };

export type PlaceHeaderProps = {
  name: string;
  logoUrl?: string | null;
  phone: string | null;
  nav: PlaceNavItem[];
  links: PlaceLink[];
};

export type PlaceFooterProps = {
  storeName: string;
  phone: string | null;
  hours: string | null;
  address: string | null;
  legal: string;
  business: BusinessRow[];
  nav: PlaceNavItem[];
  links: PlaceLink[];
  terms: FooterLink[];
};

export type PlaceSections = { [K in SectionKind]?: ComponentType<SectionProps<K>> };

export type PlaceDesign = {
  Header: ComponentType<PlaceHeaderProps>;
  Footer: ComponentType<PlaceFooterProps>;
  sections: PlaceSections;
};
