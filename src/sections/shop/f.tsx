import NextLink from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ProductGrid } from "../../blocks/product-grid";
import { SiteLogo } from "../../blocks/site-header/site-logo";
import { ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { StarRow } from "../../components/star-row";
import type { SectionProps } from "../../renderer/registry";
import type { ProductSummary } from "../../types";
import { cn } from "../../utils/cn";
import { discountRate, won } from "../../utils/format";
import { focusRing } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, BlankStars, Lines } from "../kit";
import { ShopNavLinks } from "./nav";
import { BEST_HREF, categoryHref, fillCols, FRESH_HREF, lastOdd, PRODUCTS_HREF, productView, ROW_ITEM, SHOP_TITLE, shownCount } from "./shared";
import { SHELF_DEFAULTS, SHELF_RATIO, shelfCols, shelfOf, shelfSizes, shelfView, type Shelf } from "./shelf";
import type { FooterLink, ShopFooterProps, ShopHeaderProps, ShopListProps } from "./types";

const CARD_SIZES = "(max-width: 1024px) 50vw, 320px";

const VIEW = "상품 보기";

const ALL = "전체";

const stagePanel = "ez:fx-stage ez:relative ez:isolate ez:block ez:overflow-hidden ez:fx-round-lg ez:bg-linear-to-b ez:from-stage ez:to-stage-2";

const wordmark = "ez:bg-linear-to-b ez:from-aurora-2 ez:from-10% ez:to-primary ez:to-78% ez:bg-clip-text ez:text-transparent";

const WIDE: [number, number][] = [
  [0x1100, 0x11ff],
  [0x2e80, 0x9fff],
  [0xac00, 0xd7a3],
  [0xf900, 0xfaff],
  [0xff00, 0xffef],
];

function charUnit(ch: string): number {
  const code = ch.codePointAt(0) ?? 0;
  if (WIDE.some(([lo, hi]) => code >= lo && code <= hi)) return 1;
  if (ch >= "A" && ch <= "Z") return 0.68;
  if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) return 0.56;
  if (ch === " ") return 0.3;
  return 0.6;
}

function wordUnits(name: string): number {
  const sum = [...name].reduce((n, ch) => n + charUnit(ch), 0);
  return Math.max(2, Math.round(sum * 100) / 100);
}

const moreLink = cn("ez:inline-flex ez:shrink-0 ez:items-center ez:gap-1.5 ez:text-site-lead ez:text-muted ez:no-underline ez:hover:text-fg", focusRing);

const topLink = cn("ez:inline-flex ez:h-10 ez:min-w-10 ez:items-center ez:justify-center ez:gap-1.5 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg ez:lg:min-w-0", focusRing);

