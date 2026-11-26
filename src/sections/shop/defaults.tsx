import NextLink from "next/link";
import { ProductGrid } from "../../blocks/product-grid";
import type { SectionProps } from "../../renderer/registry";
import { won } from "../../utils/format";
import { Bar, BlankPrice, Pic } from "../kit";
import { BEST_HREF, SHOP_TITLE } from "./shared";
import { Won } from "../../components/price";

export function BestGrid({ data, grid }: SectionProps<"best_grid">) {
  const items = data.items ?? [];
  if (!items.length) {
    return (
      <section data-slot="best-grid" data-blank="" className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-9">
        <h2 className="ez:m-0 ez:text-site-section">{SHOP_TITLE.best}</h2>
        <div className="ez:grid ez:grid-cols-2 ez:gap-gutter ez:md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="ez:grid ez:gap-2">
              <Pic ratio={grid?.ratio ?? 1} tone={i} />
              <Bar />
              <BlankPrice />
            </div>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section data-slot="best-grid" className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-9">
      <div className="ez:flex ez:items-end ez:justify-between ez:gap-3">
        <h2 className="ez:m-0 ez:text-site-section">{SHOP_TITLE.best}</h2>
        <NextLink href={BEST_HREF} className="ez:shrink-0 ez:text-site-small ez:text-fg">
          {SHOP_TITLE.more}
        </NextLink>
      </div>
      <ProductGrid products={items.slice(0, grid?.pc ?? 4)} grid={grid} fit />
    </section>
  );
}

export function guideRows(data: SectionProps<"shop_guide">["data"], shipping: SectionProps["context"]["shipping"]) {
  const fee = shipping ? (shipping.base_fee ? won(shipping.base_fee) : "무료") : null;
  const free = shipping?.free_threshold ? `${won(shipping.free_threshold)} 이상 무료` : null;
  return {
    delivery: shipping ? { label: "배송비", value: [fee, free].filter(Boolean).join(" · ") } : null,
    exchange: shipping ? { label: "교환 배송비", value: won(shipping.exchange_fee) } : null,
    returns: shipping ? { label: "반품 배송비", value: won(shipping.return_fee), days: shipping.return_days, href: data.returns ?? null } : null,
    center: data.phone ? { label: "고객센터", value: data.phone, href: `tel:${data.phone}`, hours: data.hours ?? null } : null,
  };
}

export function ShopGuide({ data, context }: SectionProps<"shop_guide">) {
  const rows = guideRows(data, context.shipping);
  const items = [rows.delivery, rows.exchange, rows.returns, rows.center].filter((r) => r !== null);
  if (!items.length) {
    return (
      <section data-slot="shop-guide" data-blank="" className="ez:grid ez:gap-4 ez:text-fg ez:md:grid-cols-4">
        {["배송비", "교환 배송비", "반품 배송비", "고객센터"].map((label) => (
          <div key={label} className="ez:grid ez:gap-1">
            <span className="ez:text-site-small ez:text-muted">{label}</span>
            <Bar />
          </div>
        ))}
      </section>
    );
  }
  return (
    <section data-slot="shop-guide" className="ez:grid ez:gap-4 ez:text-fg ez:md:grid-cols-4">
      {items.map((r) => (
        <div key={r.label} className="ez:grid ez:gap-1">
          <span className="ez:text-site-small ez:text-muted">{r.label}</span>
          <span><Won value={r.value} /></span>
        </div>
      ))}
    </section>
  );
}
