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
import { focusRing, textLink } from "../../utils/styles";
import { Bar, BlankPrice, BlankStars, Lines } from "../kit";
import type { Tile } from "../template/data";
import { ShopNavLinks } from "./nav";
import { BEST_HREF, categoryHref, FRESH_HREF, PRODUCTS_HREF, productView, ROW_ITEM, SHOP_TITLE, type ProductView } from "./shared";
import { SHELF_DEFAULTS, SHELF_RATIO, shelfCols, shelfOf, shelfSizes, shelfView, type Shelf } from "./shelf";
import type { FooterLink, ShopFooterProps, ShopHeaderProps, ShopListProps } from "./types";

const bleed = "ez:mx-[calc(50%-50vw)]";

const link = cn(textLink, "ez:font-normal ez:text-site-body");

const iconLink = cn("ez:relative ez:inline-flex ez:size-11 ez:items-center ez:justify-center ez:text-fg ez:no-underline", focusRing);

function Head({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="ez:grid ez:justify-items-center ez:gap-3.5 ez:text-center">
      <span aria-hidden="true" className="ez:text-site-small ez:uppercase ez:tracking-widest ez:text-muted">
        {eyebrow}
      </span>
      <h2 className="ez:m-0 ez:font-display ez:text-site-heading ez:font-normal ez:leading-snug ez:lg:text-site-title">{title}</h2>
    </div>
  );
}

function Foot({ href }: { href: string }) {
  return (
    <div className="ez:mt-12 ez:flex ez:justify-center ez:lg:mt-16">
      <NextLink href={href} className={cn(link, focusRing)}>
        {SHOP_TITLE.more}
      </NextLink>
    </div>
  );
}

function Price({ v }: { v: ProductView }) {
  return (
    <span className="ez:mt-1.5 ez:flex ez:flex-wrap ez:items-baseline ez:justify-center ez:gap-x-2 ez:text-site-body ez:tabular-nums">
      {v.rate > 0 && <span className="ez:font-semibold ez:text-fg">{v.rate}%</span>}
      <span>{v.price}</span>
      {v.list && (
        <s className="ez:text-site-note ez:text-muted">
          <span className="ez:sr-only">정가 </span>
          {v.list}
        </s>
      )}
    </span>
  );
}

function Card({ product, sizes, preload, shelf }: { product: ProductSummary; sizes: string; preload?: boolean; shelf: Shelf }) {
  const v = shelfView(productView(product), shelf);
  const labels = [v.soldOut && "품절", v.sample && "예시"].filter(Boolean).join(" · ");
  return (
    <NextLink
      href={v.href}
      data-slot="product-card"
      data-sold-out={v.soldOut || undefined}
      data-sample={v.sample || undefined}
      className={cn("ez:group ez:grid ez:min-w-0 ez:content-start ez:text-fg ez:no-underline", focusRing)}
    >
      <Photo src={v.cover} alt={v.name} sizes={sizes} preload={preload} className={cn(SHELF_RATIO[shelf.ratio], v.soldOut && "ez:opacity-45")} />
      <span className="ez:grid ez:justify-items-center ez:pt-5 ez:text-center ez:lg:pt-6">
        <span className="ez:mb-3 ez:block ez:h-4 ez:text-site-small ez:leading-none ez:tracking-widest ez:text-muted">{labels}</span>
        <span className="ez:line-clamp-2 ez:text-site-item ez:font-medium ez:underline-offset-4 ez:group-hover:underline">{v.name}</span>
        <Price v={v} />
      </span>
    </NextLink>
  );
}

function BlankCard({ tone }: { tone: number }) {
  return (
    <div className="ez:grid ez:min-w-0 ez:content-start">
      <Photo src={null} alt="" tone={tone} className="ez:aspect-[4/5]" />
      <span className="ez:grid ez:justify-items-center ez:gap-2 ez:pt-5 ez:text-center ez:lg:pt-6">
        <span className="ez:mt-7 ez:text-site-item">
          <Bar />
        </span>
        <BlankPrice className="ez:font-normal ez:text-site-body" />
      </span>
    </div>
  );
}

const row = "ez:-mx-3 ez:flex ez:flex-wrap ez:justify-center ez:gap-y-12 ez:lg:gap-y-16";

const rowItem = { 3: cn(ROW_ITEM[3], "ez:lg:w-1/3 ez:px-3"), 4: cn(ROW_ITEM[4], "ez:px-3") } as const;

