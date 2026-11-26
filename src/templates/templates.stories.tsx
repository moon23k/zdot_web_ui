import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { business, productDetail } from "../__stories__/fixtures/commerce";
import { CUTOUT_PNG } from "../__stories__/fixtures/cutout";
import products from "../__stories__/fixtures/products.json";
import { classCards, classSessions, detailData, homeSections, paletteDesign, placeInfo, placeStoreLinks, quoteCases, quoteStarter, stayAddOns, stayRooms, staySearched } from "../__stories__/fixtures/templates";
import { BuyBox } from "../blocks/buy-box";
import { ClassCatalog } from "../blocks/class-catalog";
import { CatalogView } from "../blocks/catalog-view";
import { ProductGrid } from "../blocks/product-grid";
import { QuoteCases } from "../blocks/quote-cases";
import { SiteFooter } from "../blocks/site-footer";
import { SiteHeader } from "../blocks/site-header";
import { StayRooms } from "../blocks/stay-rooms";
import { DetailLayout } from "../details";
import type { DetailData } from "../details/data";
import type { SiteContext } from "../renderer/registry";
import { SiteRenderer } from "../renderer/site-renderer";
import { Rows } from "../sections/kit";
import type { NightTheme } from "../theme/night";
import { ThemeRoot } from "../theme/theme-root";
import type { Design } from "../types";
import { isLanding } from "../sections/landing";
import { resolveTemplate } from "./index";
import type { TemplateMain } from "./types";

const meta: Meta = { title: "Templates", parameters: { layout: "fullscreen" } };
export default meta;

const context: SiteContext = {
  products: products.slice(0, 8),
  categories: [
    { id: "c1", name: "과일청" },
    { id: "c2", name: "잼" },
    { id: "c3", name: "선물 세트" },
  ],
  faqs: [
    { id: "f1", question: "주문하면 언제 받나요?", answer: "오후 2시 전 주문은 당일 발송해요." },
    { id: "f2", question: "교환 · 반품은 어떻게 하나요?", answer: "받은 날부터 7일 안에 신청해 주세요." },
  ],
  shipping: { base_fee: 3000, free_threshold: 50000, return_fee: 3000, exchange_fee: 6000, return_days: 7 },
  storeName: "스토어 이름",
};

const policies = [
  { key: "returns", title: "교환·반품 안내" },
  { key: "terms", title: "이용약관" },
  { key: "privacy", title: "개인정보처리방침" },
];

const navCategories = [
  { id: "c1", name: "과일청" },
  { id: "c2", name: "잼" },
  { id: "c3", name: "선물 세트" },
];

function shopNodes(): { nodes: Record<string, React.ReactNode>; data: DetailData } {
  const notice = (
    <Rows
      rows={[
        { label: "식품의 유형", value: "과채가공품" },
        { label: "내용량", value: "500ml" },
        { label: "소비기한", value: "제조일로부터 6개월" },
        { label: "제조원", value: "스토어 이름" },
      ]}
    />
  );
  return {
    nodes: {
      buy: <BuyBox product={productDetail} addAction={async () => ({ ok: true })} />,
      body: <p className="ez:m-0 ez:leading-relaxed">제주 자몽을 껍질째 얇게 썰어 원당과 하루 재웠습니다.</p>,
      related: <ProductGrid products={context.products.slice(0, 4)} />,
    },
    data: {
      ...detailData.shop,
      reviews: detailData.class.reviews,
      info: [
        { title: "상품 정보 고시", node: notice },
        { title: "배송", node: <p className="ez:m-0 ez:text-muted">오후 2시 전 주문은 당일 발송 · 배송비 3,000원</p> },
        { title: "교환 · 반품", node: <p className="ez:m-0 ez:text-muted">받은 날부터 7일 안에 신청</p> },
        { title: "후기", node: <p className="ez:m-0 ez:text-muted">후기 128개</p> },
      ],
    },
  };
}

type Banner = string | { title: string; sub: string };

const coverContext: SiteContext = {
  ...context,
  categories: [
    { id: "c1", name: "과일청", product_count: 6, cover_url: "/sample/p1.jpg" },
    { id: "c2", name: "잼", product_count: 4, cover_url: "/sample/p2.jpg" },
    { id: "c3", name: "선물 세트", product_count: 2, cover_url: null },
  ],
};

