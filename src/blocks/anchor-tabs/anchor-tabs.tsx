import NextLink from "next/link";
import { cn } from "../../utils/cn";
import { countSup } from "../../utils/styles";

export function AnchorTabs({ items }: { items: { label: string; href: string; count?: number | null }[] }) {
  return (
    <nav data-slot="anchor-tabs" aria-label="상세 메뉴" className="ez:flex ez:gap-9 ez:overflow-x-auto ez:border-0 ez:border-b ez:border-solid ez:border-site-line">
      {items.map((t, i) => (
        <NextLink
          key={t.href}
          href={t.href}
          className={cn(
            "ez:relative ez:shrink-0 ez:py-4.5 ez:text-site-lead ez:no-underline ez:hover:text-fg",
            i === 0 ? "ez:font-medium ez:text-fg ez:after:absolute ez:after:inset-x-0 ez:after:-bottom-px ez:after:h-px ez:after:bg-primary" : "ez:text-muted",
          )}
        >
          {t.label}
          {t.count ? <span className={countSup}>{t.count}</span> : null}
        </NextLink>
      ))}
    </nav>
  );
}
