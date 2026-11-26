import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resolveTemplate, SiteHeader, SiteRenderer, Won } from "../src/index";
import { scriptOf } from "../src/utils/writing";

const css = (path: string) => readFileSync(path, "utf8");

const hero = (letter: string, storeName: string) =>
  render(<SiteRenderer page={{ sections: [{ kind: "hero", data: {} }], arranged: true }} context={{ products: [], categories: [], faqs: [], shipping: null, storeName }} template={resolveTemplate("shop", letter)} />).container;

const latin = (root: Element, text: string) => [...root.querySelectorAll('[data-script="latin"]')].some((el) => el.textContent === text);

describe("scriptOf", () => {
  it("marks text without hangul that has latin letters", () => {
    expect(scriptOf("Ongi Market")).toBe("latin");
    expect(scriptOf("ONGI 2024")).toBe("latin");
  });

  it("leaves hangul, mixed, numbers, other scripts and non-text alone", () => {
    expect(scriptOf("온기상점")).toBeUndefined();
    expect(scriptOf("Ongi 상점")).toBeUndefined();
    expect(scriptOf("ㅇㄱ shop")).toBeUndefined();
    expect(scriptOf("12,000")).toBeUndefined();
    expect(scriptOf("やさしい店")).toBeUndefined();
    expect(scriptOf("花店")).toBeUndefined();
    expect(scriptOf(null)).toBeUndefined();
    expect(scriptOf(3)).toBeUndefined();
  });
});

describe("latin store text", () => {
  it("marks a latin store name in the header and leaves a hangul one", () => {
    const en = render(<SiteHeader name="ONGI" variant={resolveTemplate("shop", "a").header} cartCount={0} />).container;
    expect(latin(en, "ONGI")).toBe(true);
    const ko = render(<SiteHeader name="온기상점" variant={resolveTemplate("shop", "a").header} cartCount={0} />).container;
    expect(ko.querySelector("[data-script]")).toBeNull();
  });

  it("marks the large store name of the aurora and night heroes", () => {
    for (const letter of ["d", "e"]) {
      expect(latin(hero(letter, "Ongi Market"), "Ongi Market")).toBe(true);
      expect(hero(letter, "온기상점").querySelector("[data-script]")).toBeNull();
    }
  });

  it("generates the latin steps from the source table", () => {
    const script = css("src/styles/script.css");
    expect(script).toContain(':where(.ez-root) [data-script="latin"] {');
    expect(script).toContain("--ez-text-site-display: calc(4rem * 1.06 * var(--ezd-title-scale, 1));");
    expect(script).toContain("--ez-text-site-display--line-height: 1.04;");
    expect(script).toContain("--ez-text-site-display--letter-spacing: calc(-0.045em + var(--ezd-title-tracking, 0em));");
    expect(script).toContain("--ez-text-site-page--letter-spacing: calc(-0.04em + var(--ezd-title-tracking, 0em));");
    expect(script).toContain("--ez-text-site-logo: calc(1.875rem * 1.04);");
    expect(script).toContain("--ez-text-site-heading--line-height: 1.26;");
    expect(script).toContain("--ez-text-site-item--letter-spacing: -0.012em;");
    expect(script).toContain("--ez-text-site-body--letter-spacing: -0.006em;");
    expect(script).toContain("--ez-text-site-small--letter-spacing: 0.002em;");
    expect(script).toContain("--ez-text-site-badge--letter-spacing: 0.02em;");
    expect(script).not.toMatch(/--ez-text-site-(?:figure|rank|counter)/);
    expect(script).toContain("--ez-fx-scale: 1.06;");
    expect(css("src/styles/base.css")).toContain('@import "./script.css"');
    expect(css("src/styles/future.css").match(/var\(--ez-fx-scale, 1\)/g)).toHaveLength(2);
  });
});

describe("Won", () => {
  it("sets the unit apart and reads as the same price", () => {
    const { container } = render(
      <>
        <Won amount={52000} />
        <Won value="30만원" />
      </>,
    );
    const won = [...container.querySelectorAll('[data-slot="won"]')];
    expect(won.map((el) => el.textContent)).toEqual(["52,000원", "30만원"]);
    expect(won.map((el) => el.querySelector(".ez-won-unit")?.textContent)).toEqual(["원", "만원"]);
  });

  it("keeps any other text as it is", () => {
    const { container } = render(
      <>
        <Won value="1박 95,000원~" />
        <Won value="무료" />
        <Won value={null} />
      </>,
    );
    expect(container.querySelector('[data-slot="won"]')).toBeNull();
    expect(container.textContent).toBe("1박 95,000원~무료");
  });

  it("styles the unit in one rule", () => {
    expect(css("src/styles/legacy.css").replace(/\s+/g, " ")).toContain(".ez-won-unit { margin-left: 0.03em; font-size: 0.9em; font-weight: 400; font-style: normal; letter-spacing: 0; }");
  });
});
