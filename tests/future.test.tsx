import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NIGHT_THEMES, resolveTemplate, SiteRenderer, templates, ThemeRoot } from "../src";
import { designVars } from "../src/core";
import { applyTemplate } from "../src/theme/tokens";
import { NIGHT_PALETTE } from "../src/theme/night";

const context = { products: [], categories: [], faqs: [], shipping: null, storeName: "온기상점" };
const rootVars = (style: Element): Record<string, string> => {
  const text = style.textContent ?? "";
  const body = text.slice(text.indexOf("{") + 1, text.lastIndexOf("}"));
  return Object.fromEntries(body.split(";").map((pair) => [pair.slice(0, pair.indexOf(":")), pair.slice(pair.indexOf(":") + 1)]));
};
const nested = (outer: [string, string], inner: [string, string]) => {
  const { container } = render(
    <ThemeRoot template={resolveTemplate(...outer)} night="tokyo">
      <ThemeRoot template={resolveTemplate(...inner)}>
        <div />
      </ThemeRoot>
    </ThemeRoot>,
  );
  const styles = [...container.querySelectorAll("style")].map(rootVars);
  return { outer: styles[0], last: styles[styles.length - 1] };
};
const alone = (main: string, letter: string) => {
  const { container } = render(
    <ThemeRoot template={resolveTemplate(main, letter)}>
      <div />
    </ThemeRoot>,
  );
  return rootVars(container.querySelector("style")!);
};
const look = (main: string, letter: string) => {
  const t = resolveTemplate(main, letter);
  return { t, site: { ...t.look, skin: t.skin } };
};

