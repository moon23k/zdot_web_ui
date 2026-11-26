import NextLink from "next/link";
import type { ReactNode } from "react";
import { ProductGrid } from "../../blocks/product-grid";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import type { ProductSummary } from "../../types";
import { cn } from "../../utils/cn";
import { discountRate, won } from "../../utils/format";
import { focusRing } from "../../utils/styles";
import { Bar, BlankPrice, Pic } from "../kit";
import { guideRows } from "./defaults";
import { ShopNavLinks } from "./nav";
import { BEST_HREF, categoryHref, fillCols, FRESH_HREF, lastOdd, PRODUCTS_HREF, productView, ROW_ITEM, SHOP_TITLE, shownCount } from "./shared";
import { SHELF_DEFAULTS, SHELF_RATIO, shelfCols, shelfOf, shelfSizes, shelfView, type Shelf } from "./shelf";
import type { CatalogPromo, FooterLink, ShopFooterProps, ShopHeaderProps, ShopListProps } from "./types";

const CARD_SIZES = "(max-width: 1024px) 50vw, 320px";

const iconLink = cn("ez:relative ez:inline-flex ez:h-10 ez:min-w-10 ez:items-center ez:justify-center ez:gap-1.5 ez:text-fg ez:no-underline", focusRing);

function Head({ title, href }: { title: string; href?: string }) {
  return (
    <div className="ez:flex ez:items-center ez:justify-between ez:gap-3">
      <h2 className="ez:m-0 ez:text-site-section ez:text-fg">{title}</h2>
      {href && (
        <NextLink href={href} className={cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1 ez:text-site-lead ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}>
          {SHOP_TITLE.more}
          <Icon name="next" size="sm" />
        </NextLink>
      )}
    </div>
  );
}

function Card({ product, eager, shelf, sizes = CARD_SIZES }: { product: ProductSummary; eager?: boolean; shelf: Shelf; sizes?: string }) {
  const v = shelfView(productView(product), shelf);
  const label = v.soldOut ? "품절" : v.sample ? "예시" : null;
  return (
    <NextLink
      href={v.href}
      data-slot="product-card"
      data-sold-out={v.soldOut ? "" : undefined}
      data-sample={v.sample ? "" : undefined}
      className={cn("ez:group ez:flex ez:min-w-0 ez:flex-col ez:text-fg ez:no-underline", focusRing)}
    >
      <div className="ez:rounded-md ez:bg-surface-alt ez:p-3 ez:md:p-4.5">
        <Photo src={v.cover} alt={v.name} preload={eager} sizes={sizes} className={cn(SHELF_RATIO[shelf.ratio], "ez:rounded-sm ez:bg-surface", v.soldOut && "ez:opacity-45")} />
      </div>
      <div className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-3 ez:gap-y-0.5 ez:px-1 ez:pt-3.5">
        <span className={cn("ez:col-span-2 ez:truncate ez:text-site-lead ez:font-normal ez:group-hover:underline ez:underline-offset-4", v.soldOut ? "ez:text-muted" : "ez:text-fg")}>{v.name}</span>
        <span className={cn("ez:flex ez:min-w-0 ez:flex-wrap ez:items-baseline ez:gap-x-2 ez:text-site-lead ez:tabular-nums", v.soldOut ? "ez:text-muted" : "ez:text-fg")}>
          {v.rate > 0 && <span className="ez:font-medium ez:text-fg">{v.rate}%</span>}
          <span>{v.price}</span>
          {v.list && (
            <s className="ez:text-site-small ez:text-muted">
              <span className="ez:sr-only">정가 </span>
              {v.list}
            </s>
          )}
        </span>
        {label && <span className="ez:justify-self-end ez:text-site-small ez:text-muted">{label}</span>}
      </div>
    </NextLink>
  );
}

function BlankCard() {
  return (
    <div className="ez:flex ez:min-w-0 ez:flex-col">
      <div className="ez:rounded-md ez:bg-surface-alt ez:p-3 ez:md:p-4.5">
        <Photo src={null} alt="" className="ez:aspect-square ez:rounded-sm ez:bg-surface" />
      </div>
      <div className="ez:grid ez:gap-2 ez:px-1 ez:pt-3.5 ez:text-site-lead">
        <Bar />
        <BlankPrice className="ez:font-normal ez:text-muted" />
      </div>
    </div>
  );
}

