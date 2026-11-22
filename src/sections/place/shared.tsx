import type { Business } from "../../types";
import { businessRows } from "../quote/shared";
import { legalLine } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import type { MenuGroup, MenuItem, PlaceLink } from "../template/data";
import type { PlaceFooterProps, PlaceNavItem } from "./types";

export const PLACE_TITLE = {
  intro: "소개",
  menu: "메뉴",
  store: "매장 안내",
  location: "오시는 길",
  faq: "자주 묻는 질문",
  address: "주소",
  hours: "영업시간",
  phone: "전화",
  call: "전화하기",
  directions: "길 찾기",
  business: "사업자 정보",
  terms: "약관",
  links: "링크",
  all: "전체",
} as const;

export const PLACE_ID = {
  intro: "intro",
  menu: "menu",
  store: "store",
  location: "location",
  faq: "faq",
} as const;

export type StoreLinks = { kakao_channel?: string | null; naver_booking?: string | null; instagram?: string | null };

const LINKS: { key: keyof StoreLinks; label: string }[] = [
  { key: "naver_booking", label: "네이버 예약" },
  { key: "kakao_channel", label: "카카오톡 채널" },
  { key: "instagram", label: "인스타그램" },
];

export function placeLinks(links: StoreLinks | null | undefined): PlaceLink[] {
  return LINKS.flatMap(({ key, label }) => {
    const href = links?.[key]?.trim();
    return href ? [{ key, label, href }] : [];
  });
}

const ANCHORS: { kind: string; label: string; href: string }[] = [
  { kind: "intro", label: PLACE_TITLE.intro, href: `/#${PLACE_ID.intro}` },
  { kind: "menu", label: PLACE_TITLE.menu, href: `/#${PLACE_ID.menu}` },
  { kind: "store_info", label: PLACE_TITLE.store, href: `/#${PLACE_ID.store}` },
  { kind: "location", label: PLACE_TITLE.location, href: `/#${PLACE_ID.location}` },
  { kind: "faq", label: PLACE_TITLE.faq, href: `/#${PLACE_ID.faq}` },
];

export function placeNav(kinds?: string[] | null): PlaceNavItem[] {
  return ANCHORS.filter((a) => !kinds || kinds.includes(a.kind)).map(({ label, href }) => ({ label, href }));
}

export function menuItems(groups: MenuGroup[] | undefined): MenuItem[] {
  return (groups ?? []).flatMap((g) => g.items);
}

export function paragraphs(body: string | null | undefined): string[] {
  return (body ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

const LEGAL = new Set(["terms", "privacy"]);

export function placeFooter({
  storeName,
  business,
  hosting,
  policies,
  hours,
  address,
  links,
  policyHref,
  kinds,
}: {
  storeName: string;
  business: Business | null;
  hosting: string;
  policies: { key: string; title: string }[];
  hours?: string | null;
  address?: string | null;
  links?: PlaceLink[] | null;
  policyHref: (key: string) => string;
  kinds?: string[] | null;
}): PlaceFooterProps {
  const terms: FooterLink[] = policies.filter((p) => LEGAL.has(p.key)).map((p) => ({ label: p.title, href: policyHref(p.key), strong: p.key === "privacy" }));
  return {
    storeName,
    phone: business?.cs_phone ?? null,
    hours: hours ?? null,
    address: address ?? business?.address ?? null,
    legal: legalLine(storeName, business, hosting),
    business: businessRows(storeName, business, hosting),
    nav: placeNav(kinds),
    links: links ?? [],
    terms,
  };
}
