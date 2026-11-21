import NextLink from "next/link";
import { ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { won } from "../../utils/format";
import { textLink } from "../../utils/styles";
import { Bar, BlankButton } from "../kit";

const BUTTON: Record<string, string> = { shop: "상품 보기", stay: "객실 보기", class: "클래스 보기", quote: "작업 보기" };

type Product = NonNullable<SectionProps<"hero">["data"]["products"]>[number];

const productHref = (p: Product) => p.href ?? `/products/${p.id}`;

export function Hero({ data, context, variant }: SectionProps<"hero">) {
  const title = data.title?.trim() || null;
  const image = data.image ?? data.images?.[0] ?? null;
  const blank = !title && !image;
  const href = data.href ?? "/products";
  const button = BUTTON[context.main ?? "shop"] ?? BUTTON.shop;
  const products = blank ? [] : (data.products ?? []);
  const pick = products.find((p) => p.cover_url) ?? products[0];
  const facts = data.facts ?? [];
  const mark = (name: string, empty = blank) => ({ "data-slot": "hero", "data-variant": name, "data-blank": empty ? "" : undefined });
  const heading = (size: string) => <h1 className={cn("ez:m-0 ez:font-light ez:tracking-[-0.04em] ez:text-balance", size)}>{title}</h1>;
  const go = (className?: string, outline?: boolean) => (
    <ButtonLink href={href} variant={outline ? "outline" : undefined} className={className}>
      {button}
      <Icon name="right" size="sm" />
    </ButtonLink>
  );

  if (variant === "class") {
    return (
      <section {...mark("class")} className={cn("ez:grid ez:gap-8 ez:text-fg", title && "ez:lg:grid-cols-[7fr_5fr] ez:lg:items-end ez:lg:gap-6")}>
        <Photo src={image} alt="" preload sizes={title ? "(max-width: 1024px) 100vw, 740px" : "100vw"} tone={0} className="ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-160" />
        <div className={cn("ez:flex ez:flex-col ez:items-start ez:gap-8", title && "ez:lg:gap-10 ez:lg:pb-2 ez:lg:pl-14")}>
          {title && heading("ez:text-site-page-sm ez:lg:text-site-display")}
          <div className="ez:flex ez:flex-wrap ez:items-center ez:gap-7">
            {blank ? (
              <BlankButton>일정 보기</BlankButton>
            ) : (
              <ButtonLink href="#schedule">
                일정 보기
                <Icon name="right" size="sm" />
              </ButtonLink>
            )}
            {!blank && (
              <NextLink href="/classes" className={textLink}>
                클래스 전체
              </NextLink>
            )}
          </div>
          {facts.length > 0 && (
            <dl className="ez:m-0 ez:mt-4 ez:flex ez:gap-10 ez:self-stretch ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-7">
              {facts.map((f) => (
                <div key={f.label} className="ez:flex ez:flex-col">
                  <dd className="ez:order-1 ez:m-0 ez:font-figure ez:text-site-figure-lg ez:italic">{f.value}</dd>
                  <dt className="ez:order-2 ez:text-site-small ez:text-muted">{f.label}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>
    );
  }

  if (variant === "stay") {
    return (
      <section {...mark("stay")} className="ez:grid ez:gap-10 ez:pt-4 ez:text-fg ez:lg:gap-14 ez:lg:pt-10">
        {(title || facts.length > 0) && (
          <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-8">
            {title && heading("ez:max-w-3xl ez:text-site-page-sm ez:lg:text-site-display")}
            {facts.length > 0 && (
              <dl className="ez:m-0 ez:grid ez:w-full ez:max-w-75 ez:gap-2 ez:pb-3 ez:text-site-small">
                {facts.map((f) => (
                  <div key={f.label} className="ez:flex ez:justify-between ez:gap-6">
                    <dt className="ez:text-muted">{f.label}</dt>
                    <dd className="ez:m-0 ez:text-right">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )}
        <Photo src={image} alt="" preload sizes="100vw" tone={0} className="ez:aspect-[4/3] ez:md:aspect-[2.06]" />
      </section>
    );
  }

  if (variant === "gallery") {
    const photo = (
      <div className="ez:relative">
        <Photo src={image} alt="" preload sizes={title ? "(max-width: 1024px) 100vw, 740px" : "100vw"} tone={0} className="ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-150" />
        {pick && (
          <NextLink
            href={productHref(pick)}
            className="ez:absolute ez:bottom-6 ez:left-6 ez:flex ez:items-center ez:gap-3.5 ez:rounded-md ez:bg-surface/92 ez:py-2.5 ez:pr-5 ez:pl-2.5 ez:text-fg ez:no-underline ez:max-md:hidden"
          >
            <Photo src={pick.cover_url} alt="" sizes="56px" tone={1} className="ez:size-14 ez:rounded-sm" />
            <span className="ez:flex ez:flex-col ez:text-site-small">
              <span>{pick.name}</span>
              {pick.sale_price != null && <span className="ez:font-medium ez:tabular-nums">{won(pick.sale_price)}</span>}
            </span>
          </NextLink>
        )}
      </div>
    );
    if (!title) {
      return (
        <section {...mark("gallery")} className="ez:grid ez:text-fg">
          {photo}
        </section>
      );
    }
    return (
      <section {...mark("gallery")} className="ez:grid ez:gap-8 ez:text-fg ez:lg:grid-cols-[5fr_7fr] ez:lg:items-end ez:lg:gap-6">
        <div className="ez:flex ez:flex-col ez:items-start ez:gap-6 ez:lg:gap-10 ez:lg:pb-2">
          {heading("ez:text-site-page-sm ez:lg:text-site-display")}
          <div className="ez:flex ez:flex-wrap ez:items-center ez:gap-7">
            {go()}
            {href !== "/products" && (
              <NextLink href="/products" className={textLink}>
                전체 상품
              </NextLink>
            )}
          </div>
        </div>
        {photo}
      </section>
    );
  }

  if (variant === "full" && (image || !title)) {
    return (
      <section {...mark("full")} className="ez:relative ez:mx-[calc(50%-50vw)] ez:h-130 ez:overflow-hidden ez:text-[#ffffff] ez:lg:h-190">
        <Photo src={image} alt="" preload sizes="100vw" tone={0} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
        {title && (
          <>
            <span aria-hidden="true" className="ez:absolute ez:inset-0 ez:bg-[linear-gradient(rgb(20_20_18/0.34),rgb(20_20_18/0)_26%,rgb(20_20_18/0)_52%,rgb(20_20_18/0.46))]" />
            <div className="ez:absolute ez:inset-x-0 ez:bottom-10 ez:mx-auto ez:flex ez:max-w-wrap ez:flex-wrap ez:items-end ez:justify-between ez:gap-6 ez:px-page ez:lg:bottom-16">
              {heading("ez:text-site-page ez:lg:text-site-display")}
              {go("ez:border-[rgb(255_255_255/0.7)] ez:bg-transparent ez:text-[#ffffff] ez:hover:border-[#ffffff]", true)}
            </div>
          </>
        )}
      </section>
    );
  }

  if (variant === "slide") {
    const side = products.filter((p) => p.cover_url).slice(0, 2);
    const photo = <Photo src={image} alt="" preload sizes={side.length ? "(max-width: 1024px) 100vw, 860px" : "100vw"} tone={0} className="ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-140" />;
    return (
      <section {...mark("slide")} className={cn("ez:grid ez:gap-gutter ez:text-fg", side.length > 0 && "ez:lg:grid-cols-[8fr_4fr]")}>
        {title ? (
          <NextLink href={href} className="ez:relative ez:block ez:text-fg ez:no-underline">
            {photo}
            <span className="ez:absolute ez:bottom-6 ez:left-6 ez:grid ez:max-w-[70%] ez:gap-2 ez:rounded-md ez:bg-surface ez:px-7 ez:py-6">
              {heading("ez:text-site-heading ez:lg:text-site-title")}
              <span className="ez:text-site-small ez:text-muted">{button}</span>
            </span>
          </NextLink>
        ) : (
          photo
        )}
        {side.length > 0 && (
          <div className="ez:grid ez:gap-gutter ez:max-lg:grid-cols-2">
            {side.map((p, i) => (
              <NextLink key={p.id} href={productHref(p)} className="ez:grid ez:grid-cols-[1fr_auto] ez:items-end ez:gap-4 ez:rounded-md ez:bg-surface-alt ez:p-5 ez:text-fg ez:no-underline">
                <span className="ez:grid ez:gap-1">
                  <span className="ez:text-site-item ez:font-normal">{p.name}</span>
                  {p.sale_price != null && <span className="ez:text-site-small ez:text-muted ez:tabular-nums">{won(p.sale_price)}</span>}
                </span>
                <Photo src={p.cover_url} alt="" sizes="160px" tone={i + 1} className="ez:size-24 ez:lg:size-36" />
              </NextLink>
            ))}
          </div>
        )}
      </section>
    );
  }

  if (variant === "rounded" || variant === "card") {
    const photo = (
      <div className="ez:relative">
        <Photo
          src={image}
          alt=""
          preload
          sizes={title ? "(max-width: 1024px) 100vw, 760px" : "100vw"}
          tone={0}
          className={cn("ez:aspect-[4/3] ez:rounded-none ez:lg:aspect-auto", title ? "ez:lg:h-full" : "ez:lg:h-150")}
        />
        {variant === "card" && pick && (
          <NextLink href={productHref(pick)} className="ez:absolute ez:inset-x-5 ez:bottom-5 ez:flex ez:items-center ez:justify-between ez:gap-4 ez:rounded-sm ez:bg-surface ez:px-5 ez:py-3.5 ez:text-fg ez:no-underline ez:max-md:hidden">
            <span className="ez:text-site-small">{pick.name}</span>
            <Icon name="right" size="sm" />
          </NextLink>
        )}
      </div>
    );
    return (
      <section {...mark(variant)} className={cn("ez:grid ez:overflow-hidden ez:rounded-md ez:bg-surface-alt ez:text-fg", title && "ez:lg:min-h-150 ez:lg:grid-cols-[5fr_7fr]")}>
        {title && (
          <div className="ez:flex ez:flex-col ez:justify-end ez:gap-9 ez:p-8 ez:lg:p-16">
            {heading("ez:text-site-page ez:lg:text-site-display")}
            {go("ez:self-start ez:bg-surface")}
          </div>
        )}
        {photo}
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section {...mark("split")} className={cn("ez:grid ez:gap-8 ez:pt-4 ez:text-fg", title && "ez:lg:grid-cols-[7fr_5fr] ez:lg:items-end ez:lg:gap-6 ez:lg:pt-14")}>
        {title && (
          <div className="ez:flex ez:flex-col ez:items-start ez:gap-10">
            {heading("ez:text-site-page ez:lg:text-site-display-lg")}
            {go()}
          </div>
        )}
        <Photo src={image} alt="" preload sizes={title ? "(max-width: 1024px) 100vw, 520px" : "100vw"} tone={0} className="ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-105" />
      </section>
    );
  }

  const empty = !title && !facts.length;
  return (
    <section {...mark("text", empty)} className={cn("ez:grid ez:gap-8 ez:text-fg", title ? "ez:pt-4 ez:lg:grid-cols-[7fr_5fr] ez:lg:items-end ez:lg:gap-6 ez:lg:pt-16" : "ez:pt-6")}>
      {title && (
        <div className="ez:flex ez:flex-col ez:items-start ez:gap-10">
          {heading("ez:text-site-page ez:lg:text-site-display-lg")}
          {variant === "full" && go()}
        </div>
      )}
      {facts.length > 0 && (
        <dl className={cn("ez:m-0 ez:grid ez:gap-3", title ? "ez:pb-4" : "ez:md:grid-cols-3 ez:md:gap-x-12")}>
          {facts.map((f, i) => (
            <div key={f.label} className={cn("ez:flex ez:justify-between ez:gap-6", title && "ez:border-0 ez:border-solid ez:border-site-line ez:pb-3", title && i < facts.length - 1 && "ez:border-b")}>
              <dt className="ez:text-muted">{f.label}</dt>
              <dd className="ez:m-0 ez:text-right">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {empty && (
        <div aria-hidden="true" className="ez:grid ez:gap-3 ez:md:grid-cols-3 ez:md:gap-x-12">
          {[0, 1].map((i) => (
            <span key={i} className="ez:flex ez:justify-between ez:gap-6">
              <Bar size="short" />
              <Bar />
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
