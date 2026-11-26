import NextLink from "next/link";
import type { ReactNode } from "react";
import { ProductGrid } from "../../blocks/product-grid";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { buttonVariants, ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { STAR_PATH } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import type { ProductSummary } from "../../types";
import { cn } from "../../utils/cn";
import { discountRate, won } from "../../utils/format";
import { focusRing } from "../../utils/styles";
import { Bar, BlankPrice, BlankStars, Lines } from "../kit";
import { guideRows } from "./defaults";
import { BestShelf, type BestTab } from "./e-best";
import { ShopNavLinks } from "./nav";
import { BEST_HREF, FRESH_HREF, lastOdd, PRODUCTS_HREF, productView, SHOP_TITLE, shownCount } from "./shared";
import { SHELF_DEFAULTS, SHELF_RATIO, shelfCols, shelfOf, shelfSizes, shelfView, type Shelf } from "./shelf";
import type { CatalogPromo, FooterLink, ShopFooterProps, ShopHeaderProps, ShopListProps } from "./types";
import { Won } from "../../components/price";
import { scriptOf } from "../../utils/writing";

const bleed = "ez:mx-[calc(50%-50vw)]";

const wrap = "ez:mx-auto ez:w-full ez:max-w-wrap ez:box-border ez:px-page";

const CARD_SIZES = "(max-width: 1024px) 50vw, 330px";

const frame = "ez:overflow-hidden ez:rounded-lg ez:border ez:border-solid";

const panel = "ez:fx-round-md ez:overflow-hidden ez:border ez:border-solid";

const pill = "ez:rounded-full";

const title = "ez:m-0 ez:text-site-section ez:text-fg ez:lg:text-site-page";

const more = cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1.5 ez:text-site-small ez:text-site-off ez:no-underline ez:hover:text-fg", focusRing);

const lineButton = "ez:rounded-full ez:border-site-line ez:font-normal";

const topLink = cn("ez:relative ez:inline-flex ez:h-10 ez:min-w-10 ez:items-center ez:justify-center ez:gap-1.5 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg ez:lg:min-w-0", focusRing);

const rowGrid = "ez:grid ez:gap-x-4 ez:gap-y-10 ez:lg:gap-x-6 ez:lg:gap-y-11";

function Head({ text, aside }: { text: string; aside?: ReactNode }) {
  return (
    <div className="ez:mb-7 ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-x-8 ez:gap-y-3">
      <h2 data-script={scriptOf(text)} className={title}>{text}</h2>
      {aside}
    </div>
  );
}

function More({ href, label = SHOP_TITLE.more }: { href: string; label?: string }) {
  return (
    <NextLink href={href} className={more}>
      {label}
      <Icon name="right" size="sm" />
    </NextLink>
  );
}

function Card({ product, shelf, eager, sizes = CARD_SIZES }: { product: ProductSummary; shelf: Shelf; eager?: boolean; sizes?: string }) {
  const v = shelfView(productView(product), shelf);
  const label = v.soldOut ? "품절" : v.sample ? "예시" : null;
  const ink = v.soldOut ? "ez:text-muted" : "ez:text-fg";
  return (
    <NextLink
      href={v.href}
      data-slot="product-card"
      data-sold-out={v.soldOut ? "" : undefined}
      data-sample={v.sample ? "" : undefined}
      className={cn("ez:group ez:flex ez:min-w-0 ez:flex-col ez:text-fg ez:no-underline", focusRing)}
    >
      <span className={cn(frame, "ez:relative ez:block ez:border-hairline ez:bg-surface-alt")}>
        <Photo src={v.cover} alt={v.name} preload={eager} sizes={sizes} className={cn(SHELF_RATIO[shelf.ratio], "ez:rounded-none", v.soldOut && "ez:opacity-45")} />
        {!v.soldOut && (
          <span aria-hidden="true" className="ez:fx-glass ez:absolute ez:right-3 ez:bottom-3 ez:grid ez:size-11 ez:place-items-center ez:rounded-md ez:text-fg">
            <Icon name="bag" size="sm" />
          </span>
        )}
      </span>
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-3 ez:gap-y-1 ez:px-0.5 ez:pt-4">
        <span data-script={scriptOf(v.name)} className={cn("ez:truncate ez:text-site-item ez:underline-offset-4 ez:group-hover:underline", ink)}>{v.name}</span>
        <span className={cn("ez:text-site-body ez:whitespace-nowrap", ink)}><Won value={v.price} /></span>
        {(v.rate > 0 || v.list || label) && (
          <span className="ez:col-span-2 ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:text-site-small">
            <span className="ez:flex ez:items-baseline ez:gap-2">
              {v.rate > 0 && <span className="ez:text-fg">{v.rate}%</span>}
              {v.list && (
                <s className="ez:text-site-off">
                  <span className="ez:sr-only">정가 </span>
                  {v.list}
                </s>
              )}
            </span>
            {label && <span className="ez:text-site-off">{label}</span>}
          </span>
        )}
      </span>
    </NextLink>
  );
}

function BlankCard({ ratio }: { ratio: string }) {
  return (
    <div className="ez:flex ez:min-w-0 ez:flex-col">
      <span className={cn(frame, "ez:block ez:border-hairline ez:bg-surface-alt")}>
        <Photo src={null} alt="" className={cn(ratio, "ez:rounded-none")} />
      </span>
      <span className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-baseline ez:gap-x-3 ez:px-0.5 ez:pt-4 ez:text-site-item">
        <Bar />
        <BlankPrice className="ez:text-site-body ez:text-muted" />
      </span>
    </div>
  );
}

function Blanks({ shelf }: { shelf: Shelf }) {
  return (
    <div className={cn(rowGrid, shelfCols(shelf))}>
      {[0, 1, 2, 3].map((i) => (
        <BlankCard key={i} ratio={SHELF_RATIO[shelf.ratio]} />
      ))}
    </div>
  );
}

function Cards({ items, shelf }: { items: ProductSummary[]; shelf: Shelf }) {
  const pair = shelf.cols_mobile === 2;
  return (
    <div className={cn(rowGrid, shelfCols(shelf))}>
      {items.map((p, i) => (
        <div key={p.id} className={cn("ez:min-w-0", pair && lastOdd(i, items.length, 4))}>
          <Card product={p} shelf={shelf} />
        </div>
      ))}
    </div>
  );
}

export function Header({ name, logoUrl, cartCount, nav, links }: ShopHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="float" className="ez:bg-surface ez:text-fg">
      <div className={cn(wrap, "ez:flex ez:h-16 ez:items-center ez:gap-6 ez:lg:h-22 ez:lg:gap-0")}>
        <NextLink data-script={scriptOf(name)} href="/" className={cn("ez:min-w-0 ez:text-site-heading ez:text-fg ez:no-underline ez:lg:w-51 ez:lg:shrink-0", focusRing)}>
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:gap-9 ez:overflow-hidden ez:whitespace-nowrap ez:max-lg:hidden">
          <ShopNavLinks
            items={[nav.fresh, nav.best, ...nav.categories]}
            className={cn("ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}
            currentClassName="ez:text-fg"
          />
        </nav>
        <div className="ez:ml-auto ez:flex ez:shrink-0 ez:items-center ez:gap-1 ez:lg:gap-6 ez:lg:pl-6">
          <NextLink href={links.search} aria-label="검색" className={topLink}>
            <Icon name="search" className="ez:lg:hidden" />
            <span className="ez:max-lg:hidden">검색</span>
          </NextLink>
          <NextLink href={links.account.href} aria-label={links.account.label} className={topLink}>
            <Icon name="user" className="ez:lg:hidden" />
            <span className="ez:max-lg:hidden">{links.account.label}</span>
          </NextLink>
          <NextLink href={links.likes} aria-label="찜" className={topLink}>
            <Icon name="heart" className="ez:lg:hidden" />
            <span className="ez:max-lg:hidden">찜</span>
          </NextLink>
          <NextLink href={links.cart} aria-label={cartCount ? `장바구니 ${cartCount}` : "장바구니"} className={topLink}>
            <span className="ez:relative ez:inline-flex ez:lg:hidden">
              <Icon name="bag" />
              {cartCount ? <span aria-hidden="true" className="ez:absolute ez:-top-0.5 ez:-right-1 ez:size-1.75 ez:rounded-full ez:bg-primary" /> : null}
            </span>
            <span className="ez:max-lg:hidden">{cartCount ? `장바구니 ${cartCount}` : "장바구니"}</span>
          </NextLink>
          <ButtonLink href={nav.all.href} size="sm" className={cn(pill, "ez:max-lg:hidden")}>
            {nav.all.label}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({ heading, items }: { heading: string; items: FooterLink[] }) {
  return (
    <nav aria-label={heading} className="ez:grid ez:content-start ez:gap-4 ez:lg:col-span-2">
      <span data-script={scriptOf(heading)} className="ez:text-site-small ez:text-muted">{heading}</span>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-2 ez:p-0 ez:text-site-small">
        {items.map((l) => (
          <li key={l.href}>
            <NextLink href={l.href} className={cn("ez:no-underline ez:hover:text-fg", l.strong ? "ez:text-muted" : "ez:text-site-off", focusRing)}>
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
    <footer data-slot="site-footer" data-variant="night" className="ez:pt-10 ez:text-fg ez:lg:pt-14">
      <div className={wrap}>
        <div className="ez:grid ez:grid-cols-2 ez:gap-x-6 ez:gap-y-10 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-12 ez:pb-10 ez:md:grid-cols-4 ez:lg:grid-cols-12 ez:lg:pt-15">
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-5 ez:md:col-span-4 ez:lg:col-span-4">
            <p data-script={scriptOf(storeName)} className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{storeName}</p>
            {(phone || hours) && (
              <div className="ez:grid ez:gap-1">
                <span className="ez:text-site-small ez:text-muted">고객센터</span>
                {phone && (
                  <a href={`tel:${phone}`} className={cn("ez:justify-self-start ez:text-site-heading ez:text-fg ez:no-underline", focusRing)}>
                    {phone}
                  </a>
                )}
                {hours && <span data-script={scriptOf(hours)} className="ez:text-site-small ez:text-site-off">{hours}</span>}
              </div>
            )}
          </div>
          <FooterColumn heading="쇼핑" items={shop} />
          <FooterColumn heading="안내" items={guide} />
          <FooterColumn heading="내 쇼핑" items={account} />
          {terms.length > 0 && <FooterColumn heading="약관" items={terms} />}
        </div>
        <div className="ez:flex ez:flex-col ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-hairline ez:pt-6 ez:pb-12 ez:text-site-small ez:leading-relaxed ez:text-site-off ez:md:flex-row ez:md:justify-between ez:md:gap-10">
          <p className="ez:m-0">{legal}</p>
          <p className="ez:m-0 ez:shrink-0">© {storeName}</p>
        </div>
      </div>
    </footer>
  );
}

type HeroProduct = NonNullable<SectionProps<"hero">["data"]["products"]>[number];

const floatBox = "ez:fx-glass ez:mt-3 ez:block ez:rounded-lg ez:px-5.5 ez:pt-5 ez:pb-2.5 ez:text-fg ez:no-underline ez:md:absolute ez:md:bottom-7 ez:md:left-7 ez:md:mt-0 ez:md:w-75";

const floatRow = "ez:flex ez:items-baseline ez:justify-between ez:gap-6 ez:border-0 ez:border-t ez:border-solid ez:border-hairline ez:py-2.5 ez:text-site-body";

function HeroFloat({ product, delivery }: { product: HeroProduct; delivery: string | null }) {
  const sale = product.sale_price ?? product.list_price;
  const rate = !product.sold_out && product.list_price != null && product.sale_price != null ? discountRate(product.list_price, product.sale_price) : 0;
  return (
    <NextLink href={product.href ?? `/products/${product.id}`} className={cn(floatBox, "ez:group", focusRing)}>
      <span data-script={scriptOf(product.name)} className="ez:block ez:truncate ez:text-site-heading ez:underline-offset-4 ez:group-hover:underline">{product.name}</span>
      <span className="ez:mt-3 ez:grid">
        {sale != null && (
          <span className={floatRow}>
            <span className="ez:text-site-off">{rate > 0 ? `${rate}%` : ""}</span>
            <span><Won amount={sale} /></span>
          </span>
        )}
        {delivery && (
          <span className={floatRow}>
            <span className="ez:text-site-off">배송비</span>
            <span>{delivery}</span>
          </span>
        )}
        {product.sold_out && (
          <span className={floatRow}>
            <span className="ez:text-site-off">품절</span>
          </span>
        )}
      </span>
    </NextLink>
  );
}

function BlankFloat() {
  return (
    <div className={floatBox}>
      <span className="ez:block ez:text-site-heading">
        <Bar />
      </span>
      <span className="ez:mt-3 ez:grid">
        {[0, 1].map((i) => (
          <span key={i} className={floatRow}>
            <Bar size="short" />
            <BlankPrice className="ez:text-muted" />
          </span>
        ))}
      </span>
    </div>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const heading = data.title?.trim() || null;
  const sub = heading ? data.sub?.trim() || null : null;
  const image = data.image ?? data.images?.[0] ?? null;
  const name = context.storeName?.trim() || null;
  const blank = !heading && !image;
  const products = blank ? [] : (data.products ?? []);
  const pick = products.find((p) => p.cover_url) ?? products[0] ?? null;
  const banner = heading && data.href && data.href !== PRODUCTS_HREF ? data.href : null;
  const ship = context.shipping;
  const delivery = ship ? (ship.base_fee ? won(ship.base_fee) : "무료") : null;
  const photo = <Photo src={image} alt={heading ?? ""} preload sizes="(max-width: 1440px) 100vw, 1344px" tone={0} className="ez:aspect-auto ez:h-full ez:rounded-none" />;
  return (
    <section
      data-slot="hero"
      data-variant="full"
      data-blank={blank ? "" : undefined}
      data-bleed=""
      data-flush=""
      className={cn("ez:relative ez:overflow-clip ez:pt-16 ez:text-fg ez:lg:pt-22", bleed)}
    >
      <div aria-hidden="true" className="ez:fx-sky ez:absolute ez:inset-x-0 ez:top-0 ez:h-168 ez:lg:h-225" />
      <div className="ez:relative">
        <div aria-hidden="true" className="ez:fx-halo ez:z-1" />
        <div aria-hidden="true" className="ez:fx-orb ez:z-1" />
        <div className={cn(wrap, "ez:relative ez:z-2 ez:flex ez:h-152 ez:flex-col ez:items-center ez:pt-12 ez:text-center ez:lg:h-203 ez:lg:pt-21")}>
          {name ? (
            <p data-script={scriptOf(name)} className="ez:fx-fade ez:fx-title-xl ez:m-0 ez:max-w-full ez:break-keep">{name}</p>
          ) : (
            <span className="ez:fx-title-xl">
              <Bar size="long" strong />
            </span>
          )}
          {heading ? (
            <h1 data-script={scriptOf(heading)} className="ez:m-0 ez:mt-6 ez:max-w-140 ez:text-site-item ez:font-normal ez:text-balance ez:text-muted">{heading}</h1>
          ) : (
            <span className="ez:mt-6 ez:text-site-item">
              <Bar size="long" />
            </span>
          )}
          {sub && (
            <p data-slot="hero-sub" className="ez:m-0 ez:mt-2 ez:max-w-140 ez:text-site-body ez:text-site-off">
              {sub}
            </p>
          )}
          {!blank && (
            <div className="ez:mt-9 ez:flex ez:flex-wrap ez:justify-center ez:gap-3">
              <ButtonLink href={PRODUCTS_HREF} className={pill}>
                {SHOP_TITLE.all}
              </ButtonLink>
              <ButtonLink href={FRESH_HREF} variant="outline" className={lineButton}>
                {SHOP_TITLE.fresh}
              </ButtonLink>
            </div>
          )}
        </div>
        <div className={cn(wrap, "ez:relative ez:z-2")}>
          <div className="ez:relative">
            <div className={cn(panel, "ez:h-100 ez:border-site-line ez:md:h-140 ez:lg:h-175")}>
              {banner ? (
                <NextLink href={banner} className={cn("ez:block ez:h-full", focusRing)}>
                  {photo}
                </NextLink>
              ) : (
                photo
              )}
            </div>
            {blank ? <BlankFloat /> : pick && <HeroFloat product={pick} delivery={delivery} />}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Best({ data, context, grid }: SectionProps<"best_grid">) {
  const shelf = shelfOf("night", context.shelf);
  const items = (data.items ?? []).slice(0, grid?.pc ?? 4);
  if (!items.length) {
    return (
      <section data-slot="best-grid" data-blank="" className="ez:text-fg">
        <Head text={SHOP_TITLE.best} />
        <Blanks shelf={shelf} />
      </section>
    );
  }
  const used = new Set(items.map((p) => p.category_id).filter(Boolean));
  const tabs: BestTab[] = context.categories.filter((c) => used.has(c.id)).map((c) => ({ id: c.id, label: c.name }));
  if (tabs.length < 2) {
    return (
      <section data-slot="best-grid" className="ez:text-fg">
        <Head text={SHOP_TITLE.best} aside={<More href={BEST_HREF} />} />
        <Cards items={items} shelf={shelf} />
      </section>
    );
  }
  return (
    <section data-slot="best-grid" className="ez:text-fg">
      <BestShelf
        title={<h2 className={title}>{SHOP_TITLE.best}</h2>}
        all="전체"
        tabs={tabs}
        cards={items.map((p) => ({ id: p.id, category: p.category_id ?? null, node: <Card product={p} shelf={shelf} /> }))}
        grid={cn(rowGrid, shelfCols(shelf))}
        pair={shelf.cols_mobile === 2}
      />
    </section>
  );
}

export function Band({ data, context }: SectionProps<"photo_band">) {
  const image = data.image ?? data.images?.[0] ?? null;
  const name = context.storeName?.trim() || null;
  const body = data.body?.trim() || null;
  return (
    <section data-slot="photo-band" data-variant="night" data-blank={image ? undefined : ""} className="ez:grid ez:items-center ez:gap-8 ez:text-fg ez:md:grid-cols-[7fr_5fr] ez:md:gap-6">
      <div className={cn(panel, "ez:border-hairline")}>
        <Photo src={image} alt="" sizes="(max-width: 768px) 100vw, 780px" tone={2} className="ez:aspect-[4/3] ez:rounded-none ez:md:aspect-auto ez:md:h-140" />
      </div>
      <div className="ez:flex ez:min-w-0 ez:flex-col ez:items-start ez:md:pl-12">
        {image && name ? (
          <h2 data-script={scriptOf(name)} className={cn(title, "ez:break-keep")}>{name}</h2>
        ) : (
          <span className="ez:w-full ez:max-w-80 ez:text-site-page">
            <Bar size="long" strong block />
          </span>
        )}
        {body ? (
          <p data-script={scriptOf(body)} className="ez:m-0 ez:mt-5 ez:max-w-100 ez:text-site-item ez:font-normal ez:leading-relaxed ez:whitespace-pre-line ez:text-muted">{body}</p>
        ) : (
          <span className="ez:mt-5 ez:w-full ez:max-w-100 ez:text-site-item">
            <Lines />
          </span>
        )}
        {image && (
          <NextLink href={PRODUCTS_HREF} className={cn(more, "ez:mt-9 ez:text-site-body ez:text-fg")}>
            {SHOP_TITLE.more}
            <Icon name="right" size="sm" />
          </NextLink>
        )}
      </div>
    </section>
  );
}

export function NewArrivals({ data, context, grid }: SectionProps<"product_grid">) {
  const shelf = shelfOf("night", context.shelf);
  const items = context.products.slice(0, shownCount(data.count, grid?.pc ?? 4));
  return (
    <section data-slot="product-grid" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head text={SHOP_TITLE.fresh} aside={items.length ? <More href={FRESH_HREF} /> : undefined} />
      {items.length ? <Cards items={items} shelf={shelf} /> : <Blanks shelf={shelf} />}
    </section>
  );
}

type ReviewItem = NonNullable<SectionProps<"reviews">["data"]["items"]>[number];

const reviewCol = "ez:grid ez:min-w-0 ez:content-start ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-6";

function Review({ item, product }: { item: ReviewItem; product?: string }) {
  return (
    <article className={reviewCol}>
      <span className="ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-small ez:text-muted">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="ez:size-3.5 ez:fill-star">
          <path d={STAR_PATH} />
        </svg>
        <span className="ez:sr-only">별점 </span>
        {item.rating.toFixed(1)}
      </span>
      <p data-script={scriptOf(item.body)} className="ez:m-0 ez:mt-4 ez:line-clamp-4 ez:min-h-[4lh] ez:text-site-item ez:leading-relaxed ez:text-pretty ez:text-fg">{item.body}</p>
      <span data-script={scriptOf([item.name, product].filter(Boolean).join(" · "))} className="ez:mt-5 ez:truncate ez:text-site-small ez:text-site-off">{[item.name, product].filter(Boolean).join(" · ")}</span>
    </article>
  );
}

function BlankReview() {
  return (
    <div className={reviewCol}>
      <BlankStars />
      <span className="ez:mt-4 ez:text-site-item">
        <Lines />
      </span>
      <span className="ez:mt-5 ez:text-site-small">
        <Bar size="short" />
      </span>
    </div>
  );
}

function reviewSummary(average: number | null | undefined, count: number | null | undefined, word: string): string | null {
  const parts = [average != null ? average.toFixed(1) : null, count != null ? `${word} ${count}` : null].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).filter((r, i, all) => !r.product || all.findIndex((x) => x.product === r.product) === i).slice(0, 3);
  const summary = items.length ? reviewSummary(data.average, data.count, SHOP_TITLE.reviews) : null;
  return (
    <section data-slot="reviews" data-variant="night" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head text={SHOP_TITLE.reviews} aside={summary ? <span data-script={scriptOf(summary)} className="ez:text-site-small ez:text-site-off">{summary}</span> : undefined} />
      <div className="ez:grid ez:gap-x-6 ez:gap-y-10 ez:md:grid-cols-3">
        {items.length
          ? items.map((r, i) => <Review key={`${r.name}-${r.date ?? ""}-${i}`} item={r} product={r.product ? context.products.find((p) => p.id === r.product)?.name : undefined} />)
          : [0, 1, 2].map((i) => <BlankReview key={i} />)}
      </div>
    </section>
  );
}

type GuideCell = { label: string; value: string | null; sub?: string | null; href?: string | null };

const GUIDE_EDGE = [
  "ez:pr-4 ez:lg:pr-7",
  "ez:border-l ez:pl-4 ez:lg:px-7",
  "ez:border-t ez:pr-4 ez:lg:border-t-0 ez:lg:border-l ez:lg:px-7",
  "ez:border-t ez:border-l ez:pl-4 ez:lg:border-t-0 ez:lg:pl-7",
];

function GuideBody({ cell }: { cell: GuideCell }) {
  return (
    <>
      <span className="ez:block ez:text-site-small ez:text-site-off">{cell.label}</span>
      {cell.value ? (
        <span className="ez:mt-3 ez:block ez:text-site-heading ez:text-fg"><Won value={cell.value} /></span>
      ) : (
        <span className="ez:mt-3 ez:block ez:text-site-heading">
          <Bar />
        </span>
      )}
      {cell.sub && <span data-script={scriptOf(cell.sub)} className="ez:mt-1.5 ez:block ez:text-site-small ez:text-muted">{cell.sub}</span>}
    </>
  );
}

export function Guide({ data, context }: SectionProps<"shop_guide">) {
  const rows = guideRows(data, context.shipping);
  const ship = context.shipping;
  const empty = !rows.delivery && !rows.exchange && !rows.returns && !rows.center;
  const cells: GuideCell[] = [
    { label: "배송비", value: ship ? (ship.base_fee ? won(ship.base_fee) : "무료") : null, sub: ship?.free_threshold ? `${won(ship.free_threshold)} 이상 무료` : null },
    { label: "교환 배송비", value: rows.exchange?.value ?? null },
    { label: "반품 배송비", value: rows.returns?.value ?? null, href: rows.returns?.href },
    { label: "고객센터", value: rows.center?.value ?? null, sub: rows.center?.hours, href: rows.center?.href },
  ];
  return (
    <section data-slot="shop-guide" data-variant="night" data-blank={empty ? "" : undefined} className="ez:grid ez:grid-cols-2 ez:border-0 ez:border-y ez:border-solid ez:border-site-line ez:text-fg ez:lg:grid-cols-4">
      {cells.map((cell, i) => {
        const box = cn("ez:block ez:min-w-0 ez:border-0 ez:border-solid ez:border-site-line ez:py-7 ez:text-fg ez:no-underline ez:lg:py-8", GUIDE_EDGE[i]);
        if (!cell.href || !cell.value) {
          return (
            <div key={cell.label} className={box}>
              <GuideBody cell={cell} />
            </div>
          );
        }
        const live = cn(box, "ez:hover:bg-select", focusRing);
        return cell.href.startsWith("tel:") ? (
          <a key={cell.label} href={cell.href} className={live}>
            <GuideBody cell={cell} />
          </a>
        ) : (
          <NextLink key={cell.label} href={cell.href} className={live}>
            <GuideBody cell={cell} />
          </NextLink>
        );
      })}
    </section>
  );
}

function Promo({ promo, single }: { promo: CatalogPromo; single: boolean }) {
  return (
    <NextLink href={promo.href} className={cn("ez:group ez:block ez:self-start ez:text-fg ez:no-underline", single ? "ez:col-span-1 ez:lg:col-span-2" : "ez:col-span-2", focusRing)}>
      <span className="ez:relative ez:block">
        <span className={cn(panel, "ez:relative ez:block ez:border-hairline")} style={{ aspectRatio: 2.08 }}>
          <Photo src={promo.image} alt="" sizes="(max-width: 1024px) 100vw, 860px" tone={2} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
        </span>
        <span className="ez:fx-glass ez:mt-3 ez:grid ez:gap-5 ez:rounded-lg ez:p-6 ez:sm:absolute ez:sm:bottom-6 ez:sm:left-6 ez:sm:mt-0 ez:sm:max-w-90 ez:md:p-7">
          <span data-script={scriptOf(promo.title)} className="ez:text-site-heading ez:text-balance">{promo.title}</span>
          <span className="ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-body ez:group-hover:underline ez:underline-offset-4">
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
        <summary className={cn("ez:flex ez:min-h-10 ez:cursor-pointer ez:list-none ez:items-center ez:gap-1.5 ez:text-site-body ez:text-fg ez:[&::-webkit-details-marker]:hidden", focusRing)}>
          {current.label}
          <Icon name="down" size="sm" className="ez:text-site-off ez:transition-transform ez:group-open:rotate-180" />
        </summary>
        <ul className="ez:absolute ez:right-0 ez:z-10 ez:m-0 ez:mt-1 ez:grid ez:min-w-40 ez:list-none ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-raised ez:p-1.5">
          {sorts.map((s) => (
            <li key={s.href}>
              <NextLink
                href={s.href}
                aria-current={s.on ? "true" : undefined}
                className={cn("ez:flex ez:min-h-10 ez:items-center ez:rounded-sm ez:px-3 ez:text-site-body ez:no-underline ez:hover:bg-select", s.on ? "ez:text-fg" : "ez:text-muted", focusRing)}
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
    <nav aria-label="현재 위치" className="ez:flex ez:flex-wrap ez:items-center ez:gap-1.5 ez:text-site-small ez:text-site-off">
      {items.map((c, i) => (
        <span key={c.href} className="ez:flex ez:items-center ez:gap-1.5">
          {i > 0 && <Icon name="next" size="sm" />}
          {i === items.length - 1 ? (
            <span aria-current="page" className="ez:text-muted">
              {c.label}
            </span>
          ) : (
            <NextLink href={c.href} className={cn("ez:text-site-off ez:no-underline ez:hover:text-fg", focusRing)}>
              {c.label}
            </NextLink>
          )}
        </span>
      ))}
    </nav>
  );
}

export function List({ title: heading, count, crumbs, tabs, sorts, products, more: next, search, promo, emptyHref, shelf = SHELF_DEFAULTS.night }: ShopListProps) {
  const sizes = shelfSizes(shelf, "night", CARD_SIZES);
  const cards: ReactNode[] = products.map((p, i) => <Card key={p.id} product={p} eager={i < 4} shelf={shelf} sizes={sizes} />);
  if (promo && cards.length) cards.splice(Math.min(4, cards.length), 0, <Promo key="promo" promo={promo} single={shelf.cols_mobile === 1} />);
  return (
    <div data-slot="catalog-view" data-variant="night" className="ez:grid ez:grid-cols-1 ez:text-fg">
      <Crumbs items={crumbs} />
      <div className="ez:mt-4 ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1">
        <h1 data-script={scriptOf(heading)} className="ez:m-0 ez:text-site-section ez:text-fg ez:md:text-site-page">{heading}</h1>
        {count ? <span className="ez:text-site-body ez:text-site-off">{count}</span> : null}
      </div>
      {search && <div className="ez:mt-6">{search}</div>}
      <div className="ez:mt-8 ez:flex ez:items-center ez:justify-between ez:gap-6 ez:border-0 ez:border-b ez:border-solid ez:border-site-line">
        <nav aria-label="카테고리" className="ez:-mx-page ez:flex ez:min-w-0 ez:gap-7 ez:overflow-x-auto ez:px-page ez:whitespace-nowrap ez:md:mx-0 ez:md:px-0">
          {tabs.map((t) => (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={cn("ez:inline-flex ez:shrink-0 ez:items-baseline ez:gap-1.5 ez:py-3 ez:text-site-lead ez:no-underline ez:hover:text-fg", t.on ? "ez:fx-tab ez:text-fg" : "ez:text-site-off", focusRing)}
            >
              {t.label}
              {t.count != null && <span className="ez:text-site-small ez:text-site-off">{t.count}</span>}
            </NextLink>
          ))}
        </nav>
        <SortMenu sorts={sorts} />
      </div>
      <div className="ez:mt-9">
        {products.length ? (
          <div className={cn(rowGrid, "ez:grid-flow-row-dense", shelfCols(shelf))}>{cards}</div>
        ) : (
          <ProductGrid products={[]} emptyHref={emptyHref} />
        )}
      </div>
      {next && (
        <div className="ez:mt-14 ez:flex ez:flex-col ez:items-center ez:gap-4">
          {count ? (
            <span className="ez:text-site-small ez:text-site-off ez:tabular-nums">
              {products.length} / {count}
            </span>
          ) : null}
          <NextLink href={next} className={cn(buttonVariants({ variant: "outline" }), lineButton)}>
            더 보기
            <Icon name="down" size="sm" />
          </NextLink>
        </div>
      )}
    </div>
  );
}
