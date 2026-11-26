import NextLink from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "../../components/button";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import type { CustomerProvider } from "../../types";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";

const mark = "ez:inline-flex ez:size-6 ez:shrink-0 ez:box-border ez:items-center ez:justify-center ez:rounded-full";

const BRAND: Record<CustomerProvider, { label: string; symbol: ReactNode }> = {
  kakao: {
    label: "카카오로 시작하기",
    symbol: (
      <span aria-hidden="true" className={cn(mark, "ez:bg-[#FEE500]")}>
        <svg width="14" height="14" viewBox="0 0 20 20">
          <path d="M10 4C6.1 4 3 6.4 3 9.4c0 1.9 1.3 3.6 3.2 4.5l-.7 2.6 3-2c.5.1 1 .1 1.5.1 3.9 0 7-2.4 7-5.3S13.9 4 10 4z" fill="#191919" />
        </svg>
      </span>
    ),
  },
  naver: {
    label: "네이버로 시작하기",
    symbol: (
      <span aria-hidden="true" className={cn(mark, "ez:bg-[#03C75A]")}>
        <svg width="10" height="10" viewBox="0 0 20 20">
          <path d="M4 3h4.2l3.6 5.4V3H16v14h-4.2L8.2 11.6V17H4z" fill="#ffffff" />
        </svg>
      </span>
    ),
  },
  google: {
    label: "Google로 시작하기",
    symbol: (
      <span aria-hidden="true" className={cn(mark, "ez:border ez:border-solid ez:border-site-line ez:bg-surface")}>
        <svg width="12" height="12" viewBox="0 0 24 24">
          <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285F4" />
          <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" fill="#34A853" />
          <path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z" fill="#FBBC05" />
          <path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1z" fill="#EA4335" />
        </svg>
      </span>
    ),
  },
};

export function OAuthButtons({
  next,
  providers = ["kakao", "naver", "google"],
  startHref = (provider) => `/api/auth/${provider}/start`,
  title,
  guestHref,
  image,
  children,
}: {
  next?: string;
  providers?: CustomerProvider[];
  startHref?: (provider: CustomerProvider) => string;
  title?: string;
  guestHref?: string;
  image?: string | null;
  children?: ReactNode;
}) {
  const query = next ? `?next=${encodeURIComponent(next)}` : "";
  const buttons = (
    <div data-slot="oauth-buttons" className="ez:grid ez:w-full ez:max-w-95 ez:gap-2.5">
      {providers.map((p) => (
        <a
          key={p}
          href={`${startHref(p)}${query}`}
          className={cn(buttonVariants({ variant: "outline", block: true }), "ez:justify-start ez:gap-3.5 ez:px-5.5 ez:hover:border-muted")}
        >
          {BRAND[p].symbol}
          {BRAND[p].label}
        </a>
      ))}
    </div>
  );
  if (!title && !guestHref && !children) return buttons;
  const panel = (
    <section data-slot="login-panel" className="ez:mx-auto ez:grid ez:w-full ez:max-w-95 ez:gap-10 ez:pt-6 ez:text-fg ez:lg:pt-18">
      {title && <h1 className="ez:m-0 ez:text-site-page">{title}</h1>}
      {buttons}
      {children}
      {guestHref && (
        <div className="ez:flex ez:items-center ez:justify-between ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-6 ez:text-site-small">
          <NextLink href={guestHref} className={cn("ez:inline-flex ez:items-center ez:gap-2 ez:text-fg ez:no-underline ez:hover:text-muted", focusRing)}>
            비회원 주문 조회
            <Icon name="right" size="sm" />
          </NextLink>
        </div>
      )}
    </section>
  );
  if (!image) return panel;
  return (
    <div data-slot="login-split" className="ez:grid ez:gap-10 ez:lg:grid-cols-2 ez:lg:items-center ez:lg:gap-24">
      <Photo src={image} alt="" preload sizes="(max-width: 1024px) 100vw, 640px" tone={0} className="ez:aspect-[4/3] ez:lg:aspect-auto ez:lg:h-175 ez:max-lg:hidden" />
      {panel}
    </div>
  );
}
