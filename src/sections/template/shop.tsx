import NextLink from "next/link";
import { Icon } from "../../components/icon";
import type { SectionProps } from "../../renderer/registry";
import { ButtonLink } from "../../components/button";
import { cn } from "../../utils/cn";
import { countSup, focusRing, textLink } from "../../utils/styles";
import { Bar, Card, Cols, Pairs, Pic, type Row } from "../kit";
import type { Tile } from "./data";

function blankTiles(count: number, ratio: number) {
  return Array.from({ length: count }, (_, i) => (
    <Card key={i}>
      <Pic ratio={ratio} tone={i} />
      <Bar />
    </Card>
  ));
}

function GalleryTiles({ items }: { items: (Tile & { count?: number | null })[] }) {
  if (!items.length) {
    return (
      <section data-slot="category-tiles" data-variant="gallery" data-blank="" className="ez:grid ez:grid-cols-2 ez:gap-gutter ez:lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="ez:grid ez:gap-4">
            <Pic ratio={0.8} tone={i} />
            <span className="ez:text-site-heading">
              <Bar size="short" />
            </span>
          </div>
        ))}
      </section>
    );
  }
  return (
    <section data-slot="category-tiles" data-variant="gallery" className="ez:grid ez:grid-cols-2 ez:gap-gutter ez:lg:grid-cols-4">
      {items.slice(0, 4).map((t, i) => (
        <NextLink key={t.title} href={t.href ?? "/products"} className="ez:group ez:grid ez:gap-4 ez:text-fg ez:no-underline">
          <Pic src={t.image} ratio={0.8} tone={i} />
          <span className="ez:flex ez:items-center ez:justify-between ez:gap-3">
            <span className="ez:text-site-heading">
              {t.title}
              {t.count ? <span className={countSup}>{t.count}</span> : null}
            </span>
            <Icon name="right" className="ez:transition-transform ez:group-hover:translate-x-1" />
          </span>
        </NextLink>
      ))}
    </section>
  );
}

export function CategoryTiles({ data, context, variant, blank }: SectionProps<"category_tiles">) {
  const items: (Tile & { count?: number | null })[] = data.items?.length
    ? data.items
    : context.categories.map((c) => ({ title: c.name, href: `/products?category=${c.id}`, count: c.product_count }));
  if (!items.length && !blank) return null;
  if (variant === "gallery") return <GalleryTiles items={items} />;
  if (!items.length) {
    return (
      <section data-slot="category-tiles" data-blank="">
        <Cols m={1} pc={3}>
          {blankTiles(3, 1.8)}
        </Cols>
      </section>
    );
  }
  return (
    <section data-slot="category-tiles">
      <Cols m={1} pc={3}>
        {items.map((t, i) => (
          <Card key={t.title} href={t.href}>
            <Pic src={t.image} ratio={1.8} tone={i} />
            <span className="ez:flex ez:items-center ez:justify-between ez:gap-3 ez:text-site-item">
              {t.title}
              <Icon name="right" size="sm" />
            </span>
          </Card>
        ))}
      </Cols>
    </section>
  );
}

function Bundle({ items }: { items: (Tile | null)[] }) {
  return (
    <div className="ez:grid ez:grid-cols-3 ez:gap-3 ez:rounded-lg ez:border ez:border-solid ez:border-site-line ez:p-5 ez:lg:gap-gutter ez:lg:p-8">
      {items.map((t, i) =>
        t ? (
          <NextLink key={`${t.title}-${i}`} href={t.href ?? "/products"} className={cn("ez:group ez:grid ez:content-start ez:gap-2.5 ez:text-fg ez:no-underline", focusRing)}>
            <Pic src={t.image} alt={t.title} ratio={1} tone={i} />
            <span className="ez:line-clamp-2 ez:text-site-small ez:group-hover:underline ez:underline-offset-4">{t.title}</span>
          </NextLink>
        ) : (
          <span key={i} className="ez:grid ez:content-start ez:gap-2.5">
            <Pic ratio={1} tone={i} />
            <span className="ez:text-site-small">
              <Bar size="short" />
            </span>
          </span>
        ),
      )}
    </div>
  );
}