function Head({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="ez:mb-7 ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-x-6 ez:gap-y-3 ez:lg:mb-9">
      <h2 className="ez:m-0 ez:text-site-section ez:text-fg ez:lg:text-site-display-md">{title}</h2>
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

function Card({ product, rank, shelf, preload, sizes = CARD_SIZES }: { product: ProductSummary; rank?: number; shelf: Shelf; preload?: boolean; sizes?: string }) {
  const v = shelfView(productView(product), shelf);
  const tags = [v.soldOut && "품절", v.sample && "예시"].filter(Boolean) as string[];
  return (
    <NextLink
      href={v.href}
      data-slot="product-card"
      data-sold-out={v.soldOut || undefined}
      data-sample={v.sample || undefined}
      className={cn("ez:group ez:grid ez:min-w-0 ez:grid-cols-1 ez:content-start ez:text-fg ez:no-underline", focusRing)}
    >
      <span className="ez:relative ez:block">
        <span data-cutout={v.cutout ? "" : undefined} className={cn(stagePanel, "ez:p-5 ez:md:p-10", v.soldOut && "ez:opacity-45")}>
          <Photo src={v.cutout ?? v.cover} alt={v.name} preload={preload} sizes={sizes} className={cn(SHELF_RATIO[shelf.ratio], "ez:rounded-none ez:bg-transparent")} />
        </span>
        {rank != null && <span className="ez:absolute ez:top-4 ez:left-5 ez:text-site-small ez:text-site-off ez:tabular-nums">{String(rank).padStart(2, "0")}</span>}
        <span aria-hidden="true" className="ez:absolute ez:right-3 ez:bottom-3 ez:grid ez:size-11 ez:place-items-center ez:rounded-full ez:bg-surface ez:text-fg ez:md:right-4 ez:md:bottom-4">
          <Icon name="bag" size="sm" />
        </span>
      </span>
      <span className="ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:px-1 ez:pt-4">
        <span className="ez:flex ez:min-w-0 ez:items-baseline ez:gap-2">
          <span className={cn("ez:truncate ez:text-site-lead ez:underline-offset-4 ez:group-hover:underline", v.soldOut ? "ez:text-muted" : "ez:text-fg")}>{v.name}</span>
          {tags.map((t) => (
            <span key={t} className="ez:shrink-0 ez:text-site-small ez:text-site-off">
              {t}
            </span>
          ))}
        </span>
        <span className="ez:flex ez:shrink-0 ez:flex-wrap ez:items-baseline ez:justify-end ez:gap-x-1.5 ez:text-site-lead ez:text-muted ez:tabular-nums">
          {v.rate > 0 && <span className="ez:font-medium ez:text-fg">{v.rate}%</span>}
          <span>{v.price}</span>
          {v.list && (
            <s className="ez:text-site-small ez:text-site-off">
              <span className="ez:sr-only">정가 </span>
              {v.list}
            </s>
          )}
        </span>
      </span>
    </NextLink>
  );
}

function BlankCard() {
  return (
    <div className="ez:grid ez:min-w-0 ez:content-start">
      <span className={cn(stagePanel, "ez:p-5 ez:md:p-10")}>
        <Photo src={null} alt="" className="ez:aspect-square ez:rounded-none ez:bg-transparent" />
      </span>
      <span className="ez:flex ez:items-center ez:justify-between ez:gap-3 ez:px-1 ez:pt-4 ez:text-site-lead">
        <Bar />
        <BlankPrice className="ez:text-muted" />
      </span>
    </div>
  );
}

const shelfRow = "ez:-mx-1.5 ez:flex ez:flex-wrap ez:gap-y-10 ez:md:-mx-3";

const shelfItem = cn(ROW_ITEM[4], "ez:px-1.5 ez:md:px-3");

function Row({ slot, title, aside, items, shelf, ranked }: { slot: string; title: string; aside: ReactNode; items: ProductSummary[]; shelf: Shelf; ranked?: boolean }) {
  if (!items.length) {
    return (
      <section data-slot={slot} data-variant="stage" data-blank="" className="ez:text-fg">
        <Head title={title} />
        <div className={shelfRow}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={shelfItem}>
              <BlankCard />
            </div>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section data-slot={slot} data-variant="stage" className="ez:text-fg">
      <Head title={title} aside={aside} />
      <div className={shelfRow}>
        {items.map((p, i) => (
          <div key={p.id} className={cn(shelfItem, lastOdd(i, items.length, 4))}>
            <Card product={p} rank={ranked ? i + 1 : undefined} shelf={shelf} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Header({ name, logoUrl, cartCount, nav, links }: ShopHeaderProps) {
  return (
    <header data-slot="site-header" data-variant="stage" className="ez:bg-surface ez:text-fg">
      <div className="ez:mx-auto ez:grid ez:min-h-16 ez:max-w-wrap ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-6 ez:px-page ez:lg:min-h-20 ez:lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:gap-8 ez:overflow-hidden ez:whitespace-nowrap ez:max-lg:hidden">
          <ShopNavLinks
            items={[nav.fresh, nav.best, ...nav.categories]}
            className={cn("ez:py-1.5 ez:text-site-body ez:text-muted ez:no-underline ez:hover:text-fg", focusRing)}
            currentClassName="ez:font-medium ez:text-fg"
          />
        </nav>
        <NextLink
          href="/"
          className={cn("ez:min-w-0 ez:text-site-heading ez:leading-none ez:text-fg ez:no-underline ez:lg:justify-self-center ez:lg:text-center", focusRing)}
        >
          <SiteLogo name={name} src={logoUrl} />
        </NextLink>
        <div className="ez:flex ez:items-center ez:justify-end ez:gap-1 ez:lg:gap-6">
          <NextLink href={links.search} aria-label="검색" className={topLink}>
            <Icon name="search" size="lg" className="ez:lg:hidden" />
            <span className="ez:max-lg:hidden">검색</span>
          </NextLink>
          <NextLink href={links.account.href} aria-label={links.account.label} className={topLink}>
            <Icon name="user" size="lg" className="ez:lg:hidden" />
            <span className="ez:max-lg:hidden">{links.account.label}</span>
          </NextLink>
          <NextLink href={links.cart} aria-label={cartCount ? `장바구니 ${cartCount}` : "장바구니"} className={cn(topLink, "ez:text-fg")}>
            <Icon name="bag" size="lg" className="ez:lg:hidden" />
            <span className="ez:max-lg:hidden">장바구니</span>
            {cartCount ? (
              <span aria-hidden="true" className="ez:text-site-small ez:text-muted ez:tabular-nums">
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
    <nav aria-label={title} className="ez:grid ez:content-start ez:gap-2.5">
      <span className="ez:text-site-note ez:text-muted">{title}</span>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-1 ez:p-0 ez:text-site-note ez:leading-relaxed">
        {items.map((l) => (
          <li key={l.href}>
            <NextLink href={l.href} className={cn("ez:no-underline ez:underline-offset-4 ez:hover:text-fg ez:hover:underline", l.strong ? "ez:font-medium ez:text-fg" : "ez:text-site-off", focusRing)}>
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
    <footer data-slot="site-footer" data-variant="stage" className="ez:text-fg">
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-14 ez:pb-14 ez:lg:pt-18 ez:lg:pb-16">
        <div className="ez:grid ez:grid-cols-2 ez:gap-x-6 ez:gap-y-10 ez:md:grid-cols-4 ez:lg:grid-cols-12">
          <div className="ez:col-span-2 ez:grid ez:content-start ez:gap-4 ez:md:col-span-4 ez:lg:col-span-4">
            <p className="ez:m-0 ez:text-site-item ez:font-normal ez:text-fg">{storeName}</p>
            {(phone || hours) && (
              <div className="ez:grid ez:gap-1">
                <span className="ez:text-site-note ez:text-muted">고객센터</span>
                {phone && (
                  <a href={`tel:${phone}`} className={cn("ez:justify-self-start ez:text-site-heading ez:text-fg ez:tabular-nums ez:no-underline", focusRing)}>
                    {phone}
                  </a>
                )}
                {hours && <span className="ez:text-site-note ez:text-site-off">{hours}</span>}
              </div>
            )}
          </div>
          <div className="ez:lg:col-span-2">
            <FooterColumn title="쇼핑" items={shop} />
          </div>
          <div className="ez:lg:col-span-2">
            <FooterColumn title="안내" items={guide} />
          </div>
          <div className="ez:lg:col-span-2">
            <FooterColumn title="내 쇼핑" items={account} />
          </div>
          {terms.length > 0 && (
            <div className="ez:lg:col-span-2">
              <FooterColumn title="약관" items={terms} />
            </div>
          )}
        </div>
        <div className="ez:mt-12 ez:grid ez:gap-2.5 ez:md:grid-cols-[minmax(0,1fr)_auto] ez:md:gap-10 ez:lg:mt-14">
          <div className="ez:grid ez:gap-2.5">
            <span className="ez:text-site-note ez:text-muted">사업자 정보</span>
            <p className="ez:m-0 ez:text-site-note ez:leading-relaxed ez:text-site-off">{legal}</p>
          </div>
          <span className="ez:self-end ez:text-site-note ez:text-site-off">© {storeName}</span>
        </div>
      </div>
    </footer>
  );
}

type HeroProduct = NonNullable<SectionProps<"hero">["data"]["products"]>[number];

const productHref = (p: HeroProduct) => p.href ?? `/products/${p.id}`;

function Pager({ shown, next }: { shown: HeroProduct[]; next: HeroProduct }) {
  return (
    <div className="ez:mt-8 ez:flex ez:items-center ez:gap-4 ez:self-end ez:text-site-small ez:text-muted ez:tabular-nums ez:lg:absolute ez:lg:right-12 ez:lg:bottom-12 ez:lg:mt-0">
      <span>01</span>
      <span aria-hidden="true" className="ez:relative ez:block ez:h-0.5 ez:w-30 ez:bg-site-line">
        <span className="ez:absolute ez:inset-y-0 ez:left-0 ez:bg-muted" style={{ width: `${100 / shown.length}%` }} />
      </span>
      <span>{String(shown.length).padStart(2, "0")}</span>
      <NextLink
        href={productHref(next)}
        aria-label="다음"
        className={cn("ez:grid ez:size-11 ez:place-items-center ez:rounded-full ez:border ez:border-solid ez:border-site-line ez:text-fg ez:no-underline", focusRing)}
      >
        <Icon name="right" size="sm" />
      </NextLink>
    </div>
  );
}

export function Hero({ data, context }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const image = data.image ?? data.images?.[0] ?? null;
  const shown = (data.products ?? []).filter((p) => p.cover_url);
  const pick = shown[0] ?? data.products?.[0] ?? null;
  const blank = !title && !image && !pick;
  const cutout = pick?.cover_url ? (pick.cover_cutout_url ?? null) : null;
  const photo = cutout ?? pick?.cover_url ?? image;
  const sale = pick ? (pick.sale_price ?? pick.list_price) : undefined;
  const rate = pick && !pick.sold_out && pick.list_price != null && pick.sale_price != null ? discountRate(pick.list_price, pick.sale_price) : 0;
  const heading = pick?.name ?? title;
  const label = pick && title ? title : null;
  const sub = !pick && title ? data.sub?.trim() || null : null;
  const name = context.storeName?.trim() || null;
  return (
    <section
      data-slot="hero"
      data-variant="stage"
      data-blank={blank ? "" : undefined}
      className="ez:fx-stage ez:fx-wordmark-box ez:fx-round-xl ez:relative ez:isolate ez:flex ez:flex-col ez:overflow-hidden ez:bg-linear-to-b ez:from-surface ez:via-stage ez:via-45% ez:to-stage-2 ez:px-6 ez:pt-12 ez:pb-8 ez:text-fg ez:md:px-12 ez:lg:pt-14 ez:lg:pb-21"
    >
      <div style={{ "--ez-wm-units": String(name ? wordUnits(name) : 4) } as CSSProperties} className="ez:fx-wordmark ez:flex ez:flex-col ez:items-center">
        {name ? (
          <p aria-hidden="true" className={cn("ez:m-0 ez:text-center", wordmark)}>
            {name}
          </p>
        ) : (
          <span className="ez:flex ez:justify-center ez:text-site-display-md ez:lg:text-site-hero">
            <Bar size="long" strong />
          </span>
        )}
        {(photo || blank) && (
          <div data-cutout={cutout ? "" : undefined} className="ez:fx-wordmark-under ez:relative ez:aspect-square ez:w-4/5 ez:max-w-96 ez:lg:size-120 ez:lg:max-w-none">
            <Photo src={photo} alt={heading ?? ""} preload sizes="(max-width: 1024px) 80vw, 480px" className={cn("ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:bg-transparent", pick?.sold_out && "ez:opacity-45")} />
          </div>
        )}
      </div>
      <div className="ez:mt-8 ez:grid ez:justify-items-start ez:gap-2.5 ez:lg:absolute ez:lg:bottom-12 ez:lg:left-12 ez:lg:mt-0 ez:lg:w-64 ez:xl:w-80">
        {blank ? (
          <>
            <span className="ez:w-full ez:text-site-page-sm ez:lg:text-site-page">
              <Bar size="long" block />
            </span>
            <BlankPrice className="ez:text-site-item ez:text-muted" />
            <BlankButton className="ez:mt-5">{VIEW}</BlankButton>
          </>
        ) : (
          <>
            {label && <p className="ez:m-0 ez:line-clamp-1 ez:text-site-small ez:text-muted">{label}</p>}
            {heading && <h1 className="ez:m-0 ez:line-clamp-2 ez:text-site-page-sm ez:text-balance ez:text-fg ez:lg:text-site-page">{heading}</h1>}
            {sub && (
              <p data-slot="hero-sub" className="ez:m-0 ez:text-site-lead ez:text-muted">
                {sub}
              </p>
            )}
            {pick && sale != null && (
              <p className="ez:m-0 ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-2 ez:text-site-item ez:font-normal ez:tabular-nums">
                {rate > 0 && <span className="ez:font-medium">{rate}%</span>}
                {won(sale)}
                {pick.sold_out && <span className="ez:text-site-small ez:text-muted">품절</span>}
              </p>
            )}
            <ButtonLink href={pick ? productHref(pick) : (data.href ?? PRODUCTS_HREF)} className="ez:mt-5">
              {VIEW}
            </ButtonLink>
          </>
        )}
      </div>
      {shown.length > 1 && <Pager shown={shown} next={shown[1]} />}
    </section>
  );
}

function BestTabs({ categories }: { categories: SectionProps["context"]["categories"] }) {
  const items = categories.filter((c) => c.product_count !== 0).slice(0, 4);
  if (!items.length) return <More href={BEST_HREF} />;
  const tab = cn("ez:inline-flex ez:min-h-10 ez:shrink-0 ez:items-center ez:text-site-lead ez:no-underline ez:hover:text-fg", focusRing);
  return (
    <nav aria-label={SHOP_TITLE.categories} className="ez:-mx-page ez:flex ez:max-w-full ez:gap-7 ez:overflow-x-auto ez:px-page ez:whitespace-nowrap ez:md:mx-0 ez:md:px-0">
      <NextLink href={BEST_HREF} className={cn(tab, "ez:font-medium ez:text-fg")}>
        {ALL}
      </NextLink>
      {items.map((c) => (
        <NextLink key={c.id} href={`${categoryHref(c.id)}&sort=popular`} className={cn(tab, "ez:text-site-off")}>
          {c.name}
        </NextLink>
      ))}
    </nav>
  );
}

export function Best({ data, context, grid }: SectionProps<"best_grid">) {
  return (
    <Row
      slot="best-grid"
      title={SHOP_TITLE.best}
      aside={<BestTabs categories={context.categories} />}
      items={(data.items ?? []).slice(0, grid?.pc ?? 4)}
      shelf={shelfOf("stage", context.shelf)}
      ranked
    />
  );
}

export function NewArrivals({ data, context, grid }: SectionProps<"product_grid">) {
  return (
    <Row
      slot="product-grid"
      title={SHOP_TITLE.fresh}
      aside={<More href={FRESH_HREF} />}
      items={context.products.slice(0, shownCount(data.count, grid?.pc ?? 4))}
      shelf={shelfOf("stage", context.shelf)}
    />
  );
}

export function Band({ data, context }: SectionProps<"photo_band">) {
  const image = data.image ?? data.images?.[0] ?? null;
  const name = context.storeName?.trim() || null;
  const body = data.body?.trim() || null;
  return (
    <section data-slot="photo-band" data-variant="stage" data-blank={image ? undefined : ""} className="ez:grid ez:gap-8 ez:text-fg ez:lg:grid-cols-12 ez:lg:items-center ez:lg:gap-6">
      <div className="ez:fx-round-xl ez:relative ez:aspect-[4/3] ez:overflow-hidden ez:lg:col-span-7 ez:lg:aspect-auto ez:lg:h-150">
        <Photo src={image} alt="" sizes="(max-width: 1024px) 100vw, 780px" tone={1} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
      </div>
      {image ? (
        <div className="ez:grid ez:justify-items-start ez:gap-5 ez:lg:col-span-5 ez:lg:pl-12">
          {name && <h2 className="ez:m-0 ez:text-site-section ez:text-fg ez:lg:text-site-display-md">{name}</h2>}
          {body && <p className="ez:m-0 ez:max-w-100 ez:text-site-body ez:leading-relaxed ez:whitespace-pre-line ez:text-muted">{body}</p>}
          <NextLink href={PRODUCTS_HREF} className={cn(moreLink, "ez:mt-4 ez:text-fg")}>
            {SHOP_TITLE.more}
            <Icon name="right" size="sm" />
          </NextLink>
        </div>
      ) : (
        <div className="ez:grid ez:w-full ez:max-w-100 ez:gap-5 ez:lg:col-span-5 ez:lg:pl-12">
          <span className="ez:w-3/5 ez:text-site-section ez:lg:text-site-display-md">
            <Bar size="full" strong block />
          </span>
          <span className="ez:text-site-body">
            <Lines />
          </span>
        </div>
      )}
    </section>
  );
}

type ReviewItem = NonNullable<SectionProps<"reviews">["data"]["items"]>[number];

const reviewCell = "ez:grid ez:min-w-0 ez:content-start ez:gap-5 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-6";

function ReviewCard({ item, product }: { item: ReviewItem; product?: ProductSummary }) {
  return (
    <article className={reviewCell}>
      <StarRow rating={item.rating} className="ez:text-muted" />
      <p className="ez:m-0 ez:line-clamp-4 ez:text-site-item ez:leading-relaxed ez:text-pretty ez:text-fg">{item.body}</p>
      <p className="ez:m-0 ez:truncate ez:text-site-small ez:text-site-off">{[item.name, product?.name].filter(Boolean).join(" · ")}</p>
    </article>
  );
}

function BlankReview() {
  return (
    <div className={reviewCell}>
      <BlankStars />
      <span className="ez:text-site-item">
        <Lines />
      </span>
      <span className="ez:text-site-small">
        <Bar size="short" />
      </span>
    </div>
  );
}

export function Reviews({ data, context }: SectionProps<"reviews">) {
  const items = (data.items ?? []).filter((r, i, all) => !r.product || all.findIndex((x) => x.product === r.product) === i).slice(0, 3);
  const summary = items.length && data.average != null && data.count ? `${data.average.toFixed(1)} · ${SHOP_TITLE.reviews} ${data.count}` : null;
  return (
    <section data-slot="reviews" data-variant="stage" data-blank={items.length ? undefined : ""} className="ez:text-fg">
      <Head title={SHOP_TITLE.reviews} aside={summary ? <span className="ez:text-site-lead ez:text-muted ez:tabular-nums">{summary}</span> : undefined} />
      <div className={cn("ez:grid ez:gap-x-6 ez:gap-y-10", fillCols(items.length || 3))}>
        {items.length
          ? items.map((r, i) => <ReviewCard key={`${r.name}-${r.date ?? ""}-${i}`} item={r} product={r.product ? context.products.find((p) => p.id === r.product) : undefined} />)
          : [0, 1, 2].map((i) => <BlankReview key={i} />)}
      </div>
    </section>
  );
}

type GuideCell = { label: string; value: string | null; note: string | null; href?: string | null };

function GuideBody({ cell }: { cell: GuideCell }) {
  return (
    <>
      <span className="ez:text-site-small ez:text-muted">{cell.label}</span>
      {cell.value ? (
        <span className="ez:mt-2 ez:text-site-heading ez:tabular-nums">{cell.value}</span>
      ) : (
        <span className="ez:mt-2 ez:text-site-heading">
          <Bar />
        </span>
      )}
      {cell.note && <span className="ez:mt-1 ez:text-site-small ez:text-muted ez:tabular-nums">{cell.note}</span>}
    </>
  );
}

export function Guide({ data, context }: SectionProps<"shop_guide">) {
  const s = context.shipping;
  const phone = data.phone?.trim() || null;
  const empty = !s && !phone;
  const cells: GuideCell[] = [
    { label: "배송비", value: s ? (s.base_fee ? won(s.base_fee) : "무료") : null, note: s?.free_threshold ? `${won(s.free_threshold)} 이상 무료` : null },
    { label: "반품 배송비", value: s ? won(s.return_fee) : null, note: s ? `교환 배송비 ${won(s.exchange_fee)}` : null, href: s ? (data.returns ?? null) : null },
    { label: "고객센터", value: phone, note: phone ? data.hours?.trim() || null : null, href: phone ? `tel:${phone}` : null },
  ];
  const cell = (i: number) =>
    cn("ez:flex ez:min-w-0 ez:flex-col ez:items-start ez:px-8 ez:py-6 ez:text-fg ez:no-underline ez:md:px-12 ez:md:py-0", i > 0 && "ez:border-0 ez:border-solid ez:border-hairline ez:max-md:border-t ez:md:border-l");
  return (
    <section data-slot="shop-guide" data-variant="stage" data-blank={empty ? "" : undefined} className="ez:fx-stage ez:fx-round-xl ez:grid ez:grid-cols-1 ez:py-2 ez:text-fg ez:md:grid-cols-3 ez:md:py-12">
      {cells.map((c, i) =>
        c.href && c.value ? (
          c.href.startsWith("tel:") ? (
            <a key={c.label} href={c.href} className={cn(cell(i), "ez:hover:underline ez:underline-offset-4", focusRing)}>
              <GuideBody cell={c} />
            </a>
          ) : (
            <NextLink key={c.label} href={c.href} className={cn(cell(i), "ez:hover:underline ez:underline-offset-4", focusRing)}>
              <GuideBody cell={c} />
            </NextLink>
          )
        ) : (
          <div key={c.label} className={cell(i)}>
            <GuideBody cell={c} />
          </div>
        ),
      )}
    </section>
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

export function List({ title, count, crumbs, tabs, sorts, products, more, search, emptyHref, shelf = SHELF_DEFAULTS.stage }: ShopListProps) {
  const sizes = shelfSizes(shelf, "stage", CARD_SIZES);
  return (
    <div data-slot="catalog-view" data-variant="stage" className="ez:grid ez:grid-cols-1 ez:text-fg">
      <Crumbs items={crumbs} />
      <div className="ez:mt-4 ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1">
        <h1 className="ez:m-0 ez:text-site-page-sm ez:text-fg ez:lg:text-site-display-md">{title}</h1>
        {count != null && <span className="ez:text-site-item ez:font-normal ez:text-muted ez:tabular-nums">{count}</span>}
      </div>
      {search && <div className="ez:mt-6">{search}</div>}
      <div className="ez:mt-8 ez:flex ez:flex-col ez:gap-x-6 ez:gap-y-2 ez:md:flex-row ez:md:items-center ez:md:justify-between ez:lg:mt-10">
        <nav aria-label="카테고리" className="ez:-mx-page ez:flex ez:min-w-0 ez:gap-7 ez:overflow-x-auto ez:px-page ez:whitespace-nowrap ez:md:mx-0 ez:md:px-0">
          {tabs.map((t) => (
            <NextLink
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={cn("ez:inline-flex ez:min-h-11 ez:shrink-0 ez:items-baseline ez:gap-1.5 ez:py-2.5 ez:text-site-lead ez:no-underline ez:hover:text-fg", t.on ? "ez:font-medium ez:text-fg" : "ez:text-site-off", focusRing)}
            >
              {t.label}
              {t.count != null && <span className="ez:text-site-small ez:font-normal ez:text-site-off ez:tabular-nums">{t.count}</span>}
            </NextLink>
          ))}
        </nav>
        <nav aria-label="정렬" className="ez:flex ez:shrink-0 ez:flex-wrap ez:gap-x-5">
          {sorts.map((s) => (
            <NextLink
              key={s.href}
              href={s.href}
              aria-current={s.on ? "true" : undefined}
              className={cn("ez:inline-flex ez:min-h-11 ez:items-center ez:text-site-body ez:no-underline ez:hover:text-fg", s.on ? "ez:font-medium ez:text-fg" : "ez:text-muted", focusRing)}
            >
              {s.label}
            </NextLink>
          ))}
        </nav>
      </div>
      <div className="ez:mt-6 ez:lg:mt-8">
        {products.length ? (
          <div className={cn("ez:grid ez:gap-x-3 ez:gap-y-10 ez:md:gap-x-6", shelfCols(shelf))}>
            {products.map((p, i) => (
              <Card key={p.id} product={p} preload={i < 4} shelf={shelf} sizes={sizes} />
            ))}
          </div>
        ) : (
          <ProductGrid products={[]} emptyHref={emptyHref} />
        )}
      </div>
      {products.length > 0 && (count != null || more) && (
        <div className="ez:mt-16 ez:flex ez:flex-col ez:items-center ez:gap-4">
          {count != null && count > 0 && (
            <>
              <span className="ez:text-site-small ez:text-muted ez:tabular-nums">
                {Math.min(products.length, count)} / {count}
              </span>
              <span aria-hidden="true" className="ez:relative ez:block ez:h-0.5 ez:w-50 ez:bg-site-line">
                <span className="ez:absolute ez:inset-y-0 ez:left-0 ez:bg-muted" style={{ width: `${Math.min(100, (products.length / count) * 100)}%` }} />
              </span>
            </>
          )}
          {more && (
            <ButtonLink href={more} variant="secondary" className="ez:mt-2">
              더 보기
            </ButtonLink>
          )}
        </div>
      )}
    </div>
  );
}