function Page({ main, letter, banner, design, covers, night }: { main: TemplateMain; letter: string; banner?: Banner; design?: Design; covers?: boolean; night?: NightTheme }) {
  const t = resolveTemplate(main, letter);
  const hero = typeof banner === "string" ? { title: banner } : banner;
  const sections = homeSections[main]
    .map((s) => (hero && s.kind === "hero" ? { ...s, data: { ...s.data, ...hero } } : s))
    .map((s) => (covers && s.kind === "category_tiles" ? { ...s, data: {} } : s));
  const site = covers ? coverContext : context;
  const shop = main === "shop" ? shopNodes() : null;
  const data = shop?.data ?? detailData[main];
  return (
    <ThemeRoot design={design} template={t} night={night}>
      <div style={{ background: "var(--ezd-surface)", color: "var(--ezd-text)", fontFamily: "var(--ezd-font-body)" }}>
        <SiteHeader name="스토어 이름" variant={t.header} main={t.main === "shop" ? undefined : t.main} phone="02-000-0000" cartCount={2} categories={main === "shop" ? navCategories : undefined} cta={t.cta ? { label: t.cta, href: "/quote" } : null} links={isLanding(main) ? placeStoreLinks : undefined} address={isLanding(main) ? placeInfo.address : undefined} />
        <main className="ez:mx-auto ez:grid ez:w-full ez:max-w-wrap ez:gap-section ez:px-page ez:py-8">
          <SiteRenderer page={{ sections }} context={site} template={t} />
          <hr className="ez:my-4 ez:border-0 ez:border-t ez:border-solid ez:border-primary-border" />
          <DetailLayout slots={t.detail} data={data} nodes={shop?.nodes} />
        </main>
        <SiteFooter
          storeName="스토어 이름"
          business={business}
          hours="평일 10:00 – 17:00"
          hosting="자사닷"
          policies={policies}
          main={t.main}
          skin={t.skin}
          address={isLanding(main) ? placeInfo.address : undefined}
          links={isLanding(main) ? placeStoreLinks : undefined}
        />
      </div>
    </ThemeRoot>
  );
}

function ListPage({ letter, promo }: { letter: string; promo?: boolean }) {
  const t = resolveTemplate("shop", letter);
  return (
    <ThemeRoot template={t}>
      <div style={{ background: "var(--ezd-surface)", color: "var(--ezd-text)", fontFamily: "var(--ezd-font-body)" }}>
        <SiteHeader name="스토어 이름" variant={t.header} main="shop" cartCount={2} categories={navCategories} />
        <main className="ez:mx-auto ez:grid ez:w-full ez:max-w-wrap ez:px-page ez:py-8">
          <CatalogView
            skin={t.skin}
            title="전체 상품"
            count={products.length}
            crumbs={[
              { label: "홈", href: "/" },
              { label: "전체 상품", href: "/products" },
            ]}
            chips={[
              { label: "전체", href: "/products", on: true },
              { label: "과일청", href: "/products?category=c1", count: 4 },
              { label: "잼", href: "/products?category=c2", count: 2 },
              { label: "선물 세트", href: "/products?category=c3", count: 0 },
            ]}
            sorts={[
              { label: "신상품순", href: "/products", on: true },
              { label: "인기순", href: "/products?sort=popular" },
              { label: "낮은 가격순", href: "/products?sort=price_asc" },
              { label: "높은 가격순", href: "/products?sort=price_desc" },
            ]}
            products={products}
            more="/products?cursor=n24"
            promo={promo ? { title: "겨울 선물 모음", image: "/sample/hero.jpg", href: "/products?category=c3" } : null}
          />
        </main>
        <SiteFooter storeName="스토어 이름" business={business} hosting="자사닷" policies={policies} main="shop" skin={t.skin} />
      </div>
    </ThemeRoot>
  );
}

