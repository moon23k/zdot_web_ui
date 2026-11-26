import NextLink from "next/link";
import type { SectionProps } from "../../renderer/registry";
import type { Category } from "../../types";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar } from "../kit";
import { scriptOf } from "../../utils/writing";

const chip = cn(
  "ez:inline-flex ez:h-9.5 ez:shrink-0 ez:items-center ez:rounded-button ez:border ez:border-solid ez:border-site-line ez:px-4 ez:text-site-note ez:text-fg ez:no-underline ez:hover:border-site-edge",
  "ez:aria-[current=page]:border-primary ez:aria-[current=page]:text-primary ez:aria-[current=page]:font-medium",
  focusRing,
);

export function CategoryChips({ categories, current }: { categories: Category[]; current?: string | null }) {
  if (!categories.length) return null;
  return (
    <nav data-slot="category-menu" aria-label="카테고리" className="ez:-mx-page ez:flex ez:gap-2 ez:overflow-x-auto ez:px-page ez:md:mx-0 ez:md:flex-wrap ez:md:px-0">
      <NextLink href="/products" aria-current={current ? undefined : "page"} className={chip}>
        전체
      </NextLink>
      {categories.map((c) => (
        <NextLink data-script={scriptOf(c.name)} key={c.id} href={`/products?category=${c.id}`} aria-current={current === c.id ? "page" : undefined} className={chip}>
          {c.name}
        </NextLink>
      ))}
    </nav>
  );
}

export function CategoryMenu({ context }: SectionProps<"category_menu">) {
  if (context.categories.length) {
    return (
      <div className="ez:lg:hidden">
        <CategoryChips categories={context.categories} />
      </div>
    );
  }
  return (
    <div data-slot="category-menu" data-variant="header" data-blank="" aria-hidden="true" className="ez:flex ez:justify-center ez:gap-11 ez:text-site-lead ez:lg:hidden">
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} size="short" />
      ))}
    </div>
  );
}
