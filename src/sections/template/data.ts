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
};

export type ClassCard = { id: string; name: string; image?: string | null; chips?: string[]; price?: string; next?: string; href?: string };

export type Room = { id: string; name: string; image?: string | null; specs: string[]; price: string; amount?: string; unit?: string; left?: number | null; href?: string; sample?: boolean };

export const SOLD_OUT_TODAY = "오늘 마감";

export function roomLeft(room: Room | null | undefined): { out: boolean; few: boolean; text: string | null } {
  const left = room?.left;
  const few = left != null && left > 0 && left <= 3;
  return { out: left === 0, few, text: few ? `${left}객실 남음` : null };
}

export type Case = { id: string; title: string; image?: string | null; meta?: string; scope?: string; href?: string };

export type Review = { rating: number; body: string; name: string; date?: string; product?: string | null };

export type TemplateSectionData = {
  photo_band: { image?: string | null; images?: string[] };
  category_tiles: { items?: Tile[] };
  testimonial: { quote?: string | null; name?: string | null; count?: number | null; items?: Review[] };
  intro: { images?: string[] };
  curation: { items?: Tile[] };
  store_info: { title?: string | null; address?: string | null; hours?: string | null; phone?: string | null; image?: string | null };
  reviews: { average?: number | null; count?: number | null; items?: Review[] };
  trust_line: { items?: string[] };
  process_steps: { steps?: string[] };
  numbers: { items?: { value: string; label: string }[] };
  class_schedule: { sessions?: Session[] };
  class_list: { classes?: ClassCard[] };
  gates: { items?: Tile[] };
  search_bar: { href?: string | null; check_in?: string | null; check_out?: string | null; guests?: string | null; price?: string | null };
  booking_strip: { price?: string | null; href?: string | null; check_in?: string | null; check_out?: string | null; guests?: string | null };
  gallery: { images?: string[] };
  amenities: { items?: { name: string; group?: string }[] };
  house_rules: { check_in?: string | null; check_out?: string | null; rules?: string[] };
  pay_plan: { rows?: Row[]; groups?: { title: string; rows: Row[] }[] };
  location: { address?: string | null; note?: string | null; href?: string | null };
  room_list: { rooms?: Room[] };
  room_box: { names?: string[]; image?: string | null; href?: string | null; rooms?: Room[]; price?: string | null };
  price_tiers: { items?: Row[] };
  package_cards: { tabs?: string[]; items?: { name: string; price: string; image?: string | null; includes?: string[]; href?: string }[] };
  case_grid: { categories?: string[]; cases?: Case[] };
  case_cards: { categories?: string[]; cases?: Case[] };
};
