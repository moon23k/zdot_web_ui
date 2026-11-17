import { ButtonLink } from "../../components/button";
import { Photo } from "../../components/photo";
import type { SectionProps } from "../../renderer/registry";
import NextLink from "next/link";
import { Icon } from "../../components/icon";
import { cn, won } from "../../utils/cn";
import { textLink } from "../../utils/styles";
import { Bar, BlankButton, Lines } from "../kit";

function Heading({ title, inverse }: { title?: string | null; inverse?: boolean }) {
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

  if (variant === "class") {
    const facts = data.facts ?? [];
    return (
      <section data-slot="hero" data-variant="class" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-8 ez:text-fg ez:lg:grid-cols-[7fr_5fr] ez:lg:items-end ez:lg:gap-6">
        <Photo src={image} alt="" preload sizes="(max-width: 1024px) 100vw, 740px" tone={0} className="ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-160" />
        <div className="ez:flex ez:flex-col ez:items-start ez:gap-8 ez:lg:gap-10 ez:lg:pb-2 ez:lg:pl-14">
          {empty ? (
            <span className="ez:w-full ez:text-site-page-sm ez:lg:text-site-display">
              <Bar size="long" />
            </span>
          ) : (
            <div className="ez:grid ez:gap-5">
              <h1 className="ez:m-0 ez:text-site-page-sm ez:font-light ez:tracking-[-0.04em] ez:text-balance ez:lg:text-site-display">{data.title}</h1>
            </div>
          )}
          <div className="ez:flex ez:flex-wrap ez:items-center ez:gap-7">
            {empty ? (
              <BlankButton>일정 보기</BlankButton>
            ) : (
              <ButtonLink href="#schedule">
                일정 보기
                <Icon name="right" size="sm" />
              </ButtonLink>
            )}
            {!empty && (
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
    const facts = data.facts ?? [];
    return (
      <section data-slot="hero" data-variant="stay" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-10 ez:pt-4 ez:text-fg ez:lg:gap-14 ez:lg:pt-10">
        <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-8">
          {empty ? (
            <span className="ez:w-full ez:max-w-xl ez:text-site-page-sm ez:lg:text-site-display">
              <Bar size="long" />
            </span>
          ) : (
            <div className="ez:grid ez:gap-4">
              <h1 className="ez:m-0 ez:max-w-3xl ez:text-site-page-sm ez:font-light ez:tracking-[-0.04em] ez:text-balance ez:lg:text-site-display">{data.title}</h1>
            </div>
          )}
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
        <Photo src={image} alt="" preload sizes="100vw" tone={0} className="ez:aspect-[4/3] ez:md:aspect-[2.06]" />
      </section>
    );
  }

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

  const title = (size: string) =>
    empty ? (
      <span className={cn("ez:w-full ez:max-w-xl", size)}>
        <Bar size="long" />
      </span>
    ) : (
      <h1 className={cn("ez:m-0 ez:font-light ez:tracking-[-0.04em] ez:text-balance", size)}>{data.title}</h1>
    );
  const pick = data.products?.find((p) => p.cover_url) ?? data.products?.[0];
  const ghost = "ez:border-[rgb(255_255_255/0.7)] ez:bg-transparent ez:text-[#ffffff] ez:hover:border-[#ffffff]";

  if (variant === "full" && image) {
    return (
      <section data-slot="hero" data-variant="full" className="ez:relative ez:mx-[calc(50%-50vw)] ez:h-130 ez:overflow-hidden ez:text-[#ffffff] ez:lg:h-190">
        <Photo src={image} alt="" preload sizes="100vw" tone={0} className="ez:absolute ez:inset-0 ez:aspect-auto ez:h-full ez:rounded-none" />
        <span aria-hidden="true" className="ez:absolute ez:inset-0 ez:bg-[linear-gradient(rgb(20_20_18/0.34),rgb(20_20_18/0)_26%,rgb(20_20_18/0)_52%,rgb(20_20_18/0.46))]" />
        <div className="ez:absolute ez:inset-x-0 ez:bottom-10 ez:mx-auto ez:flex ez:max-w-wrap ez:flex-wrap ez:items-end ez:justify-between ez:gap-6 ez:px-page ez:lg:bottom-16">
          <h1 className="ez:m-0 ez:text-site-page ez:font-light ez:tracking-[-0.04em] ez:text-balance ez:lg:text-site-display">{data.title}</h1>
          <ButtonLink href={href} variant="outline" className={ghost}>
            {button}
            <Icon name="right" size="sm" />
          </ButtonLink>
        </div>
      </section>
    );
  }

  if (variant === "frame") {
    return (
      <section data-slot="hero" data-variant="frame" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-6 ez:text-fg ez:lg:relative ez:lg:h-160">
        <Photo src={image} alt="" preload sizes="(max-width: 1024px) 100vw, 920px" tone={0} className="ez:aspect-[4/3] ez:lg:absolute ez:lg:inset-y-0 ez:lg:left-0 ez:lg:right-90 ez:lg:aspect-auto" />
        <div className="ez:grid ez:gap-6 ez:lg:absolute ez:lg:bottom-0 ez:lg:left-0 ez:lg:bg-surface ez:lg:pt-9 ez:lg:pr-14">
          {title("ez:text-site-page ez:lg:text-site-display")}
        </div>
        <div className="ez:grid ez:content-start ez:gap-5 ez:rounded-lg ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-8 ez:lg:absolute ez:lg:top-10 ez:lg:right-0 ez:lg:w-120">
          {empty ? <BlankButton>견적 요청</BlankButton> : <ButtonLink href={href === "/products" ? "/quote" : href} block>{button}<Icon name="right" size="sm" /></ButtonLink>}
        </div>
      </section>
    );
  }

  if (variant === "slide") {
    const side = (data.products ?? []).filter((p) => p.cover_url).slice(0, 2);
    return (
      <section data-slot="hero" data-variant="slide" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-gutter ez:text-fg ez:lg:grid-cols-[8fr_4fr]">
        {(() => {
          const body = (
            <>
              <Photo src={image} alt="" preload sizes="(max-width: 1024px) 100vw, 860px" tone={0} className="ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-140" />
              <span className="ez:absolute ez:bottom-6 ez:left-6 ez:grid ez:max-w-[70%] ez:gap-2 ez:rounded-md ez:bg-surface ez:px-7 ez:py-6">
                {title("ez:text-site-heading ez:lg:text-site-title")}
                {!empty && <span className="ez:text-site-small ez:text-muted">{button}</span>}
              </span>
            </>
          );
          return empty ? (
            <div className="ez:relative">{body}</div>
          ) : (
            <NextLink href={href} className="ez:relative ez:block ez:text-fg ez:no-underline">
              {body}
            </NextLink>
          );
        })()}
        {side.length > 0 && (
          <div className="ez:grid ez:gap-gutter ez:max-lg:grid-cols-2">
            {side.map((p, i) => (
              <NextLink key={p.id} href={p.href ?? `/products/${p.id}`} className="ez:grid ez:grid-cols-[1fr_auto] ez:items-end ez:gap-4 ez:rounded-md ez:bg-surface-alt ez:p-5 ez:text-fg ez:no-underline">
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
    return (
      <section data-slot="hero" data-variant={variant} data-blank={empty ? "" : undefined} className="ez:grid ez:overflow-hidden ez:rounded-md ez:bg-surface-alt ez:text-fg ez:lg:min-h-150 ez:lg:grid-cols-[5fr_7fr]">
        <div className="ez:flex ez:flex-col ez:justify-end ez:gap-9 ez:p-8 ez:lg:p-16">
          {title("ez:text-site-page ez:lg:text-site-display")}
          {empty ? (
            <BlankButton>둘러보기</BlankButton>
          ) : (
            <ButtonLink href={href} className="ez:self-start ez:bg-surface">
              {button}
              <Icon name="right" size="sm" />
            </ButtonLink>
          )}
        </div>
        <div className="ez:relative">
          <Photo src={image} alt="" preload sizes="(max-width: 1024px) 100vw, 760px" tone={0} className="ez:aspect-[4/3] ez:rounded-none ez:lg:aspect-auto ez:lg:h-full" />
          {variant === "card" && pick && !empty && (
            <NextLink href={pick.href ?? `/products/${pick.id}`} className="ez:absolute ez:inset-x-5 ez:bottom-5 ez:flex ez:items-center ez:justify-between ez:gap-4 ez:rounded-sm ez:bg-surface ez:px-5 ez:py-3.5 ez:text-fg ez:no-underline ez:max-md:hidden">
              <span className="ez:text-site-small">{pick.name}</span>
              <Icon name="right" size="sm" />
            </NextLink>
          )}
        </div>
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section data-slot="hero" data-variant="split" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-8 ez:pt-4 ez:text-fg ez:lg:grid-cols-[7fr_5fr] ez:lg:items-end ez:lg:gap-6 ez:lg:pt-14">
        <div className="ez:flex ez:flex-col ez:items-start ez:gap-10">
          {title("ez:text-site-page ez:lg:text-site-display-lg")}
          {empty ? (
            <BlankButton>둘러보기</BlankButton>
          ) : (
            <ButtonLink href={href}>
              {button}
              <Icon name="right" size="sm" />
            </ButtonLink>
          )}
        </div>
        <Photo src={image} alt="" preload sizes="(max-width: 1024px) 100vw, 520px" tone={0} className="ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-105" />
      </section>
    );
  }

  if (variant === "text" || (variant === "full" && !image)) {
    const facts = data.facts ?? [];
    return (
      <section data-slot="hero" data-variant="text" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-8 ez:pt-4 ez:text-fg ez:lg:grid-cols-[7fr_5fr] ez:lg:items-end ez:lg:gap-6 ez:lg:pt-16">
        <div className="ez:flex ez:flex-col ez:items-start ez:gap-10">
          {title("ez:text-site-page ez:lg:text-site-display-lg")}
          {!empty && variant === "full" && <ButtonLink href={href}>{button}</ButtonLink>}
        </div>
        {facts.length > 0 && (
          <dl className="ez:m-0 ez:grid ez:gap-3 ez:pb-4">
            {facts.map((f, i) => (
              <div key={f.label} className={cn("ez:flex ez:justify-between ez:gap-6 ez:border-0 ez:border-solid ez:border-site-line ez:pb-3", i < facts.length - 1 && "ez:border-b")}>
                <dt className="ez:text-muted">{f.label}</dt>
                <dd className="ez:m-0 ez:text-right">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    );
  }

  return (
    <section data-slot="hero" data-blank={empty ? "" : undefined} className={cn("ez:grid ez:gap-6 ez:text-fg", (image || empty) && "ez:md:grid-cols-2 ez:md:items-center ez:md:gap-10")}>
      <div className="ez:grid ez:justify-items-start ez:gap-4">
        <Heading title={data.title} />
        {action()}
      </div>
      {(image || empty) && <Photo src={image} alt="" preload sizes="(max-width: 768px) 100vw, 540px" tone={0} className="ez:aspect-[4/3] ez:rounded-lg" />}
    </section>
  );
}
