import type { Business } from "../../types";
import { businessRows } from "../quote/shared";
import { legalLine } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import type { MenuGroup, MenuItem, PlaceLink } from "../template/data";
import type { LandingAnchor, LandingFooterProps, LandingNavItem } from "./types";

export const LANDING_LABEL = {
  address: "주소",
  hours: "영업시간",
  phone: "전화",
  call: "전화하기",
  book: "예약하기",
  consult: "상담 문의",
  directions: "길 찾기",
  business: "사업자 정보",
  terms: "약관",
  links: "링크",
  all: "전체",
} as const;

export type StoreLinks = { kakao_channel?: string | null; naver_booking?: string | null; instagram?: string | null };

const LINKS: { key: keyof StoreLinks; label: string }[] = [
  { key: "naver_booking", label: "네이버 예약" },
  { key: "kakao_channel", label: "카카오톡 채널" },
  { key: "instagram", label: "인스타그램" },
];

const BOOKING = new Set<string>(["naver_booking", "kakao_channel"]);

export function landingLinks(links: StoreLinks | null | undefined): PlaceLink[] {
  return LINKS.flatMap(({ key, label }) => {
    const href = links?.[key]?.trim();
    return href ? [{ key, label, href }] : [];
  });
}

export function bookingLink(links: PlaceLink[] | null | undefined): PlaceLink | null {
  return (links ?? []).find((l) => BOOKING.has(l.key)) ?? null;
}

export function anchorNav(anchors: LandingAnchor[], kinds?: string[] | null): LandingNavItem[] {
  return anchors.filter((a) => !kinds || kinds.includes(a.kind)).map(({ label, href }) => ({ label, href }));
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

export function caseHref(id: string): string {
  return `/cases/${encodeURIComponent(id)}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

const LEGAL = new Set(["terms", "privacy"]);

export type LandingFooterInput = {
  storeName: string;
  business: Business | null;
  hosting: string;
  policies: { key: string; title: string }[];
  hours?: string | null;
  address?: string | null;
  links?: PlaceLink[] | null;
  policyHref: (key: string) => string;
  nav: LandingNavItem[];
};

export function landingFooter({ storeName, business, hosting, policies, hours, address, links, policyHref, nav }: LandingFooterInput): LandingFooterProps {
  const terms: FooterLink[] = policies.filter((p) => LEGAL.has(p.key)).map((p) => ({ label: p.title, href: policyHref(p.key), strong: p.key === "privacy" }));
  return {
    storeName,
    phone: business?.cs_phone ?? null,
    hours: hours ?? null,
    address: address ?? business?.address ?? null,
    legal: legalLine(storeName, business, hosting),
    business: businessRows(storeName, business, hosting),
    nav,
    links: links ?? [],
    terms,
  };
}
