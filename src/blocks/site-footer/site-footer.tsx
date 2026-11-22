import NextLink from "next/link";
import type { Business } from "../../types";
import { ButtonLink } from "../../components/button";
import { cn } from "../../utils/cn";
import { footerMark } from "../../utils/styles";
import { SHOP_DESIGNS, shopFooter } from "../../sections/shop";
import { STAY_DESIGNS, stayFooter } from "../../sections/stay";
import type { ShopSkin } from "../../templates/types";
import { PathSwitch } from "../site-header/path-switch";

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
}) {
  const Skin = main === "shop" && skin ? SHOP_DESIGNS[skin]?.Footer : undefined;
  const StaySkin = main === "stay" && skin ? STAY_DESIGNS[skin]?.Footer : undefined;
  const guide = GUIDE[main] ?? GUIDE.shop;
  const legal = [
    [business?.name || storeName, business?.ceo_name && `대표 ${business.ceo_name}`].filter(Boolean).join(" · "),
    business?.address,
    business?.registration_no && `사업자등록번호 ${business.registration_no}`,
    business?.mail_order_no && `통신판매업 신고 ${business.mail_order_no}`,
    business?.cs_phone && `고객센터 ${business.cs_phone}`,
    business?.cs_email && `이메일 ${business.cs_email}`,
    `호스팅 제공 ${hosting}`,
  ]
    .filter(Boolean)
    .join(" · ");
  const columns: { title: string; items: [string, string, boolean?][] }[] = [
    { title: guide.title, items: policies.filter((p) => !LEGAL.has(p.key)).map((p) => [p.key === "returns" ? guide.returns : p.title, policyHref(p.key)]) },
    { title: "계정", items: [["로그인", "/login"], ...guide.account] },
    { title: "약관", items: policies.filter((p) => LEGAL.has(p.key)).map((p) => [p.title, policyHref(p.key), p.key === "privacy"]) },
  ];
  const line = (
    <footer data-slot="site-footer" data-variant="line" className="ez:border-0 ez:border-t ez:border-solid ez:border-site-line">
      <p className="ez:m-0 ez:mx-auto ez:max-w-wrap ez:px-page ez:py-10 ez:text-site-small ez:text-muted">{legal}</p>
    </footer>
  );
  const full = Skin ? (
    <Skin {...shopFooter({ storeName, business, hosting, policies, hours, policyHref })} />
  ) : StaySkin ? (
    <StaySkin {...stayFooter({ storeName, business, hosting, policies, hours, policyHref, kinds: sections })} />
  ) : (
    <footer data-slot="site-footer" data-variant="full" className="ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:text-site-lead">
      <div className="ez:mx-auto ez:max-w-wrap ez:px-page ez:pt-14 ez:pb-10 ez:lg:pt-18">
        <div className="ez:grid ez:gap-10 ez:md:grid-cols-[5fr_2fr_2fr_2fr] ez:md:gap-6">
          <div className="ez:flex ez:flex-col ez:gap-3.5">
            {business?.cs_phone && (
              <>
                <span className="ez:text-site-small ez:text-muted">고객센터</span>
                <a href={`tel:${business.cs_phone}`} className="ez:text-site-name ez:tracking-[-0.035em] ez:text-fg ez:no-underline">
                  {business.cs_phone}
                </a>
              </>
            )}
            {hours && <span className="ez:text-site-small ez:text-muted">{hours}</span>}
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
              <span className="ez:mb-1 ez:text-site-small ez:text-muted">{c.title}</span>
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
          <span aria-hidden="true" className={cn("ez:text-site-faint ez:max-md:hidden", footerMark(storeName))}>
            {storeName}
          </span>
        </div>
      </div>
    </footer>
  );
  if (main !== "shop") return <PathSwitch prefix="/login" match={null} rest={full} />;
  return <PathSwitch prefix="/login" match={null} rest={<PathSwitch prefix="/checkout" match={line} rest={full} />} />;
}