export function Curation({ data, blank }: SectionProps<"curation">) {
  const items = data.items ?? [];
  if (!items.length && !blank) return null;
  const title = data.title ?? "기획 묶음";
  return (
    <section data-slot="curation" data-blank={items.length ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-7">
      <div className="ez:flex ez:items-end ez:justify-between ez:gap-3">
        <h2 className="ez:m-0 ez:font-display ez:text-site-section">{title}</h2>
        {items.length > 0 && (
          <NextLink href="/products" className={cn(textLink, "ez:shrink-0 ez:text-site-small")}>
            전체 보기
          </NextLink>
        )}
      </div>
      <Bundle items={items.length ? items.slice(0, 3) : [null, null, null]} />
    </section>
  );
}

function mapHref(address: string): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(address)}`;
}

function storeRows(data: SectionProps<"store_info">["data"]): Row[] {
  if (!data.address) {
    return [
      { label: "주소", value: <Bar size="long" /> },
      { label: "영업", value: <Bar /> },
      { label: "전화", value: <Bar /> },
    ];
  }
  return [
    { label: "주소", value: data.address },
    ...(data.hours ? [{ label: "영업", value: data.hours }] : []),
    ...(data.phone ? [{ label: "전화", value: data.phone }] : []),
  ];
}

function Directions({ address, className }: { address?: string | null; className?: string }) {
  if (!address) return null;
  return (
    <div className="ez:flex ez:gap-2">
      <ButtonLink href={mapHref(address)} target="_blank" rel="noopener noreferrer" variant="outline" size="sm" className={className}>
        길 찾기
      </ButtonLink>
    </div>
  );
}

function StoreTitle({ children }: { children: string }) {
  return <h2 className="ez:m-0 ez:font-display ez:text-site-section">{children}</h2>;
}

export function StoreInfo({ data, variant, blank }: SectionProps<"store_info">) {
  if (!data.address && !blank) return null;
  const empty = !data.address;
  if (variant === "visit") {
    return (
      <section data-slot="store-info" data-variant="visit" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-6 ez:text-fg ez:lg:grid-cols-[4fr_8fr]">
        <StoreTitle>{data.title ?? "매장"}</StoreTitle>
        <div className="ez:grid ez:max-w-170 ez:justify-items-stretch ez:gap-7">
          <Pairs rows={storeRows(data)} />
          <Directions address={data.address} />
        </div>
      </section>
    );
  }
  const photo = data.image || empty;
  return (
    <section data-slot="store-info" data-blank={empty ? "" : undefined} className="ez:mx-[calc(50%-50vw)] ez:bg-surface-alt ez:text-fg">
      <div className={cn("ez:mx-auto ez:grid ez:max-w-wrap ez:gap-8 ez:px-page ez:py-16 ez:lg:items-center ez:lg:gap-gutter ez:lg:py-24", photo ? "ez:lg:grid-cols-[7fr_5fr]" : "ez:lg:grid-cols-[4fr_8fr]")}>
        {photo ? (
          <div className="ez:relative">
            <Pic src={data.image} ratio={1.6} tone={3} />
            {data.title && !empty && (
              <span className="ez:absolute ez:bottom-6 ez:left-6 ez:inline-flex ez:items-center ez:gap-2.5 ez:rounded-full ez:bg-surface ez:py-2.5 ez:pr-4.5 ez:pl-3 ez:text-site-small ez:font-medium">
                <Icon name="pin" size="sm" className="ez:text-primary" />
                {data.title}
              </span>
            )}
          </div>
        ) : (
          <StoreTitle>매장 안내</StoreTitle>
        )}
        <div className={cn("ez:grid ez:gap-7", photo && "ez:lg:pl-14")}>
          {photo && <StoreTitle>매장 안내</StoreTitle>}
          <Pairs rows={storeRows(data)} />
          <Directions address={data.address} className="ez:bg-surface" />
        </div>
      </div>
    </section>
  );
}
