import type { DetailData } from "../../details/data";
import type { TemplateMain } from "../../templates/types";
import type { Design, Section } from "../../types";
import type { AddOn, Case, ClassCard, MenuGroup, MenuItem, QuoteFigures, QuoteStarter, Room, Session } from "../../sections/template/data";
import products from "./products.json";

const s = (kind: string, data: Record<string, unknown>): Section => ({ kind, v: 1, data });

const reviews = {
  average: 4.9,
  count: 128,
  items: [
    { rating: 5, body: "포장이 꼼꼼하고 설명대로였어요.", name: "김*희", date: "11월 2일" },
    { rating: 5, body: "두 번째 주문인데 이번에도 만족해요.", name: "이*준", date: "10월 28일" },
    { rating: 4, body: "생각보다 빨리 받았어요.", name: "박*아", date: "10월 21일" },
  ],
};

const pay = [
  { label: "예약금 · 지금", value: "50%" },
  { label: "잔금 · 7일 전", value: "50%" },
  { label: "7일 전 취소", value: "전액 환불" },
  { label: "3일 전 취소", value: "50% 환불" },
];

const rate = (weekday: number, weekend: number, peak: number, peak_weekend: number) => ({ weekday, weekend, peak, peak_weekend });

const room = (id: string, name: string, base: number, max: number, from: number, rates: ReturnType<typeof rate>, extra: number, more: Partial<Room> = {}): Room => ({
  id,
  name,
  image: `/sample/${id}.jpg`,
  specs: [],
  price: `1박 ${from.toLocaleString("ko-KR")}원부터`,
  href: `/products/${id}`,
  left: 1,
  base_guests: base,
  max_guests: max,
  check_in: "15:00",
  check_out: "11:00",
  price_from: from,
  min_nights: 1,
  max_nights: 7,
  extra_adult_fee: extra,
  extra_child_fee: extra ? 20000 : 0,
  rates,
  ...more,
});

export const stayRooms: Room[] = [
  room("p1", "본채", 4, 6, 280000, rate(280000, 340000, 380000, 440000), 30000),
  room("p2", "별채", 2, 4, 180000, rate(180000, 220000, 250000, 290000), 30000),
  room("p3", "다락방", 2, 2, 140000, rate(140000, 170000, 190000, 220000), 0, { left: 0 }),
  room("p4", "정원방", 2, 3, 160000, rate(160000, 195000, 220000, 250000), 30000, { min_nights: 2 }),
];

export const stayAddOns: AddOn[] = [
  { name: "바비큐 그릴", price: 30000, unit: "stay", pay_at: "onsite" },
  { name: "조식", price: 15000, unit: "stay", pay_at: "online" },
  { name: "장작", price: 20000, unit: "stay", pay_at: "onsite" },
];

export const staySearched: Room[] = stayRooms.map((r, i) => ({
  ...r,
  stay: [
    { nights: 1, total: 340000, left: 1, state: "open" as const },
    { nights: 1, total: 220000, left: 2, state: "open" as const },
    { nights: 1, total: 170000, left: 0, state: "full" as const },
    { nights: 1, total: 195000, left: 1, state: "nights" as const },
  ][i],
  book: i < 2 ? `${r.href}?check_in=2026-12-12&check_out=2026-12-13&adults=2&children=0` : null,
}));

const sessions = [
  { id: "s1", date: "11월 9일 토", time: "10:30", name: "물레 입문", length: "3시간", status: "few" as const, seats_left: 2, href: "#" },
  { id: "s2", date: "11월 16일 토", time: "10:30", name: "물레 입문", length: "3시간", status: "open" as const, href: "#" },
  { id: "s3", date: "11월 23일 토", time: "14:00", name: "핸드빌딩", length: "2시간", status: "full" as const, href: "#" },
];

const YMD = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" });

const dayAt = (offset: number) => YMD.format(new Date(Date.now() + offset * 86400000));

const label = (ymd: string) => {
  const [, m, d] = ymd.split("-").map(Number);
  return `${m}월 ${d}일`;
};

const weekday = (ymd: string) => "일월화수목금토"[new Date(`${ymd}T00:00:00Z`).getUTCDay()];