const gridFour = "ez:grid ez:grid-cols-2 ez:gap-x-3 ez:gap-y-8 ez:md:gap-x-4 ez:md:gap-y-9 ez:lg:grid-cols-4";

const shelfRow = "ez:-mx-1.5 ez:flex ez:flex-wrap ez:gap-y-8 ez:md:-mx-2 ez:md:gap-y-9";

const shelfItem = cn(ROW_ITEM[4], "ez:px-1.5 ez:md:px-2");

function Row({ slot, title, href, items, shelf }: { slot: string; title: string; href: string; items: ProductSummary[]; shelf: Shelf }) {
  if (!items.length) {
    return (
      <section data-slot={slot} data-blank="" className="ez:grid ez:gap-7 ez:text-fg">
        <Head title={title} />
        <div className={gridFour}>
          {[0, 1, 2, 3].map((i) => (
            <BlankCard key={i} />
          ))}
        </div>
      </section>
    );
  }
  return (
    <section data-slot={slot} className="ez:grid ez:gap-7 ez:text-fg">
      <Head title={title} href={href} />
      <div className={shelfRow}>
        {items.map((p, i) => (
          <div key={p.id} className={cn(shelfItem, lastOdd(i, items.length, 4))}>
            <Card product={p} shelf={shelf} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Header({ name, logoUrl, cartCount, nav, links }: ShopHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="showroom" className="ez:bg-transparent">
      <div className="ez:mx-auto ez:grid ez:min-h-16 ez:max-w-wrap ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-6 ez:px-page ez:lg:min-h-19 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <NextLink href="/" className={cn("ez:min-w-0 ez:justify-self-start ez:text-site-heading ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:justify-center ez:gap-6.5 ez:overflow-hidden ez:whitespace-nowrap ez:max-lg:hidden">
          <ShopNavLinks
            items={[nav.all, nav.fresh, nav.best, ...nav.categories]}
            className={cn("ez:text-site-lead ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}
            currentClassName="ez:font-medium ez:text-fg"
          />
        </nav>
        <div className="ez:flex ez:items-center ez:justify-self-end ez:gap-1">
          <NextLink href={links.search} aria-label="검색" className={iconLink}>
            <Icon name="search" />
          </NextLink>
          <NextLink href={links.account.href} aria-label={links.account.label} className={iconLink}>
            <Icon name="user" />
          </NextLink>
          <NextLink href={links.likes} aria-label="찜" className={iconLink}>
            <Icon name="heart" />
          </NextLink>
          <NextLink href={links.cart} aria-label={cartCount ? `장바구니 ${cartCount}` : "장바구니"} className={cn(iconLink, "ez:pl-2")}>
            <span className="ez:relative ez:inline-flex">
              <Icon name="bag" />
              {cartCount ? <span aria-hidden="true" className="ez:absolute ez:-top-0.5 ez:-right-1 ez:size-1.75 ez:rounded-full ez:bg-primary" /> : null}
            </span>
            {cartCount ? (
              <span aria-hidden="true" className="ez:text-site-lead ez:text-muted ez:tabular-nums">
                {cartCount}
              </span>
            ) : null}
          </NextLink>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:grid ez:content-start ez:gap-4">
      <span className="ez:text-site-small ez:font-normal ez:text-muted">{title}</span>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-2.5 ez:p-0 ez:text-site-lead">
        {items.map((l) => (
          <li key={l.href}>
            <NextLink href={l.href} className={cn("ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", l.strong && "ez:font-medium", focusRing)}>
              {l.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer({ storeName, phone, hours, legal, shop, guide, account, terms }: ShopFooterProps) {
  return (
    <footer data-slot="site-footer" data-variant="showroom">
      <div className="ez:rounded-t-lg ez:bg-surface-alt ez:text-fg">
        <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-14 ez:pb-10 ez:md:pt-16 ez:md:pb-14">
          <div className="ez:grid ez:grid-cols-2 ez:gap-x-8 ez:gap-y-10 ez:md:grid-cols-3 ez:lg:grid-cols-[4fr_3fr_3fr_3fr_3fr]">
            <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-4 ez:md:col-span-3 ez:lg:col-span-1">
              <span className="ez:text-site-small ez:font-normal ez:text-muted">고객센터</span>
              {(phone || hours) && (
                <div className="ez:grid ez:gap-1.5">
                  {phone && (
                    <a href={`tel:${phone}`} className={cn("ez:justify-self-start ez:text-site-section ez:text-fg ez:tabular-nums ez:no-underline", focusRing)}>
                      {phone}
                    </a>
                  )}
                  {hours && <span className="ez:text-site-lead ez:text-muted">{hours}</span>}
                </div>
              )}
            </div>
            <FooterColumn title="쇼핑" items={shop} />
            <FooterColumn title="안내" items={guide} />
            <FooterColumn title="내 쇼핑" items={account} />
            {terms.length > 0 && <FooterColumn title="약관" items={terms} />}
          </div>
          <div className="ez:mt-12 ez:flex ez:flex-col ez:gap-3 ez:text-site-small ez:leading-relaxed ez:text-muted ez:md:mt-14 ez:md:flex-row ez:md:justify-between ez:md:gap-10">
            <p className="ez:m-0">{legal}</p>
            <p className="ez:m-0 ez:shrink-0">© {storeName}</p>
          </div>
          <p
            aria-hidden="true"
            className="ez:m-0 ez:mt-10 ez:truncate ez:text-center ez:text-site-name ez:text-site-faint ez:md:mt-12 ez:md:text-site-display-lg ez:lg:text-site-hero"
          >
            {storeName}
          </p>
        </div>
      </div>
    </footer>
  );
}

type HeroProduct = NonNullable<SectionProps<"hero">["data"]["products"]>[number];

function HeroProductTile({ product }: { product: HeroProduct }) {
  const sale = product.sale_price ?? product.list_price;
  const rate = !product.sold_out && product.list_price != null && product.sale_price != null ? discountRate(product.list_price, product.sale_price) : 0;
  return (
    <NextLink
      href={product.href ?? `/products/${product.id}`}
      className={cn("ez:group ez:grid ez:grid-cols-[3fr_2fr] ez:items-start ez:gap-5 ez:rounded-lg ez:bg-surface-alt ez:p-4 ez:text-fg ez:no-underline ez:md:gap-6 ez:md:p-5", focusRing)}
    >
      <Photo src={product.cover_url} alt={product.name} sizes="(max-width: 1024px) 60vw, 280px" className={cn("ez:aspect-square ez:rounded-sm ez:bg-surface", product.sold_out && "ez:opacity-45")} />
      <span className="ez:grid ez:min-w-0 ez:content-start ez:gap-1 ez:pt-1.5">
        <span className="ez:line-clamp-2 ez:text-site-item ez:font-normal ez:group-hover:underline ez:underline-offset-4">{product.name}</span>
        {sale != null && (
          <span className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-2 ez:text-site-item ez:font-normal ez:tabular-nums">
            {rate > 0 && <span className="ez:font-medium">{rate}%</span>}
            {won(sale)}
          </span>
        )}
        {product.sold_out && <span className="ez:text-site-small ez:text-muted">품절</span>}
      </span>
    </NextLink>
  );
}

function BlankHeroProduct() {
  return (
    <div className="ez:grid ez:grid-cols-[3fr_2fr] ez:items-start ez:gap-5 ez:rounded-lg ez:bg-surface-alt ez:p-4 ez:md:gap-6 ez:md:p-5">
      <Photo src={null} alt="" className="ez:aspect-square ez:rounded-sm ez:bg-surface" />
      <span className="ez:grid ez:content-start ez:gap-2.5 ez:pt-1.5 ez:text-site-item">
        <Bar />
        <BlankPrice className="ez:font-normal ez:text-muted" />
      </span>
    </div>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const sub = title ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const blank = !title && !image;
  const products = blank ? [] : (data.products ?? []);
  const pick = products.find((p) => p.cover_url) ?? products[0] ?? null;
  const side = blank || pick !== null;
  const banner = title && data.href && data.href !== PRODUCTS_HREF ? data.href : null;
  const photo = <Photo src={image} alt={title ?? ""} preload sizes="(max-width: 1024px) 100vw, 800px" tone={0} className="ez:aspect-[4/3] ez:h-full ez:rounded-lg ez:lg:aspect-auto" />;
  return (
    <section
      data-slot="hero"
      data-variant="showroom"
      data-blank={blank ? "" : undefined}
      className="ez:grid ez:grid-cols-1 ez:gap-3 ez:text-fg ez:md:grid-cols-2 ez:md:gap-4 ez:lg:min-h-148 ez:lg:grid-cols-[13fr_8fr] ez:lg:grid-rows-[67fr_77fr]"
    >
      <div className="ez:min-h-0 ez:md:col-span-2 ez:lg:col-span-1 ez:lg:row-span-2">
        {banner ? (
          <NextLink href={banner} className={cn("ez:block ez:h-full", focusRing)}>
            {photo}
          </NextLink>
        ) : (
          photo
        )}
      </div>
      <div className={cn("ez:flex ez:min-h-0 ez:min-w-0 ez:flex-col ez:gap-6 ez:rounded-lg ez:bg-surface-alt ez:p-7 ez:md:px-10 ez:md:pt-9 ez:md:pb-8", !side && "ez:md:col-span-2 ez:lg:col-span-1 ez:lg:row-span-2")}>
        <div className="ez:grid ez:gap-3.5">
          {context.storeName ? (
            <p className="ez:m-0 ez:text-site-name ez:break-keep ez:text-fg ez:lg:text-site-display-md">{context.storeName}</p>
          ) : (
            <span className="ez:text-site-name ez:lg:text-site-display-md">
              <Bar size="long" strong />
            </span>
          )}
          {title ? (
            <div className="ez:grid ez:gap-1.5">
              <h1 className="ez:m-0 ez:text-site-item ez:font-normal ez:text-balance ez:text-fg">{title}</h1>
              {sub && (
                <p data-slot="hero-sub" className="ez:m-0 ez:text-site-lead ez:text-muted">
                  {sub}
                </p>
              )}
            </div>
          ) : (
            <span className="ez:text-site-item">
              <Bar size="long" />
            </span>
          )}
        </div>
        <div className="ez:mt-auto">
          {blank ? (
            <span className="ez:text-site-lead">
              <Bar size="short" />
            </span>
          ) : (
            <NextLink href={PRODUCTS_HREF} className={cn("ez:inline-flex ez:items-center ez:gap-2 ez:text-site-lead ez:font-normal ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing)}>
              {SHOP_TITLE.all}
              <Icon name="right" size="sm" />
            </NextLink>
          )}
        </div>
      </div>
      {blank ? <BlankHeroProduct /> : pick && <HeroProductTile product={pick} />}
    </section>
  );
}

type CategoryTile = { title: string; image?: string | null; href: string; count?: number | null };

const gridThree = "ez:grid ez:grid-cols-2 ez:gap-x-3 ez:gap-y-6 ez:md:gap-4";

const TILE_RATIO = 416 / 360;

export function Categories({ data, context }: SectionProps<"category_tiles">) {
  const source: CategoryTile[] = data.items?.length
    ? data.items.map((t) => ({ title: t.title, image: t.image, href: t.href ?? PRODUCTS_HREF }))
    : context.categories.filter((c) => c.product_count !== 0).map((c) => ({ title: c.name, image: c.cover_url, href: categoryHref(c.id), count: c.product_count }));
  const items = source.slice(0, 3);
  if (!items.length) {
    return (
      <section data-slot="category-tiles" data-blank="" className="ez:grid ez:gap-7 ez:text-fg">
        <Head title={SHOP_TITLE.categories} />
        <div className={cn(gridThree, fillCols(3))}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn("ez:grid ez:content-start", lastOdd(i, 3, 3))}>
              <Pic ratio={TILE_RATIO} tone={i} />
              <span className="ez:px-1 ez:pt-4 ez:text-site-item">
                <Bar size="short" />
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section data-slot="category-tiles" className="ez:grid ez:gap-7 ez:text-fg">
      <Head title={SHOP_TITLE.categories} href={PRODUCTS_HREF} />
      <div className={cn(gridThree, fillCols(items.length))}>
        {items.map((t, i) => (
          <NextLink key={`${t.href}-${i}`} href={t.href} className={cn("ez:group ez:grid ez:min-w-0 ez:content-start ez:text-fg ez:no-underline", lastOdd(i, items.length, 3), focusRing)}>
            <Pic src={t.image} alt={t.title} ratio={TILE_RATIO} tone={i} />
            <span className="ez:flex ez:items-center ez:justify-between ez:gap-3 ez:px-1 ez:pt-4">
              <span className="ez:flex ez:min-w-0 ez:items-baseline ez:gap-2">
                <span className="ez:truncate ez:text-site-item ez:font-normal ez:group-hover:underline ez:underline-offset-4">{t.title}</span>
                {t.count != null && <span className="ez:text-site-small ez:text-muted ez:tabular-nums">{t.count}</span>}
              </span>
              <Icon name="right" size="sm" className="ez:text-muted" />
            </span>
          </NextLink>
        ))}
      </div>
    </section>
  );
}

export function NewArrivals({ data, context, grid }: SectionProps<"product_grid">) {
  return <Row slot="product-grid" title={SHOP_TITLE.fresh} href={FRESH_HREF} items={context.products.slice(0, shownCount(data.count, grid?.pc ?? 4))} shelf={shelfOf("showroom", context.shelf)} />;
}

export function Best({ data, context, grid }: SectionProps<"best_grid">) {
  return <Row slot="best-grid" title={SHOP_TITLE.best} href={BEST_HREF} items={(data.items ?? []).slice(0, grid?.pc ?? 4)} shelf={shelfOf("showroom", context.shelf)} />;
}

const curationRow = "ez:grid ez:grid-cols-[auto_minmax(0,1fr)_auto] ez:items-center ez:gap-4 ez:rounded-md ez:bg-surface ez:p-3 ez:pr-5 ez:md:gap-5";

export function Curation({ data }: SectionProps<"curation">) {
  const items = (data.items ?? []).slice(0, 3);
  const empty = !items.length;
  return (
    <section data-slot="curation" data-blank={empty ? "" : undefined} className="ez:grid ez:grid-cols-1 ez:gap-3 ez:text-fg ez:md:grid-cols-2 ez:md:gap-4">
      <Photo src={empty ? null : data.image} alt="" sizes="(max-width: 768px) 100vw, 640px" tone={1} className="ez:aspect-[4/3] ez:h-full ez:rounded-lg ez:md:aspect-auto ez:md:min-h-120" />
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:rounded-lg ez:bg-surface-alt ez:p-5 ez:md:p-9">
        <h2 className="ez:m-0 ez:px-1 ez:text-site-section ez:text-fg">{SHOP_TITLE.curation}</h2>
        <ul className="ez:m-0 ez:mt-6 ez:grid ez:list-none ez:gap-2 ez:p-0">
          {empty
            ? [0, 1, 2].map((i) => (
                <li key={i} className={curationRow}>
                  <Photo src={null} alt="" tone={i} className="ez:size-16 ez:rounded-sm ez:md:size-21" />
                  <span className="ez:text-site-lead">
                    <Bar />
                  </span>
                  <BlankPrice className="ez:text-site-lead ez:font-normal ez:text-muted" />
                </li>
              ))
            : items.map((t, i) => (
                <li key={`${t.title}-${i}`}>
                  <NextLink href={t.href ?? PRODUCTS_HREF} className={cn(curationRow, "ez:group ez:text-fg ez:no-underline", focusRing)}>
                    <Photo src={t.image} alt={t.title} sizes="84px" tone={i} className="ez:size-16 ez:rounded-sm ez:md:size-21" />
                    <span className="ez:line-clamp-2 ez:text-site-lead ez:font-normal ez:group-hover:underline ez:underline-offset-4">{t.title}</span>
                    {t.price ? <span className="ez:text-site-lead ez:tabular-nums">{t.price}</span> : <span />}
                  </NextLink>
                </li>
              ))}
        </ul>
        <div className="ez:mt-auto ez:px-1 ez:pt-8">
          {empty ? (
            <span className="ez:text-site-lead">
              <Bar size="short" />
            </span>
          ) : (
            <NextLink href={PRODUCTS_HREF} className={cn("ez:inline-flex ez:items-center ez:gap-2 ez:text-site-lead ez:font-normal ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing)}>
              {SHOP_TITLE.more}
              <Icon name="right" size="sm" />
            </NextLink>
          )}
        </div>
      </div>
    </section>
  );
}

type GuideCell = { label: string; value: string | null; href?: string | null };

const guideCell = "ez:flex ez:min-w-0 ez:items-start ez:pt-5 ez:text-fg ez:no-underline";

function GuideBody({ cell }: { cell: GuideCell }) {
  return (
    <span className="ez:grid ez:min-w-0 ez:gap-0.5">
      <span className="ez:text-site-small ez:text-muted">{cell.label}</span>
      {cell.value ? (
        <span className="ez:text-site-lead ez:tabular-nums">{cell.value}</span>
      ) : (
        <span className="ez:text-site-lead">
          <Bar />
        </span>
      )}
    </span>
  );
}

export function Guide({ data, context }: SectionProps<"shop_guide">) {
  const rows = guideRows(data, context.shipping);
  const empty = !rows.delivery && !rows.exchange && !rows.returns && !rows.center;
  const cells: GuideCell[] = [
    { label: "배송비", value: rows.delivery?.value ?? null },
    { label: "교환 배송비", value: rows.exchange?.value ?? null },
    { label: "반품 배송비", value: rows.returns?.value ?? null, href: rows.returns?.href },
    { label: "고객센터", value: rows.center?.value ?? null, href: rows.center?.href },
  ];
  return (
    <section data-slot="shop-guide" data-blank={empty ? "" : undefined} className="ez:grid ez:grid-cols-1 ez:gap-x-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:text-fg ez:sm:grid-cols-2 ez:md:gap-x-4 ez:lg:grid-cols-4">
      {cells.map((cell) =>
        cell.href && cell.value ? (
          cell.href.startsWith("tel:") ? (
            <a key={cell.label} href={cell.href} className={cn(guideCell, "ez:hover:underline ez:underline-offset-4", focusRing)}>
              <GuideBody cell={cell} />
            </a>
          ) : (
            <NextLink key={cell.label} href={cell.href} className={cn(guideCell, "ez:hover:underline ez:underline-offset-4", focusRing)}>
              <GuideBody cell={cell} />
            </NextLink>
          )
        ) : (
          <div key={cell.label} className={guideCell}>
            <GuideBody cell={cell} />
          </div>
        ),
      )}
    </section>
  );
}

function Promo({ promo, single }: { promo: CatalogPromo; single: boolean }) {
  return (
    <NextLink href={promo.href} className={cn("ez:group ez:block", single ? "ez:col-span-1 ez:lg:col-span-2" : "ez:col-span-2", "ez:self-start ez:text-fg ez:no-underline", focusRing)}>
      <span className="ez:relative ez:block">
        <span className="ez:relative ez:block" style={{ aspectRatio: 2.08 }}>
          <Photo src={promo.image} alt="" sizes="(max-width: 1024px) 100vw, 860px" tone={2} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-md" />
        </span>
        <span className="ez:mt-3 ez:grid ez:gap-5 ez:rounded-md ez:bg-surface-alt ez:p-6 ez:sm:absolute ez:sm:right-6 ez:sm:bottom-6 ez:sm:left-6 ez:sm:mt-0 ez:sm:max-w-90 ez:sm:bg-surface ez:md:p-7">
          <span className="ez:text-site-section ez:text-balance">{promo.title}</span>
          <span className="ez:inline-flex ez:items-center ez:gap-2 ez:text-site-lead ez:font-normal ez:group-hover:underline ez:underline-offset-4">
            {SHOP_TITLE.more}
            <Icon name="right" size="sm" />
          </span>
        </span>
      </span>
    </NextLink>
  );
}

function SortMenu({ sorts }: { sorts: ShopListProps["sorts"] }) {
  const current = sorts.find((s) => s.on) ?? sorts[0];
  if (!current) return null;
  return (
    <nav aria-label="정렬" className="ez:shrink-0">
      <details className="ez:group ez:relative">
        <summary className={cn("ez:flex ez:min-h-10 ez:cursor-pointer ez:list-none ez:items-center ez:gap-1.5 ez:text-site-lead ez:text-fg ez:[&::-webkit-details-marker]:hidden", focusRing)}>
          {current.label}
          <Icon name="down" size="sm" className="ez:text-muted ez:transition-transform ez:group-open:rotate-180" />
        </summary>
        <ul className="ez:absolute ez:right-0 ez:z-10 ez:m-0 ez:mt-1 ez:grid ez:min-w-40 ez:list-none ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-2">
          {sorts.map((s) => (
            <li key={s.href}>
              <NextLink
                href={s.href}
                aria-current={s.on ? "true" : undefined}
                className={cn("ez:flex ez:min-h-10 ez:items-center ez:rounded-sm ez:px-3 ez:text-site-lead ez:no-underline ez:hover:bg-surface-alt", s.on ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}
              >
                {s.label}
              </NextLink>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}

function Crumbs({ items }: { items: ShopListProps["crumbs"] }) {
  return (
    <nav aria-label="현재 위치" className="ez:flex ez:flex-wrap ez:items-center ez:gap-1.5 ez:text-site-small ez:text-muted">
      {items.map((c, i) => (
        <span key={c.href} className="ez:flex ez:items-center ez:gap-1.5">
          {i > 0 && <Icon name="next" size="sm" />}
          {i === items.length - 1 ? (
            <span aria-current="page">{c.label}</span>
          ) : (
            <NextLink href={c.href} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}>
              {c.label}
            </NextLink>
          )}
        </span>
      ))}
    </nav>
  );
}

export function List({ title, count, crumbs, tabs, sorts, products, more, search, promo, emptyHref, shelf = SHELF_DEFAULTS.showroom }: ShopListProps) {
  const sizes = shelfSizes(shelf, "showroom", CARD_SIZES);
  const cards: ReactNode[] = products.map((p, i) => <Card key={p.id} product={p} eager={i < 3} shelf={shelf} sizes={sizes} />);
  if (promo && cards.length) cards.splice(Math.min(3, cards.length), 0, <Promo key="promo" promo={promo} single={shelf.cols_mobile === 1} />);
  return (
    <div data-slot="catalog-view" className="ez:grid ez:grid-cols-1 ez:text-fg">
      <Crumbs items={crumbs} />
      <div className="ez:mt-4 ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1">
        <h1 className="ez:m-0 ez:text-site-page-sm ez:text-fg ez:md:text-site-figure-lg">{title}</h1>
        {count ? <span className="ez:text-site-item ez:font-normal ez:text-muted ez:tabular-nums">{count}</span> : null}
      </div>
      {search && <div className="ez:mt-6">{search}</div>}
      <div className="ez:mt-8 ez:flex ez:items-center ez:justify-between ez:gap-6">
        <nav aria-label="카테고리" className="ez:-mx-page ez:flex ez:min-w-0 ez:gap-6 ez:overflow-x-auto ez:px-page ez:whitespace-nowrap ez:md:mx-0 ez:md:gap-8 ez:md:px-0">
          {tabs.map((t) => (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={cn("ez:inline-flex ez:shrink-0 ez:items-baseline ez:gap-1.5 ez:py-2 ez:text-site-lead ez:no-underline ez:hover:text-fg", t.on ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}
            >
              {t.label}
              {t.count != null && <span className="ez:text-site-small ez:font-normal ez:text-muted ez:tabular-nums">{t.count}</span>}
            </NextLink>
          ))}
        </nav>
        <SortMenu sorts={sorts} />
      </div>
      <div className="ez:mt-8">
        {products.length ? (
          <div className={cn("ez:grid ez:grid-flow-row-dense ez:gap-x-3 ez:gap-y-8 ez:md:gap-x-4 ez:md:gap-y-9", shelfCols(shelf))}>{cards}</div>
        ) : (
          <ProductGrid products={[]} emptyHref={emptyHref} />
        )}
      </div>
      {more && (
        <div className="ez:mt-14 ez:flex ez:flex-col ez:items-center ez:gap-4">
          {count ? (
            <span className="ez:text-site-small ez:text-muted ez:tabular-nums">
              {products.length} / {count}
            </span>
          ) : null}
          <NextLink
            href={more}
            className={cn("ez:inline-flex ez:h-11.5 ez:items-center ez:gap-2 ez:rounded-sm ez:bg-surface-alt ez:px-6 ez:text-site-lead ez:font-medium ez:text-fg ez:no-underline", focusRing)}
          >
            더 보기
            <Icon name="down" size="sm" />
          </NextLink>
        </div>
      )}
    </div>
  );
}
