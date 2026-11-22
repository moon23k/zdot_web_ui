import type { Business } from "../../types";
import { legalLine } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import type { Case, QuoteFigures } from "../template/data";
import type { BusinessRow, CaseView, QuoteFooterProps, QuoteHeaderProps, QuoteNavItem } from "./types";

export const QUOTE_TITLE = {
  cases: "작업 사례",
  prices: "가격 안내",
  packages: "패키지",
  process: "진행 과정",
  reviews: "리뷰",
  faq: "자주 묻는 질문",
  request: "견적 요청",
  lookup: "견적 요청 조회",
  orders: "견적 내역",
  more: "전체 보기",
  view: "사례 보기",
  all: "전체",
  category: "분류",
  area: "지역 · 규모",
  scope: "작업 범위",
  case: "사례",
  center: "고객센터",
  hours: "운영 시간",
  business: "사업자 정보",
  closed: "지금은 견적 요청을 받지 않아요",
  login: "로그인",
  terms: "약관",
  guide: "안내",
  cancel: "취소 · 환불 규정",
  inquiry: "1:1 문의",
  includes: "포함",
} as const;

export const QUOTE_CONSENT = "[필수] 견적 상담을 위해 이름 · 휴대폰 번호 · 요청 내용을 수집하고, 상담이 끝난 뒤 1년간 보관합니다.";

export const CASES_HREF = "/cases";

export const QUOTE_HREF = "/quote";

export const LOOKUP_HREF = "/quote/lookup";

export function includesOf(item: { includes?: string[] } | null | undefined): string[] {
  return (item?.includes ?? []).map((line) => line.trim()).filter(Boolean);
}

export function reviewCount(count: number): string {
  return `${QUOTE_TITLE.reviews} ${count}`;
}

export function average(value: number): string {
  return value.toFixed(1);
}

export function hasFigures(f: QuoteFigures | undefined): boolean {
  return Boolean(f && (f.cases > 0 || f.reviews > 0));
}

const ANCHORS: { kind: string; label: string; href: string }[] = [
  { kind: "case_grid", label: QUOTE_TITLE.cases, href: CASES_HREF },
  { kind: "price_tiers", label: QUOTE_TITLE.prices, href: "/#prices" },
  { kind: "package_cards", label: QUOTE_TITLE.packages, href: "/#packages" },
  { kind: "process_steps", label: QUOTE_TITLE.process, href: "/#process" },
  { kind: "reviews", label: QUOTE_TITLE.reviews, href: "/#reviews" },
  { kind: "faq", label: QUOTE_TITLE.faq, href: "/#faq" },
];

export function quoteNav(kinds?: string[] | null): QuoteNavItem[] {
  return ANCHORS.filter((a) => a.kind === "case_grid" || !kinds || kinds.includes(a.kind)).map(({ label, href }) => ({ label, href }));
}

export function quoteLinks(signedIn?: boolean): QuoteHeaderProps["links"] {
  return {
    lookup: { label: QUOTE_TITLE.lookup, href: LOOKUP_HREF },
    request: { label: QUOTE_TITLE.request, href: QUOTE_HREF },
    account: signedIn ? { label: "내 정보", href: "/me" } : { label: QUOTE_TITLE.login, href: "/login" },
  };
}

export function businessRows(storeName: string, business: Business | null, hosting: string): BusinessRow[] {
  const rows: [string, string | null | undefined][] = [
    ["상호", business?.name || storeName],
    ["대표", business?.ceo_name],
    ["사업자등록번호", business?.registration_no],
    ["통신판매업 신고", business?.mail_order_no],
    ["주소", business?.address],
    ["이메일", business?.cs_email],
    ["호스팅 제공", hosting],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1])).map(([label, value]) => ({ label, value }));
}

const LEGAL = new Set(["terms", "privacy"]);

export function quoteFooter({
  storeName,
  business,
  hosting,
  policies,
  hours,
  policyHref,
  kinds,
}: {
  storeName: string;
  business: Business | null;
  hosting: string;
  policies: { key: string; title: string }[];
  hours?: string | null;
  policyHref: (key: string) => string;
  kinds?: string[] | null;
}): QuoteFooterProps {
  const guide: FooterLink[] = [
    ...policies.filter((p) => !LEGAL.has(p.key)).map((p) => ({ label: p.key === "returns" ? QUOTE_TITLE.cancel : p.title, href: policyHref(p.key) })),
    { label: QUOTE_TITLE.inquiry, href: "/inquiries/new" },
  ];
  return {
    storeName,
    phone: business?.cs_phone ?? null,
    hours: hours ?? null,
    legal: legalLine(storeName, business, hosting),
    business: businessRows(storeName, business, hosting),
    nav: [...quoteNav(kinds), { label: QUOTE_TITLE.lookup, href: LOOKUP_HREF }],
    guide,
    account: [
      { label: QUOTE_TITLE.login, href: "/login" },
      { label: QUOTE_TITLE.orders, href: LOOKUP_HREF },
    ],
    terms: policies.filter((p) => LEGAL.has(p.key)).map((p) => ({ label: p.title, href: policyHref(p.key), strong: p.key === "privacy" })),
  };
}

export function caseView(c: Case): CaseView {
  const category = c.category?.trim() || null;
  const area = c.meta?.trim() || null;
  const scope = c.scope?.trim() || null;
  const pairs: [string, string | null][] = [
    [QUOTE_TITLE.category, category],
    [QUOTE_TITLE.area, area],
    [QUOTE_TITLE.scope, scope],
  ];
  const facts = pairs.filter((f): f is [string, string] => Boolean(f[1])).map(([label, value]) => ({ label, value }));
  return {
    id: c.id,
    href: c.href ?? `${CASES_HREF}/${c.id}`,
    title: c.title,
    image: c.image ?? null,
    category,
    area,
    scope,
    facts,
    line: [category, area].filter(Boolean).join(" · "),
  };
}

export function leadCase(cases: Case[] | undefined): Case | null {
  const first = cases?.[0];
  return first?.image ? first : null;
}

export function restCases(cases: Case[] | undefined): Case[] {
  const list = cases ?? [];
  return leadCase(list) && list.length >= 2 ? list.slice(1) : list;
}