function StayListPage({ letter, searched }: { letter: string; searched?: boolean }) {
  const t = resolveTemplate("stay", letter);
  const rooms = searched ? staySearched : stayRooms;
  return (
    <ThemeRoot template={t}>
      <div style={{ background: "var(--ezd-surface)", color: "var(--ezd-text)", fontFamily: "var(--ezd-font-body)" }}>
        <SiteHeader name="스토어 이름" variant={t.header} main="stay" />
        <main className="ez:mx-auto ez:grid ez:w-full ez:max-w-wrap ez:px-page ez:py-8">
          <StayRooms
            skin={t.skin}
            title="객실"
            count={rooms.length}
            crumbs={[
              { label: "홈", href: "/" },
              { label: "객실", href: "/products" },
            ]}
            search={{ check_in: searched ? "2026-12-12" : null, check_out: searched ? "2026-12-13" : null, adults: 2, children: 0, max: 6 }}
            rooms={rooms}
            peak
            addOns={stayAddOns}
            photo="/sample/hero.jpg"
          />
        </main>
        <SiteFooter storeName="스토어 이름" business={business} hours="매일 10:00 – 20:00" hosting="자사닷" policies={policies} main="stay" skin={t.skin} />
      </div>
    </ThemeRoot>
  );
}

function ClassListPage({ letter, view = "classes", sample }: { letter: string; view?: "classes" | "schedule"; sample?: boolean }) {
  const t = resolveTemplate("class", letter);
  const classes = sample ? classCards.map((c) => ({ ...c, next: undefined, left: null, sample: true })) : classCards;
  return (
    <ThemeRoot template={t}>
      <div style={{ background: "var(--ezd-surface)", color: "var(--ezd-text)", fontFamily: "var(--ezd-font-body)" }}>
        <SiteHeader name="스토어 이름" variant={t.header} main="class" categories={[{ id: "k1", name: "원데이" }, { id: "k2", name: "정규반" }]} />
        <main className="ez:mx-auto ez:grid ez:w-full ez:max-w-wrap ez:px-page ez:py-8">
          <ClassCatalog
            skin={t.skin}
            view={view}
            title={view === "schedule" ? "일정" : "전체 클래스"}
            count={view === "schedule" ? classSessions.length : classCards.length}
            crumbs={[
              { label: "홈", href: "/" },
              { label: "전체 클래스", href: "/classes" },
            ]}
            tabs={[
              { label: "전체", href: "/classes", on: true, count: 3 },
              { label: "원데이", href: "/classes?category=k1", count: 2 },
              { label: "정규반", href: "/classes?category=k2", count: 1 },
              { label: "단체", href: "/classes?category=k3", count: 0 },
            ]}
            sorts={[
              { label: "가까운 일정순", href: "/classes", on: true },
              { label: "낮은 가격순", href: "/classes?sort=price_asc" },
            ]}
            classes={classes}
            sessions={classSessions}
            links={{ classes: "/classes", schedule: "/classes?view=schedule" }}
          />
        </main>
        <SiteFooter storeName="스토어 이름" business={business} hours="화 – 일 11:00 – 21:00" hosting="자사닷" policies={policies} main="class" skin={t.skin} />
      </div>
    </ThemeRoot>
  );
}

function QuoteListPage({ letter, category }: { letter: string; category?: string }) {
  const t = resolveTemplate("quote", letter);
  const names = [...new Set(quoteCases.map((c) => c.category ?? ""))];
  return (
    <ThemeRoot template={t}>
      <div style={{ background: "var(--ezd-surface)", color: "var(--ezd-text)", fontFamily: "var(--ezd-font-body)" }}>
        <SiteHeader name="스토어 이름" variant={t.header} main="quote" phone="02-000-0000" sections={t.home.map((slot) => slot.kind)} />
        <main className="ez:mx-auto ez:grid ez:w-full ez:max-w-wrap ez:px-page ez:py-8">
          <QuoteCases
            skin={t.skin}
            title="작업 사례"
            count={quoteCases.length}
            crumbs={[
              { label: "홈", href: "/" },
              { label: "작업 사례", href: "/cases" },
            ]}
            tabs={[
              { label: "전체", href: "/cases", count: quoteCases.length, on: !category },
              ...names.map((n) => ({ label: n, href: `/cases?category=${encodeURIComponent(n)}`, count: quoteCases.filter((c) => c.category === n).length, on: n === category })),
            ]}
            cases={quoteCases.filter((c) => !category || c.category === category)}
            rating={{ average: 4.9, count: 128 }}
            request={quoteStarter}
            storeName="스토어 이름"
          />
        </main>
        <SiteFooter storeName="스토어 이름" business={business} hours="평일 10:00 – 18:00" hosting="자사닷" policies={policies} main="quote" skin={t.skin} sections={t.home.map((slot) => slot.kind)} />
      </div>
    </ThemeRoot>
  );
}

