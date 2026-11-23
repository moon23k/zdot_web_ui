import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import products from "../src/__stories__/fixtures/products.json";
import { homeSections } from "../src/__stories__/fixtures/templates";
import { CatalogView, resolveTemplate, SHELF_DEFAULTS, shelfOf, SiteRenderer, type ShelfSetting } from "../src/index";

const letters = ["a", "b", "c"] as const;

function catalog(letter: (typeof letters)[number], shelf?: ShelfSetting | null, promo = false) {
  return render(
    <CatalogView
      skin={resolveTemplate("shop", letter).skin}
      title="전체 상품"
      count={products.length}
      crumbs={[{ label: "홈", href: "/" }]}
      chips={[{ label: "전체", href: "/products", on: true }]}
      sorts={[{ label: "신상품순", href: "/products", on: true }]}
      products={products}
      promo={promo ? { title: "기획전", image: null, href: "/products" } : null}
      shelf={shelf}
    />,
  ).container;
}

function grid(root: Element): string[] {
  const card = root.querySelector('[data-slot="product-card"]');
  const cell = card?.parentElement?.getAttribute("class")?.includes("grid") ? card.parentElement : card?.parentElement?.parentElement;
  return (cell?.getAttribute("class") ?? "").split(/\s+/);
}

function photos(root: Element): string[] {
  return [...root.querySelectorAll('[data-slot="product-card"] img, [data-slot="product-card"] [data-slot="photo"]')].map((el) => el.closest("[class*='aspect-']")?.getAttribute("class") ?? "");
}

describe("shelfOf", () => {
  it("keeps the design value for every empty field", () => {
    expect(shelfOf("catalog", null)).toEqual(SHELF_DEFAULTS.catalog);
    expect(shelfOf("editorial", { cols_web: 5, ratio: null, show_discount: false })).toEqual({ ...SHELF_DEFAULTS.editorial, cols_web: 5, show_discount: false });
    expect(shelfOf(undefined, {})).toEqual(SHELF_DEFAULTS.editorial);
  });
});

describe.each(letters)("shop %s shelf", (letter) => {
  const skin = resolveTemplate("shop", letter).skin!;

  it("draws the same list with no setting and with the design values", () => {
    expect(catalog(letter, SHELF_DEFAULTS[skin]).innerHTML).toBe(catalog(letter).innerHTML);
    expect(catalog(letter, {}, true).innerHTML).toBe(catalog(letter, null, true).innerHTML);
  });

  it("sets columns for web and mobile", () => {
    const cols = grid(catalog(letter, { cols_web: 5, cols_mobile: 1 }));
    expect(cols).toEqual(expect.arrayContaining(["ez:grid-cols-1", "ez:lg:grid-cols-5"]));
    expect(cols).not.toContain("ez:grid-cols-2");
    expect(cols.includes("ez:md:grid-cols-3")).toBe(letter === "b");
  });

  it("keeps the banner inside a one-column list", () => {
    const banner = catalog(letter, { cols_mobile: 1 }, true).querySelector('a[href="/products"][class*="col-span"]');
    if (letter === "c") expect(banner?.getAttribute("class")).toContain("ez:col-span-1");
    else expect(banner).toBeNull();
  });

  it("sets the photo ratio", () => {
    const shots = photos(catalog(letter, { ratio: "3:4" }));
    expect(shots.length).toBeGreaterThan(0);
    for (const c of shots) expect(c).toContain("ez:aspect-[3/4]");
  });

  it("hides discount, list price and sold-out marks", () => {
    const shown = catalog(letter);
    expect(shown.textContent).toContain("10%");
    expect(shown.querySelector("s")).not.toBeNull();
    expect(shown.querySelector('[data-sold-out]')).toHaveTextContent("품절");
    const hidden = catalog(letter, { show_discount: false, show_list_price: false, show_sold_out: false });
    expect(hidden.textContent).not.toContain("10%");
    expect(hidden.querySelector("s")).toBeNull();
    expect(hidden.querySelector('[data-sold-out]')).toBeNull();
    expect(hidden.textContent).not.toContain("품절");
    expect(hidden.querySelector(".ez\\:opacity-45")).toBeNull();
  });

  it("applies the card settings to the home shelves", () => {
    const sections = homeSections.shop.map((s) => (s.kind === "best_grid" ? { ...s, data: { items: products } } : s));
    const home = render(
      <SiteRenderer page={{ sections }} context={{ products, categories: [], faqs: [], shipping: null, shelf: { ratio: "3:4", show_discount: false } }} template={resolveTemplate("shop", letter)} />,
    ).container;
    const shots = photos(home.querySelector('[data-slot="product-grid"]')!);
    expect(shots.length).toBeGreaterThan(0);
    for (const c of shots) expect(c).toContain("ez:aspect-[3/4]");
    expect(home.querySelector('[data-slot="product-grid"]')!.textContent).not.toContain("10%");
  });
});
