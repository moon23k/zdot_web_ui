import NextLink from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "../../components/button";
import { Icon, type IconName } from "../../components/icon";
import { SHOP_DESIGNS, shopLinks, shopNav } from "../../sections/shop";
import type { HeaderVariant, ShopSkin } from "../../templates/types";
import { cn } from "../../utils/cn";
import { wordmark } from "../../utils/styles";
import { LiveNavLinks, NavLinks, type NavCategory } from "./header-nav";
import { CheckoutSteps, PathSwitch } from "./path-switch";
import { SiteLogo } from "./site-logo";

const LINKS: Record<string, { label: string; signed: string; guest: string }> = {
  stay: { label: "예약 조회", signed: "/orders", guest: "/orders/lookup" },
  class: { label: "예약 내역", signed: "/orders", guest: "/orders/lookup" },
  quote: { label: "견적 조회", signed: "/quote/lookup", guest: "/quote/lookup" },
};

const CTA: Record<string, { label: string; href: string }> = {
  stay: { label: "예약하기", href: "/#rooms" },
  quote: { label: "견적 요청", href: "/quote" },
};

function IconLink({ href, icon, label, count }: { href: string; icon: IconName; label: string; count?: number }) {
  return (
    <NextLink
      href={href}
      aria-label={count ? `${label} ${count}` : label}
      className="ez:relative ez:inline-flex ez:size-11 ez:items-center ez:justify-center ez:rounded-full ez:text-fg ez:no-underline ez:hover:text-primary"
    >
      <Icon name={icon} />
      {count ? (
        <span className="ez:absolute ez:top-1.5 ez:right-0.5 ez:flex ez:h-4 ez:min-w-4 ez:items-center ez:justify-center ez:rounded-full ez:bg-point-soft ez:px-1 ez:text-site-badge ez:leading-none ez:tracking-normal ez:text-primary ez:tabular-nums">
          {count}
        </span>
      ) : null}
    </NextLink>
  );
}

