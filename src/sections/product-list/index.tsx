import NextLink from "next/link";
import type { ReactNode } from "react";
import { Badge } from "../../components/badge";
import { ButtonLink } from "../../components/button";
import { countSup, chip, chipOn, figure, focusRing, sectionTitle, textLink } from "../../utils/styles";
import { cn } from "../../utils/cn";
import { won } from "../../utils/format";
import { ProductGrid } from "../../blocks/product-grid";
import type { SectionProps } from "../../renderer/registry";
import type { GridSpec } from "../../templates/types";
import type { ProductSummary } from "../../types";
import { Bar, BlankPrice, Card, Cols, pcCols, Pic, Title } from "../kit";

const SHOWN = 8;

const SORTS = [
  ["신상품순", "/products"],
  ["인기순", "/products?sort=popular"],
  ["낮은 가격순", "/products?sort=price_asc"],
] as const;

function fullRows(count: number, m: number, pc: number): number {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const both = (m * pc) / gcd(m, pc);
  return count < pc ? count : Math.floor(count / both) * both || Math.floor(count / pc) * pc;
}

function discount(p: ProductSummary): number {
  return p.list_price > p.sale_price ? Math.floor(((p.list_price - p.sale_price) / p.list_price) * 100) : 0;
}

function cols(grid: GridSpec | undefined, count: number): string {
  return cn("ez:grid ez:gap-x-gutter ez:gap-y-10 ez:lg:gap-y-14", { 1: "ez:grid-cols-1", 2: "ez:grid-cols-2", 3: "ez:grid-cols-3" }[grid?.m ?? 2], pcCols(grid?.pc ?? 4, count));
}

function Head({ title, count, aside }: { title: string; count?: number; aside?: ReactNode }) {
  return (
    <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-3">
      <h2 className="ez:m-0 ez:font-display ez:text-site-section">
        {title}
        {count ? <span className={countSup}>{count}</span> : null}
      </h2>
      {aside}
    </div>
  );
}

function Shot({ product, ratio, index, children }: { product: ProductSummary; ratio: number; index: number; children?: ReactNode }) {
  return (
    <span className="ez:relative ez:block">
      <Pic src={product.cover_url} alt={product.name} ratio={ratio} tone={index} className={cn(product.sold_out && "ez:opacity-45")} />
      {product.sample && <Badge className="ez:absolute ez:left-2.5 ez:top-2.5 ez:z-1">예시</Badge>}
      {children}
    </span>
  );
}