describe("future designs", () => {
  it("adds aurora and night to every main and stage to shop only", () => {
    for (const [main, list] of Object.entries(templates)) {
      const skins = list.map((t) => t.skin);
      expect(skins).toContain("aurora");
      expect(skins).toContain("night");
      expect(skins.includes("stage")).toBe(main === "shop");
    }
  });

  it.each(NIGHT_THEMES)("paints the night glow from the %s palette", (theme) => {
    const { t, site } = look("shop", "e");
    const p = NIGHT_PALETTE[theme];
    const vars = designVars(applyTemplate(null, t, theme), { ...site, night: theme });
    expect(vars["--ezd-surface"]).toBe(p.bg);
    expect(vars["--ezd-surface-alt"]).toBe(p.sf);
    expect(vars["--ezd-sky"]).toBe(p.sky);
    expect(vars["--ezd-field"]).toBe(p.deep);
    expect(vars["--ez-color-danger"]).toBe(p.err);
    expect(vars["--ez-color-site-off"]).toBe(p.ink3);
  });

  it("falls back to dracula and keeps the warm night of the place brand design", () => {
    const { t, site } = look("shop", "e");
    expect(designVars(applyTemplate(null, t), site)["--ezd-surface"]).toBe(NIGHT_PALETTE.dracula.bg);
    const place = resolveTemplate("place", "a");
    const vars = designVars(applyTemplate(null, place, "tokyo"), { ...place.look, skin: place.skin, night: "tokyo" });
    expect(vars["--ezd-surface"]).not.toBe(NIGHT_PALETTE.tokyo.bg);
    expect(vars["--ez-color-danger"]).toBe("revert-layer");
  });

  it("puts aurora on its own pale ground", () => {
    const { t, site } = look("care", "d");
    const vars = designVars(applyTemplate(null, t), site);
    expect(vars["--ezd-surface"]).toBe("#f6f6fa");
    expect(vars["--ez-color-site-line"]).toBe("rgb(20 20 30 / 0.1)");
  });

  it("keeps light designs free of night overrides", () => {
    for (const t of Object.values(templates).flat().filter((t) => t.skin !== "night" && t.look.tone !== "night")) {
      const vars = designVars(applyTemplate(null, t), { ...t.look, skin: t.skin });
      expect(vars["--ez-color-danger"]).toBe("revert-layer");
      expect(vars["--ezd-field"]).toBe("#ffffff");
    }
  });

  it("marks the root with the night theme only on the night glow", () => {
    const { container, rerender } = render(<ThemeRoot template={resolveTemplate("stay", "e")} night="nord"><SiteRenderer page={{ sections: [] }} context={context} template={resolveTemplate("stay", "e")} /></ThemeRoot>);
    expect(container.querySelector(".ez-root")?.getAttribute("data-night-theme")).toBe("nord");
    rerender(<ThemeRoot template={resolveTemplate("stay", "d")} night="nord"><div /></ThemeRoot>);
    expect(container.querySelector(".ez-root")?.hasAttribute("data-night-theme")).toBe(false);
  });

  it("writes the same variable names for every design and theme", () => {
    const names = (vars: Record<string, string>) => Object.keys(vars).sort();
    const base = names(designVars(null, false));
    for (const t of Object.values(templates).flat()) {
      for (const night of NIGHT_THEMES) {
        expect(names(designVars(applyTemplate(null, t, night), { ...t.look, skin: t.skin, night }))).toEqual(base);
      }
    }
  });

  it("hands light designs back to the system colors instead of leaving them unset", () => {
    for (const t of Object.values(templates).flat().filter((t) => t.look.tone !== "night" && t.look.tone !== "aurora")) {
      const vars = designVars(applyTemplate(null, t), { ...t.look, skin: t.skin });
      for (const [name, value] of Object.entries(vars).filter(([name]) => name.startsWith("--ez-color-") && !name.startsWith("--ez-color-tile-"))) {
        expect([name, value]).toEqual([name, "revert-layer"]);
      }
      expect(vars["--ezd-error"]).toBe("#b42318");
    }
  });

  it("puts the cutout on the stage instead of the photo when there is one", () => {
    const t = resolveTemplate("shop", "f");
    const items = [
      { id: "p1", name: "자몽청", list_price: 18000, sale_price: 18000, cover_url: "https://img.test/p1.jpg", cover_cutout_url: "https://img.test/p1-cut.png", sold_out: false, sample: false, slot_scope: "none" },
      { id: "p2", name: "유자청", list_price: 18000, sale_price: 18000, cover_url: "https://img.test/p2.jpg", cover_cutout_url: null, sold_out: false, sample: false, slot_scope: "none" },
    ];
    const { container } = render(
      <ThemeRoot template={t}>
        <SiteRenderer
          page={{ sections: [{ kind: "hero", data: { products: items } }, { kind: "product_grid", data: {} }] }}
          context={{ ...context, products: items }}
          template={t}
        />
      </ThemeRoot>,
    );
    const src = (el: Element | null) => decodeURIComponent(el?.querySelector("img")?.getAttribute("src") ?? "");
    const hero = container.querySelector('[data-slot="hero"] [data-cutout]');
    expect(src(hero)).toContain("p1-cut.png");
    const cards = [...container.querySelectorAll('[data-slot="product-card"]')];
    expect(cards).toHaveLength(2);
    expect(src(cards[0]!.querySelector("[data-cutout]"))).toContain("p1-cut.png");
    expect(cards[1]!.querySelector("[data-cutout]")).toBeNull();
    expect(src(cards[1]!)).toContain("p2.jpg");
  });

  it.each([
    [["shop", "e"], ["shop", "a"]],
    [["shop", "e"], ["shop", "f"]],
    [["care", "d"], ["care", "a"]],
    [["stay", "e"], ["stay", "d"]],
  ] as [[string, string], [string, string]][])("keeps the %j outer root from leaking into a %j preview", (outer, inner) => {
    const vars = nested(outer, inner);
    expect(Object.keys(vars.last).sort()).toEqual(Object.keys(vars.outer).sort());
    expect(vars.last).toEqual(alone(...inner));
    expect(vars.last["--ez-color-site-line"]).not.toBe(vars.outer["--ez-color-site-line"]);
  });
});