function BlankPage({ main, letter }: { main: TemplateMain; letter: string }) {
  const t = resolveTemplate(main, letter);
  return (
    <ThemeRoot template={t}>
      <div style={{ background: "var(--ezd-surface)", color: "var(--ezd-text)", fontFamily: "var(--ezd-font-body)" }}>
        <SiteHeader name="스토어 이름" variant={t.header} main={t.main === "shop" ? undefined : t.main} phone="02-000-0000" cta={t.cta ? { label: t.cta, href: "/quote" } : null} />
        <main className="ez:mx-auto ez:grid ez:w-full ez:max-w-wrap ez:gap-section ez:px-page ez:py-8">
          <SiteRenderer page={{ sections: [] }} context={{ products: [], categories: [], faqs: [], shipping: null, storeName: "스토어 이름" }} template={t} />
        </main>
      </div>
    </ThemeRoot>
  );
}

const blank = (main: TemplateMain, letter: string, name: string): StoryObj => ({ name, render: () => <BlankPage main={main} letter={letter} /> });

const story = (main: TemplateMain, letter: string, name: string, banner?: Banner, design?: Design): StoryObj => ({
  name,
  render: () => <Page main={main} letter={letter} banner={banner} design={design} />,
});

export const S1 = story("shop", "a", "쇼핑몰 · S1 에디토리얼형");
export const S1Covers: StoryObj = { name: "쇼핑몰 · S1 분류 대표 사진", render: () => <Page main="shop" letter="a" covers /> };
export const S1Banner = story("shop", "a", "쇼핑몰 · S1 배너 제목", { title: "겨울 선물 모음", sub: "자몽청과 유자청을 한 상자에 담았어요" });
export const S2 = story("shop", "b", "쇼핑몰 · S2 카탈로그형");
export const S3 = story("shop", "c", "쇼핑몰 · S3 쇼룸형");
export const S3Palette = story("shop", "c", "쇼핑몰 · S3 브랜드 키트", { title: "겨울 선물 모음", sub: "자몽청과 유자청을 한 상자에 담았어요" }, paletteDesign);
export const S1List: StoryObj = { name: "쇼핑몰 · S1 상품 목록", render: () => <ListPage letter="a" /> };
export const S2List: StoryObj = { name: "쇼핑몰 · S2 상품 목록", render: () => <ListPage letter="b" /> };
export const S3List: StoryObj = { name: "쇼핑몰 · S3 상품 목록 · 홍보 칸", render: () => <ListPage letter="c" promo /> };
export const C1 = story("class", "a", "클래스 · C1 에디토리얼형");
export const C1Banner = story("class", "a", "클래스 · C1 배너 제목", { title: "겨울 정규반 모집", sub: "주 1회 · 4주 과정" });
export const C2 = story("class", "b", "클래스 · C2 카탈로그형", "겨울 정규반 모집");
export const C3 = story("class", "c", "클래스 · C3 쇼룸형");
export const C1List: StoryObj = { name: "클래스 · C1 클래스 목록", render: () => <ClassListPage letter="a" /> };
export const C2List: StoryObj = { name: "클래스 · C2 클래스 목록", render: () => <ClassListPage letter="b" /> };
export const C3List: StoryObj = { name: "클래스 · C3 클래스 목록", render: () => <ClassListPage letter="c" /> };
export const C1Sample: StoryObj = { name: "클래스 · C1 예시 수업", render: () => <ClassListPage letter="a" sample /> };
export const C2Sample: StoryObj = { name: "클래스 · C2 예시 수업", render: () => <ClassListPage letter="b" sample /> };
export const C3Sample: StoryObj = { name: "클래스 · C3 예시 수업", render: () => <ClassListPage letter="c" sample /> };
export const C2Schedule: StoryObj = { name: "클래스 · C2 일정 전체", render: () => <ClassListPage letter="b" view="schedule" /> };
export const T1 = story("stay", "a", "숙박 · T1 에디토리얼형");
export const T1Banner = story("stay", "a", "숙박 · T1 배너 제목", { title: "겨울 숲속 독채", sub: "계곡 옆 본채와 별채" });
export const T2 = story("stay", "b", "숙박 · T2 카탈로그형");
export const T3 = story("stay", "c", "숙박 · T3 쇼룸형");
export const T1List: StoryObj = { name: "숙박 · T1 객실 목록 · 날짜 선택", render: () => <StayListPage letter="a" searched /> };
export const T2List: StoryObj = { name: "숙박 · T2 객실 목록 · 날짜 선택", render: () => <StayListPage letter="b" searched /> };
export const T3List: StoryObj = { name: "숙박 · T3 객실 목록 · 날짜 선택", render: () => <StayListPage letter="c" searched /> };
export const T3ListPlain: StoryObj = { name: "숙박 · T3 객실 목록 · 날짜 없음", render: () => <StayListPage letter="c" /> };
export const RoomTerms: StoryObj = {
  name: "숙박 · 객실별 취소 규정",
  render: () => (
    <ThemeRoot>
      <SiteRenderer
        template={resolveTemplate("stay", "a")}
        context={context}
        page={{
          sections: [
            {
              kind: "house_rules",
              data: {
                cancel: {
                  groups: [
                    {
                      title: "바다 앞 독채",
                      rows: [
                        { label: "이용일 3일 전까지", value: "100% 환불" },
                        { label: "이용일 2일 전부터 당일까지", value: "0% 환불" },
                      ],
                    },
                    { title: "마당 있는 별채", rows: [{ label: "이용 시작 전까지", value: "100% 환불" }] },
                  ],
                },
              },
            },
          ],
        }}
      />
    </ThemeRoot>
  ),
};
export const Q1 = story("quote", "a", "견적 · Q1 사례형");
export const Q1Banner = story("quote", "a", "견적 · Q1 배너 제목", { title: "오래 머무는 집", sub: "실측부터 마감까지 한 팀이" });
export const Q3 = story("quote", "b", "견적 · Q3 가격 · 절차형");
export const Q4 = story("quote", "c", "견적 · Q4 리뷰형");
export const P1 = story("place", "a", "가게 · P1 브랜드형");
export const P1Banner = story("place", "a", "가게 · P1 배너 제목", { title: "스토어 이름", sub: "Lorem ipsum dolor sit amet" });
export const P2 = story("place", "b", "가게 · P2 방문형");
export const P3 = story("place", "c", "가게 · P3 이야기형");
export const K1 = story("care", "a", "예약형 매장 · K1 안내형");
export const K2 = story("care", "b", "예약형 매장 · K2 살롱형");
export const K3 = story("care", "c", "예약형 매장 · K3 스튜디오형");
export const W1 = story("portfolio", "a", "작업 소개 · W1 격자형");
export const W2 = story("portfolio", "b", "작업 소개 · W2 목록형");
export const W3 = story("portfolio", "c", "작업 소개 · W3 프로필형");
export const O1 = story("office", "a", "사무소 · O1 사례형");
export const O2 = story("office", "b", "사무소 · O2 선언형");
export const Q1List: StoryObj = { name: "견적 · Q1 작업 사례 목록", render: () => <QuoteListPage letter="a" /> };
export const Q3List: StoryObj = { name: "견적 · Q3 작업 사례 목록", render: () => <QuoteListPage letter="b" /> };
export const Q4List: StoryObj = { name: "견적 · Q4 작업 사례 목록 · 분류", render: () => <QuoteListPage letter="c" category="아파트" /> };

