import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BuyBox, DetailDoc, DetailLayout, liftDetail, ProductGallery, resolveTemplate, ReviewList, type DetailBlock, type DetailLayer, type ProductDetail } from "../src";

const text = (id: string, value: string, style?: DetailLayer["style"]): DetailLayer => ({ id, type: "text", text: value, style });
const intro: DetailBlock = { id: "b1", layout: "text", layers: [text("t1", "흰 접시"), text("t2", "매일 쓰는 접시")] };
const table: DetailBlock = { id: "b2", layout: "table", layers: [text("k0", "소재"), text("v0", "도자기"), text("k1", "크기"), text("v1", "지름 21cm")] };
const note: DetailBlock = { id: "b3", layout: "text", layers: [text("n1", "관리 방법"), text("n2", "중성 세제로 씻어 주세요")] };

describe("상세 첫 덩어리 올리기", () => {
  it("글 다음 표이면 설명 · 사양 줄을 올리고 본문에서 뺀다", () => {
    const lift = liftDetail({ blocks: [intro, table, note] })!;
    expect(lift.lead).toEqual(["흰 접시", "매일 쓰는 접시"]);
    expect(lift.rows).toEqual([
      { label: "소재", value: "도자기" },
      { label: "크기", value: "지름 21cm" },
    ]);
    expect(lift.doc.blocks?.map((b) => b.id)).toEqual(["b3"]);
  });

  it("첫 블록이 글이 아니거나 표가 없거나 값이 빈 줄이 있으면 올리지 않는다", () => {
    const image: DetailBlock = { id: "i", layout: "image", layers: [{ id: "p", type: "image", url: "x.jpg" }] };
    expect(liftDetail({ blocks: [image, intro, table] })).toBeNull();
    expect(liftDetail({ blocks: [intro, note] })).toBeNull();
    expect(liftDetail({ blocks: [intro, { ...table, layers: [text("k0", "소재"), text("v0", "")] }] })).toBeNull();
    expect(liftDetail({ blocks: [] })).toBeNull();
    expect(liftDetail(null)).toBeNull();
  });
});

describe("상세 본문 2열", () => {
  it("짧은 첫 줄은 제목 열, 나머지는 내용 열에 판매자 글자 값 그대로", () => {
    const root = render(<DetailDoc doc={{ blocks: [{ ...note, layers: [text("n1", "관리 방법", { size: 3, align: "center" }), text("n2", "중성 세제로 씻어 주세요", { size: 3 })] }] }} split />).container;
    const head = root.querySelector('[data-slot="detail-split-head"]')!;
    expect(head).toHaveTextContent("관리 방법");
    expect((head as HTMLElement).style.textAlign).toBe("center");
    expect(head.nextElementSibling).toHaveTextContent("중성 세제로 씻어 주세요");
    expect(root.querySelector("section")!.className).not.toContain("ez:max-w-180");
  });

  it("한 줄뿐인 글은 제목 없이 내용 열, 그림 블록은 내용 열 폭 안", () => {
    const root = render(
      <DetailDoc doc={{ blocks: [{ id: "a", layout: "text", layers: [text("x", "본문 한 줄")] }, { id: "i", layout: "image", layers: [{ id: "p", type: "image", url: "x.jpg" }] }] }} split />,
    ).container;
    expect(root.querySelector('[data-slot="detail-split-head"]')).toBeNull();
    expect(root.querySelector('[data-layout="image"]')!.className).toContain("ez:max-w-180");
  });

  it("split 없이는 한 열, 담긴 열의 전폭", () => {
    const root = render(<DetailDoc doc={{ blocks: [note] }} />).container;
    expect(root.querySelector("section")!.className).not.toContain("ez:max-w-180");
    expect(root.querySelector('[data-slot="detail-split"]')).toBeNull();
  });

  it("표 줄은 정보 줄 틀(32% · 13px 흐림 → 15px · site-line), 셀 정렬 · 굵기는 판매자 값", () => {
    const root = render(<DetailDoc doc={{ blocks: [{ id: "t", layout: "table", layers: [text("k", "침대", { size: 2, color: "#999999" }), text("v", "퀸 1개", { size: 3, weight: "bold", align: "right" })] }] }} />).container;
    const row = root.querySelector<HTMLElement>("[data-row]")!;
    expect(row.className).toContain("ez:grid-cols-[32%_minmax(0,1fr)]");
    expect(row.className).toContain("ez:border-site-line");
    expect(row.style.borderTop).toBe("");
    const [label, value] = [...row.querySelectorAll("p")];
    expect(label.className).toContain("ez:text-site-small");
    expect(label.style.color).toBe("");
    expect(value.className).toContain("ez:text-site-body");
    expect(value.style.textAlign).toBe("right");
    expect(value.style.fontWeight).toBe("700");
    expect(value.style.fontSize).toBe("");
  });
});

