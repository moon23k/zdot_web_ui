import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { resolveTemplate, SiteRenderer } from "../src/index";
import type { TemplateMain } from "../src/templates/types";

const context = { products: [], categories: [], faqs: [], shipping: null };
const designs: [TemplateMain, string][] = [
  ["shop", "a"],
  ["shop", "b"],
  ["shop", "c"],
  ["class", "a"],
  ["class", "b"],
  ["class", "c"],
  ["stay", "a"],
  ["stay", "b"],
  ["stay", "c"],
  ["quote", "a"],
  ["quote", "b"],
  ["quote", "c"],
  ["place", "a"],
  ["place", "b"],
  ["place", "c"],
];

function page(main: TemplateMain, letter: string, arranged = false) {
  const template = resolveTemplate(main, letter);
  const { container } = render(<SiteRenderer page={{ sections: [], arranged }} context={context} template={template} />);
  return { template, root: container.querySelector('[data-slot="site-renderer"]') as HTMLElement };
}

describe.each(designs)("blank %s %s", (main, letter) => {
  it("keeps every template section on screen", () => {
    const { template, root } = page(main, letter);
    const joined = main === "quote" && letter !== "b" ? 1 : 0;
    expect(root.children.length).toBe(template!.home.length - joined);
  });

  it("marks every blank section so the partner preview can jump to its input", () => {
    const { template, root } = page(main, letter);
    const missing = template!.home
      .map((slot) => slot.kind)
      .filter((kind) => !root.querySelector(`[data-blank][data-slot="${kind.replace(/_/g, "-")}"]`));
    expect(missing).toEqual([]);
  });

  it("invents no prices, ratings or figures", () => {
    const { root } = page(main, letter);
    root.querySelector('[data-slot="process-steps"]')?.remove();
    const text = root.textContent ?? "";
    expect(text).not.toMatch(/\d[\d,]*원|\d{2,}|\d\.\d|★/);
  });

  it("lays blank cards out in several columns", () => {
    const { root } = page(main, letter);
    const stacked = [...root.querySelectorAll('[class*="ez:gap-gutter"]')].filter((grid) => grid.children.length > 1 && grid.className.includes("ez:md:grid-cols-1"));
    expect(stacked).toHaveLength(0);
  });

  it("offers nothing to click or buy", () => {
    const { root } = page(main, letter);
    expect(root.querySelectorAll("a")).toHaveLength(0);
    expect(root.querySelectorAll("button:not(form button)")).toHaveLength(0);
  });
});

describe("blank scope", () => {
  const hero = (main: TemplateMain, letter: string, data: Record<string, unknown>) =>
    render(<SiteRenderer page={{ sections: [{ kind: "hero", data }], arranged: true }} context={context} template={resolveTemplate(main, letter)} />).container.querySelector(
      '[data-slot="hero"]',
    ) as HTMLElement;

  it("draws a photo-only full hero as a photo, not as a blank", () => {
    const el = hero("shop", "b", { image: "https://img.test/a.jpg" });
    expect(el).toHaveAttribute("data-variant", "full");
    expect(el).not.toHaveAttribute("data-blank");
    expect(el.querySelector("h1")).toBeNull();
    expect(el.querySelector("a")).toBeNull();
    expect(el.querySelector('[data-slot="blank-bar"]')).toBeNull();
    expect(el.querySelector('[class*="linear-gradient"]')).toBeNull();
  });

  it("marks a hero blank only when it has neither a title nor a photo", () => {
    expect(hero("class", "a", {})).toHaveAttribute("data-blank");
    expect(hero("class", "a", { image: "https://img.test/a.jpg" })).not.toHaveAttribute("data-blank");
    expect(hero("class", "b", { title: "겨울 정규반 모집" })).not.toHaveAttribute("data-blank");
  });

  it("keeps the banner products and fixed links without a title", () => {
    const products = [{ id: "p1", name: "자몽청", sale_price: 18000, cover_url: "https://img.test/p.jpg" }];
    const pair = [...products, { id: "p2", name: "유자청", sale_price: 16000, cover_url: "https://img.test/q.jpg" }];
    expect(hero("shop", "a", { image: "https://img.test/a.jpg", products }).querySelector("a")).toBeNull();
    expect([...hero("shop", "b", { image: "https://img.test/a.jpg", products: pair }).querySelectorAll('[data-slot="hero-product"]')].map((a) => a.getAttribute("href"))).toEqual(["/products/p1", "/products/p2"]);
    expect(hero("shop", "c", { image: "https://img.test/a.jpg", products }).querySelector('a[href="/products/p1"]')).not.toBeNull();
    expect(hero("quote", "c", { image: "https://img.test/a.jpg", products }).querySelector('a[href="/cases"]')).not.toBeNull();
    expect(hero("class", "a", { image: "https://img.test/a.jpg" }).querySelector("a")).toBeNull();
  });

  it("uses a fixed button label for a partner banner", () => {
    const el = hero("class", "b", { title: "겨울 정규반 모집", image: "https://img.test/a.jpg" });
    expect(el.querySelector("h1")).toHaveTextContent("겨울 정규반 모집");
    expect(el.querySelector("a")).toHaveTextContent("전체 클래스");
  });

  it("keeps a photo-only stay hero out of the blank state", () => {
    const el = hero("stay", "c", { image: "https://img.test/a.jpg" });
    expect(el).not.toHaveAttribute("data-blank");
    expect(el.querySelector("h1")).toBeNull();
  });

  it("fills a category tile with its cover and keeps the tile without one", () => {
    const categories = [
      { id: "c1", name: "과일청", product_count: 3, cover_url: "https://img.test/c1.png" },
      { id: "c2", name: "잼", product_count: 2, cover_url: null },
    ];
    const { container } = render(
      <SiteRenderer page={{ sections: [{ kind: "category_tiles", data: {} }], arranged: true }} context={{ ...context, categories }} template={resolveTemplate("shop", "a")} />,
    );
    const el = container.querySelector('[data-slot="category-tiles"]') as HTMLElement;
    expect(el).not.toHaveAttribute("data-blank");
    const photos = [...el.querySelectorAll('[data-slot="photo"]')];
    expect(photos).toHaveLength(2);
    expect(photos[0]).not.toHaveAttribute("data-empty");
    expect(photos[0]!.querySelector("img")?.getAttribute("src")).toContain(encodeURIComponent("https://img.test/c1.png"));
    expect(photos[1]).toHaveAttribute("data-empty");
    expect(photos[1]!.querySelector("img")).toBeNull();
    expect(el.querySelector('a[href="/products?category=c1"]')).toHaveTextContent("과일청");
  });

  it("leaves a partner arranged page alone", () => {
    expect(page("stay", "a", true).root.children).toHaveLength(0);
  });

  it("shows cancel terms per room in the stay guide", () => {
    const groups = [{ title: "바다 앞 독채", rows: [{ label: "이용일 당일", value: "0% 환불" }] }];
    const { container } = render(
      <SiteRenderer page={{ sections: [{ kind: "house_rules", data: { cancel: { groups } } }], arranged: true }} context={context} template={resolveTemplate("stay", "a")} />,
    );
    const block = container.querySelector('[data-slot="house-rules"]');
    expect(block).not.toHaveAttribute("data-blank");
    expect(block).toHaveTextContent("바다 앞 독채");
    expect(block).toHaveTextContent("0% 환불");
  });
});
