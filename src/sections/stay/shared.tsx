import type { Business } from "../../types";
import { dayLabel, won } from "../../utils/format";
import { legalLine } from "../shop/shared";
import type { FooterLink } from "../shop/types";
import { SOLD_OUT_TODAY, type AddOn, type Room } from "../template/data";
import type { AddOnView, RoomView, StayFooterProps, StayHeaderProps, StayNavItem } from "./types";

export const STAY_TITLE = {
  rooms: "객실",
  amenities: "편의시설",
  gallery: "갤러리",
  info: "이용 안내",
  times: "입실 · 퇴실",
  checkIn: "입실",
  checkOut: "퇴실",
  rules: "이용 규칙",
  cancel: "취소 · 환불 규정",
  location: "오시는 길",
  reviews: "리뷰",
  rates: "요금 안내",
  addOns: "부가 서비스",
  extra: "추가 인원(1박)",
  weekday: "주중",
  weekend: "주말",
  peak: "성수기 주중",
  peakWeekend: "성수기 주말",
  more: "전체 보기",
  view: "객실 보기",
  book: "예약하기",
  find: "예약 가능 객실 보기",
  change: "변경",
  dateIn: "체크인",
  dateOut: "체크아웃",
  guests: "인원",
  adults: "성인",
  children: "아동",
  pick: "날짜 선택",
  address: "주소",
  phone: "전화",
  center: "고객센터",
  map: "지도 보기",
  price: "요금",
  sample: "예시",
  guide: "안내",
  booking: "예약",
  bookingGuide: "예약 안내",
  account: "계정",
  support: "고객 지원",
  terms: "약관",
} as const;

export function stayDate(iso: string): string {
  return dayLabel(iso, "dot").replace(/ (\S+)$/, " ($1)");
}

export function stayDates(checkIn?: string | null, checkOut?: string | null): string | null {
  return checkIn && checkOut ? `${stayDate(checkIn)} – ${stayDate(checkOut)}` : null;
}

export const ROOMS_HREF = "/products";

export const RATES_HREF = "/products#rates";

const ANCHORS: { kind: string; label: string; href: string }[] = [
  { kind: "room_list", label: STAY_TITLE.rooms, href: ROOMS_HREF },
  { kind: "amenities", label: STAY_TITLE.amenities, href: "/#amenities" },
  { kind: "house_rules", label: STAY_TITLE.info, href: "/#rules" },
  { kind: "location", label: STAY_TITLE.location, href: "/#location" },
  { kind: "reviews", label: STAY_TITLE.reviews, href: "/#reviews" },
];

export function stayNav(kinds?: string[] | null): StayNavItem[] {
  return ANCHORS.filter((a) => a.kind === "room_list" || !kinds || kinds.includes(a.kind)).map(({ label, href }) => ({ label, href }));
}

export function stayLinks(signedIn?: boolean): StayHeaderProps["links"] {
  return {
    account: signedIn ? { label: "내 정보", href: "/me" } : { label: "로그인", href: "/login" },
    book: { label: STAY_TITLE.book, href: ROOMS_HREF },
  };
}

const LEGAL = new Set(["terms", "privacy"]);

export function stayFooter({
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
}): StayFooterProps {
  const nav = stayNav(kinds);
  const guide: FooterLink[] = [
    ...policies.filter((p) => !LEGAL.has(p.key)).map((p) => ({ label: p.key === "returns" ? STAY_TITLE.cancel : p.title, href: policyHref(p.key) })),
    { label: "1:1 문의", href: "/inquiries/new" },
    { label: "예약 조회", href: "/orders/lookup" },
  ];
  return {
    storeName,
    phone: business?.cs_phone ?? null,
    hours: hours ?? null,
    legal: legalLine(storeName, business, hosting),
    stay: [nav[0], { label: STAY_TITLE.rates, href: RATES_HREF }, ...nav.slice(1)],
    guide,
    account: [
      { label: "로그인", href: "/login" },
      { label: "회원가입", href: "/signup" },
      { label: "예약 내역", href: "/orders" },
    ],
    terms: policies.filter((p) => LEGAL.has(p.key)).map((p) => ({ label: p.title, href: policyHref(p.key), strong: p.key === "privacy" })),
  };
}

function quoteNote(room: Room): string | null {
  const stay = room.stay;
  if (!stay) return null;
  if (stay.state === "full") return "예약 마감";
  if (stay.state === "nights") return stay.nights < (room.min_nights ?? 1) ? `${room.min_nights}박부터` : `최대 ${room.max_nights}박`;
  if (stay.state === "guests") return `최대 ${room.max_guests}명`;
  return null;
}

export function roomView(room: Room): RoomView {
  const stay = room.stay;
  const rates = room.rates;
  const extra = (room.extra_adult_fee ?? 0) > 0 || (room.extra_child_fee ?? 0) > 0 ? `성인\u00a0${won(room.extra_adult_fee ?? 0)} · 아동\u00a0${won(room.extra_child_fee ?? 0)}` : null;
  return {
    id: room.id,
    href: room.href ?? `/products/${room.id}`,
    name: room.name,
    image: room.image ?? null,
    sample: Boolean(room.sample),
    guests: room.base_guests != null && room.max_guests != null ? `기준 ${room.base_guests}명 · 최대 ${room.max_guests}명` : null,
    times: room.check_in && room.check_out ? `${room.check_in} · ${room.check_out}` : null,
    from: room.price_from != null ? `1박 ${won(room.price_from)}~` : room.price,
    today: room.left === 0 ? SOLD_OUT_TODAY : null,
    minNights: (room.min_nights ?? 1) > 1 ? `${room.min_nights}박부터` : null,
    rates: rates
      ? {
          weekday: won(rates.weekday),
          weekend: won(rates.weekend),
          peak: rates.peak != null ? won(rates.peak) : null,
          peakWeekend: rates.peak_weekend != null ? won(rates.peak_weekend) : null,
        }
      : null,
    extra,
    quote: stay
      ? {
          price: won(stay.total),
          nights: `${stay.nights}박`,
          left: stay.state === "open" ? `남은 객실 ${stay.left}` : null,
          state: stay.state,
          note: quoteNote(room),
        }
      : null,
    book: room.book ?? null,
  };
}

const UNIT: Record<AddOn["unit"], string> = { stay: "1회", night: "1박", hour: "1시간" };

const PAY: Record<AddOn["pay_at"], string> = { online: "예약 시 결제", onsite: "현장 결제" };

export function addOnView(a: AddOn): AddOnView {
  return { name: a.name, price: `${won(a.price)}${a.vary ? "~" : ""}`, unit: UNIT[a.unit], pay: PAY[a.pay_at] };
}

export function sameExtra(rooms: Room[]): string | null {
  const views = rooms.map((r) => roomView(r).extra);
  return views.length && views.every((v) => v === views[0]) ? views[0] : null;
}

export function peakOf(rooms: Room[]): boolean {
  return rooms.some((r) => r.rates?.peak != null);
}

export function roomNotes(v: RoomView): string[] {
  const q = v.quote;
  const notes = q ? (q.state === "open" ? [q.left, v.minNights] : [q.note]) : [v.today, v.minNights];
  return [...new Set(notes.filter((t): t is string => Boolean(t)))];
}
