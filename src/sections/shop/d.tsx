import NextLink from "next/link";
import type { ReactNode } from "react";
import { ProductGrid } from "../../blocks/product-grid";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { STAR_PATH } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import type { ProductSummary } from "../../types";
import { cn } from "../../utils/cn";
import { discountRate, won } from "../../utils/format";
import { focusRing } from "../../utils/styles";
import { Bar, BlankPrice, BlankStars, Lines } from "../kit";
import { ShopNavLinks } from "./nav";
import { BEST_HREF, categoryHref, fillCols, FRESH_HREF, lastOdd, PRODUCTS_HREF, productView, SHOP_TITLE, shownCount } from "./shared";
import { SHELF_DEFAULTS, SHELF_RATIO, shelfCols, shelfOf, shelfSizes, shelfView, type Shelf } from "./shelf";
import type { CatalogPromo, FooterLink, ShopFooterProps, ShopHeaderProps, ShopListProps } from "./types";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const CARD_SIZES = "(max-width: 1024px) 50vw, 330px";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:box-border ez:px-page";

const sectionTitle = "ez:m-0 ez:text-site-section ez:text-fg ez:lg:text-site-display-md";

const button = "ez:inline-flex ez:shrink-0 ez:items-center ez:justify-center ez:gap-2 ez:rounded-full ez:text-site-body ez:font-medium ez:whitespace-nowrap ez:no-underline";

const primaryButton = cn("ez:fx-press ez:h-12 ez:bg-primary ez:px-7 ez:text-on-primary ez:lg:h-13", button, focusRing);

const glassButton = cn("ez:fx-glass ez:h-12 ez:px-7 ez:text-fg ez:lg:h-13", button, focusRing);

const headerButton = cn("ez:fx-press ez:h-11 ez:bg-primary ez:px-5 ez:text-on-primary ez:max-lg:hidden", button, focusRing);

const moreLink = cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1.5 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const goLink = cn("ez:inline-flex ez:items-center ez:gap-2 ez:text-site-body ez:text-fg ez:no-underline ez:hover:underline ez:underline-offset-4", focusRing);

