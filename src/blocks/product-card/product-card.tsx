import NextLink from "next/link";
import { Badge } from "../../components/badge";
import { Photo } from "../../components/photo";
import type { ProductSummary } from "../../types";
import { cn } from "../../utils/cn";
import { discountRate, won } from "../../utils/format";
import { focusRing, pointTag } from "../../utils/styles";

export function ProductCard({
  product,
  preload,
  tone,
  rank,
}: {
  product: ProductSummary;
  preload?: boolean;
  tone?: number;
  rank?: number;
}) {
  const sale = discountRate(product.list_price, product.sale_price);
  const tag = product.sold_out ? "품절" : sale > 0 ? `${sale}%` : null;
  return (
    <NextLink
      href={`/products/${product.id}`}
      data-slot="product-card"
      data-sold-out={product.sold_out || undefined}
      data-sample={product.sample || undefined}
      className={cn("ez:group ez:flex ez:flex-col ez:gap-3.5 ez:text-fg ez:no-underline", focusRing)}
    >
      <span className="ez:relative ez:block ez:aspect-[4/5]">
        <Photo
          src={product.cover_url}
          alt={product.name}
          preload={preload}
          tone={tone}
          className={cn("ez:absolute ez:inset-0 ez:aspect-auto ez:h-full", product.sold_out && "ez:opacity-45")}
        />
        {product.sample && <Badge className="ez:absolute ez:left-2.5 ez:top-2.5 ez:z-1">예시</Badge>}
      </span>
      <span className="ez:flex ez:flex-col ez:gap-1">
        {tag && (
          <span className={cn(pointTag, product.sold_out && "ez:text-muted")}>
            <span aria-hidden="true" className={cn("ez:size-1.25 ez:rounded-full", product.sold_out ? "ez:bg-muted" : "ez:bg-primary")} />
            {tag}
          </span>
        )}
        <span className="ez:flex ez:items-baseline ez:gap-2.5">
          {rank != null && <span className="ez:font-body ez:text-site-rank ez:font-normal ez:tabular-nums ez:text-primary">{rank}</span>}
          <span className="ez:line-clamp-2 ez:text-site-lead ez:group-hover:underline ez:underline-offset-4">{product.name}</span>
        </span>
        <span className="ez:flex ez:items-baseline ez:tabular-nums ez:whitespace-nowrap">
          <strong className={cn("ez:text-site-lead ez:font-medium", product.sold_out ? "ez:text-muted" : "ez:text-fg")}>{won(product.sale_price)}</strong>
          {sale > 0 && !product.sold_out && (
            <s className="ez:ml-2 ez:text-site-small ez:text-muted">
              <span className="ez:sr-only">정가 </span>
              {won(product.list_price)}
            </s>
          )}
        </span>
      </span>
    </NextLink>
  );
}
