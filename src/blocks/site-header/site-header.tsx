import NextLink from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "../../components/button";
import { Icon, type IconName } from "../../components/icon";
import type { HeaderVariant } from "../../templates/types";
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
        <span className="ez:absolute ez:top-1.5 ez:right-0.5 ez:flex ez:h-4 ez:min-w-4 ez:items-center ez:justify-center ez:rounded-full ez:bg-point-soft ez:px-1 ez:text-[11px] ez:font-semibold ez:leading-none ez:tracking-normal ez:text-primary ez:tabular-nums">
          {count}
        </span>
      ) : null}
    </NextLink>
  );
}

function Logo({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  return (
    <NextLink href="/" className={cn("ez:min-w-0 ez:truncate ez:text-[2rem] ez:leading-none ez:text-fg ez:no-underline", wordmark(name))}>
      <SiteLogo name={name} src={logoUrl} />
    </NextLink>
  );
}

export function SiteHeader({
  name,
  logoUrl,
  cartCount,
  signedIn,
  main = "shop",
  cta,
  notice,
  categories,
}: {
  name: string;
  logoUrl?: string | null;
  cartCount?: number;
  signedIn?: boolean;
  variant?: HeaderVariant;
  main?: string;
  actions?: string[];
  cta?: { label: string; href: string } | null;
  notice?: string | null;
  categories?: NavCategory[];
}) {
  const shop = main === "shop";
  const link = LINKS[main];
  const action = cta ?? CTA[main] ?? null;
  const full = (
    <header data-slot="site-header" data-variant="site" className="ez:bg-surface">
      {notice && (
        <p
          data-slot="notice-bar"
          className="ez:m-0 ez:flex ez:min-h-9.5 ez:items-center ez:justify-center ez:gap-2 ez:bg-surface-alt ez:px-page ez:text-site-small ez:text-fg"
        >
          <Icon name="truck" size="sm" />
          {notice}
        </p>
      )}
      <div className="ez:border-0 ez:border-b ez:border-solid ez:border-site-line">
        <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:grid-cols-[1fr_auto] ez:items-center ez:gap-3 ez:px-page ez:min-h-16 ez:lg:min-h-20 ez:lg:grid-cols-[minmax(0,260px)_1fr_minmax(0,260px)]">
          <Logo name={name} logoUrl={logoUrl} />
          <nav aria-label="주요 메뉴" className="ez:flex ez:justify-center ez:gap-10 ez:text-site-lead ez:max-lg:hidden">
            <Suspense fallback={<NavLinks main={main} categories={categories} />}>
              <LiveNavLinks main={main} categories={categories} />
            </Suspense>
          </nav>
          <div className="ez:flex ez:items-center ez:justify-end ez:gap-1">
            {link && (
              <NextLink href={signedIn ? link.signed : link.guest} className="ez:mr-4 ez:text-site-small ez:text-fg ez:no-underline ez:hover:text-primary ez:max-md:hidden">
                {link.label}
              </NextLink>
            )}
            {shop && <IconLink href="/products?search=1" icon="search" label="검색" />}
            <IconLink href={signedIn ? "/me" : "/login"} icon="user" label={signedIn ? "내 정보" : "로그인"} />
            {shop && <IconLink href={signedIn ? "/me/likes" : "/login"} icon="heart" label="찜" />}
            {shop && <IconLink href="/cart" icon="bag" label="장바구니" count={cartCount} />}
            {action && (
              <ButtonLink href={action.href} size="sm" className="ez:ml-2 ez:max-md:hidden">
                {action.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
  if (!shop) return full;
  const compact = (
    <header data-slot="site-header" data-variant="checkout" className="ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:bg-surface">
      <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:grid-cols-[1fr_auto] ez:items-center ez:gap-3 ez:px-page ez:min-h-16 ez:lg:min-h-20 ez:md:grid-cols-[minmax(0,260px)_1fr_minmax(0,260px)]">
        <Logo name={name} logoUrl={logoUrl} />
        <CheckoutSteps className="ez:justify-center ez:max-md:hidden" />
        <NextLink href="/cart" className="ez:inline-flex ez:items-center ez:justify-self-end ez:gap-2 ez:text-site-small ez:text-fg ez:no-underline ez:hover:text-primary">
          <Icon name="left" size="sm" />
          장바구니
        </NextLink>
      </div>
    </header>
  );
  return <PathSwitch prefix="/checkout" match={compact} rest={full} />;
}
