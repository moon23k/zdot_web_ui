import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { applyTemplate, designVars, fontHref, resolveTemplate } from "../src/index";

const design = { font: { display: "Jua", body: "Noto Sans KR" } };

describe("store font", () => {
  it("reaches the page through the theme variables", () => {
    const vars = designVars(design);
    expect(vars["--ezd-font-display"]).toContain('"Jua"');
    expect(vars["--ezd-font-body"]).toContain('"Noto Sans KR"');
  });

  it("falls back to the system font", () => {
    expect(designVars({})["--ezd-font-display"]).toMatch(/^"Wanted Sans Variable", "Wanted Sans", "Pretendard Variable"/);
    expect(designVars({})["--ezd-font-figure"]).toBe(designVars({})["--ezd-font-body"]);
  });

  it("loads each family once", () => {
    const href = fontHref({ font: { display: "Noto Sans KR", body: "Noto Sans KR" } }) ?? "";
    expect(href.match(/family=/g)).toHaveLength(1);
  });

  it("requests only the weights the set ships", () => {
    const href = fontHref({
      font: {
        display: "Sunflower",
        body: "Noto Sans KR",
        load: [
          { family: "Sunflower", weights: [500, 700] },
          { family: "Noto Sans KR", weights: [400, 700] },
        ],
      },
    });
    expect(href).toContain("family=Sunflower:wght@500;700");
    expect(href).toContain("family=Noto%20Sans%20KR:wght@400;700");
  });

  it("requests nothing for the bundled set", () => {
    expect(fontHref({ font: { display: "Pretendard", body: "Pretendard", load: [] } })).toBeNull();
  });

  it("carries bold and italic per level", () => {
    const vars = designVars({
      font: {
        styles: {
          title: { weight: 400, style: "italic" },
          subtitle: { weight: 600, style: "normal" },
          body: { weight: 700, style: "italic" },
        },
      },
    });
    expect(vars["--ezd-title-weight"]).toBe("400");
    expect(vars["--ezd-display-weight"]).toBe("400");
    expect(vars["--ezd-title-style"]).toBe("italic");
    expect(vars["--ezd-subtitle-style"]).toBe("normal");
    expect(vars["--ezd-body-weight"]).toBe("700");
  });

  it("keeps controls and figures upright", () => {
    const css = readFileSync("src/styles/legacy.css", "utf8");
    const upright = css.slice(0, css.indexOf("font-style: normal;"));
    for (const slot of ["site-header", "site-footer", "button"]) expect(upright).toContain(`[data-slot="${slot}"]`);
    expect(css).toMatch(/text-site-figure"\], \[data-slot="won"\]\) \{\s+font-style: normal;/);
  });

  it("defaults to the fixed hierarchy", () => {
    const vars = designVars({});
    expect([vars["--ezd-display-weight"], vars["--ezd-title-weight"], vars["--ezd-subtitle-weight"], vars["--ezd-body-weight"]]).toEqual(["400", "400", "400", "400"]);
    expect(vars["--ezd-body-style"]).toBe("normal");
  });

  it("loads nothing without a font", () => {
    expect(fontHref({})).toBeNull();
  });

  it("sets every template site in the site font without a font link", () => {
    for (const template of [resolveTemplate("class", "a"), resolveTemplate("shop", "d")]) {
      const applied = applyTemplate({ font: { display: "Noto Serif KR", body: "Noto Sans KR", load: [{ family: "Noto Serif KR", weights: [400, 600] }] } }, template);
      const vars = designVars(applied);
      expect(fontHref(applied)).toBeNull();
      expect(vars["--ezd-font-display"]).toBe(designVars({})["--ezd-font-body"]);
      expect(vars["--ezd-font-body"]).toBe(designVars({})["--ezd-font-body"]);
      expect([vars["--ezd-title-weight"], vars["--ezd-subtitle-weight"], vars["--ezd-title-style"]]).toEqual(["400", "500", "normal"]);
    }
  });

  it("keeps the brand font without a template", () => {
    expect(applyTemplate(design, null).font?.display).toBe("Jua");
    expect(fontHref(applyTemplate(design, null))).toContain("family=Jua");
  });
});

describe("브랜드 분위기 값", () => {
  const shop = resolveTemplate("shop", "a");
  const round = { shape: { radius_sm: 11, radius_md: 22, radius_lg: 38, button_shape: "pill" as const }, density: { section_gap: 48, grid_gutter: 12 } };

  it("템플릿 모양 대신 고른 모서리 · 버튼을 쓴다", () => {
    const vars = designVars(applyTemplate(round, shop), shop?.look);
    expect(vars["--ezd-radius-lg"]).toBe("38px");
    expect(vars["--ezd-button-radius"]).toBe("999px");
  });

  it("고른 간격 비율만큼 섹션 간격 · 칸 간격을 줄이고 늘린다", () => {
    const calm = designVars(applyTemplate({ ...round, density: { section_gap: 88, grid_gutter: 22 } }, shop), shop?.look);
    const busy = designVars(applyTemplate(round, shop), shop?.look);
    expect(parseInt(calm["--ezd-section-gap"]!)).toBeGreaterThan(parseInt(busy["--ezd-section-gap"]!));
    expect(calm["--ezd-gutter"]).toBe("33px");
    expect(busy["--ezd-gutter"]).toBe("18px");
  });

  it("분위기 값이 없으면 템플릿 모양 그대로", () => {
    expect(applyTemplate({}, shop).shape?.button_shape).toBe("square");
  });
});

describe("분위기 제목 글자", () => {
  const shop = resolveTemplate("shop", "a");
  const title = (font: Record<string, unknown>) => {
    const vars = designVars(applyTemplate({ font } as Parameters<typeof applyTemplate>[0], shop), shop?.look);
    return [vars["--ezd-title-scale"], vars["--ezd-title-tracking"], vars["--ezd-title-weight"]];
  };

  it("은은한 · 클래식 끝 값", () => {
    expect(title({ title_scale: 0.94, title_weight: 400, title_tracking_em: 0.01 })).toEqual(["0.94", "0.01em", "400"]);
  });

  it("강한 · 모던 끝 값은 템플릿을 거쳐도 남는다", () => {
    expect(title({ title_scale: 1.08, title_weight: 500, title_tracking_em: -0.01 })).toEqual(["1.08", "-0.01em", "500"]);
  });

  it("범위를 벗어나면 끝 값으로 자른다", () => {
    expect(title({ title_scale: 1.5, title_weight: 900, title_tracking_em: -0.2 })).toEqual(["1.08", "-0.01em", "500"]);
    expect(title({ title_scale: 0.5, title_weight: 100, title_tracking_em: 0.3 })).toEqual(["0.94", "0.01em", "400"]);
  });

  it("값이 없거나 숫자가 아니면 기본", () => {
    expect(title({})).toEqual(["1", "0em", "400"]);
    expect(title({ title_scale: "big", title_weight: null, title_tracking_em: Number.NaN })).toEqual(["1", "0em", "400"]);
    const vars = designVars({});
    expect([vars["--ezd-title-scale"], vars["--ezd-title-tracking"], vars["--ezd-title-weight"]]).toEqual(["1", "0em", "400"]);
  });
});
