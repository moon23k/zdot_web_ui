import type { ProductSummary } from "../../types";
import type { Row, Status } from "../kit";

export type Tile = { title: string; image?: string | null; href?: string; price?: string | null };

export type Session = {
  id: string;
  date: string;
  day?: string;
  time: string;
  name: string;
  length?: string;
  image?: string | null;
  status: Status;
  seats_left?: number | null;
  price?: string;
  href?: string;
  ymd?: string;
  kind?: string | null;
};

export type ClassCard = { id: string; name: string; image?: string | null; chips?: string[]; price?: string; next?: string; href?: string; kind?: string | null; length?: string | null; capacity?: number | null; left?: number | null };

export type RoomRates = { weekday: number; weekend: number; peak?: number | null; peak_weekend?: number | null };

export type RoomStay = { nights: number; total: number; left: number; state: "open" | "nights" | "guests" | "full" };

export type Room = {
  id: string;
  name: string;
  image?: string | null;
  specs: string[];
  price: string;
  amount?: string;
  unit?: string;
  left?: number | null;
  href?: string;
  sample?: boolean;
  base_guests?: number;
  max_guests?: number;
  check_in?: string;
  check_out?: string;
  price_from?: number;
  min_nights?: number;
  max_nights?: number;
  extra_adult_fee?: number;
  extra_child_fee?: number;
  rates?: RoomRates | null;
  stay?: RoomStay | null;
  book?: string | null;
};

export type AddOn = { name: string; price: number; vary?: boolean; unit: "stay" | "night" | "hour"; pay_at: "online" | "onsite" };

export type CancelData = { rows?: Row[]; groups?: { title: string; rows: Row[] }[] };

export const SOLD_OUT_TODAY = "오늘 마감";

export type Case = { id: string; title: string; image?: string | null; meta?: string; scope?: string; href?: string };

export type Review = { rating: number; body: string; name: string; date?: string; product?: string | null };

export type TemplateSectionData = {
  photo_band: { image?: string | null; images?: string[] };
  category_tiles: { items?: Tile[] };
  testimonial: { quote?: string | null; name?: string | null; count?: number | null; average?: number | null; items?: Review[]; image?: string | null };
  intro: { images?: string[] };
  curation: { items?: Tile[]; image?: string | null };
  best_grid: { items?: ProductSummary[] };
  shop_guide: { phone?: string | null; hours?: string | null; returns?: string | null; inquiry?: string | null };
  store_info: { title?: string | null; address?: string | null; hours?: string | null; phone?: string | null; image?: string | null };
  reviews: { average?: number | null; count?: number | null; items?: Review[] };
  trust_line: { items?: string[] };
  process_steps: { steps?: string[] };
  numbers: { items?: { value: string; label: string }[] };
  class_schedule: { sessions?: Session[] };
  class_list: { classes?: ClassCard[] };
  gates: { items?: Tile[] };
  booking_strip: { price?: string | null; href?: string | null; check_in?: string | null; check_out?: string | null; guests?: string | null; max?: number | null };
  gallery: { images?: string[] };
  amenities: { items?: { name: string; group?: string }[] };
  house_rules: { check_in?: string | null; check_out?: string | null; rules?: string[]; cancel?: CancelData };
  pay_plan: CancelData;
  location: { address?: string | null; note?: string | null; href?: string | null; phone?: string | null; hours?: string | null; cancel?: string | null; returns?: string | null };
  add_ons: { items?: AddOn[]; image?: string | null };
  room_list: { rooms?: Room[] };
  price_tiers: { items?: Row[] };
  package_cards: { tabs?: string[]; items?: { name: string; price: string; image?: string | null; includes?: string[]; href?: string }[] };
  case_grid: { categories?: string[]; cases?: Case[] };
  case_cards: { categories?: string[]; cases?: Case[] };
};
