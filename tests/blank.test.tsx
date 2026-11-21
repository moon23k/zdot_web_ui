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
];

function page(main: TemplateMain, letter: string, arranged = false) {
  const template = resolveTemplate(main, letter);
  const { container } = render(<SiteRenderer page={{ sections: [], arranged }} context={context} template={template} />);
  return { template, root: container.querySelector('[data-slot="site-renderer"]') as HTMLElement };
}

describe.each(designs)("blank %s %s", (main, letter) => {
  it("keeps every template section on screen", () => {
    const { template, root } = page(main, letter);
    expect(root.children.length).toBe(template!.home.length);
  });

  it("marks every blank section so the partner preview can jump to its input", () => {
    const { template, root } = page(main, letter);
    const missing = template!.home
      .map((slot) => slot.kind)
      .filter((kind) => !["search_bar"].includes(kind))
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

  it("keeps the product chip and fixed links without a title", () => {
    const products = [{ id: "p1", name: "자몽청", sale_price: 18000, cover_url: "https://img.test/p.jpg" }];
    expect(hero("shop", "a", { image: "https://img.test/a.jpg", products }).querySelector('a[href="/products/p1"]')).not.toBeNull();
    expect(hero("quote", "c", { image: "https://img.test/a.jpg", products }).querySelector('a[href="/products/p1"]')).not.toBeNull();
    expect([...hero("class", "a", { image: "https://img.test/a.jpg" }).querySelectorAll("a")].map((a) => a.textContent)).toEqual(["일정 보기", "클래스 전체"]);
  });

  it("uses a fixed button label for a partner banner", () => {
    const el = hero("class", "b", { title: "겨울 정규반 모집", image: "https://img.test/a.jpg" });
    expect(el.querySelector("h1")).toHaveTextContent("겨울 정규반 모집");
    expect(el.querySelector("a")).toHaveTextContent("클래스 보기");
  });

  it("puts the stay facts first when there is no title", () => {
    const facts = [{ label: "체크인 · 체크아웃", value: "15:00 · 11:00" }];
    const el = hero("stay", "c", { facts });
    expect(el).not.toHaveAttribute("data-blank");
    expect(el).toHaveTextContent("15:00 · 11:00");
    expect(el.querySelector("h1")).toBeNull();
  });

  it("leaves a partner arranged page alone", () => {
    expect(page("stay", "a", true).root.children).toHaveLength(0);
  });

  it("shows cancel terms per room", () => {
    const groups = [{ title: "바다 앞 독채", rows: [{ label: "이용일 당일", value: "0% 환불" }] }];
    const { container } = render(
      <SiteRenderer page={{ sections: [{ kind: "pay_plan", data: { groups } }], arranged: true }} context={context} template={resolveTemplate("stay", "a")} />,
    );
    const block = container.querySelector('[data-slot="pay-plan"]');
    expect(block).not.toHaveAttribute("data-blank");
    expect(block).toHaveTextContent("바다 앞 독채");
    expect(block).toHaveTextContent("0% 환불");
  });
});