const slot = (offset: number, time: string, name: string, kind: string, length: string, seats: number, image: string, price: string, id: string): Session => {
  const ymd = dayAt(offset);
  return { id, ymd, date: label(ymd), day: weekday(ymd), time, name, kind, length, image, price, href: "#", status: seats === 0 ? "full" : seats <= 3 ? "few" : "open", seats_left: seats };
};

export const classSessions: Session[] = [
  slot(1, "14:00", "물레 원데이 클래스", "원데이", "120분", 3, "/sample/p1.jpg", "65,000원", "s1"),
  slot(2, "19:30", "핸드빌딩 컵 만들기", "원데이", "90분", 5, "/sample/p2.jpg", "48,000원", "s2"),
  slot(2, "11:00", "접시 페인팅", "원데이", "90분", 0, "/sample/p3.jpg", "42,000원", "s3"),
  slot(4, "11:00", "물레 원데이 클래스", "원데이", "120분", 1, "/sample/p1.jpg", "65,000원", "s4"),
  slot(4, "15:00", "커플 물레 체험", "원데이", "120분", 2, "/sample/p4.jpg", "120,000원", "s5"),
  slot(9, "19:30", "물레 정규반 4주", "정규반", "4회", 2, "/sample/p2.jpg", "240,000원", "s6"),
];

export const classCards: ClassCard[] = [
  { id: "k1", name: "물레 원데이 클래스", image: "/sample/p1.jpg", price: "65,000원", next: "다음 수업 11월 24일 화 14:00", href: "#", kind: "원데이", length: "120분", capacity: 6, left: 3 },
  { id: "k2", name: "핸드빌딩 컵 만들기", image: "/sample/p2.jpg", price: "48,000원", next: "다음 수업 11월 25일 수 19:30", href: "#", kind: "원데이", length: "90분", capacity: 6, left: 5 },
  { id: "k3", name: "물레 정규반 4주", image: "/sample/p4.jpg", price: "240,000원", next: "다음 수업 12월 2일 화 19:30", href: "#", kind: "정규반", length: "120분", capacity: 6, left: 2 },
];

export const paletteDesign: Design = {
  color: {
    primary: "#B64C2F",
    on_primary: "#FFFFFF",
    primary_hover: "#963E27",
    primary_tint: "#F7E6D8",
    primary_border: "#EBC9B9",
    secondary: "#FACCB6",
    accent: "#601000",
    on_accent: "#FFFFFF",
    surface: "#FDF3E7",
    surface_alt: "#FCE5D6",
    text: "#1A0D03",
    text_muted: "#695E53",
  },
  palette: { color: "09-C03", harmony: "tonal" },
};

const quoteCase = (n: number, title: string, category: string, meta: string, scope: string): Case => ({ id: `cas_${n}`, title, category, meta, scope, image: `/sample/p${(n % 4) + 1}.jpg`, href: `/cases/cas_${n}` });

export const quoteCases: Case[] = [
  quoteCase(1, "아파트 32평 전체 리모델링", "아파트", "서울 성동구 · 32평", "전체 리모델링"),
  quoteCase(2, "주방 · 다이닝 부분 시공", "부분 시공", "경기 성남시 · 24평", "주방 · 조명"),
  quoteCase(3, "신혼집 아파트 24평", "아파트", "서울 마포구 · 24평", "전체 리모델링"),
  quoteCase(4, "단독주택 욕실 · 현관", "주택", "경기 양평군 · 40평", "욕실 · 현관"),
  quoteCase(5, "아파트 45평 거실 확장", "아파트", "서울 송파구 · 45평", "거실 · 주방"),
  quoteCase(6, "주택 서재 · 작업실", "주택", "서울 종로구 · 18평", "가구 제작 · 조명"),
  quoteCase(7, "카페 12평 인테리어", "상가", "서울 용산구 · 12평", "전체 시공"),
  quoteCase(8, "아파트 28평 현관 · 복도", "아파트", "인천 연수구 · 28평", "현관 · 수납"),
];

export const quoteFigures: QuoteFigures = { cases: 8, average: 4.9, reviews: 128 };

