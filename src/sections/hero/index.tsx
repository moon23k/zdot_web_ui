import { ButtonLink } from "../../components/button";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import NextLink from "next/link";
import { Icon } from "../../components/icon";
import { cn, won } from "../../utils/cn";
import { textLink } from "../../utils/styles";
import { Bar, BlankButton, Lines, line, Pic } from "../kit";

function Heading({ title, sub, inverse }: { title?: string | null; sub?: string | null; inverse?: boolean }) {
  if (!title) {
    return (
      <div className="ez:grid ez:w-full ez:max-w-xl ez:gap-4">
        <span className="ez:font-display ez:text-site-page-sm ez:md:text-site-page">
          <Bar size="long" strong={inverse} />
        </span>
        <Lines strong={inverse} />
      </div>
    );
  }
  return (
    <>
      <h1
        className={cn(
          "ez:m-0 ez:max-w-3xl ez:font-display ez:text-site-page-sm ez:text-balance ez:md:text-site-page",
          inverse && "ez:text-on-primary",
        )}
      >
        {title}
      </h1>
      {sub && <p className={cn("ez:m-0 ez:max-w-2xl", inverse ? "ez:text-on-primary" : "ez:text-muted")}>{sub}</p>}
    </>
  );
}

export function Hero({ data, variant, blank }: SectionProps<"hero">) {
  if (!data.title && !blank) return null;
  const empty = !data.title;
  const href = data.href ?? "/products";
  const button = data.button ?? "상품 보기";
  const image = data.image ?? data.images?.[0];
  const action = (className?: string) =>
    empty ? (
      <BlankButton className={className}>둘러보기</BlankButton>
    ) : (
      <ButtonLink href={href} className={className}>
        {button}
      </ButtonLink>
    );

  if (variant === "gallery") {
    const pick = data.products?.find((p) => p.cover_url) ?? data.products?.[0];
    return (
      <section data-slot="hero" data-variant="gallery" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-8 ez:text-fg ez:lg:grid-cols-[5fr_7fr] ez:lg:items-end ez:lg:gap-6">
        <div className="ez:flex ez:flex-col ez:items-start ez:gap-6 ez:lg:gap-10 ez:lg:pb-2">
          {empty ? (
            <div className="ez:grid ez:w-full ez:max-w-xl ez:gap-4">
              <span className="ez:text-site-page-sm ez:lg:text-site-display">
                <Bar size="long" />
              </span>
              <Lines />
            </div>
          ) : (
            <div className="ez:grid ez:gap-5">
              <h1 className="ez:m-0 ez:text-site-page-sm ez:font-light ez:tracking-[-0.04em] ez:text-balance ez:lg:text-site-display">{data.title}</h1>
              {data.sub && <p className="ez:m-0 ez:max-w-xl ez:text-muted">{data.sub}</p>}
            </div>
          )}
          <div className="ez:flex ez:flex-wrap ez:items-center ez:gap-7">
            {empty ? (
              <BlankButton>둘러보기</BlankButton>
            ) : (
              <ButtonLink href={href}>
                {button}
                <Icon name="right" size="sm" />
              </ButtonLink>
            )}
            {href !== "/products" && (
              <NextLink href="/products" className={textLink}>
                전체 상품
              </NextLink>
            )}
          </div>
        </div>
        <div className="ez:relative">
          <Photo src={image} alt="" preload sizes="(max-width: 1024px) 100vw, 740px" tone={0} className="ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-150" />
          {pick && !empty && (
            <NextLink
              href={pick.href ?? `/products/${pick.id}`}
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
      </section>
    );
  }

  if (variant === "box") {
    return (
      <section data-slot="hero" data-variant="box" data-blank={empty ? "" : undefined} className={cn("ez:grid ez:text-fg ez:md:grid-cols-2", line)}>
        <Pic src={image} ratio={1} tone={0} />
        <div className="ez:grid ez:content-center ez:justify-items-start ez:gap-4 ez:p-6 ez:md:p-10">
          <Heading title={data.title} sub={data.sub} />
          {action()}
        </div>
      </section>
    );
  }

  if (variant === "full" || variant === "slide" || variant === "rounded" || variant === "card") {
    const count = data.images?.length ?? 0;
    return (
      <section
        data-slot="hero"
        data-variant={variant}
        data-blank={empty ? "" : undefined}
        className={cn(
          "ez:relative ez:grid ez:overflow-hidden",
          variant === "slide" ? "ez:aspect-[1.6] ez:md:aspect-[2.6]" : "ez:aspect-[0.8] ez:md:aspect-[2.4]",
          (variant === "rounded" || variant === "card") && "ez:rounded-lg",
        )}
      >
        <Photo src={image} alt="" preload sizes="100vw" tone={0} strong iconClassName="ez:-translate-y-16" className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
        <div className="ez:absolute ez:inset-0 ez:bg-[rgb(0_0_0/var(--ezd-overlay))]" aria-hidden="true" />
        <div className="ez:relative ez:grid ez:content-end ez:justify-items-start ez:gap-4 ez:p-6 ez:md:p-12">
          <Heading title={data.title} sub={data.sub} inverse />
          {action("ez:bg-surface ez:text-fg ez:hover:bg-surface-alt")}
          {variant === "slide" && count > 1 && (
            <span className="ez:text-site-note ez:text-on-primary" aria-hidden="true">
              {Array.from({ length: count }, (_, i) => (i === 0 ? "●" : "○")).join(" ")}
            </span>
          )}
        </div>
      </section>
    );
  }

  if (variant === "text") {
    return (
      <section data-slot="hero" data-variant="text" data-blank={empty ? "" : undefined} className="ez:grid ez:justify-items-center ez:gap-6 ez:text-center ez:text-fg">
        <Heading title={data.title} sub={data.sub} />
        {(image || empty) && <Pic src={image} ratio={1.4} tone={0} className="ez:md:max-w-3xl" />}
      </section>
    );
  }

  return (
    <section data-slot="hero" data-blank={empty ? "" : undefined} className={cn("ez:grid ez:gap-6 ez:text-fg", (image || empty) && "ez:md:grid-cols-2 ez:md:items-center ez:md:gap-10")}>
      <div className="ez:grid ez:justify-items-start ez:gap-4">
        <Heading title={data.title} sub={data.sub} />
        {action()}
      </div>
      {(image || empty) && <Photo src={image} alt="" preload sizes="(max-width: 768px) 100vw, 540px" tone={0} className="ez:aspect-[4/3] ez:rounded-lg" />}
    </section>
  );
}