function ShowcaseCard({ product, ratio, index }: { product: ProductSummary; ratio: number; index: number }) {
  const href = `/products/${product.id}`;
  const sale = discount(product);
  return (
    <div data-slot="product-card" data-sold-out={product.sold_out || undefined} data-sample={product.sample || undefined} className="ez:flex ez:flex-col ez:gap-5 ez:text-fg">
      <NextLink href={href} tabIndex={-1} aria-hidden="true" className="ez:block ez:text-fg ez:no-underline">
        <Shot product={product} ratio={ratio} index={index}>
          {!product.sample && (
            <span aria-hidden="true" className={cn(figure, "ez:absolute ez:left-5 ez:top-3.5 ez:text-site-rank ez:text-fg")}>
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </Shot>
      </NextLink>
      <div className="ez:grid ez:gap-3.5">
        <div className="ez:flex ez:items-baseline ez:justify-between ez:gap-4">
          <NextLink href={href} className="ez:line-clamp-2 ez:text-site-item ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4">
            {product.name}
          </NextLink>
          <span className={cn("ez:shrink-0 ez:text-site-lead ez:font-medium ez:tabular-nums", product.sold_out && "ez:text-muted")}>{won(product.sale_price)}</span>
        </div>
        <div className="ez:flex ez:min-h-6 ez:items-center ez:justify-between ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-3.5 ez:text-site-small">
          {product.sold_out ? (
            <span className="ez:text-muted">품절</span>
          ) : sale > 0 ? (
            <span className="ez:font-medium ez:text-primary ez:tabular-nums">{`${sale}%`}</span>
          ) : (
            <span />
          )}
          {!product.sold_out && !product.sample && (
            <NextLink href={href} className={cn(textLink, "ez:pb-0.5 ez:text-site-small")}>
              구매
            </NextLink>
          )}
        </div>
      </div>
    </div>
  );
}

function StoreCard({ product, ratio, index }: { product: ProductSummary; ratio: number; index: number }) {
  const sale = discount(product);
  return (
    <NextLink
      href={`/products/${product.id}`}
      data-slot="product-card"
      data-sold-out={product.sold_out || undefined}
      data-sample={product.sample || undefined}
      className={cn("ez:group ez:flex ez:flex-col ez:gap-3 ez:text-fg ez:no-underline", focusRing)}
    >
      <Shot product={product} ratio={ratio} index={index} />
      <span className="ez:flex ez:flex-col ez:gap-0.5">
        <span className="ez:line-clamp-2 ez:text-site-lead ez:group-hover:underline ez:underline-offset-4">{product.name}</span>
        <span className="ez:flex ez:items-baseline ez:gap-2 ez:tabular-nums ez:whitespace-nowrap">
          {product.sold_out ? <span className="ez:text-site-small ez:text-muted">품절</span> : sale > 0 && <span className="ez:font-medium ez:text-primary">{`${sale}%`}</span>}
          <strong className={cn("ez:text-site-lead ez:font-medium", product.sold_out && "ez:text-muted")}>{won(product.sale_price)}</strong>
        </span>
      </span>
    </NextLink>
  );
}

function BlankGrid({ title, grid }: { title: string; grid?: GridSpec }) {
  return (
    <section data-slot="product-grid" data-blank="" className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-9">
      <Title>{title}</Title>
      <Cols m={grid?.m ?? 2} pc={grid?.pc ?? 4}>
        {Array.from({ length: grid?.pc ?? 4 }, (_, i) => (
          <Card key={i}>
            <Pic ratio={grid?.ratio ?? 1} tone={i} />
            <Bar />
            <BlankPrice />
          </Card>
        ))}
      </Cols>
    </section>
  );
}

function AllLink() {
  return (
    <NextLink href="/products" className={cn(textLink, "ez:shrink-0 ez:text-site-small")}>
      전체 보기
    </NextLink>
  );
}

export function ProductList({ data, context, grid, variant, blank }: SectionProps<"product_grid">) {
  const products = context.products;
  if (!products.length && !blank) return null;
  const fallback = variant === "store" ? "전체 상품" : "신상품";
  if (!products.length) return <BlankGrid title={sectionTitle(data.title, fallback)} grid={grid} />;
  const shown = products.slice(0, fullRows(Math.min(products.length, SHOWN), grid?.m ?? 2, grid?.pc ?? 4));
  const more = products.length > shown.length || products.length >= SHOWN;
  const count = products.length < SHOWN ? products.length : undefined;
  const ratio = grid?.ratio ?? 0.8;
  if (variant === "gallery") {
    return (
      <section data-slot="product-grid" data-variant="gallery" className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-9">
        <div className="ez:flex ez:items-end ez:justify-between ez:gap-3">
          <h2 className="ez:m-0 ez:text-site-section">{sectionTitle(data.title, "신상품")}</h2>
          <AllLink />
        </div>
        <ProductGrid products={products.slice(0, SHOWN)} eager={4} grid={grid} />
      </section>
    );
  }
  if (variant === "showcase") {
    return (
      <section data-slot="product-grid" data-variant="showcase" className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-9">
        <Head title={sectionTitle(data.title, "신상품")} count={count} aside={more ? <AllLink /> : undefined} />
        <div className={cols(grid, shown.length)}>
          {shown.map((p, i) => (
            <ShowcaseCard key={p.id} product={p} ratio={ratio} index={i} />
          ))}
        </div>
      </section>
    );
  }
  if (variant === "store") {
    return (
      <section data-slot="product-grid" data-variant="store" className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-7">
        <Head
          title={sectionTitle(data.title, "전체 상품")}
          count={count}
          aside={
            <nav aria-label="정렬" className="ez:flex ez:gap-2 ez:overflow-x-auto">
              {SORTS.map(([label, href], i) => (
                <NextLink key={label} href={href} aria-current={i === 0 ? "true" : undefined} className={cn(chip, "ez:h-9 ez:px-3.5 ez:text-site-small", i === 0 && chipOn, focusRing)}>
                  {label}
                </NextLink>
              ))}
            </nav>
          }
        />
        <div className={cols(grid, shown.length)}>
          {shown.map((p, i) => (
            <StoreCard key={p.id} product={p} ratio={ratio} index={i} />
          ))}
        </div>
        {more && (
          <div className="ez:mt-4 ez:flex ez:justify-center ez:lg:mt-8">
            <ButtonLink href="/products" variant="outline">
              상품 더 보기
            </ButtonLink>
          </div>
        )}
      </section>
    );
  }
  return (
    <section data-slot="product-grid" data-variant="line" className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-9">
      <Head title={sectionTitle(data.title, "신상품")} count={count} aside={<AllLink />} />
      <ProductGrid products={shown} eager={2} grid={grid} fit />
    </section>
  );
}
