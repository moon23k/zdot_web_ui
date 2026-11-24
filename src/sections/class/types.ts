import type { ComponentType, ReactNode } from "react";
import type { CatalogLink } from "../../blocks/catalog-view/classic";
import type { SectionKind, SectionProps } from "../../renderer/registry";
import type { CatalogTab } from "../shop/types";
import type { FooterLink } from "../shop/types";
import type { ClassCard, Session } from "../template/data";

export type ClassNavItem = { label: string; href: string };

export type ClassHeaderProps = {
  name: string;
  logoUrl?: string | null;
  signedIn?: boolean;
  nav: { classes: ClassNavItem; kinds: ClassNavItem[]; anchors: ClassNavItem[] };
  links: { search: string; orders: ClassNavItem; account: ClassNavItem };
};

export type ClassFooterProps = {
  storeName: string;
  phone: string | null;
  hours: string | null;
  legal: ReactNode;
  classes: FooterLink[];
  guide: FooterLink[];
  account: FooterLink[];
  terms: FooterLink[];
};

export type ClassListProps = {
  view: "classes" | "schedule";
  title: string;
  count: number | null;
  crumbs: CatalogLink[];
  tabs: CatalogTab[];
  sorts: CatalogLink[];
  classes: ClassCard[];
  sessions: Session[];
  links: { classes: string; schedule: string };
  query?: string | null;
  search?: ReactNode;
  emptyHref?: string;
};

export type ClassSections = { [K in SectionKind]?: ComponentType<SectionProps<K>> };

export type ClassDesign = {
  Header: ComponentType<ClassHeaderProps>;
  Footer: ComponentType<ClassFooterProps>;
  List: ComponentType<ClassListProps>;
  sections: ClassSections;
};

export type SessionView = {
  id: string;
  href: string;
  ymd: string | null;
  date: string;
  day: string | null;
  time: string;
  name: string;
  kind: string | null;
  length: string | null;
  count: string | null;
  image: string | null;
  price: string | null;
  full: boolean;
  few: boolean;
  seats: string;
};

export type DayCell = { ymd: string; month: number; date: number; weekday: string; count: number; past: boolean };

export type DayGroup = { ymd: string; label: string; sessions: Session[] };
