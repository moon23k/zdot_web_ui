import NextLink from "next/link";
import type { ReactNode } from "react";
import { ProductGrid } from "../../blocks/product-grid";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { StarRow } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import type { ProductSummary } from "../../types";
import { cn } from "../../utils/cn";
import { discountRate, won } from "../../utils/format";
import { focusRing } from "../../utils/styles";
import { Bar, BlankPrice, BlankStars, Lines } from "../kit";
import { ShopNavLinks } from "./nav";
import { alone, BEST_HREF, categoryHref, fillCols, fives, FRESH_HREF, PRODUCTS_HREF, productView, ROW_ITEM, SHOP_TITLE, shownCount } from "./shared";
import { SHELF_DEFAULTS, SHELF_RATIO, shelfCols, shelfOf, shelfSizes, shelfView, type Shelf } from "./shelf";
import type { FooterLink, ShopFooterProps, ShopHeaderProps, ShopListProps } from "./types";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:box-border ez:px-page";

const heading = "ez:m-0 ez:font-body ez:text-site-heading ez:font-normal ez:text-fg";

const tlink = cn(
  "ez:inline-flex ez:self-start ez:border-0 ez:border-b ez:border-solid ez:border-site-edge ez:pb-0.5 ez:text-site-lead ez:text-muted ez:no-underline ez:hover:border-fg ez:hover:text-fg",
  focusRing,
);