const textLink = cn("ez:inline-flex ez:h-10 ez:items-center ez:gap-1 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const iconLink = cn("ez:relative ez:inline-flex ez:size-10 ez:items-center ez:justify-center ez:text-fg ez:no-underline ez:lg:hidden", focusRing);

const hair = "ez:border-0 ez:border-solid ez:border-hairline";

function Head({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="ez:mb-6 ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-x-6 ez:gap-y-3 ez:lg:mb-9">
      <h2 data-script={scriptOf(title)} className={sectionTitle}>{title}</h2>
      {aside}
    </div>
  );
}

function More({ href }: { href: string }) {
  return (
    <NextLink href={href} className={moreLink}>
      {SHOP_TITLE.more}
      <Icon name="right" size="sm" />
    </NextLink>
  );
}

export function Header({ name, logoUrl, cartCount, nav, links }: ShopHeaderProps) {
  const cart = cartCount ? `장바구니 ${cartCount}` : "장바구니";
  return (
    <header data-slot="site-header" data-variant="aurora" className="ez:relative ez:z-10 ez:bg-transparent ez:pt-3 ez:lg:pt-6">
      <div className={wrap}>
        <div className="ez:fx-glass ez:grid ez:h-14 ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-6 ez:rounded-full ez:pr-2 ez:pl-5 ez:lg:h-17 ez:lg:grid-cols-[auto_minmax(0,1fr)_auto] ez:lg:gap-9 ez:lg:pr-3 ez:lg:pl-8">
          <NextLink data-script={scriptOf(name)} href="/" className={cn("ez:min-w-0 ez:justify-self-start ez:text-site-item ez:font-normal ez:text-fg ez:no-underline", focusRing)}>
            <SiteLogo name={name} src={logoUrl} />
          </NextLink>
          <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:justify-end ez:gap-9 ez:overflow-hidden ez:whitespace-nowrap ez:max-lg:hidden">
            <ShopNavLinks
              items={[nav.fresh, nav.best, ...nav.categories]}
              className={cn("ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}
              currentClassName="ez:font-medium ez:text-fg"
            />
          </nav>
          <div className="ez:flex ez:items-center ez:justify-self-end ez:gap-0.5 ez:lg:gap-6">
            <span className="ez:flex ez:items-center ez:gap-6 ez:whitespace-nowrap ez:max-lg:hidden">
              <NextLink href={links.search} className={textLink}>
                검색
              </NextLink>
              <NextLink href={links.account.href} className={textLink}>
                {links.account.label}
              </NextLink>
              <NextLink href={links.likes} className={textLink}>
                찜
              </NextLink>
              <NextLink href={links.cart} aria-label={cart} className={textLink}>
                장바구니
                {cartCount ? (
                  <span aria-hidden="true" className="ez:tabular-nums">
                    {cartCount}
                  </span>
                ) : null}
              </NextLink>
            </span>
            <NextLink href={links.search} aria-label="검색" className={iconLink}>
              <Icon name="search" />
            </NextLink>
            <NextLink href={links.account.href} aria-label={links.account.label} className={iconLink}>
              <Icon name="user" />
            </NextLink>
            <NextLink href={links.likes} aria-label="찜" className={iconLink}>
              <Icon name="heart" />
            </NextLink>
            <NextLink href={links.cart} aria-label={cart} className={iconLink}>
              <Icon name="bag" />
              {cartCount ? <span aria-hidden="true" className="ez:absolute ez:top-2 ez:right-1.5 ez:size-1.75 ez:rounded-full ez:bg-primary" /> : null}
            </NextLink>
            <NextLink href={nav.all.href} className={headerButton}>
              {nav.all.label}
            </NextLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <nav aria-label={title} className="ez:grid ez:content-start ez:gap-3.5">
      <span data-script={scriptOf(title)} className="ez:text-site-note ez:text-fg">{title}</span>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-1.5 ez:p-0 ez:text-site-note">
        {items.map((l) => (
          <li key={l.href}>
            <NextLink href={l.href} className={cn("ez:no-underline ez:hover:text-fg", l.strong ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}>
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
    <footer data-slot="site-footer" data-variant="aurora" className="ez:text-fg">
      <div className={cn(wrap, "ez:pt-16 ez:pb-12 ez:lg:pt-18 ez:lg:pb-16")}>
        <div className="ez:grid ez:grid-cols-2 ez:gap-x-6 ez:gap-y-10 ez:md:grid-cols-4 ez:lg:grid-cols-[6fr_3fr_3fr_3fr_3fr]">
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-3 ez:md:col-span-4 ez:lg:col-span-1">
            <p data-script={scriptOf(storeName)} className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{storeName}</p>
            {(phone || hours) && (
              <div className="ez:grid ez:gap-0.5 ez:text-site-note ez:text-muted">
                <span>고객센터</span>
                {phone && (
                  <a href={`tel:${phone}`} className={cn("ez:justify-self-start ez:text-fg ez:tabular-nums ez:no-underline ez:hover:underline", focusRing)}>
                    {phone}
                  </a>
                )}
                {hours && <span>{hours}</span>}
              </div>
            )}
          </div>
          <FooterColumn title="쇼핑" items={shop} />
          <FooterColumn title="안내" items={guide} />
          <FooterColumn title="내 쇼핑" items={account} />
          {terms.length > 0 && <FooterColumn title="약관" items={terms} />}
        </div>
        <div className="ez:mt-12 ez:flex ez:flex-col ez:gap-3 ez:text-site-small ez:leading-relaxed ez:text-muted ez:md:flex-row ez:md:justify-between ez:md:gap-10 ez:lg:mt-14">
          <p className="ez:m-0">{legal}</p>
          <p className="ez:m-0 ez:shrink-0">© {storeName}</p>
        </div>
      </div>
    </footer>
  );
}

type HeroProduct = NonNullable<SectionProps<"hero">["data"]["products"]>[number];

const floatBox = "ez:relative ez:mx-4 ez:-mt-14 ez:block ez:fx-round-md ez:px-6 ez:pt-5.5 ez:pb-3 ez:text-fg ez:no-underline ez:lg:absolute ez:lg:bottom-12 ez:lg:-left-18 ez:lg:mx-0 ez:lg:mt-0 ez:lg:w-75";

const floatRow = cn(hair, "ez:flex ez:items-baseline ez:justify-between ez:gap-4 ez:border-t ez:py-2.5");

function HeroFloat({ product, shipping }: { product: HeroProduct; shipping: SectionProps["context"]["shipping"] }) {
  const sale = product.sale_price ?? product.list_price;
  const rate = !product.sold_out && product.list_price != null && product.sale_price != null ? discountRate(product.list_price, product.sale_price) : 0;
  const fee = shipping ? (shipping.base_fee ? won(shipping.base_fee) : "무료") : null;
  return (
    <NextLink href={product.href ?? `/products/${product.id}`} data-slot="hero-product" className={cn("ez:fx-glass ez:group", floatBox, focusRing)}>
      <span data-script={scriptOf(product.name)} className="ez:block ez:truncate ez:text-site-heading ez:underline-offset-4 ez:group-hover:underline">{product.name}</span>
      <span className="ez:mt-1 ez:mb-3.5 ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-2 ez:text-site-body ez:tabular-nums">
        {rate > 0 && <span className="ez:font-medium">{rate}%</span>}
        {sale != null && <span><Won amount={sale} /></span>}
        {product.sold_out && <span className="ez:text-muted">품절</span>}
      </span>
      {fee && (
        <dl className="ez:m-0 ez:text-site-note">
          <div className={floatRow}>
            <dt className="ez:text-muted">배송비</dt>
            <dd className="ez:m-0 ez:tabular-nums"><Won value={fee} /></dd>
          </div>
        </dl>
      )}
    </NextLink>
  );
}

function BlankFloat() {
  return (
    <div className={cn("ez:fx-glass", floatBox)}>
      <span className="ez:block ez:text-site-heading">
        <Bar />
      </span>
      <span className="ez:mt-1 ez:mb-3.5 ez:block ez:text-site-body">
        <BlankPrice className="ez:text-muted" />
      </span>
      <div className={cn(floatRow, "ez:text-site-note")}>
        <Bar size="short" />
      </div>
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
  const banner = title && data.href && data.href !== PRODUCTS_HREF ? data.href : null;
  const photo = (
    <div className="ez:fx-round-xl ez:overflow-hidden">
      <Photo src={image} alt={title ?? ""} preload sizes="(max-width: 1024px) 100vw, 660px" tone={0} className="ez:aspect-[4/3] ez:rounded-none ez:lg:aspect-auto ez:lg:h-185" />
    </div>
  );
  return (
    <section
      data-slot="hero"
      data-variant="aurora"
      data-blank={blank ? "" : undefined}
      className="ez:relative ez:isolate ez:grid ez:grid-cols-1 ez:items-center ez:gap-10 ez:pt-4 ez:text-fg ez:lg:grid-cols-2 ez:lg:gap-6 ez:lg:pt-10"
    >
      <span aria-hidden="true" className="ez:fx-aurora ez:absolute ez:-top-40 ez:-bottom-40 ez:left-1/2 ez:-z-10 ez:w-screen ez:-translate-x-1/2" />
      <div className="ez:grid ez:min-w-0 ez:justify-items-start">
        {context.storeName ? (
          <p data-script={scriptOf(context.storeName)} className="ez:fx-title ez:m-0 ez:break-keep ez:text-fg">{context.storeName}</p>
        ) : (
          <span className="ez:fx-title ez:w-3/5">
            <Bar size="full" strong block />
          </span>
        )}
        {title ? (
          <div className="ez:mt-5 ez:grid ez:max-w-118 ez:gap-2 ez:lg:mt-6">
            <h1 data-script={scriptOf(title)} className="ez:m-0 ez:text-site-item ez:font-normal ez:text-balance ez:text-fg">{title}</h1>
            {sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:text-site-body ez:leading-relaxed ez:text-muted">
                {sub}
              </p>
            )}
          </div>
        ) : (
          blank && (
            <span className="ez:mt-6 ez:w-full ez:max-w-118">
              <Lines />
            </span>
          )
        )}
        <div className="ez:mt-8 ez:flex ez:flex-wrap ez:gap-3 ez:lg:mt-10">
          {blank ? (
            <span className="ez:text-site-body">
              <Bar size="short" />
            </span>
          ) : (
            <>
              <NextLink href={PRODUCTS_HREF} className={primaryButton}>
                {SHOP_TITLE.all}
              </NextLink>
              <NextLink href={FRESH_HREF} className={glassButton}>
                {SHOP_TITLE.fresh}
              </NextLink>
            </>
          )}
        </div>
      </div>
      <div className="ez:relative ez:min-w-0">
        {banner ? (
          <NextLink href={banner} className={cn("ez:block", focusRing)}>
            {photo}
          </NextLink>
        ) : (
          photo
        )}
        {blank ? <BlankFloat /> : pick && <HeroFloat product={pick} shipping={context.shipping} />}
      </div>
    </section>
  );
}

function Card({ product, shelf, sizes = CARD_SIZES, eager }: { product: ProductSummary; shelf: Shelf; sizes?: string; eager?: boolean }) {
  const v = shelfView(productView(product), shelf);
  const label = v.soldOut ? "품절" : v.sample ? "예시" : null;
  return (
    <NextLink
      href={v.href}
      data-slot="product-card"
      data-sold-out={v.soldOut ? "" : undefined}
      data-sample={v.sample ? "" : undefined}
      className={cn("ez:group ez:grid ez:min-w-0 ez:content-start ez:text-fg ez:no-underline", focusRing)}
    >
      <span className="ez:fx-round-lg ez:block ez:overflow-hidden">
        <Photo src={v.cover} alt={v.name} preload={eager} sizes={sizes} className={cn(SHELF_RATIO[shelf.ratio], "ez:rounded-none", v.soldOut && "ez:opacity-45")} />
      </span>
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-3 ez:gap-y-0.5 ez:px-1.5 ez:pt-4">
        <span data-script={scriptOf(v.name)} className={cn("ez:truncate ez:text-site-item ez:font-normal ez:underline-offset-4 ez:group-hover:underline", v.soldOut ? "ez:text-muted" : "ez:text-fg")}>{v.name}</span>
        <span className={cn("ez:flex ez:items-baseline ez:gap-x-1.5 ez:text-site-item ez:font-normal ez:whitespace-nowrap ez:tabular-nums", v.soldOut ? "ez:text-muted" : "ez:text-fg")}>
          {v.rate > 0 && <span className="ez:font-medium ez:text-fg">{v.rate}%</span>}
          <Won value={v.price} />
        </span>
        {(label || v.list) && (
          <>
            <span className="ez:text-site-small ez:text-muted">{label}</span>
            {v.list ? (
              <s className="ez:justify-self-end ez:text-site-small ez:text-muted ez:tabular-nums">
                <span className="ez:sr-only">정가 </span>
                {v.list}
              </s>
            ) : (
              <span />
            )}
          </>
        )}
      </span>
    </NextLink>
  );
}

function BlankCard({ tone, ratio }: { tone: number; ratio: Shelf["ratio"] }) {
  return (
    <div className="ez:grid ez:min-w-0 ez:content-start">
      <span className="ez:fx-round-lg ez:block ez:overflow-hidden">
        <Photo src={null} alt="" tone={tone} className={cn(SHELF_RATIO[ratio], "ez:rounded-none")} />
      </span>
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-x-3 ez:px-1.5 ez:pt-4 ez:text-site-item">
        <Bar />
        <BlankPrice className="ez:text-muted" />
      </span>
    </div>
  );
}

const gridGap = "ez:grid ez:gap-x-3 ez:gap-y-8 ez:md:gap-x-6 ez:md:gap-y-10";

function Row({ slot, title, aside, items, shelf, count }: { slot: string; title: string; aside?: ReactNode; items: ProductSummary[]; shelf: Shelf; count: number }) {
  const sizes = shelfSizes(shelf, "aurora", CARD_SIZES);
  const two = shelf.cols_mobile === 2;
  return (
    <section data-slot={slot} data-variant="aurora" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={title} aside={items.length ? aside : undefined} />
      <div className={cn(gridGap, shelfCols(shelf))}>
        {items.length
          ? items.map((p, i) => (
              <div key={p.id} className={cn("ez:grid ez:min-w-0", two && lastOdd(i, items.length, 4))}>
                <Card product={p} shelf={shelf} sizes={sizes} />
              </div>
            ))
          : Array.from({ length: count }, (_, i) => <BlankCard key={i} tone={i} ratio={shelf.ratio} />)}
      </div>
    </section>
  );
}

const tabLink = cn("ez:inline-flex ez:min-h-10 ez:shrink-0 ez:items-center ez:no-underline ez:hover:text-fg", focusRing);

export function Best({ data, context, grid }: SectionProps<"best_grid">) {
  const count = grid?.pc ?? 4;
  const items = (data.items ?? []).slice(0, count);
  const kinds = context.categories.filter((c) => c.product_count !== 0).slice(0, 4);
  const aside = kinds.length ? (
    <nav aria-label={SHOP_TITLE.categories} className="ez:flex ez:max-w-full ez:gap-6 ez:overflow-x-auto ez:text-site-body ez:whitespace-nowrap ez:md:gap-7">
      <NextLink href={BEST_HREF} className={cn(tabLink, "ez:font-medium ez:text-fg")}>
        전체
      </NextLink>
      {kinds.map((c) => (
        <NextLink data-script={scriptOf(c.name)} key={c.id} href={categoryHref(c.id)} className={cn(tabLink, "ez:text-site-off")}>
          {c.name}
        </NextLink>
      ))}
    </nav>
  ) : (
    <More href={BEST_HREF} />
  );
  return <Row slot="best-grid" title={SHOP_TITLE.best} aside={aside} items={items} shelf={shelfOf("aurora", context.shelf)} count={count} />;
}

export function NewArrivals({ data, context, grid }: SectionProps<"product_grid">) {
  const pc = grid?.pc ?? 4;
  return <Row slot="product-grid" title={SHOP_TITLE.fresh} aside={<More href={FRESH_HREF} />} items={context.products.slice(0, shownCount(data.count, pc))} shelf={shelfOf("aurora", context.shelf)} count={pc} />;
}

export function Band({ data, context }: SectionProps<"photo_band">) {
  const image = data.image ?? data.images?.[0] ?? null;
  const name = context.storeName?.trim() || null;
  return (
    <section data-slot="photo-band" data-variant="aurora" data-blank={image ? undefined : ""} className="ez:grid ez:grid-cols-1 ez:items-center ez:gap-8 ez:text-fg ez:lg:grid-cols-[7fr_5fr] ez:lg:gap-6">
      <div className="ez:fx-round-xl ez:overflow-hidden">
        <Photo src={image} alt="" sizes="(max-width: 1024px) 100vw, 780px" tone={1} className="ez:aspect-[4/3] ez:rounded-none ez:lg:aspect-auto ez:lg:h-140" />
      </div>
      <div className="ez:grid ez:justify-items-start ez:gap-6 ez:lg:gap-9 ez:lg:pl-12">
        {image ? (
          <>
            {name && <h2 data-script={scriptOf(name)} className={sectionTitle}>{name}</h2>}
            <NextLink href={PRODUCTS_HREF} className={goLink}>
              {SHOP_TITLE.more}
              <Icon name="right" size="sm" />
            </NextLink>
          </>
        ) : (
          <>
            <span className="ez:w-3/5 ez:text-site-section ez:lg:text-site-display-md">
              <Bar size="full" block />
            </span>
            <span className="ez:text-site-body">
              <Bar size="short" />
            </span>
          </>
        )}
      </div>
    </section>
  );
}

type ReviewItem = NonNullable<SectionProps<"reviews">["data"]["items"]>[number];

const reviewCard = "ez:flex ez:min-h-60 ez:min-w-0 ez:flex-col ez:fx-round-lg ez:bg-surface-alt ez:px-6 ez:pt-7 ez:pb-6 ez:md:min-h-68 ez:md:px-8 ez:md:pt-8 ez:md:pb-7";

function ReviewCard({ item, product }: { item: ReviewItem; product?: ProductSummary }) {
  return (
    <article className={reviewCard}>
      <span role="img" aria-label={`별점 ${item.rating}점`} className="ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-note ez:text-muted ez:tabular-nums">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="ez:size-3.5 ez:text-primary">
          <path fill="currentColor" d={STAR_PATH} />
        </svg>
        {item.rating.toFixed(1)}
      </span>
      <p data-script={scriptOf(item.body)} className="ez:m-0 ez:mt-4.5 ez:line-clamp-4 ez:text-site-item ez:leading-relaxed ez:text-pretty ez:text-fg">{item.body}</p>
      <span data-script={scriptOf([item.name, product?.name].filter(Boolean).join(" · "))} className="ez:mt-auto ez:truncate ez:pt-5.5 ez:text-site-small ez:text-site-off">{[item.name, product?.name].filter(Boolean).join(" · ")}</span>
    </article>
  );
}

function BlankReview() {
  return (
    <div className={reviewCard}>
      <BlankStars />
      <Lines className="ez:mt-5 ez:text-site-item" />
      <span className="ez:mt-auto ez:pt-5.5 ez:text-site-small">
        <Bar size="short" />
      </span>
    </div>
  );
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).filter((r, i, all) => !r.product || all.findIndex((x) => x.product === r.product) === i).slice(0, 3);
  const summary =
    items.length && data.average != null && data.count ? (
      <span className="ez:text-site-body ez:text-muted ez:tabular-nums">
        {data.average.toFixed(1)} · {SHOP_TITLE.reviews} {data.count}
      </span>
    ) : undefined;
  return (
    <section data-slot="reviews" data-variant="aurora" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={SHOP_TITLE.reviews} aside={summary} />
      <div className={cn("ez:grid ez:grid-cols-1 ez:gap-3 ez:md:gap-6", fillCols(items.length || 3))}>
        {items.length
          ? items.map((r, i) => <ReviewCard key={`${r.name}-${r.date ?? ""}-${i}`} item={r} product={r.product ? context.products.find((p) => p.id === r.product) : undefined} />)
          : [0, 1, 2].map((i) => <BlankReview key={i} />)}
      </div>
    </section>
  );
}

type GuideCell = { label: string; value: string | null; note?: string | null; href?: string | null };

const guideCell = cn(
  hair,
  "ez:grid ez:min-w-0 ez:content-start ez:gap-2 ez:py-5 ez:text-fg ez:no-underline ez:max-sm:border-t ez:max-sm:first:border-t-0 ez:lg:border-l ez:lg:px-12 ez:lg:py-0 ez:lg:first:border-l-0",
);

function GuideBody({ cell }: { cell: GuideCell }) {
  return (
    <>
      <span className="ez:text-site-note ez:text-muted">{cell.label}</span>
      {cell.value ? (
        <span className="ez:text-site-heading ez:tabular-nums"><Won value={cell.value} /></span>
      ) : (
        <span className="ez:text-site-heading">
          <Bar />
        </span>
      )}
      {cell.note && <span data-script={scriptOf(cell.note)} className="ez:text-site-note ez:text-muted">{cell.note}</span>}
    </>
  );
}

export function Guide({ data, context }: SectionProps<"shop_guide">) {
  const ship = context.shipping;
  const phone = data.phone?.trim() || null;
  const cells: GuideCell[] = [
    { label: "배송비", value: ship ? (ship.base_fee ? won(ship.base_fee) : "무료") : null, note: ship?.free_threshold ? `${won(ship.free_threshold)} 이상 무료` : null },
    { label: "교환 배송비", value: ship ? won(ship.exchange_fee) : null },
    { label: "반품 배송비", value: ship ? won(ship.return_fee) : null, href: ship ? (data.returns ?? null) : null },
    { label: "고객센터", value: phone, note: phone ? (data.hours ?? null) : null, href: phone ? `tel:${phone}` : null },
  ];
  const empty = cells.every((c) => !c.value);
  return (
    <section
      data-slot="shop-guide"
      data-variant="aurora"
      data-blank={empty ? "" : undefined}
      className="ez:grid ez:grid-cols-1 ez:gap-x-6 ez:fx-round-xl ez:bg-surface-alt ez:px-6 ez:py-3 ez:text-fg ez:sm:grid-cols-2 ez:sm:py-6 ez:lg:grid-cols-4 ez:lg:gap-x-0 ez:lg:px-0 ez:lg:py-11"
    >
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
    <NextLink href={promo.href} className={cn("ez:group ez:relative ez:block ez:self-start ez:text-fg ez:no-underline", single ? "ez:col-span-1 ez:lg:col-span-2" : "ez:col-span-2", focusRing)}>
      <span className="ez:fx-round-xl ez:relative ez:block ez:overflow-hidden" style={{ aspectRatio: 2.08 }}>
        <Photo src={promo.image} alt="" sizes="(max-width: 1024px) 100vw, 680px" tone={2} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
      </span>
      <span className="ez:fx-glass ez:mt-3 ez:grid ez:gap-4 ez:fx-round-md ez:p-6 ez:sm:absolute ez:sm:right-5 ez:sm:bottom-5 ez:sm:left-5 ez:sm:mt-0 ez:sm:max-w-90">
        <span data-script={scriptOf(promo.title)} className="ez:text-site-heading ez:text-balance">{promo.title}</span>
        <span className="ez:inline-flex ez:items-center ez:gap-2 ez:text-site-body ez:underline-offset-4 ez:group-hover:underline">
          {SHOP_TITLE.more}
          <Icon name="right" size="sm" />
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
        <summary className={cn("ez:flex ez:min-h-10 ez:cursor-pointer ez:list-none ez:items-center ez:gap-1.5 ez:text-site-body ez:text-fg ez:[&::-webkit-details-marker]:hidden", focusRing)}>
          {current.label}
          <Icon name="down" size="sm" className="ez:text-muted ez:transition-transform ez:group-open:rotate-180" />
        </summary>
        <ul className="ez:fx-lift ez:absolute ez:right-0 ez:z-10 ez:m-0 ez:mt-1 ez:grid ez:min-w-40 ez:list-none ez:rounded-lg ez:bg-surface-alt ez:p-2">
          {sorts.map((s) => (
            <li key={s.href}>
              <NextLink
                href={s.href}
                aria-current={s.on ? "true" : undefined}
                className={cn("ez:flex ez:min-h-10 ez:items-center ez:rounded-md ez:px-3 ez:text-site-body ez:no-underline ez:hover:bg-surface", s.on ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}
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

export function List({ title, count, crumbs, tabs, sorts, products, more, search, promo, emptyHref, shelf = SHELF_DEFAULTS.aurora }: ShopListProps) {
  const sizes = shelfSizes(shelf, "aurora", CARD_SIZES);
  const cards: ReactNode[] = products.map((p, i) => <Card key={p.id} product={p} eager={i < 4} shelf={shelf} sizes={sizes} />);
  if (promo && cards.length) cards.splice(Math.min(4, cards.length), 0, <Promo key="promo" promo={promo} single={shelf.cols_mobile === 1} />);
  return (
    <div data-slot="catalog-view" data-variant="aurora" className="ez:grid ez:grid-cols-1 ez:pt-6 ez:text-fg ez:lg:pt-10">
      <Crumbs items={crumbs} />
      <div className="ez:mt-4 ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1">
        <h1 data-script={scriptOf(title)} className={sectionTitle}>{title}</h1>
        {count ? <span className="ez:text-site-item ez:font-normal ez:text-muted ez:tabular-nums">{count}</span> : null}
      </div>
      {search && <div className="ez:mt-6">{search}</div>}
      <div className="ez:mt-8 ez:flex ez:items-center ez:justify-between ez:gap-6 ez:lg:mt-10">
        <nav aria-label="카테고리" className="ez:-mx-page ez:flex ez:min-w-0 ez:gap-6 ez:overflow-x-auto ez:px-page ez:whitespace-nowrap ez:md:mx-0 ez:md:gap-7 ez:md:px-0">
          {tabs.map((t) => (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={cn("ez:inline-flex ez:shrink-0 ez:items-baseline ez:gap-1.5 ez:py-2 ez:text-site-body ez:no-underline ez:hover:text-fg", t.on ? "ez:fx-tab ez:font-medium ez:text-fg" : "ez:text-site-off", focusRing)}
            >
              {t.label}
              {t.count != null && <span className="ez:text-site-small ez:font-normal ez:text-muted ez:tabular-nums">{t.count}</span>}
            </NextLink>
          ))}
        </nav>
        <SortMenu sorts={sorts} />
      </div>
      <div className="ez:mt-8 ez:lg:mt-10">
        {products.length ? <div className={cn(gridGap, "ez:grid-flow-row-dense", shelfCols(shelf))}>{cards}</div> : <ProductGrid products={[]} emptyHref={emptyHref} />}
      </div>
      {more && (
        <div className="ez:mt-14 ez:flex ez:flex-col ez:items-center ez:gap-4">
          {count ? (
            <span className="ez:text-site-small ez:text-muted ez:tabular-nums">
              {products.length} / {count}
            </span>
          ) : null}
          <NextLink href={more} className={glassButton}>
            더 보기
            <Icon name="down" size="sm" />
          </NextLink>
        </div>
      )}
    </div>
  );
}
