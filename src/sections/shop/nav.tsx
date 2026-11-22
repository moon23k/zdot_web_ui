"use client";

import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { cn } from "../../utils/cn";
import type { ShopNavItem } from "./types";

const KEYS = ["category", "sort"] as const;

function same(href: string, path: string, query: Pick<URLSearchParams, "get">): boolean {
  const url = new URL(href, "http://x");
  if (url.pathname !== path) return false;
  return KEYS.every((key) => (url.searchParams.get(key) ?? "") === (query.get(key) ?? ""));
}

type LinksProps = { items: ShopNavItem[]; className?: string; currentClassName?: string };

function Links({ items, className, currentClassName, current }: LinksProps & { current: number }) {
  return items.map((n, i) => (
    <NextLink key={n.href} href={n.href} aria-current={i === current ? "page" : undefined} className={cn(className, i === current && currentClassName)}>
      {n.label}
    </NextLink>
  ));
}

function Live(props: LinksProps) {
  const path = usePathname() ?? "";
  const query = useSearchParams() ?? new URLSearchParams();
  return <Links {...props} current={props.items.findIndex((n) => same(n.href, path, query))} />;
}

export function ShopNavLinks(props: LinksProps) {
  return (
    <Suspense fallback={<Links {...props} current={-1} />}>
      <Live {...props} />
    </Suspense>
  );
}