export const S1Blank = blank("shop", "a", "공란 · S1");
export const S2Blank = blank("shop", "b", "공란 · S2");
export const S3Blank = blank("shop", "c", "공란 · S3");
export const C1Blank = blank("class", "a", "공란 · C1");
export const C2Blank = blank("class", "b", "공란 · C2");
export const C3Blank = blank("class", "c", "공란 · C3");
export const T1Blank = blank("stay", "a", "공란 · T1");
export const T2Blank = blank("stay", "b", "공란 · T2");
export const T3Blank = blank("stay", "c", "공란 · T3");
export const Q1Blank = blank("quote", "a", "공란 · Q1");
export const Q3Blank = blank("quote", "b", "공란 · Q3");
export const Q4Blank = blank("quote", "c", "공란 · Q4");
export const P1Blank = blank("place", "a", "공란 · P1");
export const P2Blank = blank("place", "b", "공란 · P2");
export const P3Blank = blank("place", "c", "공란 · P3");
export const K1Blank = blank("care", "a", "공란 · K1");
export const K2Blank = blank("care", "b", "공란 · K2");
export const K3Blank = blank("care", "c", "공란 · K3");
export const W1Blank = blank("portfolio", "a", "공란 · W1");
export const W2Blank = blank("portfolio", "b", "공란 · W2");
export const W3Blank = blank("portfolio", "c", "공란 · W3");
export const O1Blank = blank("office", "a", "공란 · O1");
export const O2Blank = blank("office", "b", "공란 · O2");
export const S4 = story("shop", "d", "쇼핑몰 · S4 오로라 글래스");
export const S5 = story("shop", "e", "쇼핑몰 · S5 나이트 글로우");
export const S6 = story("shop", "f", "쇼핑몰 · S6 오브젝트 스테이지");
export const S6Cutout: StoryObj = {
  name: "쇼핑몰 · S6 오브젝트 스테이지 · 누끼",
  render: () => {
    const t = resolveTemplate("shop", "f");
    const cut = context.products.slice(0, 4).map((p, i) => ({ ...p, cover_url: "/sample/p1.jpg", cover_cutout_url: i % 2 ? null : CUTOUT_PNG }));
    const sections = [
      { kind: "hero", data: { products: cut.slice(0, 2).map((p) => ({ id: p.id, name: p.name, list_price: p.list_price, sale_price: p.sale_price, cover_url: p.cover_url, cover_cutout_url: p.cover_cutout_url })) } },
      { kind: "product_grid", data: {} },
    ];
    return (
      <ThemeRoot template={t}>
        <div style={{ background: "var(--ezd-surface)", color: "var(--ezd-text)", fontFamily: "var(--ezd-font-body)" }}>
          <main className="ez:mx-auto ez:grid ez:w-full ez:max-w-wrap ez:gap-section ez:px-page ez:py-8">
            <SiteRenderer page={{ sections }} context={{ ...context, products: cut }} template={t} />
          </main>
        </div>
      </ThemeRoot>
    );
  },
};
export const C4 = story("class", "d", "클래스 · C4 오로라 글래스");
export const C5 = story("class", "e", "클래스 · C5 나이트 글로우");
export const T4 = story("stay", "d", "숙박 · T4 오로라 글래스");
export const T5 = story("stay", "e", "숙박 · T5 나이트 글로우");
export const Q5 = story("quote", "d", "전문 서비스 · Q5 오로라 글래스");
export const Q6 = story("quote", "e", "전문 서비스 · Q6 나이트 글로우");
export const P4 = story("place", "d", "가게 · P4 오로라 글래스");
export const P5 = story("place", "e", "가게 · P5 나이트 글로우");
export const K4 = story("care", "d", "예약형 매장 · K4 오로라 글래스");
export const K5 = story("care", "e", "예약형 매장 · K5 나이트 글로우");
export const W4 = story("portfolio", "d", "작업 소개 · W4 오로라 글래스");
export const W5 = story("portfolio", "e", "작업 소개 · W5 나이트 글로우");
export const O3 = story("office", "d", "사무소 · O3 오로라 글래스");
export const O4 = story("office", "e", "사무소 · O4 나이트 글로우");
export const S5Tokyo: StoryObj = { name: "쇼핑몰 · S5 나이트 글로우 · tokyo", render: () => <Page main="shop" letter="e" night="tokyo" /> };
export const T5Tokyo: StoryObj = { name: "숙박 · T5 나이트 글로우 · tokyo", render: () => <Page main="stay" letter="e" night="tokyo" /> };
export const S5Mocha: StoryObj = { name: "쇼핑몰 · S5 나이트 글로우 · mocha", render: () => <Page main="shop" letter="e" night="mocha" /> };
export const T5Mocha: StoryObj = { name: "숙박 · T5 나이트 글로우 · mocha", render: () => <Page main="stay" letter="e" night="mocha" /> };
export const S5Nord: StoryObj = { name: "쇼핑몰 · S5 나이트 글로우 · nord", render: () => <Page main="shop" letter="e" night="nord" /> };
export const T5Nord: StoryObj = { name: "숙박 · T5 나이트 글로우 · nord", render: () => <Page main="stay" letter="e" night="nord" /> };
export const S5Rose: StoryObj = { name: "쇼핑몰 · S5 나이트 글로우 · rose", render: () => <Page main="shop" letter="e" night="rose" /> };
export const T5Rose: StoryObj = { name: "숙박 · T5 나이트 글로우 · rose", render: () => <Page main="stay" letter="e" night="rose" /> };