function Row({
  slot,
  eyebrow,
  title,
  href,
  products,
  pc,
  sizes,
  shelf,
}: {
  slot: string;
  eyebrow: string;
  title: string;
  href: string;
  products: ProductSummary[];
  pc: 3 | 4;
  sizes: string;
  shelf: Shelf;
}) {
  const shown = products.slice(0, pc);
  return (
    <section data-slot={slot} data-blank={shown.length ? undefined : ""} className="ez:grid ez:text-fg">
      <Head eyebrow={eyebrow} title={title} />
      <div className={cn("ez:mt-8 ez:lg:mt-14", row)}>
        {shown.length
          ? shown.map((p) => (
              <div key={p.id} className={rowItem[pc]}>
                <Card product={p} sizes={sizes} shelf={shelf} />
              </div>
            ))
          : Array.from({ length: pc }, (_, i) => (
              <div key={i} className={rowItem[pc]}>
                <BlankCard tone={i} />
              </div>
            ))}
      </div>
      {shown.length > 0 && <Foot href={href} />}
    </section>
  );
}

export function Header({ name, logoUrl, cartCount, nav, links }: ShopHeaderProps) {
  const items = nav.categories.length ? nav.categories : [nav.all, nav.fresh, nav.best];
  return (
    <header data-slot="site-header" data-variant="float" className="ez:bg-surface">
      <div className="ez:border-0 ez:border-b ez:border-solid ez:border-site-line">
        <div className="ez:mx-auto ez:grid ez:min-h-16 ez:max-w-wrap ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-6 ez:px-page ez:lg:min-h-22 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:gap-8 ez:overflow-hidden ez:whitespace-nowrap ez:text-site-body ez:max-lg:hidden">
            <ShopNavLinks items={items} className="ez:py-1.5 ez:text-fg ez:no-underline" currentClassName="ez:font-medium ez:text-fg" />
          </nav>
          <NextLink
            href="/"
            className={cn(
              "ez:min-w-0 ez:font-display ez:text-site-heading ez:font-medium ez:leading-none ez:tracking-wide ez:text-fg ez:no-underline ez:lg:justify-self-center ez:lg:text-center ez:lg:text-site-logo",
              focusRing,
            )}
          >
            <SiteLogo name={name} src={logoUrl} />
          </NextLink>
          <div className="ez:flex ez:items-center ez:justify-end">
            <NextLink href={links.search} aria-label="검색" className={iconLink}>
              <Icon name="search" size="lg" />
            </NextLink>
            <NextLink href={links.account.href} aria-label={links.account.label} className={iconLink}>
              <Icon name="user" size="lg" />
            </NextLink>
            <NextLink href={links.likes} aria-label="찜" className={iconLink}>
              <Icon name="heart" size="lg" />
            </NextLink>
            <NextLink href={links.cart} aria-label={cartCount ? `장바구니 ${cartCount}` : "장바구니"} className={cn(iconLink, "ez:w-auto ez:min-w-11 ez:gap-1.5")}>
              <span className="ez:relative ez:inline-flex">
                <Icon name="bag" size="lg" />
                {cartCount ? <span aria-hidden="true" className="ez:absolute ez:-top-0.5 ez:-right-0.5 ez:size-1.75 ez:rounded-full ez:bg-primary" /> : null}
              </span>
              {cartCount ? (
                <span aria-hidden="true" className="ez:text-site-body ez:text-muted ez:tabular-nums">
                  {cartCount}
                </span>
              ) : null}
            </NextLink>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Hero({ data }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const image = data.image ?? data.images?.[0] ?? null;
  const sub = title ? data.sub?.trim() || null : null;
  const blank = !title && !image;
  const over = Boolean(image);
  return (
    <section
      data-slot="hero"
      data-variant={over ? "full" : "plain"}
      data-blank={blank ? "" : undefined}
      data-bleed=""
      className={cn("ez:relative ez:h-130 ez:overflow-hidden ez:lg:h-195", bleed)}
    >
      <Photo src={image} alt="" preload sizes="100vw" tone={0} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
      {over && <span aria-hidden="true" className="ez:absolute ez:inset-x-0 ez:top-0 ez:h-32 ez:bg-linear-to-b ez:from-surface/85 ez:to-transparent ez:lg:h-40" />}
      {title && over && <span aria-hidden="true" className="ez:absolute ez:inset-x-0 ez:bottom-0 ez:h-3/5 ez:bg-linear-to-t ez:from-surface/90 ez:via-surface/60 ez:to-transparent" />}
      {title && (
        <div className="ez:absolute ez:inset-x-0 ez:bottom-12 ez:mx-auto ez:max-w-wrap ez:px-page ez:lg:bottom-37.5">
          <div className="ez:flex ez:flex-col ez:items-start ez:gap-5 ez:text-fg ez:lg:gap-7">
            <h1 className="ez:m-0 ez:max-w-4xl ez:font-display ez:text-site-page ez:font-normal ez:leading-none ez:text-balance ez:lg:text-site-display-lg">{title}</h1>
            {sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:max-w-xl ez:text-site-body">
                {sub}
              </p>
            )}
            <NextLink href={data.href ?? PRODUCTS_HREF} className={cn(link, focusRing)}>
              {SHOP_TITLE.more}
            </NextLink>
          </div>
        </div>
      )}
    </section>
  );
}

export function NewArrivals({ context, grid }: SectionProps<"product_grid">) {
  return (
    <Row
      slot="product-grid"
      eyebrow="New Arrivals"
      title={SHOP_TITLE.fresh}
      href={FRESH_HREF}
      products={context.products}
      pc={grid?.pc === 3 ? 3 : 4}
      sizes="(max-width: 1024px) 50vw, 330px"
      shelf={shelfOf("editorial", context.shelf)}
    />
  );
}

export function Best({ data, context, grid }: SectionProps<"best_grid">) {
  return (
    <Row
      slot="best-grid"
      eyebrow="Best Sellers"
      title={SHOP_TITLE.best}
      href={BEST_HREF}
      products={data.items ?? []}
      pc={grid?.pc === 4 ? 4 : 3}
      sizes="(max-width: 1024px) 50vw, 440px"
      shelf={shelfOf("editorial", context.shelf)}
    />
  );
}

export function Story({ data, context }: SectionProps<"testimonial">) {
  const first = data.items?.[0];
  const quote = data.quote?.trim();
  const review = quote
    ? { body: quote, name: data.name ?? null, rating: null, date: null, product: null }
    : first
      ? { body: first.body, name: first.name, rating: first.rating, date: first.date ?? null, product: first.product ?? null }
      : null;
  const product = review?.product ? context.products.find((p) => p.id === review.product) : undefined;
  return (
    <section data-slot="testimonial" data-blank={review ? undefined : ""} data-bleed="" className={cn("ez:grid ez:bg-surface-alt ez:text-fg ez:lg:grid-cols-2", bleed)}>
      <Photo src={data.image} alt="" sizes="(max-width: 1024px) 100vw, 50vw" tone={1} className="ez:aspect-[4/5] ez:rounded-none ez:lg:aspect-auto ez:lg:h-225" />
      <div className="ez:flex ez:flex-col ez:items-start ez:justify-center ez:gap-6 ez:px-page ez:py-14 ez:lg:gap-7 ez:lg:px-30 ez:lg:py-20">
        <h2 className="ez:m-0 ez:font-body ez:text-site-small ez:font-normal ez:tracking-widest ez:text-muted">{SHOP_TITLE.reviews}</h2>
        {review ? (
          <figure className="ez:m-0 ez:grid ez:max-w-130 ez:gap-6 ez:lg:gap-7">
            {review.rating != null && <StarRow rating={review.rating} className="ez:text-fg" />}
            <blockquote className="ez:m-0 ez:line-clamp-6 ez:font-display ez:text-site-heading ez:font-normal ez:leading-snug ez:lg:text-site-name">{review.body}</blockquote>
            {(review.name || review.date) && (
              <figcaption className="ez:flex ez:flex-wrap ez:gap-x-3 ez:text-site-body ez:text-muted">
                {review.name && <span>{review.name}</span>}
                {review.date && <span>{review.date}</span>}
              </figcaption>
            )}
          </figure>
        ) : (
          <div aria-hidden="true" className="ez:grid ez:w-full ez:max-w-100 ez:gap-6">
            <BlankStars />
            <Lines strong className="ez:text-site-name" />
            <span className="ez:text-site-body">
              <Bar size="short" />
            </span>
          </div>
        )}
        {product && (
          <NextLink href={`/products/${product.id}`} className={cn(link, focusRing, "ez:mt-2")}>
            {product.name}
          </NextLink>
        )}
      </div>
    </section>
  );
}

export function Categories({ data, context }: SectionProps<"category_tiles">) {
  const items: (Tile & { count?: number | null })[] = (
    data.items?.length ? data.items : context.categories.map((c) => ({ title: c.name, image: c.cover_url, href: categoryHref(c.id), count: c.product_count }))
  ).slice(0, 3);
  const caption = (name: ReactNode, count?: number | null) => (
    <span className="ez:flex ez:items-center ez:justify-between ez:gap-3 ez:pt-4 ez:lg:pt-5">
      <span className="ez:flex ez:min-w-0 ez:items-baseline ez:gap-2.5">
        <span className="ez:truncate ez:font-display ez:text-site-item ez:font-normal ez:lg:text-site-heading">{name}</span>
        {count != null && <span className="ez:text-site-note ez:text-muted ez:tabular-nums">{count}</span>}
      </span>
      <Icon name="right" size="sm" className="ez:shrink-0 ez:text-muted" />
    </span>
  );
  return (
    <section data-slot="category-tiles" data-blank={items.length ? undefined : ""} className="ez:grid ez:text-fg">
      <Head eyebrow="Category" title={SHOP_TITLE.categories} />
      <div className={cn("ez:mt-8 ez:gap-y-10 ez:lg:mt-14", row)}>
        {items.length
          ? items.map((t, i) => (
              <div key={`${t.title}-${i}`} className={rowItem[3]}>
                <NextLink href={t.href ?? PRODUCTS_HREF} className={cn("ez:group ez:grid ez:min-w-0 ez:content-start ez:text-fg ez:no-underline", focusRing)}>
                  <Photo src={t.image} alt={t.title} tone={i} sizes="(max-width: 768px) 50vw, 440px" className="ez:aspect-[3/4]" />
                  {caption(t.title, t.count)}
                </NextLink>
              </div>
            ))
          : [0, 1, 2].map((i) => (
              <div key={i} className={cn(rowItem[3], "ez:grid ez:min-w-0 ez:content-start")}>
                <Photo src={null} alt="" tone={i} className="ez:aspect-[3/4]" />
                {caption(<Bar size="short" />)}
              </div>
            ))}
      </div>
    </section>
  );
}

export function Wide({ data }: SectionProps<"photo_band">) {
  const image = data.image ?? data.images?.[0] ?? null;
  return (
    <section data-slot="photo-band" data-blank={image ? undefined : ""} data-bleed="" className={cn("ez:grid", bleed)}>
      <Photo src={image} alt="" sizes="100vw" tone={2} className="ez:aspect-auto ez:h-75 ez:rounded-none ez:md:h-105 ez:lg:h-135" />
    </section>
  );
}

function FooterNav({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:grid ez:content-start ez:gap-4 ez:lg:gap-5">
      <span className="ez:text-site-note ez:text-muted">{title}</span>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-1 ez:p-0">
        {items.map((l) => (
          <li key={l.href} className="ez:text-site-body ez:leading-loose">
            <NextLink href={l.href} className={cn("ez:text-fg ez:no-underline ez:underline-offset-4 ez:hover:underline", l.strong && "ez:font-medium", focusRing)}>
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
    <footer data-slot="site-footer" data-variant="editorial" className="ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:text-fg">
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-16 ez:pb-10 ez:lg:pt-28 ez:lg:pb-14">
        <p className="ez:m-0 ez:mb-12 ez:font-display ez:text-site-name ez:font-normal ez:leading-none ez:wrap-break-word ez:md:text-site-display ez:lg:mb-22 ez:lg:text-site-hero">{storeName}</p>
        <div className="ez:grid ez:grid-cols-2 ez:gap-x-gutter ez:gap-y-10 ez:pb-12 ez:md:grid-cols-[7fr_5fr_5fr_5fr] ez:lg:pb-18">
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-4 ez:md:col-span-1 ez:lg:gap-5">
            <span className="ez:text-site-note ez:text-muted">고객센터</span>
            {(phone || hours) && (
              <div className="ez:grid ez:gap-2.5">
                {phone && (
                  <a href={`tel:${phone}`} className={cn("ez:font-display ez:text-site-counter ez:leading-tight ez:text-fg ez:no-underline ez:tabular-nums ez:lg:text-site-name", focusRing)}>
                    {phone}
                  </a>
                )}
                {hours && <span className="ez:text-site-body ez:text-muted">{hours}</span>}
              </div>
            )}
          </div>
          <FooterNav title="쇼핑" items={shop} />
          <FooterNav title="안내" items={guide} />
          <FooterNav title="내 쇼핑" items={account} />
        </div>
        <div className="ez:grid ez:gap-6 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-7 ez:md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="ez:grid ez:gap-3.5">
            {terms.length > 0 && (
              <nav aria-label="약관" className="ez:flex ez:flex-wrap ez:gap-x-6 ez:gap-y-2 ez:text-site-body">
                {terms.map((l) => (
                  <NextLink key={l.href} href={l.href} className={cn("ez:text-fg ez:no-underline ez:underline-offset-4 ez:hover:underline", l.strong && "ez:font-medium", focusRing)}>
                    {l.label}
                  </NextLink>
                ))}
              </nav>
            )}
            <p className="ez:m-0 ez:max-w-225 ez:text-site-note ez:leading-relaxed ez:text-muted">{legal}</p>
          </div>
          <span className="ez:text-site-note ez:text-muted">© {storeName}</span>
        </div>
      </div>
    </footer>
  );
}

function Crumbs({ items }: { items: ShopListProps["crumbs"] }) {
  return (
    <nav aria-label="현재 위치" className="ez:flex ez:flex-wrap ez:items-center ez:justify-center ez:gap-x-2.5 ez:text-site-note ez:tracking-wide ez:text-muted">
      {items.map((c, i) => (
        <span key={c.href} className="ez:flex ez:items-center ez:gap-x-2.5">
          {i > 0 && <span aria-hidden="true">/</span>}
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

export function List({ title, count, crumbs, tabs, sorts, products, more, search, emptyHref, shelf = SHELF_DEFAULTS.editorial }: ShopListProps) {
  const sizes = shelfSizes(shelf, "editorial", "(max-width: 1024px) 50vw, 440px");
  return (
    <div data-slot="catalog-view" className="ez:grid ez:grid-cols-1 ez:text-fg">
      <div className="ez:grid ez:justify-items-center ez:pt-8 ez:text-center ez:lg:pt-18">
        <Crumbs items={crumbs} />
        <h1 className="ez:m-0 ez:mt-5 ez:font-display ez:text-site-page-sm ez:font-normal ez:leading-tight ez:lg:mt-7 ez:lg:text-site-display-md">{title}</h1>
        {search && <div className="ez:mt-8 ez:w-full ez:max-w-130 ez:text-left">{search}</div>}
        {tabs.length > 1 && (
          <nav aria-label="카테고리" className="ez:mt-8 ez:flex ez:flex-wrap ez:justify-center ez:gap-x-10 ez:gap-y-1 ez:text-site-body ez:lg:mt-11">
            {tabs.map((t) => (
              <NextLink
                key={t.href}
                href={t.href}
                aria-current={t.on ? "page" : undefined}
                className={cn("ez:inline-flex ez:min-h-11 ez:items-center ez:gap-1.5 ez:no-underline ez:hover:text-fg", t.on ? "ez:font-semibold ez:text-fg" : "ez:text-muted", focusRing)}
              >
                {t.label}
                {t.count != null && <span className="ez:text-site-small ez:font-normal ez:text-muted ez:tabular-nums">{t.count}</span>}
              </NextLink>
            ))}
          </nav>
        )}
      </div>
      <div className="ez:mt-10 ez:flex ez:flex-wrap ez:items-center ez:justify-between ez:gap-x-6 ez:gap-y-2 ez:border-0 ez:border-y ez:border-solid ez:border-site-line ez:py-3 ez:text-site-body ez:lg:mt-16">
        {count != null ? (
          <span className="ez:text-muted">
            상품 <b className="ez:font-medium ez:text-fg ez:tabular-nums">{count}</b>개
          </span>
        ) : (
          <span />
        )}
        <nav aria-label="정렬" className="ez:flex ez:flex-wrap ez:gap-x-7">
          {sorts.map((s) => (
            <NextLink
              key={s.href}
              href={s.href}
              aria-current={s.on ? "true" : undefined}
              className={cn("ez:inline-flex ez:min-h-11 ez:items-center ez:no-underline ez:hover:text-fg", s.on ? "ez:font-semibold ez:text-fg" : "ez:text-muted", focusRing)}
            >
              {s.label}
            </NextLink>
          ))}
        </nav>
      </div>
      <div className="ez:mt-10 ez:lg:mt-14">
        {products.length ? (
          <div className={cn("ez:grid ez:gap-x-gutter ez:gap-y-12 ez:lg:gap-y-20", shelfCols(shelf))}>
            {products.map((p, i) => (
              <Card key={p.id} product={p} preload={i < 3} sizes={sizes} shelf={shelf} />
            ))}
          </div>
        ) : (
          <ProductGrid products={[]} emptyHref={emptyHref} />
        )}
      </div>
      {more && (
        <div className="ez:mt-16 ez:mb-8 ez:flex ez:justify-center ez:lg:mt-26 ez:lg:mb-16">
          <NextLink href={more} className={cn(link, focusRing)}>
            더 보기
          </NextLink>
        </div>
      )}
    </div>
  );
}
