import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { classCards } from "../src/__stories__/fixtures/templates";
import products from "../src/__stories__/fixtures/products.json";
import { DetailLayout, resolveTemplate, SiteFooter, SiteRenderer } from "../src/index";
import { roomView } from "../src/sections/stay";
import type { ProductSummary } from "../src/types";

const policies = [
  { key: "returns", title: "교환 · 반품 안내" },
  { key: "terms", title: "이용약관" },
  { key: "privacy", title: "개인정보처리방침" },
];
const business = { name: "오후의 식탁", ceo_name: "이수연", address: "서울 마포구 성미산로 17길 24", registration_no: "105-20-58144", mail_order_no: "2026-서울마포-0412", cs_phone: "02-123-4567", cs_email: "hello@ohu-table.kr" };
const context = { products: [], categories: [], faqs: [], shipping: null, storeName: "흙손 도예공방" };
const items = products as unknown as ProductSummary[];

function home(main: "shop" | "stay" | "class", letter: "a" | "b" | "c", sections: { kind: string; data: Record<string, unknown> }[], extra: Record<string, unknown> = {}) {
  return render(<SiteRenderer page={{ sections: sections.map((s) => ({ ...s, v: 1 })), arranged: true }} context={{ ...context, ...extra }} template={resolveTemplate(main, letter)} />).container;
}

describe("바닥글 사업자 정보", () => {
  for (const main of ["shop", "stay", "class"] as const) {
    for (const skin of [undefined, ...(["a", "b", "c"] as const).map((l) => resolveTemplate(main, l).skin)]) {
      it(`${main} ${skin ?? "기본"}: 번호가 줄 사이에서 갈리지 않는다`, () => {
        const foot = render(<SiteFooter storeName="오후의 식탁" business={business as never} hosting="자사닷" policies={policies} main={main} skin={skin} />).container;
        for (const text of ["고객센터 02-123-4567", "사업자등록번호 105-20-58144", "통신판매업 신고 2026-서울마포-0412"]) {
          const kept = [...foot.querySelectorAll(".ez\\:whitespace-nowrap")].find((el) => el.textContent === text);
          expect(kept, text).toBeDefined();
        }
        expect(foot.textContent).toContain("서울 마포구 성미산로 17길 24 · 사업자등록번호 105-20-58144");
      });
    }
  }
});

describe("모바일 2열 격자의 외톨이 칸", () => {
  it("쇼핑몰 a: 베스트 3개는 셋째가 모바일에서 숨고, 분류 3개는 가로로 넘긴다", () => {
    const categories = [1, 2, 3].map((n) => ({ id: `c${n}`, name: `분류 ${n}`, cover_url: null, product_count: 2 }));
    const root = home("shop", "a", [{ kind: "category_tiles", data: {} }, { kind: "best_grid", data: { items: items.slice(0, 3) } }], { categories });
    const best = root.querySelector('[data-slot="best-grid"]')!;
    const cells = [...best.querySelectorAll('[data-slot="product-card"]')].map((card) => card.parentElement!.className);
    expect(cells.map((c) => c.includes("ez:max-md:hidden"))).toEqual([false, false, true]);
    const tiles = root.querySelector('[data-slot="category-tiles"]')!;
    expect(tiles.querySelector(".ez\\:max-md\\:overflow-x-auto")).not.toBeNull();
    expect(tiles.querySelectorAll(".ez\\:max-md\\:hidden")).toHaveLength(0);
  });

  it("클래스 a · c: 클래스 3개는 셋째가 모바일에서 숨는다", () => {
    for (const letter of ["a", "c"] as const) {
      const root = home("class", letter, [{ kind: "class_list", data: { classes: classCards.slice(0, 3) } }]);
      const list = root.querySelector('[data-slot="class-list"]')!;
      expect(list.querySelectorAll(".ez\\:max-md\\:hidden"), letter).toHaveLength(1);
    }
  });

  it("짝수 개면 숨기지 않는다", () => {
    const root = home("shop", "a", [{ kind: "product_grid", data: {} }], { products: items.slice(0, 4) });
    expect(root.querySelectorAll(".ez\\:max-md\\:hidden, .ez\\:max-lg\\:hidden")).toHaveLength(0);
  });
});

