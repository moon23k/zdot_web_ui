import type { ComponentType, ReactNode } from "react";
import type { CatalogLink } from "../../blocks/catalog-view/classic";
import type { SectionKind, SectionProps } from "../../renderer/registry";
import type { FooterLink } from "../shop/types";
import type { AddOn, Room, TemplateSectionData } from "../template/data";

export type BookingData = TemplateSectionData["booking_strip"];

export type StayNavItem = { label: string; href: string };

export type StayHeaderProps = {
  name: string;
  logoUrl?: string | null;
  signedIn?: boolean;
  nav: StayNavItem[];
  links: { account: StayNavItem; book: StayNavItem };
};

export type StayFooterProps = {
  storeName: string;
  phone: string | null;
  hours: string | null;
  legal: ReactNode;
  stay: FooterLink[];
  guide: FooterLink[];
  account: FooterLink[];
  terms: FooterLink[];
};

export type StaySearch = { check_in: string | null; check_out: string | null; adults: number; children: number; max: number };

export type StayListProps = {
  title: string;
  count: number;
  crumbs: CatalogLink[];
  search: StaySearch;
  rooms: Room[];
  peak: boolean;
  addOns: AddOn[];
  photo?: string | null;
};

export type StaySections = { [K in SectionKind]?: ComponentType<SectionProps<K>> };

export type StayDesign = {
  Header: ComponentType<StayHeaderProps>;
  Footer: ComponentType<StayFooterProps>;
  List: ComponentType<StayListProps>;
  sections: StaySections;
};

export type QuoteView = { price: string; nights: string; left: string | null; state: "open" | "nights" | "guests" | "full"; note: string | null };

export type RoomView = {
  id: string;
  href: string;
  name: string;
  image: string | null;
  sample: boolean;
  guests: string | null;
  times: string | null;
  from: string;
  today: string | null;
  minNights: string | null;
  rates: { weekday: string; weekend: string; peak: string | null; peakWeekend: string | null } | null;
  extra: string | null;
  quote: QuoteView | null;
  book: string | null;
};

export type AddOnView = { name: string; price: string; unit: string; pay: string };
