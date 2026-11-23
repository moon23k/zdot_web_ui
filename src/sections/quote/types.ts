import type { ComponentType, ReactNode } from "react";
import type { CatalogLink } from "../../blocks/catalog-view/classic";
import type { SectionKind, SectionProps } from "../../renderer/registry";
import type { CatalogTab, FooterLink } from "../shop/types";
import type { Case, QuoteStarter } from "../template/data";

export type QuoteNavItem = { label: string; href: string };

export type QuoteHeaderProps = {
  name: string;
  logoUrl?: string | null;
  signedIn?: boolean;
  phone: string | null;
  nav: QuoteNavItem[];
  links: { lookup: QuoteNavItem; request: QuoteNavItem; account: QuoteNavItem };
};

export type BusinessRow = { label: string; value: string };

export type QuoteFooterProps = {
  storeName: string;
  phone: string | null;
  hours: string | null;
  legal: ReactNode;
  business: BusinessRow[];
  nav: FooterLink[];
  guide: FooterLink[];
  account: FooterLink[];
  terms: FooterLink[];
};

export type QuoteRating = { average: number; count: number };

export type QuoteListProps = {
  title: string;
  count: number;
  crumbs: CatalogLink[];
  tabs: CatalogTab[];
  cases: Case[];
  rating: QuoteRating | null;
  request: QuoteStarter;
  storeName?: string | null;
};

export type QuoteSections = { [K in SectionKind]?: ComponentType<SectionProps<K>> };

export type QuoteDesign = {
  Header: ComponentType<QuoteHeaderProps>;
  Footer: ComponentType<QuoteFooterProps>;
  List: ComponentType<QuoteListProps>;
  sections: QuoteSections;
  join?: SectionKind[];
};

export type CaseFact = { label: string; value: string };

export type CaseView = {
  id: string;
  href: string;
  title: string;
  image: string | null;
  category: string | null;
  area: string | null;
  scope: string | null;
  facts: CaseFact[];
  line: string;
};
