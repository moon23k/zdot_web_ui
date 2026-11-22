"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../utils/cn";
import type { PlaceNavItem } from "./types";

export function PlaceNavLinks({ items, className, currentClassName }: { items: PlaceNavItem[]; className?: string; currentClassName?: string }) {
  const path = usePathname() ?? "";
  return items.map((n) => {
    const on = !n.href.includes("#") && n.href === path;
    return (
      <NextLink key={n.href} href={n.href} aria-current={on ? "page" : undefined} className={cn(className, on && currentClassName)}>
        {n.label}
      </NextLink>
    );
  });
}
