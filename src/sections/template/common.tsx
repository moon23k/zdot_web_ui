import NextLink from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "../../components/button";
import type { SectionProps } from "../../renderer/registry";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { cn } from "../../utils/cn";
import { countSup, figure, textLink } from "../../utils/styles";
import type { Review } from "./data";
import { Bar, BlankButton, BlankStars, Block, Lines, Pairs, Pic, Split } from "../kit";

export function NoticeBar({ data, context, blank }: SectionProps<"notice_bar">) {
  if (data.text || context.shipping?.free_threshold != null || !blank) return null;
  return (
    <div data-slot="notice-bar" data-blank="" className="ez:mx-[calc(50%-50vw)] ez:-mt-8 ez:flex ez:min-h-9.5 ez:items-center ez:justify-center ez:bg-surface-alt ez:text-site-small">
      <Bar size="long" />
    </div>
  );
}

export function Intro({ data, lead, variant, blank }: SectionProps<"intro">) {
  if (!data.title && !blank) return null;
  if (variant === "gallery") {
    const images = data.images ?? [];
    return (
      <section data-slot="intro" data-variant="gallery" data-blank={data.title ? undefined : ""} className="ez:grid ez:gap-12 ez:pt-4 ez:text-fg ez:lg:gap-16 ez:lg:pt-14">
        <div className="ez:grid ez:gap-8 ez:lg:grid-cols-[8fr_4fr] ez:lg:items-end ez:lg:gap-6">
          {data.title ? (
            <h1 className="ez:m-0 ez:text-site-page ez:font-light ez:tracking-[-0.04em] ez:text-balance ez:lg:text-site-hero">{data.title}</h1>
          ) : (
            <span className="ez:text-site-page ez:lg:text-site-hero">
              <Bar size="long" />
            </span>
          )}
          <div className="ez:flex ez:flex-col ez:items-start ez:gap-7 ez:lg:pb-3.5">
            {data.title ? (
              <ButtonLink href="/quote">
                견적 요청
                <Icon name="right" size="sm" />
              </ButtonLink>
            ) : (
              <BlankButton>견적 요청</BlankButton>
            )}
          </div>
        </div>
        {images.length > 0 && (
          <div className="ez:grid ez:gap-gutter ez:md:grid-cols-[8fr_4fr] ez:md:items-end">
            <Pic src={images[0]} tone={0} className="ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-140 ez:[&>[data-slot=photo]]:h-full ez:[&>[data-slot=photo]]:aspect-auto" />
            {images[1] && <Pic src={images[1]} tone={1} className="ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-75 ez:[&>[data-slot=photo]]:h-full ez:[&>[data-slot=photo]]:aspect-auto" />}
          </div>
        )}
      </section>
    );
  }
  const statement = variant === "statement";
  return (
    <Block
      slot="intro"
      blank={!data.title}
      className={cn(statement ? "ez:pt-6 ez:lg:pt-14" : "ez:lg:grid-cols-[3fr_9fr] ez:lg:gap-6", lead && !statement && "ez:pt-6")}
    >
      {!statement && <span aria-hidden="true" className="ez:max-lg:hidden" />}
      <div className={cn("ez:grid ez:justify-items-start", statement ? "ez:gap-6" : "ez:gap-10")}>
        {data.title ? (
          <h2 className={cn("ez:m-0 ez:max-w-4xl ez:text-left ez:font-light ez:tracking-[-0.035em] ez:text-balance", statement ? "ez:text-site-page ez:lg:text-site-display" : "ez:text-site-page-sm ez:lg:text-site-page")}>
            {data.title}
          </h2>
        ) : (
          <span className="ez:w-full ez:max-w-xl ez:text-site-page-sm ez:lg:text-site-page">
            <Bar size="long" />
          </span>
        )}
        {data.title && data.button && (
          <NextLink href={data.href ?? "/products"} className={textLink}>
            {data.button}
          </NextLink>
        )}
      </div>
    </Block>
  );
}

export function PhotoBand({ data, blank }: SectionProps<"photo_band">) {
  const images = data.images?.length ? data.images.slice(0, 4) : data.image ? [data.image] : [];
  if (!images.length && !blank) return null;
  const shown: (string | null)[] = images.length ? images : [null, null, null, null];
  return (
    <section data-slot="photo-band" data-blank={images.length ? undefined : ""} className={cn("ez:mx-[calc(50%-50vw)] ez:grid", shown.length > 1 ? "ez:grid-cols-2 ez:lg:grid-cols-4" : "ez:grid-cols-1")}>
      {shown.map((src, i) => (
        <Pic key={i} src={src} ratio={shown.length > 1 ? 1 : 2.4} tone={i} className="ez:[&>[data-slot=photo]]:rounded-none" />
      ))}
    </section>
  );
}

