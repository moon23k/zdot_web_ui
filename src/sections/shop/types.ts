import type { ComponentType, ReactNode } from "react";
import type { CatalogLink } from "../../blocks/catalog-view/classic";
import type { NavCategory } from "../../blocks/site-header/header-nav";
import type { SectionKind, SectionProps } from "../../renderer/registry";
import type { ProductSummary } from "../../types";

export type ShopNavItem = { label: string; href: string };

export type ShopHeaderProps = {
  name: string;
  logoUrl?: string | null;
  cartCount?: number;
  signedIn?: boolean;
  categories: NavCategory[];
  nav: { all: ShopNavItem; fresh: ShopNavItem; best: ShopNavItem; categories: ShopNavItem[] };
  links: { search: string; account: ShopNavItem; likes: string; cart: string };
};

export type FooterLink = { label: string; href: string; strong?: boolean };

export type ShopFooterProps = {
  storeName: string;
  phone: string | null;
  hours: string | null;
  legal: string;
  shop: FooterLink[];
  guide: FooterLink[];
  account: FooterLink[];
  terms: FooterLink[];
};

export type CatalogTab = CatalogLink & { count?: number | null };

export type CatalogPromo = { title: string; image?: string | null; href: string };

export type ShopListProps = {
  title: string;
  count?: number | null;
  crumbs: CatalogLink[];
  tabs: CatalogTab[];
  sorts: CatalogLink[];
  products: ProductSummary[];
  more?: string | null;
  search?: ReactNode;
  promo?: CatalogPromo | null;
  emptyHref?: string;
};

export type ShopSections = { [K in SectionKind]?: ComponentType<SectionProps<K>> };

export type ShopDesign = {
  Header: ComponentType<ShopHeaderProps>;
  Footer: ComponentType<ShopFooterProps>;
  List: ComponentType<ShopListProps>;
  sections: ShopSections;
};