const iconLink = cn("ez:relative ez:inline-flex ez:h-10 ez:min-w-10 ez:items-center ez:justify-center ez:gap-1 ez:px-2 ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const navLink = cn("ez:flex ez:h-full ez:items-center ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const navOn = "ez:font-medium ez:text-fg";

const cols5 = "ez:grid ez:grid-cols-2 ez:gap-x-4 ez:gap-y-10 ez:md:grid-cols-3 ez:md:gap-x-5 ez:lg:grid-cols-5";

const listGap = "ez:grid ez:gap-x-4 ez:gap-y-10 ez:md:gap-x-5";

const CARD_SIZES = "(max-width: 768px) 50vw, 280px";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" aria-hidden="true" className="ez:size-5 ez:shrink-0">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Header({ name, logoUrl, cartCount, nav, links }: ShopHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="catalog" className="ez:bg-surface ez:text-fg">
      <div className={cn(wrap, "ez:grid ez:h-16 ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-4 ez:lg:h-21 ez:lg:grid-cols-[1fr_minmax(0,30rem)_1fr] ez:lg:gap-10")}>
        <NextLink href="/" className={cn("ez:min-w-0 ez:text-site-heading ez:font-normal ez:text-fg ez:no-underline", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <form
          role="search"
          action={PRODUCTS_HREF}
          className="ez:flex ez:h-11 ez:items-center ez:gap-2.5 ez:rounded-md ez:border ez:border-solid ez:border-site-field ez:bg-surface ez:px-4 ez:text-muted ez:focus-within:outline-2 ez:focus-within:outline-offset-2 ez:focus-within:outline-primary ez:max-lg:hidden"
        >
          <Icon name="search" />
          <input
            type="search"
            name="q"
            aria-label="상품 검색"
            placeholder="검색"
            className="ez:h-full ez:min-w-0 ez:flex-1 ez:border-0 ez:bg-transparent ez:p-0 ez:font-body ez:text-site-body ez:text-fg ez:outline-none ez:placeholder:text-muted"
          />
        </form>
        <div className="ez:flex ez:items-center ez:justify-end ez:gap-1 ez:lg:gap-2">
          <NextLink href={links.search} aria-label="검색" className={cn(iconLink, "ez:lg:hidden")}>
            <Icon name="search" size="lg" />
          </NextLink>
          <NextLink href={links.account.href} aria-label={links.account.label} className={iconLink}>
            <Icon name="user" size="lg" />
          </NextLink>
          <NextLink href={links.likes} aria-label="찜" className={iconLink}>
            <Icon name="heart" size="lg" />
          </NextLink>
          <NextLink href={links.cart} aria-label={cartCount ? `장바구니 ${cartCount}` : "장바구니"} className={iconLink}>
            <span className="ez:relative ez:inline-flex">
              <Icon name="bag" size="lg" />
              {cartCount ? <span aria-hidden="true" className="ez:absolute ez:-top-0.5 ez:-right-0.5 ez:size-1.75 ez:rounded-full ez:bg-primary" /> : null}
            </span>
            {cartCount ? (
              <span aria-hidden="true" className="ez:text-site-small ez:text-muted ez:tabular-nums">
                {cartCount}
              </span>
            ) : null}
          </NextLink>
        </div>
      </div>
      <div className="ez:border-0 ez:border-y ez:border-solid ez:border-site-line ez:max-lg:hidden">
        <nav aria-label="주요 메뉴" className={cn(wrap, "ez:flex ez:h-13 ez:items-center ez:gap-9 ez:overflow-hidden ez:whitespace-nowrap")}>
          <span className="ez:flex ez:h-5 ez:shrink-0 ez:items-center ez:gap-2 ez:border-0 ez:border-r ez:border-solid ez:border-site-line ez:pr-9 ez:text-muted">
            <MenuIcon />
            <ShopNavLinks items={[nav.all]} className={navLink} currentClassName={navOn} />
          </span>
          <span className="ez:flex ez:h-full ez:min-w-0 ez:items-center ez:gap-8">
            <ShopNavLinks items={[nav.fresh, nav.best, ...nav.categories]} className={navLink} currentClassName={navOn} />
          </span>
        </nav>
      </div>
    </header>
  );
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:flex ez:flex-col">
      <span className="ez:mb-3.5 ez:text-site-note ez:font-normal ez:text-fg">{title}</span>
      {items.map((l) => (
        <NextLink
          key={l.href}
          href={l.href}
          className={cn("ez:self-start ez:text-site-note ez:leading-loose ez:no-underline ez:hover:text-fg", l.strong ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}
        >
          {l.label}
        </NextLink>
      ))}
    </nav>
  );
}

export function Footer({ storeName, phone, hours, legal, shop, guide, account, terms }: ShopFooterProps) {
  return (
    <footer data-slot="site-footer" data-variant="catalog" className="ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:text-fg">
      <div className={cn(wrap, "ez:grid ez:grid-cols-2 ez:gap-x-8 ez:gap-y-10 ez:pt-13 ez:pb-10 ez:md:grid-cols-4 ez:lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]")}>
        <div className="ez:col-span-2 ez:flex ez:flex-col ez:md:col-span-4 ez:lg:col-span-1">
          <span className="ez:mb-3.5 ez:text-site-note ez:font-normal ez:text-fg">고객센터</span>
          {phone && (
            <a href={`tel:${phone}`} className={cn("ez:mb-2 ez:self-start ez:text-site-rank ez:font-normal ez:text-fg ez:tabular-nums ez:no-underline", focusRing)}>
              {phone}
            </a>
          )}
          {hours && <span className="ez:text-site-note ez:text-muted">{hours}</span>}
        </div>
        <FooterColumn title="쇼핑 안내" items={shop} />
        <FooterColumn title="계정" items={account} />
        <FooterColumn title="고객 지원" items={guide} />
        {terms.length > 0 && <FooterColumn title="약관" items={terms} />}
      </div>
      <div className={wrap}>
        <div className="ez:grid ez:gap-x-8 ez:gap-y-1.5 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-7 ez:pb-10 ez:lg:grid-cols-[1.6fr_4fr]">
          <p className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg ez:lg:row-span-2">{storeName}</p>
          <p className="ez:m-0 ez:text-site-small ez:text-muted">{legal}</p>
          <p className="ez:m-0 ez:text-site-small ez:text-muted">© {storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function Price({ rate, price, list, soldOut }: { rate: number; price: string; list: string | null; soldOut: boolean }) {
  return (
    <span className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-1.5 ez:tabular-nums">
      {rate > 0 && <span className="ez:text-site-figure ez:font-medium ez:text-fg">{rate}%</span>}
      <span className={cn("ez:text-site-figure ez:font-normal", soldOut ? "ez:text-muted" : "ez:text-fg")}>{price}</span>
      {list && (
        <s className="ez:text-site-small ez:text-muted">
          <span className="ez:sr-only">정가 </span>
          {list}
        </s>
      )}
    </span>
  );
}

function Card({ product, rank, tone, preload, shelf, sizes = CARD_SIZES }: { product: ProductSummary; rank?: number; tone: number; preload?: boolean; shelf: Shelf; sizes?: string }) {
  const v = shelfView(productView(product), shelf);
  const tags = [v.soldOut && "품절", v.sample && "예시"].filter(Boolean) as string[];
  return (
    <NextLink
      href={v.href}
      data-slot="product-card"
      data-sold-out={v.soldOut || undefined}
      data-sample={v.sample || undefined}
      className={cn("ez:group ez:grid ez:min-w-0 ez:content-start ez:gap-3.5 ez:text-fg ez:no-underline", focusRing)}
    >
      <Photo
        src={v.cover}
        alt={v.name}
        tone={tone}
        preload={preload}
        sizes={sizes}
        className={cn(SHELF_RATIO[shelf.ratio], "ez:rounded-sm", v.soldOut && "ez:opacity-45")}
      />
      <span className="ez:flex ez:gap-3.5">
        {rank != null && <span className="ez:w-6 ez:shrink-0 ez:text-site-name ez:leading-none ez:text-muted ez:tabular-nums">{rank}</span>}
        <span className="ez:grid ez:min-w-0 ez:flex-1 ez:content-start ez:gap-1.5">
          <span className="ez:flex ez:items-baseline ez:gap-2">
            <span className="ez:min-w-0 ez:flex-1 ez:truncate ez:text-site-body ez:underline-offset-4 ez:group-hover:underline">{v.name}</span>
            {tags.map((t) => (
              <span key={t} className="ez:shrink-0 ez:text-site-small ez:font-normal ez:text-muted">
                {t}
              </span>
            ))}
          </span>
          <Price rate={v.rate} price={v.price} list={v.list} soldOut={v.soldOut} />
        </span>
      </span>
    </NextLink>
  );
}

function BlankCard({ tone }: { tone: number }) {
  return (
    <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-3.5">
      <Photo src={null} alt="" tone={tone} className="ez:aspect-square ez:rounded-sm" />
      <span className="ez:grid ez:gap-1.5">
        <span className="ez:text-site-body">
          <Bar />
        </span>
        <BlankPrice className="ez:text-site-figure" />
      </span>
    </div>
  );
}

function Head({ title, href }: { title: string; href?: string }) {
  return (
    <div className="ez:mb-6 ez:flex ez:items-end ez:justify-between ez:gap-3">
      <h2 className={heading}>{title}</h2>
      {href && (
        <NextLink href={href} className={cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-0.5 ez:text-site-note ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}>
          {SHOP_TITLE.more}
          <Icon name="next" size="sm" />
        </NextLink>
      )}
    </div>
  );
}

const bestRow = "ez:-mx-2 ez:flex ez:flex-wrap ez:gap-y-10 ez:md:-mx-2.5";

const bestItem = cn(ROW_ITEM[5], "ez:px-2 ez:md:px-2.5");

function ProductRow({
  slot,
  title,
  href,
  products,
  count,
  ranked,
  shelf,
}: {
  slot: string;
  title: string;
  href: string;
  products: ProductSummary[];
  count: number;
  ranked?: boolean;
  shelf: Shelf;
}) {
  if (!products.length) {
    return (
      <section data-slot={slot} data-variant="catalog" data-blank="" className="ez:text-fg">
        <Head title={title} />
        <div className={cols5}>
          {Array.from({ length: count }, (_, i) => (
            <BlankCard key={i} tone={i} />
          ))}
        </div>
      </section>
    );
  }
  return (
    <section data-slot={slot} data-variant="catalog" className="ez:text-fg">
      <Head title={title} href={href} />
      {ranked ? (
        <div className={bestRow}>
          {fives(products.slice(0, count)).map((p, i, shown) => (
            <div key={p.id} className={cn(bestItem, alone(i, shown.length))}>
              <Card product={p} tone={i} rank={i + 1} shelf={shelf} />
            </div>
          ))}
        </div>
      ) : (
        <div className={cols5}>
          {fives(products.slice(0, count)).map((p, i, shown) => (
            <div key={p.id} className={cn("ez:grid ez:min-w-0", alone(i, shown.length))}>
              <Card product={p} tone={i} shelf={shelf} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function List({ title, count, crumbs, tabs, sorts, products, more, search, emptyHref, shelf = SHELF_DEFAULTS.catalog }: ShopListProps) {
  const sizes = shelfSizes(shelf, "catalog", CARD_SIZES);
  return (
    <div data-slot="catalog-view" data-variant="catalog" className="ez:grid ez:grid-cols-1 ez:text-fg">
      <nav aria-label="현재 위치" className="ez:flex ez:flex-wrap ez:items-center ez:gap-1 ez:text-site-small ez:text-muted">
        {crumbs.map((c, i) => (
          <span key={c.href} className="ez:inline-flex ez:items-center ez:gap-1">
            {i > 0 && <Icon name="next" size="sm" />}
            {i === crumbs.length - 1 ? (
              <span aria-current="page">{c.label}</span>
            ) : (
              <NextLink href={c.href} className={cn("ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}>
                {c.label}
              </NextLink>
            )}
          </span>
        ))}
      </nav>
      <div className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-2.5 ez:gap-y-1 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:pt-3 ez:pb-7">
        <h1 className="ez:m-0 ez:font-body ez:text-site-heading ez:font-normal ez:text-fg ez:md:text-site-title">{title}</h1>
        {count != null && <span className="ez:text-site-body ez:text-muted ez:tabular-nums">{count}</span>}
      </div>
      {search && <div className="ez:pt-6">{search}</div>}
      <div className="ez:grid ez:grid-cols-1 ez:gap-x-10 ez:lg:grid-cols-[13.75rem_minmax(0,1fr)]">
        <nav aria-label="카테고리" className="ez:min-w-0 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:py-3 ez:lg:self-start ez:lg:border-b-0 ez:lg:pt-7">
          <h2 className="ez:m-0 ez:mb-3 ez:font-body ez:text-site-body ez:font-normal ez:text-fg ez:max-lg:sr-only">{SHOP_TITLE.categories}</h2>
          <ul className="ez:m-0 ez:flex ez:list-none ez:gap-6 ez:overflow-x-auto ez:p-0 ez:lg:grid ez:lg:gap-0 ez:lg:overflow-visible">
            {tabs.map((t) => (
              <li key={t.href} className="ez:shrink-0">
                <NextLink
                  href={t.href}
                  aria-current={t.on ? "page" : undefined}
                  className={cn("ez:flex ez:min-h-11 ez:items-center ez:gap-2 ez:whitespace-nowrap ez:text-site-body ez:no-underline ez:lg:min-h-8", t.on ? "ez:text-fg" : "ez:text-muted ez:hover:text-fg", focusRing)}
                >
                  <Icon name="check" size="sm" className={cn("ez:text-primary", !t.on && "ez:invisible ez:max-lg:hidden")} />
                  <span className="ez:lg:flex-1">{t.label}</span>
                  {t.count != null && <span className="ez:text-site-small ez:text-muted ez:tabular-nums">{t.count}</span>}
                </NextLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ez:min-w-0">
          <nav aria-label="정렬" className="ez:mb-2 ez:flex ez:min-h-16 ez:flex-wrap ez:items-center ez:gap-x-6">
            {sorts.map((s) => (
              <NextLink
                key={s.href}
                href={s.href}
                aria-current={s.on ? "true" : undefined}
                className={cn("ez:inline-flex ez:min-h-11 ez:items-center ez:text-site-body ez:no-underline", s.on ? "ez:font-medium ez:text-fg" : "ez:text-muted ez:hover:text-fg", focusRing)}
              >
                {s.label}
              </NextLink>
            ))}
          </nav>
          {products.length ? (
            <div className={cn(listGap, shelfCols(shelf, "ez:md:grid-cols-3"))}>
              {products.map((p, i) => (
                <Card key={p.id} product={p} tone={i} preload={i < 4} shelf={shelf} sizes={sizes} />
              ))}
            </div>
          ) : (
            <ProductGrid products={[]} emptyHref={emptyHref} />
          )}
          {products.length > 0 && (count != null || more) && (
            <div className="ez:mt-16 ez:flex ez:flex-col ez:items-center ez:gap-3.5">
              {count != null && count > 0 && (
                <>
                  <p className="ez:m-0 ez:text-site-note ez:text-muted ez:tabular-nums">
                    <span className="ez:font-normal ez:text-fg">{Math.min(products.length, count)}</span> / {count}
                  </p>
                  <span aria-hidden="true" className="ez:block ez:h-0.5 ez:w-50 ez:overflow-hidden ez:rounded-full ez:bg-site-line">
                    <span className="ez:block ez:h-full ez:rounded-full ez:bg-muted" style={{ width: `${Math.min(100, (products.length / count) * 100)}%` }} />
                  </span>
                </>
              )}
              {more && (
                <NextLink
                  href={more}
                  className={cn(
                    "ez:inline-flex ez:h-12 ez:items-center ez:rounded-sm ez:bg-surface-alt ez:px-10 ez:text-site-body ez:font-medium ez:text-fg ez:no-underline",
                    focusRing,
                  )}
                >
                  더 보기
                </NextLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type HeroProduct = NonNullable<SectionProps<"hero">["data"]["products"]>[number];

const sideTile = "ez:grid ez:min-h-0 ez:overflow-hidden ez:rounded-md ez:bg-surface-alt ez:text-fg ez:no-underline ez:grid-rows-[auto_minmax(0,1fr)] ez:md:grid-rows-none ez:md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]";

function SideTile({ product, index }: { product: HeroProduct; index: number }) {
  const rate = product.sold_out || product.list_price == null || product.sale_price == null ? 0 : discountRate(product.list_price, product.sale_price);
  return (
    <NextLink href={product.href ?? `/products/${product.id}`} data-slot="hero-product" className={cn("ez:group", sideTile, focusRing)}>
      <span className="ez:relative ez:block ez:aspect-square ez:md:order-2 ez:md:aspect-auto">
        <Photo src={product.cover_url} alt={product.name} tone={index + 1} sizes="(max-width: 1024px) 50vw, 210px" className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
      </span>
      <span className="ez:grid ez:content-end ez:gap-1 ez:p-4 ez:md:p-6">
        <span className="ez:line-clamp-2 ez:text-site-body ez:underline-offset-4 ez:group-hover:underline ez:md:text-site-item">{product.name}</span>
        {product.sale_price != null && (
          <Price rate={rate} price={won(product.sale_price)} list={rate > 0 && product.list_price != null ? won(product.list_price) : null} soldOut={!!product.sold_out} />
        )}
      </span>
    </NextLink>
  );
}

function BlankSide({ index }: { index: number }) {
  return (
    <div className={sideTile}>
      <span className="ez:relative ez:block ez:aspect-square ez:md:order-2 ez:md:aspect-auto">
        <Photo src={null} alt="" tone={index + 1} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
      </span>
      <span className="ez:grid ez:content-end ez:gap-2 ez:p-4 ez:md:p-6">
        <span className="ez:text-site-item">
          <Bar />
        </span>
        <BlankPrice className="ez:text-site-figure" />
      </span>
    </div>
  );
}

export function Hero({ data }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const blank = !title && !data.image;
  const side = (data.products ?? []).filter((p) => p.cover_url).slice(0, 2);
  const split = blank || side.length === 2;
  return (
    <section
      data-slot="hero"
      data-variant="full"
      data-blank={blank ? "" : undefined}
      className={cn("ez:grid ez:gap-4 ez:text-fg ez:lg:h-120", split && "ez:lg:grid-cols-[2fr_1fr]")}
    >
      <div className={cn("ez:grid ez:overflow-hidden ez:rounded-md ez:lg:h-full", title && "ez:bg-surface-alt ez:md:min-h-80 ez:md:grid-cols-[2fr_3fr]")}>
        <div className={cn("ez:relative ez:aspect-4/3 ez:md:aspect-video ez:lg:aspect-auto ez:lg:h-full", title && "ez:md:order-2 ez:md:aspect-auto")}>
          <Photo src={data.image} alt={title ?? ""} preload tone={0} sizes="(max-width: 1024px) 100vw, 860px" className={cn("ez:absolute ez:inset-0 ez:aspect-auto ez:h-full", title ? "ez:rounded-none" : "ez:rounded-md")} />
          {blank && (
            <div aria-hidden="true" className="ez:absolute ez:bottom-6 ez:left-5 ez:grid ez:w-2/5 ez:max-w-56 ez:gap-2 ez:text-site-heading ez:md:bottom-14 ez:md:left-12 ez:md:text-site-name">
              <Bar size="full" block />
              <Bar size="mid" block />
            </div>
          )}
        </div>
        {title && (
          <div className="ez:grid ez:content-end ez:gap-2 ez:p-6 ez:md:p-10">
            <h1 className="ez:m-0 ez:font-body ez:text-site-heading ez:font-normal ez:text-fg ez:whitespace-pre-line ez:md:text-site-name ez:md:font-normal">{title}</h1>
            {data.sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:text-site-lead ez:text-muted">
                {data.sub}
              </p>
            )}
            <NextLink href={data.href ?? PRODUCTS_HREF} className={cn(tlink, "ez:mt-3")}>
              {SHOP_TITLE.more}
            </NextLink>
          </div>
        )}
      </div>
      {split && (
        <div className="ez:grid ez:grid-cols-2 ez:gap-4 ez:lg:grid-cols-1 ez:lg:grid-rows-2">
          {blank ? [0, 1].map((i) => <BlankSide key={i} index={i} />) : side.map((p, i) => <SideTile key={p.id} product={p} index={i} />)}
        </div>
      )}
    </section>
  );
}

type CatItem = { title: string; image?: string | null; href: string };

function Circle({ src, alt, tone }: { src?: string | null; alt: string; tone: number }) {
  return (
    <span className="ez:block ez:aspect-square ez:w-full ez:max-w-33 ez:overflow-hidden ez:rounded-full">
      <Photo src={src} alt={alt} tone={tone} sizes="132px" className="ez:aspect-square ez:h-full ez:rounded-full" />
    </span>
  );
}

const catRow = "ez:m-0 ez:grid ez:list-none ez:grid-cols-3 ez:gap-x-4 ez:gap-y-6 ez:p-0 ez:md:flex ez:md:flex-wrap ez:md:justify-center ez:md:gap-x-10 ez:lg:gap-x-15";

const catItem = "ez:flex ez:flex-col ez:items-center ez:gap-3.5 ez:md:w-33";

export function Categories({ data, context }: SectionProps<"category_tiles">) {
  const items: CatItem[] = (
    data.items?.length
      ? data.items.map((t) => ({ title: t.title, image: t.image, href: t.href ?? PRODUCTS_HREF }))
      : context.categories.map((c) => ({ title: c.name, image: c.cover_url, href: categoryHref(c.id) }))
  ).slice(0, 6);
  if (!items.length) {
    return (
      <section data-slot="category-tiles" data-variant="catalog" data-blank="" className="ez:text-fg">
        <h2 className="ez:sr-only">{SHOP_TITLE.categories}</h2>
        <ul className={catRow}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <li key={i} className={catItem}>
              <Circle alt="" tone={i} />
              <span className="ez:text-site-body">
                <Bar size="short" />
              </span>
            </li>
          ))}
        </ul>
      </section>
    );
  }
  return (
    <section data-slot="category-tiles" data-variant="catalog" className="ez:text-fg">
      <h2 className="ez:sr-only">{SHOP_TITLE.categories}</h2>
      <ul className={catRow}>
        {items.map((c, i) => (
          <li key={`${c.href}-${i}`} className="ez:min-w-0">
            <NextLink href={c.href} className={cn(catItem, "ez:group ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}>
              <Circle src={c.image} alt={c.title} tone={i} />
              <span className="ez:max-w-full ez:truncate ez:text-site-body ez:underline-offset-4 ez:group-hover:underline">{c.title}</span>
            </NextLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function NewArrivals({ data, context }: SectionProps<"product_grid">) {
  return <ProductRow slot="product-grid" title={SHOP_TITLE.fresh} href={FRESH_HREF} products={context.products} count={shownCount(data.count, 5)} shelf={shelfOf("catalog", context.shelf)} />;
}

export function Best({ data, context }: SectionProps<"best_grid">) {
  return <ProductRow slot="best-grid" title={SHOP_TITLE.best} href={BEST_HREF} products={data.items ?? []} count={5} ranked shelf={shelfOf("catalog", context.shelf)} />;
}

export function Strip({ data, context }: SectionProps<"photo_band">) {
  const image = data.image ?? data.images?.[0] ?? null;
  const name = context.storeName?.trim() || null;
  const copy: ReactNode = image ? (
    <>
      {name ? <p className="ez:m-0 ez:text-site-heading ez:font-normal ez:text-fg">{name}</p> : null}
      <NextLink href={PRODUCTS_HREF} className={tlink}>
        {SHOP_TITLE.more}
      </NextLink>
    </>
  ) : (
    <span className="ez:w-3/5 ez:text-site-heading">
      <Bar size="full" block />
    </span>
  );
  return (
    <section
      data-slot="photo-band"
      data-variant="catalog"
      data-blank={image ? undefined : ""}
      className="ez:grid ez:overflow-hidden ez:rounded-md ez:bg-surface-alt ez:text-fg ez:md:h-50 ez:md:grid-cols-[2fr_3fr]"
    >
      <div className="ez:flex ez:flex-col ez:items-start ez:justify-center ez:gap-3.5 ez:px-6 ez:py-8 ez:md:px-12 ez:md:py-0">{copy}</div>
      <div className="ez:relative ez:aspect-video ez:md:aspect-auto ez:md:h-full">
        <Photo src={image} alt="" tone={1} sizes="(max-width: 768px) 100vw, 780px" className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
      </div>
    </section>
  );
}

type ReviewItem = NonNullable<SectionProps<"reviews">["data"]["items"]>[number];

function ReviewCard({ item, product }: { item: ReviewItem; product?: ProductSummary }) {
  return (
    <article className="ez:flex ez:min-w-0 ez:gap-4 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-5">
      <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-1.5">
        <StarRow rating={item.rating} className="ez:text-muted" />
        <p className="ez:m-0 ez:line-clamp-2 ez:min-h-12 ez:text-site-body ez:text-pretty ez:text-fg">{item.body}</p>
        <p className="ez:m-0 ez:truncate ez:text-site-small ez:text-muted">{product?.name ?? item.name}</p>
      </div>
    </article>
  );
}

function BlankReview() {
  return (
    <div className="ez:flex ez:min-w-0 ez:gap-4 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-5">
      <div className="ez:grid ez:min-w-0 ez:flex-1 ez:content-start ez:gap-2">
        <BlankStars />
        <Lines />
        <span className="ez:text-site-small">
          <Bar size="short" />
        </span>
      </div>
    </div>
  );
}

const reviewGrid = "ez:grid ez:gap-4 ez:lg:gap-5";

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).filter((r, i, all) => !r.product || all.findIndex((x) => x.product === r.product) === i).slice(0, 4);
  return (
    <section data-slot="reviews" data-variant="catalog" data-blank={items.length ? undefined : ""} data-bleed="" className="ez:mx-[calc(50%-50vw)] ez:bg-surface-alt ez:py-16 ez:text-fg">
      <div className={wrap}>
        <Head title={SHOP_TITLE.reviews} />
        <div className={cn(reviewGrid, fillCols(items.length || 4))}>
          {items.length
            ? items.map((r, i) => <ReviewCard key={`${r.name}-${r.date ?? ""}-${i}`} item={r} product={r.product ? context.products.find((p) => p.id === r.product) : undefined} />)
            : [0, 1, 2, 3].map((i) => <BlankReview key={i} />)}
        </div>
      </div>
    </section>
  );
}
