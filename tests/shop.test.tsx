import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import products from "../src/__stories__/fixtures/products.json";
import { homeSections, paletteDesign } from "../src/__stories__/fixtures/templates";
import { applyTemplate, CatalogView, designVars, resolveTemplate, SiteFooter, SiteHeader, SiteRenderer } from "../src/index";

const letters = ["a", "b", "c"] as const;
const categories = [
  { id: "c1", name: "과일청", product_count: 4, cover_url: null },
  { id: "c2", name: "잼", product_count: 0, cover_url: null },
];
const shipping = { base_fee: 3000, free_threshold: 50000, return_fee: 3000, exchange_fee: 6000, return_days: 7 };
const policies = [
  { key: "returns", title: "교환·반품 안내" },
  { key: "terms", title: "이용약관" },
  { key: "privacy", title: "개인정보처리방침" },
];

function mainColored(root: Element): Element[] {
  return [...root.querySelectorAll("[class]")].filter((el) => !el.closest(".ez\\:invisible") && /(^|\s)ez:(?:[a-z-]+:)*(bg|text|border|fill|stroke)-primary(\/|\s|$)/.test(el.getAttribute("class") ?? ""));
}

function catalog(letter: (typeof letters)[number]) {
  return render(
    <CatalogView
      skin={resolveTemplate("shop", letter).skin}
      title="전체 상품"
      count={products.length}
      crumbs={[
        { label: "홈", href: "/" },
        { label: "전체 상품", href: "/products" },
      ]}
      chips={[
        { label: "전체", href: "/products", on: true },
        { label: "과일청", href: "/products?category=c1", count: 4 },
        { label: "잼", href: "/products?category=c2", count: 0 },
      ]}
      sorts={[
        { label: "신상품순", href: "/products", on: true },
        { label: "인기순", href: "/products?sort=popular" },
      ]}
      products={products}
      more="/products?cursor=n24"
    />,
  ).container;
}

describe.each(letters)("shop %s", (letter) => {
  const template = resolveTemplate("shop", letter);

  it("draws its own header, footer and list for the skin", () => {
    const head = render(<SiteHeader name="온기상점" variant={template.header} cartCount={2} categories={categories} />).container;
    expect(head.querySelector('[data-slot="site-header"]')).toHaveAttribute("data-variant", letter === "a" ? "float" : template.skin);
    expect(head.querySelector('a[href="/products?category=c1"]')).toHaveTextContent("과일청");
    expect(head.querySelector('a[aria-label="장바구니 2"]')).not.toBeNull();
    const foot = render(<SiteFooter storeName="온기상점" business={null} hosting="자사닷" policies={policies} skin={template.skin} />).container;
    expect(foot.querySelector('[data-slot="site-footer"]')).not.toHaveAttribute("data-variant", "full");
    for (const href of ["/login", "/orders", "/me/likes", "/policy/returns", "/policy/terms", "/policy/privacy"]) expect(foot.querySelector(`a[href="${href}"]`)).not.toBeNull();
  });

  it("moves between categories with text tabs, counts and no empty category", () => {
    const list = catalog(letter);
    const tabs = list.querySelector('nav[aria-label="카테고리"]') as HTMLElement;
    expect(tabs.querySelector('a[href="/products?category=c2"]')).toBeNull();
    expect(tabs.querySelector('a[href="/products?category=c1"]')).toHaveTextContent("과일청4");
    expect(tabs.querySelector('[aria-current="page"]')).toHaveTextContent("전체");
    expect(list.querySelector(".ez\\:rounded-full a, a.ez\\:rounded-full")).toBeNull();
    expect(list.querySelector('a[href="/products?cursor=n24"]')).toHaveTextContent("더 보기");
  });

  it("keeps the main colour to the cart dot and the picked check", () => {
    const head = render(<SiteHeader name="온기상점" variant={template.header} cartCount={2} categories={categories} />).container;
    expect(mainColored(head)).toHaveLength(1);
    const home = render(
      <SiteRenderer page={{ sections: homeSections.shop }} context={{ products, categories, faqs: [], shipping, storeName: "온기상점" }} template={template} />,
    ).container;
    expect(mainColored(home)).toHaveLength(0);
    expect(mainColored(catalog(letter))).toHaveLength(letter === "b" ? 1 : 0);
  });

  it("turns the kit faces off and keeps blank tiles neutral", () => {
    const design = applyTemplate(paletteDesign, template);
    expect(design.color?.accent).toBeUndefined();
    const vars = designVars(design, template.look);
    expect(vars["--ezd-foot"]).toBe("transparent");
    expect(vars["--ez-color-tile-2"]).toBe(design.color?.surface_alt);
    expect(vars["--ezd-section-gap"]).toBe(`${template.look.section}px`);
  });
});