export const quoteTiers = [
  { label: "부분 시공", value: "3,000,000원" },
  { label: "20평대 전체", value: "24,000,000원" },
  { label: "30평대 전체", value: "36,000,000원" },
  { label: "40평대 전체", value: "48,000,000원" },
];

export const quoteIncludes: string[][] = [
  ["주방 · 욕실 · 현관 중 선택", "철거 · 설비 · 마감", "기간 1~2주"],
  ["전체 철거 · 목공 · 마감", "주방 · 욕실 교체"],
  ["전체 철거 · 목공 · 마감", "주방 · 욕실 2곳 교체", "기간 5~6주"],
  [],
];

export const quoteStarter: QuoteStarter = {
  open: true,
  href: "/quote",
  questions: [
    { id: "space", label: "공간", options: ["아파트", "빌라 · 주택", "상가 · 사무실", "기타"] },
    { id: "size", label: "평수", options: ["10평 이하", "10~20평", "20~30평", "30~40평", "40평 이상"] },
    { id: "budget", label: "예산", options: ["상담 후 결정", "50만 원 이하", "50~100만 원", "100~300만 원", "300만 원 이상"] },
  ],
  rest: ["공사 범위", "희망 날짜", "지역", "요청 사항", "이름", "휴대폰 번호", "사진"],
  phone: "02-000-0000",
  hours: "평일 10:00 – 18:00",
  rating: { average: 4.9, count: 128 },
};

export const placeIntro = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const menuItem = (id: string, name: string, price: string, category: string, image: string | null = null): MenuItem => ({ id, name, price, category, image });

export const placeMenu: MenuGroup[] = [
  { id: "c1", name: "찌개·찜", items: [menuItem("m1", "김치찌개", "9,000원", "찌개·찜", "/sample/p1.jpg"), menuItem("m2", "된장찌개", "9,000원", "찌개·찜"), menuItem("m3", "순두부찌개", "9,000원", "찌개·찜")] },
  { id: "c2", name: "국밥·탕", items: [menuItem("m4", "돼지국밥", "9,500원", "국밥·탕", "/sample/p2.jpg"), menuItem("m5", "감자탕", "35,000원", "국밥·탕")] },
  { id: "c3", name: "밥·구이", items: [menuItem("m6", "제육볶음", "10,000원", "밥·구이", "/sample/p3.jpg"), menuItem("m7", "비빔밥", "9,500원", "밥·구이"), menuItem("m8", "불고기", "13,000원", "밥·구이")] },
];

export const careMenu: MenuGroup[] = [
  { id: "k1", name: "헤어컷", items: [menuItem("t1", "여자 커트", "25,000원", "헤어컷", "/sample/p1.jpg"), menuItem("t2", "남자 커트", "15,000원", "헤어컷")] },
  { id: "k2", name: "펌·매직", items: [menuItem("t3", "C컬펌", "120,000원", "펌·매직"), menuItem("t4", "볼륨매직", "150,000원", "펌·매직")] },
  { id: "k3", name: "염색·케어", items: [menuItem("t5", "뿌리염색", "50,000원", "염색·케어"), menuItem("t6", "클리닉", "40,000원", "염색·케어", "/sample/p2.jpg")] },
];

export const officeServices: MenuGroup[] = [
  { id: null, name: null, items: [menuItem("v1", "입주 청소", "400,000원", ""), menuItem("v2", "이사 청소", "350,000원", ""), menuItem("v3", "사무실 청소", "200,000원", ""), menuItem("v4", "줄눈 시공", "150,000원", "")] },
];

export const officeCompany = [
  { label: "상호", value: "스토어 이름" },
  { label: "대표", value: "김대표" },
  { label: "주소", value: "서울특별시 00구 00로 00" },
  { label: "전화", value: "02-000-0000" },
];

export const placeStoreLinks = { naver_booking: "https://booking.naver.com", instagram: "https://instagram.com" };

export const placeInfo = {
  address: "서울특별시 00구 00로 00",
  hours: "매일 11:00 – 21:00 · 브레이크 타임 15:00 – 17:00",
  phone: "02-000-0000",
  href: "#",
  links: [
    { key: "naver_booking", label: "네이버 예약", href: "https://booking.naver.com" },
    { key: "instagram", label: "인스타그램", href: "https://instagram.com" },
  ],
};

