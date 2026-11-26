import NextLink from "next/link";
import type { Business } from "../../types";
import { ButtonLink } from "../../components/button";
import { cn } from "../../utils/cn";
import { footerMark } from "../../utils/styles";
import { SHOP_DESIGNS, shopFooter } from "../../sections/shop";
import { legalLine } from "../../sections/shop/shared";
import { STAY_DESIGNS, stayFooter } from "../../sections/stay";
import { CLASS_DESIGNS, classFooter } from "../../sections/class";
import { QUOTE_DESIGNS, quoteFooter } from "../../sections/quote";
import { LANDINGS, landingDesign, landingFooter, landingLinks, type StoreLinks } from "../../sections/landing";
import { bySkin } from "../../templates/skin";
import type { ShopSkin } from "../../templates/types";
import { PathSwitch } from "../site-header/path-switch";
import { scriptOf } from "../../utils/writing";

const link = "ez:text-fg ez:no-underline ez:hover:text-primary";

const GUIDE: Record<string, { title: string; returns: string; account: [string, string][]; lookup: [string, string] }> = {
  shop: { title: "쇼핑 안내", returns: "교환 · 반품", account: [["주문 내역", "/orders"], ["찜", "/me/likes"]], lookup: ["비회원 주문 조회", "/orders/lookup"] },
  stay: { title: "예약 안내", returns: "취소 · 환불 규정", account: [["예약 내역", "/orders"]], lookup: ["예약 조회", "/orders/lookup"] },
  class: { title: "수강 안내", returns: "예약 변경 · 취소", account: [["예약 내역", "/orders"]], lookup: ["예약 조회", "/orders/lookup"] },
  quote: { title: "의뢰 안내", returns: "취소 · 환불 규정", account: [["견적 내역", "/quote/lookup"]], lookup: ["견적 조회", "/quote/lookup"] },
};

const LEGAL = new Set(["terms", "privacy"]);

export function SiteFooter({
  storeName,
  business,
  hosting,
  policies,
  hours,
  policyHref = (key) => `/policy/${key}`,
  main = "shop",
  skin,
  sections,
  address,
  links,
}: {
  storeName: string;
  business: Business | null;
  hosting: string;
  policies: { key: string; title: string }[];
  hours?: string | null;
  policyHref?: (key: string) => string;
  main?: string;
  skin?: ShopSkin;
  sections?: string[] | null;
  address?: string | null;
  links?: StoreLinks | null;
}) {
  const Skin = main === "shop" ? bySkin(SHOP_DESIGNS, skin)?.Footer : undefined;
  const StaySkin = main === "stay" ? bySkin(STAY_DESIGNS, skin)?.Footer : undefined;
  const ClassSkin = main === "class" ? bySkin(CLASS_DESIGNS, skin)?.Footer : undefined;
  const QuoteSkin = main === "quote" ? bySkin(QUOTE_DESIGNS, skin)?.Footer : undefined;
  const LandingSkin = landingDesign(main, skin)?.Footer;
  const guide = GUIDE[main] ?? GUIDE.shop;
  const legal = legalLine(storeName, business, hosting);
  const columns: { title: string; items: [string, string, boolean?][] }[] = [
    { title: guide.title, items: policies.filter((p) => !LEGAL.has(p.key)).map((p) => [p.key === "returns" ? guide.returns : p.title, policyHref(p.key)]) },
    { title: "계정", items: [["로그인", "/login"], ...guide.account] },
    { title: "약관", items: policies.filter((p) => LEGAL.has(p.key)).map((p) => [p.title, policyHref(p.key), p.key === "privacy"]) },
  ];
  const line = (
    <footer data-slot="site-footer" data-variant="line" className="ez:border-0 ez:border-t ez:border-solid ez:border-site-line">
      <p data-script={scriptOf(legal)} className="ez:m-0 ez:mx-auto ez:max-w-wrap ez:px-page ez:py-10 ez:text-site-small ez:text-muted">{legal}</p>
    </footer>
  );
  const full = Skin ? (
    <Skin {...shopFooter({ storeName, business, hosting, policies, hours, policyHref })} />
  ) : StaySkin ? (
    <StaySkin {...stayFooter({ storeName, business, hosting, policies, hours, policyHref, kinds: sections })} />
  ) : ClassSkin ? (
    <ClassSkin {...classFooter({ storeName, business, hosting, policies, hours, policyHref, kinds: sections })} />
  ) : QuoteSkin ? (
    <QuoteSkin {...quoteFooter({ storeName, business, hosting, policies, hours, policyHref, kinds: sections })} />
  ) : LandingSkin ? (
    <LandingSkin {...landingFooter({ storeName, business, hosting, policies, hours, address, links: landingLinks(links), policyHref, nav: LANDINGS[main].nav(sections, skin) })} />
  ) : (
    <footer data-slot="site-footer" data-variant="full" className="ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:text-site-lead">
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-14 ez:pb-10 ez:lg:pt-18">
        <div className="ez:grid ez:gap-10 ez:md:grid-cols-[5fr_2fr_2fr_2fr] ez:md:gap-6">
          <div className="ez:flex ez:flex-col ez:gap-3.5">
            {business?.cs_phone && (
              <>
                <span className="ez:text-site-small ez:text-muted">고객센터</span>
                <a href={`tel:${business.cs_phone}`} className="ez:text-site-name ez:text-fg ez:no-underline">
                  {business.cs_phone}
                </a>
              </>
            )}
            {hours && <span data-script={scriptOf(hours)} className="ez:text-site-small ez:text-muted">{hours}</span>}
            <div className="ez:mt-2.5 ez:flex ez:flex-wrap ez:gap-2">
              <ButtonLink href="/inquiries/new" variant="outline" size="sm">
                1:1 문의
              </ButtonLink>
              <ButtonLink href={guide.lookup[1]} variant="outline" size="sm">
                {guide.lookup[0]}
              </ButtonLink>
            </div>
          </div>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title} className="ez:flex ez:flex-col ez:gap-3">
              <span data-script={scriptOf(c.title)} className="ez:mb-1 ez:text-site-small ez:text-muted">{c.title}</span>
              {c.items.map(([label, href, strong]) => (
                <NextLink key={href} href={href} className={cn(link, strong && "ez:font-medium")}>
                  {label}
                </NextLink>
              ))}
            </nav>
          ))}
        </div>
        <div className="ez:mt-14 ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-10 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-7 ez:lg:mt-18">
          <div className="ez:grid ez:max-w-180 ez:gap-2 ez:text-site-small ez:text-muted">
            <p className="ez:m-0">{legal}</p>
          </div>
          <span data-script={scriptOf(storeName)} aria-hidden="true" className={cn("ez:text-site-faint ez:max-md:hidden", footerMark(storeName))}>
            {storeName}
          </span>
        </div>
      </div>
    </footer>
  );
  if (main !== "shop") return <PathSwitch prefix="/login" match={null} rest={full} />;
  return <PathSwitch prefix="/login" match={null} rest={<PathSwitch prefix="/checkout" match={line} rest={full} />} />;
}