export function StarRow({ rating, className }: { rating: number; className?: string }) {
  return (
    <span role="img" aria-label={`별점 ${rating}점`} className={cn("ez:inline-flex ez:gap-0.5 ez:text-primary", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" aria-hidden="true" className={cn("ez:size-3.25", n > Math.round(rating) && "ez:opacity-25")}>
          <path fill="currentColor" d="M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z" />
        </svg>
      ))}
    </span>
  );
}

function GalleryReviews({
  items,
  count,
  products,
  title = "리뷰",
  slot = "testimonial",
}: {
  items: Review[];
  count?: number | null;
  products: SectionProps["context"]["products"];
  title?: string;
  slot?: string;
}) {
  return (
    <section data-slot={slot} data-variant="gallery" id="reviews" data-blank={items.length ? undefined : ""} className="ez:grid ez:gap-2 ez:text-fg">
      <h2 className="ez:m-0 ez:text-site-section">
        {title}
        {count ? <span className={countSup}>{count}</span> : null}
      </h2>
      <div className="ez:grid ez:gap-x-12 ez:md:grid-cols-3">
        {(items.length ? items.slice(0, 3) : [null, null, null]).map((r, i) => {
          const product = r?.product ? products.find((p) => p.id === r.product) : undefined;
          return (
            <article key={r ? `${r.name}-${r.body}` : i} className="ez:flex ez:flex-col ez:gap-5 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:py-8">
              {r ? <StarRow rating={r.rating} /> : <BlankStars />}
              {r ? <p className="ez:m-0 ez:min-h-18.5 ez:text-site-item ez:font-normal">{r.body}</p> : <Lines />}
              <span className="ez:flex ez:items-center ez:gap-3.5">
                {product && <Photo src={product.cover_url} alt="" sizes="52px" tone={i} className="ez:size-13 ez:rounded-sm" />}
                <span className="ez:flex ez:flex-col ez:text-site-small">
                  {product && <span>{product.name}</span>}
                  <span className="ez:text-muted">{r ? [r.name, r.date].filter(Boolean).join(" · ") : <Bar size="short" />}</span>
                </span>
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function Testimonial({ data, context, variant, blank }: SectionProps<"testimonial">) {
  if (variant === "gallery") {
    if (!data.items?.length && !blank) return null;
    return <GalleryReviews items={data.items ?? []} count={data.count} products={context.products} />;
  }
  if (!data.quote && !blank) return null;
  if (!data.quote) {
    return (
      <div data-slot="testimonial" data-blank="" className="ez:grid ez:gap-3 ez:rounded-md ez:bg-surface-alt ez:p-6">
        <Lines />
        <span className="ez:text-site-note">
          <Bar size="short" />
        </span>
      </div>
    );
  }
  return (
    <figure data-slot="testimonial" className="ez:m-0 ez:grid ez:gap-3 ez:rounded-md ez:bg-surface-alt ez:p-6 ez:text-fg">
      <blockquote className="ez:m-0 ez:font-display ez:text-site-item">“{data.quote}”</blockquote>
      {data.name && <figcaption className="ez:text-site-note ez:text-muted">{data.name}</figcaption>}
    </figure>
  );
}


export function Reviews({ data, context, blank }: SectionProps<"reviews">) {
  const items = data.items ?? [];
  if (!items.length && !blank) return null;
  return <GalleryReviews items={items} count={data.count} products={context.products} title="후기" slot="reviews" />;
}

export function TrustLine({ data, blank }: SectionProps<"trust_line">) {
  const items = data.items ?? [];
  if (!items.length && !blank) return null;
  return (
    <ul data-slot="trust-line" data-variant="gallery" data-blank={items.length ? undefined : ""} className="ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-x-10 ez:gap-y-2 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:p-0 ez:pt-6 ez:text-site-small ez:text-muted">
      {(items.length ? items : ["", ""]).map((t, i) => (
        <li key={`${t}-${i}`} className="ez:flex ez:items-center ez:gap-2">
          <span aria-hidden="true" className="ez:size-1.25 ez:rounded-full ez:bg-primary" />
          {t || <Bar size="short" />}
        </li>
      ))}
    </ul>
  );
}

export function ProcessSteps({ data, blank }: SectionProps<"process_steps">) {
  const steps = data.steps ?? [];
  if (!steps.length && !blank) return null;
  return (
    <section data-slot="process-steps" data-variant="gallery" id="process" data-blank={steps.length ? undefined : ""} className="ez:grid ez:gap-10 ez:text-fg ez:lg:gap-14">
      <h2 className="ez:m-0 ez:text-site-section">{data.title ?? "진행 과정"}</h2>
      <ol className="ez:m-0 ez:grid ez:list-none ez:gap-8 ez:p-0 ez:md:auto-cols-fr ez:md:grid-flow-col ez:md:gap-6">
        {(steps.length ? steps : ["", "", "", ""]).map((s, i) => (
          <li key={`${s}-${i}`} className="ez:grid ez:gap-5">
            <span aria-hidden="true" className="ez:flex ez:items-center ez:gap-3">
              <span className="ez:size-2.25 ez:rounded-full ez:bg-primary" />
              <span className="ez:h-px ez:flex-1 ez:bg-site-line" />
            </span>
            <span className={cn(figure, "ez:text-site-section ez:leading-none")}>{i + 1}</span>
            <span className="ez:text-site-heading">{s || <Bar size="short" />}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Numbers({ data, blank }: SectionProps<"numbers">) {
  const items = data.items ?? [];
  if (!items.length && !blank) return null;
  const shown = items.length ? items : ["평점", "후기"].map((label) => ({ label, value: "" }));
  return (
    <dl data-slot="numbers" data-blank={items.length ? undefined : ""} className="ez:m-0 ez:grid ez:grid-cols-2 ez:gap-y-6 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-7 ez:text-fg ez:md:grid-cols-4">
      {shown.map((n) => (
        <div key={n.label} className="ez:flex ez:items-baseline ez:gap-3">
          <dd className={cn(figure, "ez:order-1 ez:m-0 ez:text-site-figure-lg")}>{n.value || <Bar size="short" />}</dd>
          <dt className="ez:order-2 ez:text-site-small ez:text-muted">{n.label}</dt>
        </div>
      ))}
    </dl>
  );
}

export function Gallery({ data, variant, blank }: SectionProps<"gallery">) {
  const images = data.images ?? [];
  if (!images.length && !blank) return null;
  if (variant === "gallery") {
    const shown: (string | null)[] = images.length ? images.slice(0, 3) : [null, null, null];
    const tall = ["ez:lg:h-130", "ez:lg:h-100", "ez:lg:h-75"];
    return (
      <section data-slot="gallery" data-variant="gallery" id="gallery" data-blank={images.length ? undefined : ""} className="ez:mx-[calc(50%-50vw)] ez:-mt-section ez:bg-surface-alt">
        <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:grid-cols-2 ez:gap-gutter ez:px-page ez:pb-16 ez:lg:grid-cols-[5fr_4fr_3fr] ez:lg:items-end ez:lg:pb-30">
          {shown.map((src, i) => (
            <Pic key={i} src={src} tone={i} className={cn("ez:aspect-[4/3] ez:lg:aspect-auto", tall[i], i === 0 && "ez:col-span-2 ez:lg:col-span-1", "ez:[&>[data-slot=photo]]:h-full ez:[&>[data-slot=photo]]:aspect-auto")} />
          ))}
        </div>
      </section>
    );
  }
  const shown: (string | null)[] = images.length ? images.slice(0, 6) : [null, null, null];
  return (
    <section data-slot="gallery" id="gallery" data-blank={images.length ? undefined : ""} className="ez:grid ez:grid-cols-2 ez:gap-gutter ez:md:grid-cols-3">
      {shown.map((src, i) => (
        <Pic key={i} src={src} ratio={4 / 3} tone={i} />
      ))}
    </section>
  );
}

export function Location({ data, blank }: SectionProps<"location">) {
  if (!data.address && !blank) return null;
  return (
    <Split slot="location" id="location" title="오시는 길" blank={!data.address}>
      <div className="ez:grid ez:justify-items-start ez:gap-5">
        <p className="ez:m-0 ez:text-site-heading">{data.address ?? <Bar size="long" />}</p>
        {data.note && <p className="ez:m-0 ez:text-muted">{data.note}</p>}
        {data.href && (
          <ButtonLink href={data.href} variant="outline" size="sm">
            지도 보기
          </ButtonLink>
        )}
      </div>
    </Split>
  );
}

const full = (value: ReactNode) => typeof value === "string" && value.startsWith("100%");

export function PayPlan({ data, blank }: SectionProps<"pay_plan">) {
  const rows = data.rows ?? [];
  const groups = data.groups ?? [];
  if (!rows.length && !groups.length && !blank) return null;
  const empty = !rows.length && !groups.length;
  return (
    <Split slot="pay-plan" id="refund" title={data.title ?? "취소 · 환불 규정"} blank={empty}>
      <div className="ez:grid ez:gap-8">
        {empty && <Pairs rows={["예약금", "잔금", "취소 규정"].map((label) => ({ label, value: <Bar size="short" /> }))} />}
        {rows.length > 0 && <Pairs rows={rows} accent={full} />}
        {groups.map((group) => (
          <details key={group.title} className="ez:group">
            <summary className="ez:flex ez:min-h-12 ez:cursor-pointer ez:list-none ez:items-center ez:justify-between ez:gap-3 ez:text-site-item ez:font-normal ez:[&::-webkit-details-marker]:hidden">
              {group.title}
              <span aria-hidden="true" className="ez:text-muted ez:transition-transform ez:group-open:rotate-45">
                +
              </span>
            </summary>
            <Pairs rows={group.rows} accent={full} />
          </details>
        ))}
      </div>
    </Split>
  );
}
