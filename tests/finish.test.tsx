import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { classCards } from "../src/__stories__/fixtures/templates";
import products from "../src/__stories__/fixtures/products.json";
import { STAR_PATH as STAR, StarRow } from "../src/components/star-row";
import { Calendar, type CalendarDate, DetailLayout, Fold, resolveTemplate, ReviewList, SiteFooter, SiteRenderer } from "../src/index";
import { businessRows } from "../src/sections/quote/shared";
import { roomView } from "../src/sections/stay";
import { registrationText } from "../src/utils/format";
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

describe("사업자등록번호 표기", () => {
  const digits = { ...business, registration_no: "1052058144" };
  for (const main of ["shop", "stay", "class", "quote"] as const) {
    it(`${main}: 숫자 10자리는 3-2-5 로 끊고 줄 사이에서 갈리지 않는다`, () => {
      const foot = render(<SiteFooter storeName="오후의 식탁" business={digits as never} hosting="자사닷" policies={policies} main={main} skin={resolveTemplate(main, "a").skin} />).container;
      expect(foot.textContent).toContain("105-20-58144");
      expect(foot.textContent).not.toContain("1052058144");
      if (main !== "quote") expect([...foot.querySelectorAll(".ez\\:whitespace-nowrap")].some((el) => el.textContent === "사업자등록번호 105-20-58144")).toBe(true);
    });
  }

  it("10자리 숫자가 아닌 값은 그대로", () => {
    expect(registrationText("105-20-58144")).toBe("105-20-58144");
    expect(registrationText("1052058144")).toBe("105-20-58144");
    expect(registrationText("10520581")).toBe("10520581");
    expect(businessRows("오후의 식탁", digits as never, "자사닷").find((r) => r.label === "사업자등록번호")?.value).toBe("105-20-58144");
  });
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

describe("숙박 갤러리 모바일 배치", () => {
  const pics = (n: number) => Array.from({ length: n }, (_, i) => `/sample/g${i}.jpg`);
  const gallery = (letter: "a" | "b", n: number) => home("stay", letter, [{ kind: "gallery", data: { images: pics(n) } }]).querySelector('[data-slot="gallery"]')!;

  it("a: 3장이면 첫 장이 모바일에서 2열 폭", () => {
    const shots = [...gallery("a", 3).querySelectorAll("img")].map((img) => img.closest("[class*='aspect']")!.className);
    expect(shots[0]).toContain("ez:col-span-2");
    expect(shots.slice(1).some((c) => c.includes("ez:col-span-2"))).toBe(false);
  });

  it("b: 홀수 장은 마지막을 2열 구간에서, 4장은 3열 구간에서 숨긴다", () => {
    const hidden = (n: number) => [...gallery("b", n).querySelectorAll("[class*='ez:w-1/2']")].map((el) => /(md:max-lg|max-md|max-lg):hidden/.exec(el.className)?.[0] ?? "");
    expect(hidden(2)).toEqual(["", ""]);
    expect(hidden(3)).toEqual(["", "", "max-md:hidden"]);
    expect(hidden(4)).toEqual(["", "", "", "md:max-lg:hidden"]);
    expect(hidden(5)).toEqual(["", "", "", "md:max-lg:hidden", "max-lg:hidden"]);
  });
});

describe("상세 펼침 줄", () => {
  it("후기 운영 기준도 펼침 줄과 같은 오른쪽 + 표시", () => {
    const root = render(<ReviewList count={1} average={4.7} items={[{ id: "r1", rating: 5, body: "좋아요", author: "김**", created_at: "2026-11-01T00:00:00Z" } as never]} notice={[{ title: "기준", body: "본문" }]} />).container;
    const fold = render(<Fold title="상품 정보 제공 고시">본문</Fold>).container;
    for (const summary of [root.querySelector("summary")!, fold.querySelector("summary")!]) {
      expect(summary.className).toContain("ez:list-none");
      expect(summary.className).toContain("ez:justify-between");
      expect(summary.querySelector('[aria-hidden="true"]')).toHaveTextContent("+");
    }
  });

  it("문의 목록 뒤 단추는 간격을 두고, 공용 펼침 규칙이 펼침 줄을 덮지 않는다", () => {
    const css = readFileSync(resolve("src/styles/legacy.css"), "utf8");
    expect(css).toContain('.ez-faq > div + [data-slot="button"]');
    expect(css).not.toMatch(/\.ez-faq (details|summary)/);
    expect(css).toMatch(/\.ez-line \{\n {2}border-bottom-color/);
  });
});

describe("별점의 소수 평점", () => {
  const stars = (rating: number) => [...render(<StarRow rating={rating} />).container.querySelectorAll("span[role=img] > svg")];

  it("4.7 은 다섯째 별을 70% 만 칠한다", () => {
    const row = stars(4.7);
    expect(row.slice(0, 4).every((s) => !s.classList.contains("ez:opacity-25") && s.querySelectorAll("path").length === 1)).toBe(true);
    expect(row[4].getAttribute("data-fill")).toBe("0.7");
    const [dim, full] = row[4].querySelectorAll("path");
    expect(dim.getAttribute("class")).toBe("ez:opacity-25");
    const clip = row[4].querySelector(`clipPath#${CSS.escape(full.getAttribute("clip-path")!.slice(5, -1))} rect`);
    expect(clip?.getAttribute("width")).toBe("15.28");
  });

  it("정수 평점은 꽉 찬 별과 25% 별 두 가지만 그린다", () => {
    for (const [rating, filled] of [[4, 4], [0, 0], [5, 5]] as const) {
      const row = stars(rating);
      expect(row.map((s) => s.outerHTML)).toEqual(
        [1, 2, 3, 4, 5].map(
          (n) => `<svg viewBox="0 0 24 24" aria-hidden="true" class="ez:size-3.25${n > filled ? " ez:opacity-25" : ""}"><path fill="currentColor" d="${STAR}"></path></svg>`,
        ),
      );
    }
  });

  it("범위를 넘는 평점은 0 · 5 로 묶는다", () => {
    expect(stars(-1).every((s) => s.classList.contains("ez:opacity-25"))).toBe(true);
    expect(stars(6).every((s) => !s.classList.contains("ez:opacity-25") && !s.hasAttribute("data-fill"))).toBe(true);
  });
});

describe("수업 달력의 표시", () => {
  const days: CalendarDate[] = [
    { date: "2026-11-02", disabled: true, outside: true },
    { date: "2026-11-03", disabled: true },
    { date: "2026-11-04" },
  ];
  const cell = (root: HTMLElement, day: number) => root.querySelector(`button[aria-label^="11월 ${day}일 "]`)!;

  it("수업 없는 날은 흐리게, 다 찬 날은 취소선, 열린 날은 점", () => {
    const root = render(<Calendar days={days} dots legend />).container;
    expect(cell(root, 2).className).not.toContain("ez:line-through");
    expect(cell(root, 2).hasAttribute("data-outside")).toBe(true);
    expect((cell(root, 2) as HTMLButtonElement).disabled).toBe(true);
    expect(cell(root, 3).className).toContain("ez:line-through");
    expect(cell(root, 3).className).not.toContain("ez:after:bg-primary");
    expect(cell(root, 4).className).toContain("ez:after:bg-primary");
    expect(cell(root, 4).className).not.toContain("ez:line-through");
  });

  const legendOf = (list: CalendarDate[]) => render(<Calendar days={list} dots legend />).container.querySelector("[data-slot=calendar-legend]");

  it("범례는 예약 가능 · 마감 두 줄을 실제 표시 모양으로", () => {
    const legend = legendOf(days)!;
    const rows = [...legend.querySelectorAll("li")];
    expect(rows.map((r) => r.textContent)).toEqual(["예약 가능", "3마감"]);
    expect(rows[0].querySelector("span")?.className).toContain("ez:bg-primary");
    const sample = rows[1].querySelector("span")!.className;
    for (const name of ["ez:line-through", "ez:text-site-off", "ez:text-site-note", "ez:tabular-nums"]) expect(sample).toContain(name);
    expect(legend.className).toContain("ez:text-site-caption");
  });

  it("마감 견본은 취소선 날 중 두 자리 날짜를 먼저 쓴다", () => {
    const legend = legendOf([...days, { date: "2026-11-12", disabled: true }])!;
    expect(legend.querySelectorAll("li")[1].textContent).toBe("12마감");
  });

  it("범례는 달력에 실제로 있는 상태만", () => {
    expect([...legendOf(days.filter((d) => d.date !== "2026-11-03"))!.querySelectorAll("li")].map((r) => r.textContent)).toEqual(["예약 가능"]);
    expect([...legendOf(days.filter((d) => d.date !== "2026-11-04"))!.querySelectorAll("li")].map((r) => r.textContent)).toEqual(["3마감"]);
    expect(legendOf([days[0]])).toBeNull();
  });

  it("범례를 켜지 않은 달력은 그대로", () => {
    const root = render(<Calendar days={days} dots />).container;
    expect(root.querySelector("[data-slot=calendar-legend]")).toBeNull();
    expect(root.querySelector("[data-slot=calendar]")!.children).toHaveLength(2);
  });
});