function Logo({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  return (
    <NextLink href="/" className={cn("ez:block ez:min-w-0 ez:text-site-logo ez:text-fg ez:no-underline", wordmark(name))}>
      <SiteLogo name={name} src={logoUrl} />
    </NextLink>
  );
}

export function SiteHeader({
  name,
  logoUrl,
  cartCount,
  signedIn,
  variant,
  main = "shop",
  cta,
  categories,
}: {
  name: string;
  logoUrl?: string | null;
  cartCount?: number;
  signedIn?: boolean;
  variant?: HeaderVariant;
  main?: string;
  cta?: { label: string; href: string } | null;
  categories?: NavCategory[];
}) {
  const shop = main === "shop";
  const link = LINKS[main];
  const action = cta ?? CTA[main] ?? null;
  const nav = (
    <Suspense fallback={<NavLinks main={main} categories={categories} />}>
      <LiveNavLinks main={main} categories={categories} />
    </Suspense>
  );
  const actions = (
    <div className="ez:flex ez:items-center ez:justify-end ez:gap-1">
      {link && (
        <NextLink href={signedIn ? link.signed : link.guest} className="ez:mr-4 ez:text-site-small ez:text-fg ez:no-underline ez:hover:text-primary ez:max-md:hidden">
          {link.label}
        </NextLink>
      )}
      {shop && variant !== "center" && <IconLink href="/products?search=1" icon="search" label="검색" />}
      <IconLink href={signedIn ? "/me" : "/login"} icon="user" label={signedIn ? "내 정보" : "로그인"} />
      {shop && <IconLink href={signedIn ? "/me/likes" : "/login"} icon="heart" label="찜" />}
      {shop && <IconLink href="/cart" icon="bag" label="장바구니" count={cartCount} />}
      {action && (
        <ButtonLink href={action.href} size="sm" className="ez:ml-2 ez:max-md:hidden">
          {action.label}
        </ButtonLink>
      )}
    </div>
  );
  const Skin = shop && variant && variant in SHOP_DESIGNS ? SHOP_DESIGNS[variant as ShopSkin].Header : null;
  const row = "ez:mx-auto ez:grid ez:max-w-wrap ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-3 ez:px-page ez:py-2 ez:min-h-16 ez:lg:min-h-20";
  const split = variant === "dark" || variant === "band";
  const full = Skin ? (
    <Skin name={name} logoUrl={logoUrl} cartCount={cartCount} signedIn={signedIn} categories={categories ?? []} nav={shopNav(categories ?? [])} links={shopLinks(signedIn)} />
  ) : variant === "center" ? (
      <header data-slot="site-header" data-variant="center" className="ez:bg-surface">
        <div className={cn(row, "ez:lg:min-h-21 ez:lg:grid-cols-[minmax(max-content,1fr)_max-content_minmax(max-content,1fr)]")}>
          <NextLink
            href="/products?search=1"
            className="ez:flex ez:h-11 ez:w-full ez:max-w-75 ez:items-center ez:gap-2.5 ez:border-0 ez:border-b ez:border-solid ez:border-site-field ez:text-site-small ez:text-muted ez:no-underline ez:max-lg:hidden"
          >
            <Icon name="search" size="sm" />
            상품 검색
          </NextLink>
          <span className="ez:min-w-0 ez:lg:justify-self-center">
            <Logo name={name} logoUrl={logoUrl} />
          </span>
          {actions}
        </div>
        <nav aria-label="주요 메뉴" className="ez:flex ez:min-h-13 ez:items-end ez:justify-center ez:gap-11 ez:border-0 ez:border-y ez:border-solid ez:border-site-line ez:pb-1 ez:text-site-lead ez:max-lg:hidden">
          {nav}
        </nav>
      </header>
    ) : (
      <header data-slot="site-header" data-variant={variant === "transparent" ? "overlay" : split ? "split" : "site"} className="ez:bg-surface">
        <div className="ez:border-0 ez:border-b ez:border-solid ez:border-site-line">
          <div className={cn(row, split ? "ez:lg:grid-cols-[minmax(0,1fr)_max-content_minmax(max-content,1fr)]" : "ez:lg:grid-cols-[minmax(max-content,1fr)_minmax(0,max-content)_minmax(max-content,1fr)]")}>
            {split ? (
              <>
                <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:gap-9 ez:overflow-hidden ez:whitespace-nowrap ez:text-site-lead ez:max-lg:hidden">
                  {nav}
                </nav>
                <span className="ez:min-w-0 ez:max-lg:order-first ez:lg:justify-self-center">
                  <Logo name={name} logoUrl={logoUrl} />
                </span>
              </>
            ) : (
              <>
                <Logo name={name} logoUrl={logoUrl} />
                <nav aria-label="주요 메뉴" className="ez:flex ez:min-w-0 ez:justify-center ez:gap-6 ez:overflow-hidden ez:whitespace-nowrap ez:text-site-lead ez:max-lg:hidden ez:xl:gap-10">
                  {nav}
                </nav>
              </>
            )}
            {actions}
          </div>
        </div>
      </header>
    );
  const login = (
    <header data-slot="site-header" data-variant="login" className="ez:bg-surface">
      <div className="ez:mx-auto ez:flex ez:max-w-wrap ez:items-center ez:justify-between ez:gap-3 ez:px-page ez:py-2 ez:min-h-16 ez:lg:min-h-20">
        <Logo name={name} logoUrl={logoUrl} />
        <NextLink href="/" className="ez:inline-flex ez:items-center ez:gap-2 ez:text-site-small ez:text-fg ez:no-underline ez:hover:text-primary">
          닫기
          <Icon name="x" size="sm" />
        </NextLink>
      </div>
    </header>
  );
  if (!shop) return <PathSwitch prefix="/login" match={login} rest={full} />;
  const compact = (
    <header data-slot="site-header" data-variant="checkout" className="ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:bg-surface">
      <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-3 ez:px-page ez:py-2 ez:min-h-16 ez:lg:min-h-20 ez:md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] ez:lg:grid-cols-[minmax(max-content,1fr)_auto_minmax(max-content,1fr)]">
        <Logo name={name} logoUrl={logoUrl} />
        <CheckoutSteps className="ez:justify-center ez:max-md:hidden" />
        <NextLink href="/cart" className="ez:inline-flex ez:items-center ez:justify-self-end ez:gap-2 ez:text-site-small ez:text-fg ez:no-underline ez:hover:text-primary">
          <Icon name="left" size="sm" />
          장바구니
        </NextLink>
      </div>
    </header>
  );
  return <PathSwitch prefix="/login" match={login} rest={<PathSwitch prefix="/checkout" match={compact} rest={full} />} />;
}
