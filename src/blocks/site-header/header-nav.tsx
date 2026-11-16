"use client";

import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "../../utils/cn";

type NavItem = { label: string; href: string; match: (path: string, query: URLSearchParams) => boolean };

const sort = (value: string) => (path: string, query: URLSearchParams) => path === "/products" && (query.get("sort") ?? "") === value;

const NAV: Record<string, NavItem[]> = {
  shop: [
    { label: "전체 상품", href: "/products", match: (path, query) => path === "/products" && !query.get("sort") },
    { label: "베스트", href: "/products?sort=popular", match: sort("popular") },
    { label: "신상품", href: "/products?sort=recent", match: sort("recent") },
  ],
  stay: [
    { label: "객실 선택", href: "/#rooms", match: (path) => path === "/" || path.startsWith("/products") },
    { label: "위치 및 정보", href: "/#location", match: () => false },
    { label: "리뷰", href: "/#reviews", match: () => false },
  ],
};

const item = "ez:inline-flex ez:items-center ez:py-1.5 ez:border-0 ez:border-b ez:border-solid ez:border-transparent ez:text-fg ez:no-underline ez:hover:text-primary";
const active = "ez:text-primary ez:border-primary";

export function NavLinks({ main, current }: { main: string; current?: number }) {
  return (NAV[main] ?? NAV.shop).map((n, i) => (
    <NextLink key={n.href} href={n.href} aria-current={i === current ? "page" : undefined} className={cn(item, i === current && active)}>
      {n.label}
    </NextLink>
  ));
}

export function LiveNavLinks({ main }: { main: string }) {
  const path = usePathname();
  const query = useSearchParams();
  const current = (NAV[main] ?? NAV.shop).findIndex((n) => n.match(path, query));
  return <NavLinks main={main} current={current < 0 ? undefined : current} />;
}
