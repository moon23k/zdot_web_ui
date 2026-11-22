import type { DetailData } from "../../details/data";
import type { TemplateMain } from "../../templates/types";
import type { Design, Section } from "../../types";
import type { AddOn, Room } from "../../sections/template/data";
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
    s("hero", { image: "/sample/hero.jpg", facts: [{ label: "후기 243", value: "4.9" }] }),
    s("trust_line", { items: ["평점 4.9", "후기 243", "수강생 3,200명"] }),
    s("class_schedule", { sessions }),
    s("class_list", {
      classes: [
        { id: "k1", name: "물레 입문", chips: ["3시간", "입문"], price: "85,000원 · 1인", next: "다음 수업 11월 9일", href: "#" },
        { id: "k2", name: "핸드빌딩 원데이", chips: ["2시간", "입문"], price: "65,000원 · 1인", next: "다음 수업 11월 10일", href: "#" },
        { id: "k3", name: "8주 정규반", chips: ["8주", "중급"], price: "340,000원부터", next: "다음 개강 11월 6일", href: "#" },
      ],
    }),
    s("numbers", { items: [{ value: "2018", label: "개업" }, { value: "3,200", label: "수강생" }, { value: "4.9", label: "평점" }] }),
    s("process_steps", { steps: ["예약", "수업", "굽기", "수령"] }),
    s("gates", { items: [{ title: "원데이", href: "#" }, { title: "정규반", href: "#" }, { title: "단체 문의", href: "#" }] }),
    s("reviews", reviews),
    s("faq", {}),
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
    s("hero", { image: "/sample/hero.jpg", products: [{ id: "q1", name: "작가 1명 본식", sale_price: 490000, cover_url: "/sample/q1.jpg" }] }),
    s("intro", { images: ["/sample/case-1.jpg", "/sample/case-2.jpg"] }),
    s("trust_line", { items: ["평점 4.9", "후기 86", "작업 320건"] }),
    s("case_grid", {
      categories: ["전체", "주거", "상업", "부분"],
      cases: [
        { id: "c1", title: "성수 카페", meta: "상업 · 40평", href: "#" },
        { id: "c2", title: "마포 아파트", meta: "주거 · 32평", href: "#" },
        { id: "c3", title: "판교 사무실", meta: "상업 · 60평", href: "#" },
        { id: "c4", title: "연남 주택", meta: "주거 · 25평", href: "#" },
      ],
    }),
    s("case_cards", {
      categories: ["전체", "광고", "인터뷰", "행사"],
      cases: [
        { id: "p1", title: "브랜드 필름", meta: "광고 · 2025 · 의뢰처", scope: "기획 · 촬영 · 편집 · 6주", href: "#" },
        { id: "p2", title: "대표 인터뷰", meta: "인터뷰 · 2025 · 의뢰처", scope: "촬영 · 편집 · 2주", href: "#" },
        { id: "p3", title: "출시 행사", meta: "행사 · 2024 · 의뢰처", scope: "현장 촬영 · 1일", href: "#" },
      ],
    }),
    s("price_tiers", { items: [{ label: "제품 컷", value: "10,000원부터" }, { label: "공간 촬영", value: "500,000원부터" }, { label: "브랜드 촬영", value: "별도 견적" }] }),
    s("package_cards", {
      tabs: ["사진", "영상", "패키지"],
      items: [
        { name: "작가 1명 본식", price: "490,000원", includes: ["원본 전체", "보정 50장"] },
        { name: "사진 · 영상 패키지", price: "880,000원", includes: ["사진 작가 1명", "영상 하이라이트 3분"] },
        { name: "2인 촬영", price: "740,000원", includes: ["작가 2명", "보정 80장"] },
      ],
    }),
    s("process_steps", { steps: ["문의", "견적", "예약금", "작업", "잔금"] }),
    s("reviews", reviews),
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
};
