import NextLink from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import type { ProductSummary } from "../../types";
import { cn } from "../../utils/cn";
import { chip, chipOn, countSup, focusRing, textLink } from "../../utils/styles";
import { ProductGrid } from "../product-grid";

export type CatalogLink = { label: string; href: string; on?: boolean };

export function Crumbs({ items }: { items: CatalogLink[] }) {
  return (
    <nav aria-label="현재 위치" className="ez:flex ez:items-center ez:gap-2 ez:text-site-small ez:text-muted">
      {items.map((c, i) => (
        <span key={c.href} className="ez:flex ez:items-center ez:gap-2">
          {i > 0 && <span aria-hidden="true">/</span>}
          {i === items.length - 1 ? (
            <span aria-current="page" className="ez:text-fg">
              {c.label}
            </span>
          ) : (
            <NextLink href={c.href} className="ez:text-muted ez:no-underline ez:hover:text-fg">
              {c.label}
            </NextLink>
          )}
        </span>
      ))}
    </nav>
  );
}

function SortMenu({ sorts }: { sorts: CatalogLink[] }) {
  const current = sorts.find((s) => s.on) ?? sorts[0];
  return (
    <details data-slot="sort-menu" className="ez:group ez:relative">
      <summary className={cn("ez:flex ez:min-h-11 ez:cursor-pointer ez:list-none ez:items-center ez:gap-2 ez:text-site-lead ez:[&::-webkit-details-marker]:hidden", focusRing)}>
        {current?.label}
        <Icon name="down" size="sm" className="ez:transition-transform ez:group-open:rotate-180" />
      </summary>
      <ul className="ez:absolute ez:right-0 ez:z-10 ez:m-0 ez:mt-1 ez:grid ez:min-w-40 ez:list-none ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-2">
        {sorts.map((s) => (
          <li key={s.href}>
            <NextLink
              href={s.href}
              aria-current={s.on ? "true" : undefined}
              className={cn("ez:flex ez:min-h-10 ez:items-center ez:rounded-sm ez:px-3 ez:text-site-lead ez:no-underline ez:hover:bg-surface-alt", s.on ? "ez:text-primary ez:font-medium" : "ez:text-fg")}
            >
              {s.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function CatalogView({
  title,
  count,
  crumbs,
  chips,
  sorts,
  products,
  more,
  search,
}: {
  title: string;
  count?: number | null;
  crumbs: CatalogLink[];
  chips: CatalogLink[];
  sorts: CatalogLink[];
  products: ProductSummary[];
  more?: string | null;
  search?: ReactNode;
}) {
  return (
    <div data-slot="catalog-view" className="ez:grid ez:grid-cols-1 ez:text-fg">
      <div className="ez:grid ez:gap-8 ez:pb-10 ez:lg:gap-14 ez:lg:pb-14">
        <Crumbs items={crumbs} />
        <h1 className="ez:m-0 ez:text-site-page ez:font-light ez:tracking-[-0.04em] ez:lg:text-site-display">
          {title}
          {count ? <span className={cn(countSup, "ez:text-site-item")}>{count}</span> : null}
        </h1>
        {search}
      </div>
      <div className="ez:flex ez:flex-wrap ez:items-center ez:justify-between ez:gap-4 ez:border-0 ez:border-y ez:border-solid ez:border-site-line ez:py-4">
        <nav aria-label="카테고리" className="ez:-mx-page ez:flex ez:gap-2 ez:overflow-x-auto ez:px-page ez:md:mx-0 ez:md:flex-wrap ez:md:px-0">
          {chips.map((c) => (
            <NextLink key={c.href} href={c.href} aria-current={c.on ? "page" : undefined} className={cn(chip, c.on && chipOn, focusRing)}>
              {c.label}
            </NextLink>
          ))}
        </nav>
        <SortMenu sorts={sorts} />
      </div>
      <div className="ez:mt-10">
        <ProductGrid products={products} eager={4} grid={{ m: 2, pc: 4, ratio: 0.8 }} emptyHref={chips.some((c, i) => i > 0 && c.on) ? "/products" : undefined} />
      </div>
      {more && (
        <div className="ez:mt-16 ez:flex ez:justify-center ez:lg:mt-24">
          <ButtonLink href={more} variant="outline">
            더 보기
          </ButtonLink>
        </div>
      )}
    </div>
  );
}

export function ProductShelf({ title, count, products, href }: { title: string; count?: number | null; products: ProductSummary[]; href?: string }) {
  if (!products.length) return null;
  return (
    <section data-slot="product-shelf" className="ez:mt-section ez:grid ez:gap-6 ez:text-fg ez:lg:gap-9">
      <div className="ez:flex ez:items-end ez:justify-between ez:gap-3">
        <h2 className="ez:m-0 ez:text-site-section">
          {title}
          {count ? <span className={countSup}>{count}</span> : null}
        </h2>
        {href && (
          <NextLink href={href} className={cn(textLink, "ez:shrink-0 ez:text-site-small")}>
            전체 보기
          </NextLink>
        )}
      </div>
      <ProductGrid products={products.slice(0, 4)} grid={{ m: 2, pc: 4, ratio: 0.8 }} />
    </section>
  );
}
