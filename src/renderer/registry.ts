import type { ComponentType } from "react";
import { CategoryMenu } from "../sections/category-menu";
import { FaqSection } from "../sections/faq";
import { Hero } from "../sections/hero";
import { ProductList } from "../sections/product-list";
import { BestGrid, ShopGuide } from "../sections/shop/defaults";
import { AddOns } from "../sections/stay/defaults";
import { Intro, Menu } from "../sections/place/defaults";
import { templateSections } from "../sections/template";
import type { Case, PlaceLink, QuoteFigures, QuoteStarter, Room, TemplateSectionData, Session } from "../sections/template/data";
import type { Row } from "../sections/kit";
import type { GridSpec } from "../templates/types";
import type { ShelfSetting } from "../sections/shop/shelf";
import type { Category, Faq, ProductSummary, Shipping } from "../types";

export type SiteContext = {
  products: ProductSummary[];
  categories: Category[];
  faqs: Faq[];
  shipping: Shipping | null;
  main?: string;
  storeName?: string;
  shelf?: ShelfSetting | null;
};

export type SectionData = {
  hero: {
    title?: string | null;
    sub?: string | null;
    href?: string | null;
    image?: string | null;
    images?: string[];
    products?: { id: string; name: string; list_price?: number; sale_price?: number; cover_url?: string | null; sold_out?: boolean; href?: string }[];
    facts?: { label: string; value: string }[];
    rooms?: Room[];
    sessions?: Session[];
    booking?: TemplateSectionData["booking_strip"];
    cases?: Case[];
    figures?: QuoteFigures;
    tiers?: Row[];
    request?: QuoteStarter;
    address?: string | null;
    kinds?: string[];
    trust_line?: TemplateSectionData["trust_line"];
    hours?: string | null;
    phone?: string | null;
    links?: PlaceLink[];
    intro?: TemplateSectionData["intro"];
  };
  product_grid: { count?: number };
  faq: Record<string, never>;
  category_menu: Record<string, never>;
} & TemplateSectionData;

export type SectionKind = keyof SectionData;

export type SectionProps<K extends SectionKind = SectionKind> = { data: SectionData[K]; context: SiteContext; variant?: string; grid?: GridSpec };

export const sections: { [K in SectionKind]: ComponentType<SectionProps<K>> } = {
  hero: Hero,
  product_grid: ProductList,
  faq: FaqSection,
  category_menu: CategoryMenu,
  best_grid: BestGrid,
  shop_guide: ShopGuide,
  add_ons: AddOns,
  menu: Menu,
  intro: Intro,
  ...templateSections,
};
