import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Badge } from "../src/components/badge";
import { designVars, resolveTemplate, SiteRenderer, ThemeRoot } from "../src/index";
import type { TemplateMain } from "../src/templates/types";
import type { Design } from "../src/types";

const plain: Design = {
  color: { primary: "#B64C2F", surface: "#FDF3E7", surface_alt: "#FCE5D6", text: "#1A0D03", text_muted: "#695E53" },
};
const kit: Design = {
  color: { ...plain.color, secondary: "#FACCB6", accent: "#601000", on_accent: "#FFFFFF" },
  palette: { color: "09-C03", harmony: "tonal" },
};

const css = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8").replace(/\s+/g, " ");

describe("brand kit variables", () => {
  it("derives footer, tiles and the sample badge from the kit", () => {
    const vars = designVars(kit);
    expect(vars["--ezd-foot"]).toBe("#601000");
    expect(vars["--ezd-foot-ink"]).toBe("#FFFFFF");
    expect(vars["--ezd-foot-line"]).toBe("color-mix(in srgb, #FFFFFF 26%, transparent)");
    expect(vars["--ezd-foot-rule"]).toBe("transparent");
    expect(vars["--ezd-mark"]).toBe("color-mix(in srgb, #B64C2F 14%, #FDF3E7)");
    expect(vars["--ezd-mark-ink"]).toBe("#B64C2F");
    expect([1, 2, 3, 4, 5].map((n) => vars[`--ez-color-tile-${n}`])).toEqual([
      "#FACCB6",
      "color-mix(in srgb, #B64C2F 24%, #FDF3E7)",
      "color-mix(in srgb, #601000 20%, #FDF3E7)",
      "color-mix(in srgb, #FACCB6 55%, #FDF3E7)",
      "color-mix(in srgb, #601000 10%, #FACCB6)",
    ]);
  });

  it("keeps today's footer, badge and tiles without a palette", () => {
    const vars = designVars(plain);
    expect(vars["--ezd-foot"]).toBe("transparent");
    expect(vars["--ezd-foot-ink"]).toBe("#1A0D03");
    expect(vars["--ezd-foot-muted"]).toBe("#695E53");
    expect(vars["--ezd-foot-hover"]).toBe("#B64C2F");
    expect(vars["--ezd-foot-line"]).toBe("var(--ez-color-site-line)");
    expect(vars["--ezd-mark"]).toBe("#FCE5D6");
    expect(vars["--ezd-mark-ink"]).toBe("#1A0D03");
    expect([1, 2, 3, 4, 5].map((n) => vars[`--ez-color-tile-${n}`])).toEqual(Array(5).fill("revert-layer"));
    expect(Object.values(vars).join(" ")).not.toContain("#601000");
  });

  it("resets kit values when a live design drops the palette", () => {
    const { container, rerender } = render(<ThemeRoot design={kit}>x</ThemeRoot>);
    expect(container.querySelector("style")!.textContent).toContain("--ezd-foot:#601000");
    rerender(<ThemeRoot design={plain}>x</ThemeRoot>);
    const text = container.querySelector("style")!.textContent!;
    expect(text).toContain("--ezd-foot:transparent");
    expect(text).toContain("--ez-color-tile-1:revert-layer");
  });

  it("paints the sample badge with the mark colour", () => {
    const { getByText } = render(<Badge>예시</Badge>);
    expect(getByText("예시").className).toContain("ez:bg-mark");
    expect(getByText("예시").className).toContain("ez:text-mark-ink");
  });

  it("remaps footer colours to the kit and lets nested roots bleed", () => {
    const kitCss = css("../src/styles/kit.css");
    expect(kitCss).toContain('.ez-root [data-slot="site-footer"] { --ezd-text: var(--ezd-foot-ink);');
    expect(kitCss).toContain("background: var(--ezd-foot);");
    expect(css("../src/styles/legacy.css")).toContain('.ez-root .ez-root[data-frame="gallery"] { overflow-x: visible; }');
  });
});

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

function hero(main: TemplateMain, letter: string, data: Record<string, unknown>) {
  const template = resolveTemplate(main, letter);
  const { container } = render(
    <SiteRenderer page={{ sections: [{ kind: "hero", data: { image: "/sample/hero.jpg", ...data } }], arranged: true }} context={{ products: [], categories: [], faqs: [], shipping: null }} template={template} />,
  );
  return container.querySelector('[data-slot="hero"]');
}

describe.each(designs)("hero sub %s %s", (main, letter) => {
  it("shows the partner sub line only under a partner title", () => {
    const titled = hero(main, letter, { title: "겨울 선물 모음", sub: "한 상자에 담았어요" });
    if (!titled) return;
    expect(titled.querySelector('[data-slot="hero-sub"]')?.textContent).toBe("한 상자에 담았어요");
    const bare = hero(main, letter, { sub: "한 상자에 담았어요" });
    expect(bare?.querySelector('[data-slot="hero-sub"]')).toBeNull();
    expect(bare?.textContent).not.toContain("한 상자에 담았어요");
  });
});
