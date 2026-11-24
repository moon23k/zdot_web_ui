import type { NavCategory } from "../../blocks/site-header/header-nav";
import type { Business } from "../../types";
import { legalLine } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import type { Session } from "../template/data";
import type { ClassFooterProps, ClassHeaderProps, ClassNavItem, SessionView } from "./types";

export const CLASS_TITLE = {
  classes: "클래스",
  all: "전체 클래스",
  schedule: "다가오는 일정",
  scheduleShort: "일정",
  open: "모집 중인 일정",
  nearest: "가장 가까운 일정",
  next: "다음 일정",
  nextCohort: "다음 개강",
  reviews: "후기",
  location: "오시는 길",
  faq: "자주 묻는 질문",
  more: "전체 보기",
  scheduleAll: "일정 전체 보기",
  view: "클래스 보기",
  book: "예약하기",
  full: "마감",
  cancel: "예약 변경 · 취소",
  center: "고객센터",
  address: "주소",
  hours: "운영 시간",
  phone: "전화",
  map: "길 찾기",
  kinds: "종류",
  orders: "예약 내역",
  search: "클래스 검색",
  length: "소요",
  count: "회차",
  capacity: "정원",
} as const;

export const CLASSES_HREF = "/classes";

export const SCHEDULE_HREF = "/classes?view=schedule";

const ANCHORS: { kinds: string[]; label: string; href: string }[] = [
  { kinds: ["class_schedule"], label: CLASS_TITLE.scheduleShort, href: "/#schedule" },
  { kinds: ["reviews", "testimonial"], label: CLASS_TITLE.reviews, href: "/#reviews" },
  { kinds: ["location"], label: CLASS_TITLE.location, href: "/#location" },
];

export function classKindHref(id: string): string {
  return `${CLASSES_HREF}?category=${encodeURIComponent(id)}`;
}

export function classNav(kinds?: string[] | null, categories?: NavCategory[] | null): ClassHeaderProps["nav"] {
  const anchors = ANCHORS.filter((a) => !kinds || a.kinds.some((k) => kinds.includes(k))).map(({ label, href }) => ({ label, href }));
  return {
    classes: { label: CLASS_TITLE.classes, href: CLASSES_HREF },
    kinds: (categories ?? []).slice(0, 4).map((c) => ({ label: c.name, href: classKindHref(c.id) })),
    anchors: anchors.length ? anchors : [{ label: CLASS_TITLE.scheduleShort, href: SCHEDULE_HREF }],
  };
}

export function classLinks(signedIn?: boolean): ClassHeaderProps["links"] {
  const account: ClassNavItem = signedIn ? { label: "내 정보", href: "/me" } : { label: "로그인", href: "/login" };
  return { search: CLASSES_HREF, orders: { label: CLASS_TITLE.orders, href: signedIn ? "/orders" : "/orders/lookup" }, account };
}

const LEGAL = new Set(["terms", "privacy"]);

export function classFooter({
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
}): ClassFooterProps {
  const reviews = !kinds || kinds.includes("reviews") || kinds.includes("testimonial");
  const guide: FooterLink[] = [
    ...policies.filter((p) => !LEGAL.has(p.key)).map((p) => ({ label: p.key === "returns" ? CLASS_TITLE.cancel : p.title, href: policyHref(p.key) })),
    { label: "1:1 문의", href: "/inquiries/new" },
    { label: "예약 조회", href: "/orders/lookup" },
  ];
  return {
    storeName,
    phone: business?.cs_phone ?? null,
    hours: hours ?? null,
    legal: legalLine(storeName, business, hosting),
    classes: [
      { label: CLASS_TITLE.all, href: CLASSES_HREF },
      { label: CLASS_TITLE.scheduleShort, href: SCHEDULE_HREF },
      ...(reviews ? [{ label: CLASS_TITLE.reviews, href: "/#reviews" }] : []),
    ],
    guide,
    account: [
      { label: "로그인", href: "/login" },
      { label: "회원가입", href: "/signup" },
      { label: CLASS_TITLE.orders, href: "/orders" },
    ],
    terms: policies.filter((p) => LEGAL.has(p.key)).map((p) => ({ label: p.title, href: policyHref(p.key), strong: p.key === "privacy" })),
  };
}

const WEEKDAY = "일월화수목금토";

function stamp(s: Session): { date: string; day: string | null } {
  if (!s.ymd) return { date: s.date, day: s.day && !s.date.includes(s.day) ? s.day : null };
  const [, m, d] = s.ymd.split("-");
  return { date: `${Number(m)}.${d}`, day: WEEKDAY[new Date(`${s.ymd}T00:00:00Z`).getUTCDay()] };
}

export function sessionView(s: Session): SessionView {
  const full = s.status === "full";
  const when = stamp(s);
  const few = !full && s.seats_left != null && s.seats_left > 0 && s.seats_left <= 2;
  return {
    id: s.id,
    href: s.href ?? CLASSES_HREF,
    ymd: s.ymd ?? null,
    date: when.date,
    day: when.day,
    time: s.time,
    name: s.name,
    kind: s.kind ?? null,
    length: s.length ?? null,
    count: s.count && s.count > 1 ? `${CLASS_TITLE.count} ${s.count}회` : null,
    image: s.image ?? null,
    price: s.price ?? null,
    full,
    few,
    seats: full ? CLASS_TITLE.full : s.seats_left != null ? `남은 자리 ${s.seats_left}` : "",
  };
}

export function bookable(sessions: Session[] | undefined): Session[] {
  return (sessions ?? []).filter((s) => s.status !== "full");
}

export function mapHref(address: string): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(address)}`;
}
