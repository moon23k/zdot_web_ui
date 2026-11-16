import NextLink from "next/link";
import { Suspense, type ReactNode } from "react";
import { ButtonLink } from "../../components/button";
import { Icon, type IconName } from "../../components/icon";
import type { HeaderVariant } from "../../templates/types";
import { cn } from "../../utils/cn";
import { LiveNavLinks, NavLinks } from "./header-nav";
import { SiteLogo } from "./site-logo";

const ACTIONS: Record<string, { href: string; label: string }> = {
  search: { href: "/search", label: "검색" },
  class_booking: { href: "/classes", label: "수업 예약" },
  room_booking: { href: "/products", label: "객실 예약" },
  portfolio: { href: "/cases", label: "작업 사례" },
};

const shell: Record<HeaderVariant, string> = {
  center: "ez:border-b ez:border-primary-border ez:bg-surface",
  left: "ez:border-b ez:border-primary-border ez:bg-surface",
  transparent: "ez:bg-surface",
  dark: "ez:bg-primary",
  band: "ez:bg-primary",
  pill: "ez:bg-surface ez:pt-3",
  cta: "ez:border-b ez:border-primary-border ez:bg-surface",
  gallery: "ez:bg-transparent",
};

function IconLink({ href, icon, label, count, inverse }: { href: string; icon: IconName; label: string; count?: number; inverse?: boolean }) {
  return (
    <NextLink
      href={href}
      aria-label={count ? `${label} ${count}` : label}
      className={cn("ez:relative ez:inline-flex ez:min-h-11 ez:items-center ez:no-underline", inverse ? "ez:text-on-primary" : "ez:text-fg ez:hover:text-primary")}
    >
      <Icon name={icon} />
      {count ? (
        <sup className={cn("ez:-ml-1 ez:self-start ez:pt-2 ez:text-site-label ez:tabular-nums", inverse ? "ez:text-on-primary" : "ez:text-primary")}>{count}</sup>
      ) : null}
    </NextLink>
  );
}

export function SiteHeader({
  name,
  logoUrl,
  cartCount,
  signedIn,
  variant = "left",
  main = "shop",
  actions,
  cta,
}: {
  name: string;
  logoUrl?: string | null;
  cartCount?: number;
  signedIn?: boolean;
  variant?: HeaderVariant;
  main?: string;
  actions?: string[];
  cta?: { label: string; href: string } | null;
}) {
  const inverse = variant === "dark" || variant === "band";
  const gallery = variant === "gallery";
  const text = cn(
    "ez:inline-flex ez:min-h-11 ez:items-center ez:no-underline ez:hover:underline",
    inverse ? "ez:text-on-primary" : "ez:text-fg",
    variant === "cta" && cta && "ez:max-md:hidden",
  );
  const extra = (actions ?? []).map((a) => ACTIONS[a]).filter(Boolean);
  const account = signedIn ? "/me" : "/login";
  const stay = main === "stay";
  const logo = (
    <NextLink
      href="/"
      className={cn(
        "ez:truncate ez:font-title ez:no-underline",
        gallery ? "ez:font-body ez:text-site-item ez:tracking-[0.01em]" : "ez:font-display ez:text-lg",
        inverse ? "ez:text-on-primary" : "ez:text-fg",
        variant === "center" && "ez:justify-self-center ez:max-md:justify-self-start",
      )}
    >
      <SiteLogo name={name} src={logoUrl} />
    </NextLink>
  );
  const icons: ReactNode = gallery ? (
    <>
      {stay ? (
        <NextLink href={signedIn ? "/orders" : "/orders/lookup"} className="ez:inline-flex ez:min-h-11 ez:items-center ez:text-fg ez:no-underline ez:hover:text-primary">
          예약 조회
        </NextLink>
      ) : (
        <IconLink href="/products?search=1" icon="search" label="검색" />
      )}
      <IconLink href={account} icon="user" label={signedIn ? "내 정보" : "로그인"} />
      {!stay && <IconLink href={signedIn ? "/me/likes" : "/login"} icon="heart" label="찜" />}
      {!stay && <IconLink href="/cart" icon="bag" label="장바구니" count={cartCount} />}
    </>
  ) : (
    <>
      <IconLink href={account} icon="user" label={signedIn ? "내 정보" : "로그인"} inverse={inverse} />
      <IconLink href="/cart" icon="bag" label="장바구니" count={cartCount} inverse={inverse} />
    </>
  );
  const menu = (
    <nav aria-label="주요 메뉴" className={cn("ez:flex ez:shrink-0 ez:items-center ez:justify-self-end", gallery ? "ez:gap-4.5 ez:text-site-small" : "ez:gap-4 ez:text-[0.95rem]")}>
      {!gallery &&
        (extra.length ? (
          extra.map((a) => (
            <NextLink key={a.href} href={a.href} className={cn(text, "ez:max-md:hidden")}>
              {a.label}
            </NextLink>
          ))
        ) : (
          <NextLink href="/products" className={text}>
            상품
          </NextLink>
        ))}
      {icons}
      {variant === "cta" && cta && (
        <ButtonLink href={cta.href} size="sm">
          {cta.label}
        </ButtonLink>
      )}
    </nav>
  );
  if (gallery) {
    return (
      <header data-slot="site-header" data-variant={variant} className={shell.gallery}>
        <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:grid-cols-[1fr_auto] ez:items-center ez:gap-3 ez:px-page ez:py-3 ez:md:min-h-19 ez:md:grid-cols-[1fr_auto_1fr]">
          {logo}
          <nav aria-label="상품 메뉴" className="ez:flex ez:gap-8.5 ez:text-site-small ez:tracking-[0.02em] ez:max-md:hidden">
            <Suspense fallback={<NavLinks main={main} />}>
              <LiveNavLinks main={main} />
            </Suspense>
          </nav>
          {menu}
        </div>
      </header>
    );
  }
  return (
    <header data-slot="site-header" data-variant={variant} className={cn("ez:sticky ez:top-0 ez:z-10 ez:border-0 ez:border-solid", shell[variant])}>
      <div
        className={cn(
          "ez:mx-auto ez:max-w-wrap ez:items-center ez:gap-3 ez:px-page ez:py-3",
          variant === "center" ? "ez:grid ez:grid-cols-[1fr_auto] ez:md:grid-cols-[1fr_auto_1fr]" : "ez:flex ez:justify-between",
          variant === "pill" && "ez:rounded-full ez:border ez:border-solid ez:border-primary-border ez:py-2",
        )}
      >
        {variant === "center" && <span aria-hidden="true" className="ez:max-md:hidden" />}
        {logo}
        {menu}
      </div>
    </header>
  );
}
