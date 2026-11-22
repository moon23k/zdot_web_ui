import NextLink from "next/link";
import type { ReactNode } from "react";
import type { ShopSkin } from "../../templates/types";
import type { ProductSummary } from "../../types";
import { cn } from "../../utils/cn";
import { countSup, textLink } from "../../utils/styles";
import { SHOP_DESIGNS } from "../../sections/shop";
import type { CatalogPromo, CatalogTab } from "../../sections/shop/types";
import { ProductGrid } from "../product-grid";
import { ClassicCatalog, type CatalogLink } from "./classic";

export { Crumbs, type CatalogLink } from "./classic";

export function CatalogView({
  title,
  count,
  crumbs,
  chips,
  sorts,
  products,
  more,
  search,
  skin,
  promo,
}: {
  title: string;
  count?: number | null;
  crumbs: CatalogLink[];
  chips: CatalogTab[];
  sorts: CatalogLink[];
  products: ProductSummary[];
  more?: string | null;
  search?: ReactNode;
  skin?: ShopSkin;
  promo?: CatalogPromo | null;
}) {
  const List = skin ? SHOP_DESIGNS[skin]?.List : undefined;
  if (!List) return <ClassicCatalog title={title} count={count} crumbs={crumbs} chips={chips} sorts={sorts} products={products} more={more} search={search} />;
  const tabs = chips.filter((c, i) => i === 0 || c.on || c.count !== 0);
  const filtered = chips.some((c, i) => i > 0 && c.on);
  return (
    <List
      title={title}
      count={count}
      crumbs={crumbs}
      tabs={tabs}
      sorts={sorts}
      products={products}
      more={more}
      search={search}
      promo={promo ?? null}
      emptyHref={filtered ? "/products" : undefined}
    />
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
