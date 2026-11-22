import type { NavCategory } from "../../blocks/site-header/header-nav";
import type { Business, ProductSummary } from "../../types";
import { discountRate, won } from "../../utils/format";
import type { FooterLink, ShopFooterProps, ShopHeaderProps, ShopNavItem } from "./types";

export const SHOP_TITLE = { fresh: "신상품", best: "베스트", categories: "분류", reviews: "리뷰", all: "전체 상품", more: "전체 보기", curation: "기획 묶음" } as const;

export const PRODUCTS_HREF = "/products";

export const FRESH_HREF = "/products?sort=recent";

export const BEST_HREF = "/products?sort=popular";

export function categoryHref(id: string): string {
  return `/products?category=${encodeURIComponent(id)}`;
}

export function shopNav(categories: NavCategory[]): ShopHeaderProps["nav"] {
  return {
    all: { label: SHOP_TITLE.all, href: PRODUCTS_HREF },
    fresh: { label: SHOP_TITLE.fresh, href: FRESH_HREF },
    best: { label: SHOP_TITLE.best, href: BEST_HREF },
    categories: categories.slice(0, 6).map((c) => ({ label: c.name, href: categoryHref(c.id) })),
  };
}

export function shopLinks(signedIn?: boolean): ShopHeaderProps["links"] {
  const account: ShopNavItem = signedIn ? { label: "내 정보", href: "/me" } : { label: "로그인", href: "/login" };
  return { search: "/products?search=1", account, likes: signedIn ? "/me/likes" : "/login", cart: "/cart" };
}

export type ProductView = {
  href: string;
  name: string;
  price: string;
  list: string | null;
  rate: number;
  soldOut: boolean;
  sample: boolean;
  cover: string | null;
};

export function productView(p: ProductSummary): ProductView {
  const rate = p.sold_out ? 0 : discountRate(p.list_price, p.sale_price);
  return {
    href: `/products/${p.id}`,
    name: p.name,
    price: won(p.sale_price),
    list: rate > 0 ? won(p.list_price) : null,
    rate,
    soldOut: p.sold_out,
    sample: p.sample,
    cover: p.cover_url,
  };
}

const LEGAL = new Set(["terms", "privacy"]);

export function legalLine(storeName: string, business: Business | null, hosting: string): string {
  return [
    [business?.name || storeName, business?.ceo_name && `대표 ${business.ceo_name}`].filter(Boolean).join(" · "),
    business?.address,
    business?.registration_no && `사업자등록번호 ${business.registration_no}`,
    business?.mail_order_no && `통신판매업 신고 ${business.mail_order_no}`,
    business?.cs_phone && `고객센터 ${business.cs_phone}`,
    business?.cs_email && `이메일 ${business.cs_email}`,
    `호스팅 제공 ${hosting}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function shopFooter({
  storeName,
  business,
  hosting,
  policies,
  hours,
  policyHref,
}: {
  storeName: string;
  business: Business | null;
  hosting: string;
  policies: { key: string; title: string }[];
  hours?: string | null;
  policyHref: (key: string) => string;
}): ShopFooterProps {
  const guide: FooterLink[] = [
    ...policies.filter((p) => !LEGAL.has(p.key)).map((p) => ({ label: p.key === "returns" ? "교환 · 반품" : p.title, href: policyHref(p.key) })),
    { label: "1:1 문의", href: "/inquiries/new" },
    { label: "비회원 주문 조회", href: "/orders/lookup" },
  ];
  return {
    storeName,
    phone: business?.cs_phone ?? null,
    hours: hours ?? null,
    legal: legalLine(storeName, business, hosting),
    shop: [
      { label: SHOP_TITLE.fresh, href: FRESH_HREF },
      { label: SHOP_TITLE.best, href: BEST_HREF },
      { label: SHOP_TITLE.all, href: PRODUCTS_HREF },
    ],
    guide,
    account: [
      { label: "로그인", href: "/login" },
      { label: "주문 내역", href: "/orders" },
      { label: "찜", href: "/me/likes" },
      { label: "장바구니", href: "/cart" },
    ],
    terms: policies.filter((p) => LEGAL.has(p.key)).map((p) => ({ label: p.title, href: policyHref(p.key), strong: p.key === "privacy" })),
  };
}

export const ROW_ITEM = { 2: "ez:w-1/2", 3: "ez:w-1/2 ez:md:w-1/3", 4: "ez:w-1/2 ez:lg:w-1/4", 5: "ez:w-1/2 ez:md:w-1/3 ez:lg:w-1/5" } as const;

export const FILL_COLS = { 1: "ez:md:grid-cols-1", 2: "ez:md:grid-cols-2", 3: "ez:md:grid-cols-3", 4: "ez:md:grid-cols-2 ez:lg:grid-cols-4" } as const;

export function fillCols(count: number): string {
  return FILL_COLS[Math.max(1, Math.min(4, count)) as keyof typeof FILL_COLS];
}