export const homeSections: Record<TemplateMain, Section[]> = {
  shop: [
    s("hero", {
      image: "/sample/hero.jpg",
      products: [
        { id: "p1", name: "자몽청 500ml", sale_price: 18000, cover_url: "/sample/p1.jpg" },
        { id: "p2", name: "유자청 500ml", sale_price: 18000, cover_url: "/sample/p2.jpg" },
      ],
    }),
    s("product_grid", {}),
    s("testimonial", { quote: "선물했더니 어디서 샀냐는 말을 세 번 들었어요.", name: "김*희", image: "/sample/p2.jpg" }),
    s("category_tiles", {}),
    s("best_grid", { items: products.slice(0, 5) }),
    s("photo_band", { image: "/sample/hero.jpg", images: ["/sample/hero.jpg"] }),
    s("reviews", reviews),
    s("curation", {
      image: "/sample/p1.jpg",
      items: [
        { title: "자몽청 500ml", image: "/sample/p1.jpg", price: "18,000원", href: "#" },
        { title: "유자청 500ml", image: "/sample/p2.jpg", price: "18,000원", href: "#" },
        { title: "레몬청 500ml", price: "16,000원", href: "#" },
      ],
    }),
    s("shop_guide", { phone: "02-000-0000", hours: "평일 10:00 – 17:00", returns: "/policy/returns", inquiry: "/inquiries/new" }),
  ],
  class: [
    s("hero", { image: "/sample/hero.jpg", sessions: classSessions.filter((x) => x.status !== "full").slice(0, 2) }),
    s("class_list", { classes: classCards }),
    s("photo_band", { image: "/sample/p3.jpg", images: ["/sample/p3.jpg", "/sample/p2.jpg"] }),
    s("class_schedule", { sessions: classSessions }),
    s("testimonial", { quote: "처음인데도 차근차근 알려 주셔서 컵을 완성했어요.", name: "김*희", ...reviews, image: "/sample/p2.jpg" }),
    s("reviews", reviews),
    s("faq", {}),
    s("location", { address: "서울 마포구 월드컵로 00길 0, 2층", phone: "02-000-0000", href: "#", hours: "화 – 일 11:00 – 21:00", cancel: "이용일 3일 전까지 100% 환불", returns: "/policy/returns" }),
  ],
  stay: [
    s("hero", { image: "/sample/hero.jpg", products: stayRooms.map((r) => ({ id: r.id, name: r.name, cover_url: r.image, href: r.href })), rooms: stayRooms, booking: { href: "/products", max: 6 } }),
    s("booking_strip", { href: "/products", max: 6 }),
    s("testimonial", { ...reviews, image: "/sample/p2.jpg" }),
    s("room_list", { rooms: stayRooms }),
    s("gallery", { images: ["/sample/hero.jpg", "/sample/p1.jpg", "/sample/p2.jpg", "/sample/p3.jpg", "/sample/p4.jpg"] }),
    s("amenities", { items: ["무선 인터넷", "주차", "주방", "욕조", "바비큐", "에어컨", "난방", "세탁기", "수건", "드라이기"].map((name) => ({ name })) }),
    s("add_ons", { items: stayAddOns, image: "/sample/p2.jpg" }),
    s("house_rules", { check_in: "15:00", check_out: "11:00", rules: ["전 객실 금연", "반려동물 동반 불가", "22:00 이후 실외 이용 제한"], cancel: { rows: pay } }),
    s("photo_band", { image: "/sample/p3.jpg", images: ["/sample/p3.jpg"] }),
    s("location", { address: "강원특별자치도 00군 00면 00로 00", phone: "033-000-0000", href: "#" }),
    s("reviews", reviews),
  ],
  quote: [
    s("hero", { cases: quoteCases, figures: quoteFigures, tiers: quoteTiers, request: quoteStarter, address: "서울특별시 00구 00로 00", kinds: ["hero", "trust_line", "case_grid", "price_tiers", "package_cards", "process_steps", "reviews", "faq", "quote_starter"] }),
    s("trust_line", { items: ["A/S 1년", "실측 후 견적서 발송", "예약금 · 잔금 나눠 결제"], figures: quoteFigures }),
    s("case_grid", { cases: quoteCases }),
    s("price_tiers", { items: quoteTiers }),
    s("package_cards", { items: quoteTiers.slice(0, 4).map((t, i) => ({ name: t.label, price: t.value, image: null, href: "/products/q1", includes: quoteIncludes[i] })) }),
    s("process_steps", { steps: ["문의", "상담 · 견적", "계약", "작업", "완료"] }),
    s("reviews", { ...reviews, items: reviews.items.map((r, i) => ({ ...r, product: i === 0 ? "p1" : null })) }),
    s("faq", {}),
    s("quote_starter", quoteStarter),
  ],
  place: [
    s("hero", { image: "/sample/hero.jpg" }),
    s("intro", { body: placeIntro, image: "/sample/p2.jpg" }),
    s("photo_band", { image: "/sample/p3.jpg", images: ["/sample/p3.jpg"] }),
    s("menu", { groups: placeMenu, image: "/sample/p1.jpg", images: ["/sample/p1.jpg", "/sample/p2.jpg", "/sample/p3.jpg"] }),
    s("store_info", { title: "스토어 이름", ...placeInfo, image: "/sample/p4.jpg" }),
    s("location", { ...placeInfo, image: "/sample/p4.jpg" }),
    s("faq", {}),
  ],
  care: [
    s("hero", { image: "/sample/hero.jpg", images: ["/sample/p2.jpg", "/sample/p3.jpg"], hours: placeInfo.hours, phone: placeInfo.phone, links: placeInfo.links }),
    s("intro", { body: placeIntro, image: "/sample/p2.jpg" }),
    s("menu", { groups: careMenu, image: "/sample/p1.jpg", images: ["/sample/p1.jpg", "/sample/p2.jpg"] }),
    s("store_info", { title: "스토어 이름", ...placeInfo, image: "/sample/p4.jpg" }),
    s("location", { ...placeInfo, image: "/sample/p4.jpg" }),
    s("faq", {}),
    s("photo_band", { image: "/sample/p3.jpg", images: ["/sample/p3.jpg"] }),
  ],
  portfolio: [
    s("hero", { image: "/sample/hero.jpg", images: ["/sample/p2.jpg"], links: placeInfo.links, phone: placeInfo.phone, hours: placeInfo.hours }),
    s("case_grid", { cases: quoteCases }),
    s("intro", { body: placeIntro, image: "/sample/p2.jpg" }),
    s("store_info", { title: "스토어 이름", ...placeInfo, image: "/sample/p4.jpg" }),
  ],
  office: [
    s("hero", { image: "/sample/hero.jpg", images: ["/sample/p2.jpg"], hours: placeInfo.hours, phone: placeInfo.phone, links: placeInfo.links, cases: quoteCases }),
    s("case_grid", { cases: quoteCases }),
    s("intro", { body: placeIntro, image: "/sample/p2.jpg" }),
    s("menu", { groups: officeServices }),
    s("store_info", { title: "스토어 이름", ...placeInfo, company: officeCompany, image: "/sample/p4.jpg" }),
    s("faq", {}),
  ],
};

