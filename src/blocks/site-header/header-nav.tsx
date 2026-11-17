"use client";

import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "../../utils/cn";

export type NavCategory = { id: string; name: string };

type NavItem = { label: string; href: string; match: (path: string, query: URLSearchParams) => boolean };

const listed = (path: string, query: URLSearchParams) => path === "/products" && !query.get("category") && !query.get("sort");
const never = () => false;

const FIXED: Record<string, NavItem[]> = {
  stay: [
    { label: "객실", href: "/#rooms", match: (path) => path.startsWith("/products") },
    { label: "둘러보기", href: "/#gallery", match: never },
    { label: "이용 안내", href: "/#rules", match: never },
    { label: "오시는 길", href: "/#location", match: never },
  ],
  class: [
    { label: "클래스", href: "/classes", match: (path) => path === "/classes" || path.startsWith("/products") },
    { label: "일정", href: "/#schedule", match: never },
    { label: "공방", href: "/#story", match: never },
    { label: "후기", href: "/#reviews", match: never },
  ],
  quote: [
    { label: "작업", href: "/cases", match: (path) => path.startsWith("/cases") },
    { label: "서비스", href: "/#services", match: never },
    { label: "진행 과정", href: "/#process", match: never },
    { label: "스튜디오", href: "/#studio", match: never },
  ],
};

function shopItems(categories: NavCategory[]): NavItem[] {
  const fresh = { label: "신상품", href: "/products", match: listed };
  if (!categories.length) {
    return [
      fresh,
      { label: "베스트", href: "/products?sort=popular", match: (path, query) => path === "/products" && query.get("sort") === "popular" },
    ];
  }
  return [
    fresh,
    ...categories.slice(0, 6).map((c) => ({
      label: c.name,
      href: `/products?category=${encodeURIComponent(c.id)}`,
      match: (path: string, query: URLSearchParams) => path === "/products" && query.get("category") === c.id,
    })),
  ];
}

function itemsOf(main: string, categories: NavCategory[]): NavItem[] {
  return FIXED[main] ?? shopItems(categories);
}

export function NavLinks({ main, categories = [], current }: { main: string; categories?: NavCategory[]; current?: number }) {
  return itemsOf(main, categories).map((n, i) => {
    const on = i === current;
    return (
      <NextLink
        key={n.href}
        href={n.href}
        aria-current={on ? "page" : undefined}
        className={cn(
          "ez:inline-flex ez:flex-col ez:items-center ez:gap-1.5 ez:pt-2.75 ez:no-underline ez:hover:text-fg",
          on ? "ez:font-medium ez:text-fg" : "ez:text-muted",
        )}
      >
        <span>{n.label}</span>
        <span aria-hidden="true" className={cn("ez:size-1.25 ez:rounded-full ez:bg-primary", !on && "ez:opacity-0")} />
      </NextLink>
    );
  });
}

export function LiveNavLinks({ main, categories = [] }: { main: string; categories?: NavCategory[] }) {
  const path = usePathname();
  const query = useSearchParams();
  const current = itemsOf(main, categories).findIndex((n) => n.match(path, query));
  return <NavLinks main={main} categories={categories} current={current < 0 ? undefined : current} />;
}