describe("사진 묶음", () => {
  it("사진 1장이면 썸네일 줄 · 장수 없이 큰 사진이 두 열을 차지", () => {
    const root = render(<ProductGallery images={["/a.jpg"]} name="머그" />).container;
    expect(screen.queryByRole("group")).toBeNull();
    expect(root.querySelector('[data-slot="gallery-count"]')).toBeNull();
    expect(root.querySelector('[data-slot="product-gallery"] > div')!.className).toContain("ez:lg:col-span-2");
  });

  it("여러 장이면 고른 사진에만 안쪽 선, 장수는 묶음 아래 한 줄", async () => {
    const root = render(<ProductGallery images={["/a.jpg", "/b.jpg", "/c.jpg"]} name="머그" />).container;
    expect(root.querySelector('[data-slot="gallery-count"]')).toHaveTextContent("1 / 3");
    await userEvent.click(screen.getByRole("button", { name: "사진 2" }));
    expect(root.querySelector('[data-slot="gallery-count"]')).toHaveTextContent("2 / 3");
    const picks = root.querySelectorAll('[data-slot="gallery-pick"]');
    expect(picks).toHaveLength(1);
    expect(picks[0].closest("button")).toHaveAttribute("aria-label", "사진 2");
    expect(picks[0].className).toContain("ez:rounded-lg");
  });
});

it("구매 열 설명은 첫 줄 잉크, 다음 줄 흐림", () => {
  const product = { id: "p", name: "흰 접시", list_price: 15000, sale_price: 15000, variants: [{ id: "v", label: null, price: 15000, in_stock: true, arrivals: 0 }] } as unknown as ProductDetail;
  const root = render(<BuyBox product={product} lead={["흰 접시", "매일 쓰는 접시"]} addAction={async () => ({})} />).container;
  const lines = [...root.querySelectorAll('[data-slot="buy-lead"] p')];
  expect(lines.map((p) => p.textContent)).toEqual(["흰 접시", "매일 쓰는 접시"]);
  expect(lines[0].className).not.toContain("ez:text-muted");
  expect(lines[1].className).toContain("ez:text-muted");
});

it("리뷰 점수 분포는 0건 줄을 그리지 않는다", () => {
  const root = render(<ReviewList count={1} average={5} items={[{ id: "r", rating: 5, body: "좋아요", created_at: "2026-11-01T00:00:00Z" }]} />).container;
  expect([...root.querySelectorAll("dl dt")].map((d) => d.textContent)).toEqual(["5점"]);
});

describe("사례 정보 열", () => {
  const draw = (body?: string) =>
    render(<DetailLayout slots={[{ kind: "case_info", side: true }]} data={{ title: "캔들 룩북", rows: [{ label: "분류", value: "연출 컷" }], body }} />).container;

  it("본문은 사실 줄 다음, 견적 단추 앞", () => {
    const info = draw("꼼꼼하게 마무리했어요.").querySelector('[data-slot="case-info"]')!;
    const kids = [...info.children].map((k) => k.tagName.toLowerCase());
    expect(kids).toEqual(["h1", "table", "p", "a"]);
    expect(info.querySelectorAll('[data-slot="button"]')).toHaveLength(1);
  });

  it("본문이 없으면 빈 문단 없이 단추", () => {
    const info = draw().querySelector('[data-slot="case-info"]')!;
    expect(info.querySelector("p")).toBeNull();
  });
});

it("쇼핑몰 c 는 고시 · 배송 펼침을 구매 열에, 상세 탭과 문의 자리를 아래에", () => {
  const detail = resolveTemplate("shop", "c").detail;
  expect(detail.find((s) => s.kind === "info")).toMatchObject({ variant: "accordion", side: true });
  expect(detail.find((s) => s.kind === "body")).toMatchObject({ variant: "tabs", full: true });
  expect(detail.find((s) => s.kind === "reviews")).toMatchObject({ full: true });
});