const days = (picked: number[], closed: number[], price: string) =>
  Array.from({ length: 30 }, (_, i) => i + 1).map((day) => ({
    day,
    price,
    state: picked.includes(day) ? ("picked" as const) : closed.includes(day) ? ("closed" as const) : ("open" as const),
  }));

export const detailData: Record<TemplateMain, DetailData> = {
  shop: {
    title: "자몽청 500ml",
    price: "18,000원",
    status: "재고 3개",
    ship: "발송 예정 11월 3일",
    rows: [
      { label: "배송비", value: "3,000원" },
      { label: "발송 예정", value: "2일 이내" },
      { label: "적립", value: "1%" },
    ],
    photo_reviews: ["", "", "", ""],
  },
  class: {
    title: "물레 입문",
    price: "85,000원 · 1인",
    chips: ["3시간", "입문"],
    rows: [
      { label: "수업 시간", value: "3시간" },
      { label: "정원", value: "6명" },
      { label: "수준", value: "입문" },
      { label: "형식", value: "하루" },
      { label: "가격", value: "85,000원" },
    ],
    sessions,
    steps: ["흙 준비", "물레", "다듬기", "굽기"],
    prep: [
      { title: "만드는 것", body: "컵 2개" },
      { title: "포함", body: "흙 · 유약 · 굽기" },
      { title: "챙길 것", body: "앞치마 · 편한 옷" },
    ],
    teacher: { name: "강사 김온기", body: "12년째 물레를 돌립니다." },
    curriculum: [
      { title: "1주 · 흙 다루기", body: "반죽과 중심 잡기" },
      { title: "2~3주 · 원통", body: "원통과 컵" },
      { title: "4~6주 · 그릇", body: "사발과 접시" },
      { title: "7~8주 · 유약", body: "시유와 굽기 · 작품 수령" },
    ],
    cohorts: [
      { title: "수요일 19:00–22:00", period: "11월 6일 – 12월 25일", count: "8회", status: "few", seats_left: 3, dates: ["11/6", "11/13", "11/20", "11/27", "12/4", "12/11", "12/18", "12/25"] },
      { title: "토요일 10:00–13:00", period: "11월 9일 – 12월 28일", count: "8회", status: "full", dates: ["11/9", "11/16", "11/23", "11/30", "12/7", "12/14", "12/21", "12/28"] },
    ],
    timetable: {
      days: ["월", "화", "수", "목", "금", "토"],
      rows: [
        { time: "10:00", open: [false, false, false, false, false, true] },
        { time: "19:00", open: [false, true, true, false, false, false] },
      ],
    },
    refund: [
      { label: "시작 3일 전", value: "100% 환불" },
      { label: "2일 전", value: "50% 환불" },
      { label: "1일 전", value: "30% 환불" },
      { label: "3명 미만", value: "자동 폐강 · 전액 환불" },
    ],
    location: { address: "서울 마포구 성미산로 00", note: "주차 1대", href: "#" },
    reviews,
  },
  stay: {
    title: "오션 스위트",
    price: "1박 180,000원부터",
    rows: [
      { label: "기준 · 최대", value: "2인 · 4인" },
      { label: "침대", value: "퀸 1" },
      { label: "면적", value: "33㎡" },
      { label: "전망", value: "바다" },
    ],
    steps: ["날짜", "연락처", "결제"],
    calendar: { month: "11월", days: days([10, 11, 12], [3, 4, 18, 19], "20.6만") },
    total: {
      rows: [
        { label: "2박", value: "412,000원" },
        { label: "청소비", value: "50,000원" },
        { label: "예약금 50%", value: "231,000원" },
      ],
      total: "462,000원",
      note: "입금 기한 6시간 · 지나면 자동 취소",
      button: "예약하기",
    },
    amenities: [
      { name: "와이파이" },
      { name: "주차" },
      { name: "바비큐" },
      { name: "조식" },
      { name: "정원" },
      { name: "반려동물 동반" },
    ],
    rules: { check_in: "15:00", check_out: "11:00", rules: ["기준 2인 · 최대 4인", "실내 흡연 금지"] },
    pay,
  },
  quote: {
    title: "성수 카페 공간 촬영",
    status: "2025 · 서울 성수",
    rows: [
      { label: "분류", value: "공간" },
      { label: "규모", value: "40평" },
      { label: "기간", value: "1일" },
      { label: "비용대", value: "80~120만원" },
    ],
    images: ["", "", "", "", ""],
    reviews: { average: 5, count: 1, items: [reviews.items[0]] },
    form: {
      steps: ["종류", "규모", "일정", "예산", "연락처"],
      groups: [
        { label: "종류", options: ["주거", "상업", "부분 시공"] },
        { label: "면적", options: ["20평대", "30평대", "40평대 이상"] },
        { label: "공정", options: ["도배", "바닥", "욕실", "주방"] },
      ],
      total: "1,850만원",
      button: "상담 신청",
    },
    pay,
  },
  place: {},
  care: {},
  portfolio: {},
  office: {},
};