describe("shop page edges", () => {
  it("drops the bottom gap when a full-width band closes the home", () => {
    expect(readFileSync("src/styles/legacy.css", "utf8")).toContain('.ez-root[data-skin] .ez-main:has([data-slot="site-renderer"] > [data-bleed]:last-child)');
  });

  it("keeps the editorial header readable when the hero has no photo", () => {
    const el = render(<SiteRenderer page={{ sections: [{ kind: "hero", data: {} }], arranged: true }} context={{ products: [], categories: [], faqs: [], shipping: null }} template={resolveTemplate("shop", "a")} />).container.querySelector('[data-slot="hero"]');
    expect(el).toHaveAttribute("data-variant", "plain");
    expect(el).toHaveAttribute("data-blank");
  });

  it("fills the review row with as many columns as reviews and keeps banner text off the photo", () => {
    const items = [1, 2, 3].map((i) => ({ rating: 5, body: `좋아요 ${i}`, name: `손님 ${i}` }));
    const b = resolveTemplate("shop", "b");
    const view = (sections: { kind: string; data: Record<string, unknown> }[]) =>
      render(<SiteRenderer page={{ sections, arranged: true }} context={{ products: [], categories: [], faqs: [], shipping: null }} template={b} />).container;
    const reviews = view([{ kind: "reviews", data: { items } }]).querySelector('[data-slot="reviews"] .ez\\:grid') as HTMLElement;
    expect(reviews.className).toContain("ez:md:grid-cols-3");
    const pair = ["p1", "p2"].map((id) => ({ id, name: id, sale_price: 1000, cover_url: `https://img.test/${id}.jpg` }));
    const hero = view([{ kind: "hero", data: { image: "https://img.test/a.jpg", title: "겨울 선물", products: pair } }]);
    for (const tile of hero.querySelectorAll('[data-slot="hero-product"]')) expect(tile.querySelector('[data-slot="photo"]')?.textContent).toBe("");
    expect(hero.querySelector("h1")?.closest('[data-slot="photo"]')).toBeNull();
  });

  it("cuts the b new row to fives without a lone cell, keeps one review per product and drops the a eyebrows", () => {
    const items = Array.from({ length: 12 }, (_, i) => ({ ...products[0], id: `p${i}`, name: `상품 ${i}` }));
    const view = (letter: "a" | "b", count: number, sections: { kind: string; data: Record<string, unknown> }[]) =>
      render(<SiteRenderer page={{ sections, arranged: true }} context={{ products: items.slice(0, count), categories: [], faqs: [], shipping: null }} template={resolveTemplate("shop", letter)} />).container;
    const cells = (count: number) => [...view("b", count, [{ kind: "product_grid", data: {} }]).querySelectorAll('[data-slot="product-grid"] [data-slot="product-card"]')].map((card) => card.parentElement?.className ?? "");
    expect(cells(6)).toHaveLength(5);
    expect(cells(6)[4]).toContain("ez:max-md:hidden");
    expect(cells(12)).toHaveLength(5);
    expect(cells(4)).toHaveLength(4);
    expect(cells(4)[3]).toContain("ez:md:max-lg:hidden");
    const best = [...view("b", 0, [{ kind: "best_grid", data: { items: items.slice(0, 7) } }]).querySelectorAll('[data-slot="best-grid"] [data-slot="product-card"]')];
    expect(best).toHaveLength(5);
    expect(best[4].parentElement?.className).toContain("ez:max-md:hidden");
    const capped = view("a", 4, [{ kind: "product_grid", data: { count: 3 } }]);
    expect(capped.querySelectorAll('[data-slot="product-grid"] [data-slot="product-card"]')).toHaveLength(3);
    const reviews = [
      { rating: 5, body: "가", name: "김", product: "p0" },
      { rating: 5, body: "나", name: "이", product: "p0" },
      { rating: 4, body: "다", name: "박", product: "p1" },
    ];
    const cards = view("b", 2, [{ kind: "reviews", data: { items: reviews } }]).querySelectorAll('[data-slot="reviews"] article');
    expect(cards).toHaveLength(2);
    expect(cards[0].querySelector('[data-slot="photo"]')).toBeNull();
    const c = render(<SiteRenderer page={{ sections: [{ kind: "best_grid", data: { items: items.slice(0, 2) } }], arranged: true }} context={{ products: [], categories: [], faqs: [], shipping: null }} template={resolveTemplate("shop", "c")} />).container;
    expect(c.querySelector('[data-slot="product-card"]')?.parentElement?.parentElement?.className).not.toContain("justify-center");
    const a = view("a", 4, [{ kind: "product_grid", data: {} }]);
    expect(a.querySelector('[data-slot="product-grid"] .ez\\:uppercase')).toBeNull();
  });

  it("turns the kit off on every redesigned template and keeps it without a template", () => {
    for (const main of ["shop", "class", "stay", "quote"] as const) for (const letter of ["a", "b", "c"]) expect(applyTemplate(paletteDesign, resolveTemplate(main, letter)).color?.accent).toBeUndefined();
    expect(applyTemplate(paletteDesign, null).color?.accent).toBe(paletteDesign.color?.accent);
  });
});