describe("쇼핑몰 a 카드 안 간격", () => {
  it("품절 · 예시가 없는 줄에는 표시 줄 자리를 두지 않는다", () => {
    const plain = home("shop", "a", [{ kind: "product_grid", data: {} }], { products: items.slice(0, 4).map((p) => ({ ...p, sold_out: false, sample: false })) });
    expect(plain.querySelector('[data-slot="product-card"] .ez\\:h-4')).toBeNull();
    const marked = home("shop", "a", [{ kind: "product_grid", data: {} }], { products: items.slice(0, 4).map((p, i) => ({ ...p, sold_out: false, sample: i === 0 })) });
    expect(marked.querySelectorAll('[data-slot="product-card"] .ez\\:h-4')).toHaveLength(4);
  });
});

describe("숙박 a 표 · 간격", () => {
  const rows = [
    { label: "이용일 7일 전까지", value: "100% 환불" },
    { label: "노쇼 · 이용 시작 후", value: "0% 환불" },
  ];

  it("취소 · 환불 표: 머리칸 너비를 프레임 공용 규칙(32%)에 맡기지 않고 칸 선을 따로 긋지 않는다", () => {
    const root = home("stay", "a", [{ kind: "house_rules", data: { check_in: "15:00", check_out: "11:00", rules: ["전 객실 금연"], cancel: { rows } } }]);
    const table = root.querySelector('[data-slot="house-rules"] table')!;
    for (const th of table.querySelectorAll("th")) expect(th.className).toContain("ez:w-auto");
    for (const cell of table.querySelectorAll("th, td")) expect(cell.className).toContain("ez:border-0");
  });

  it("편의시설 목록이 제목과 띄워진다", () => {
    const root = home("stay", "a", [{ kind: "amenities", data: { items: [{ name: "무선 인터넷" }, { name: "주차" }] } }]);
    expect(root.querySelector('[data-slot="amenities"] ul')!.className).toContain("ez:mt-8");
  });

  it("추가 인원 요금은 이름과 금액이 붙어 있다", () => {
    const view = roomView({ id: "r1", name: "바다 앞 독채", extra_adult_fee: 20000, extra_child_fee: 10000 } as never);
    expect(view.extra).toBe("성인 20,000원 · 아동 10,000원");
  });
});

describe("상세 배치의 빈 자리", () => {
  it("null 로 넘긴 자리는 감싸는 칸도 그리지 않는다", () => {
    const root = render(
      <DetailLayout
        slots={[{ kind: "body", full: true }, { kind: "reviews", full: true }, { kind: "others", full: true }]}
        data={{}}
        nodes={{ body: <p>본문</p>, reviews: <p>후기</p>, others: null }}
      />,
    ).container;
    expect(root.querySelectorAll('[data-slot="detail-node"]')).toHaveLength(2);
  });

  it("구획 여백은 배치 간격과 겹치지 않는다", () => {
    const css = readFileSync(resolve("src/styles/legacy.css"), "utf8");
    expect(css).toContain('[data-slot="detail-node"] > .ez-section:first-child');
    expect(css).toContain('[data-slot="detail-node"] > .ez-section:last-child');
  });
});

describe("클래스 a 스튜디오", () => {
  const band = { image: "/sample/p3.jpg", images: ["/sample/p3.jpg"] };

  it("스토어 소개가 있으면 그린다", () => {
    const root = home("class", "a", [{ kind: "photo_band", data: { ...band, body: "흙을 만지는 시간" } }]);
    expect(root.querySelector('[data-slot="studio-intro"]')).toHaveTextContent("흙을 만지는 시간");
  });

  it("소개가 없으면 빈 틀 막대", () => {
    const root = home("class", "a", [{ kind: "photo_band", data: band }]);
    expect(root.querySelector('[data-slot="studio-intro"]')).toBeNull();
    expect(root.querySelector('[data-slot="photo-band"] [data-slot="blank-bar"]')).not.toBeNull();
  });
});
