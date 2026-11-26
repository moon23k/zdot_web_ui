import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const OFF_SCALE = /ez:(?:md:|max-md:)?text-(?:xs|sm|base|lg|xl|[2-9]xl|\[\d)/g;

function sources(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".tsx") && !file.endsWith(".stories.tsx"))
    .map((file) => join(dir, file));
}

const ANY_OFF_SCALE = /ez:(?:[a-z-]+:)*text-(?:xs|sm|base|lg|xl|[2-9]xl|\[\d)/g;

const LEGACY_OFF_SCALE: Record<string, number> = {};

describe("type steps outside the home", () => {
  const files = readdirSync("src", { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx?$/.test(file) && !file.includes(".stories.") && !file.startsWith("__stories__"))
    .map((file) => join("src", file));

  it.each(files)("%s adds no type size outside the site steps", (file) => {
    const found = readFileSync(file, "utf8").match(ANY_OFF_SCALE)?.length ?? 0;
    expect(found).toBeLessThanOrEqual(LEGACY_OFF_SCALE[file] ?? 0);
  });
});

describe("home type steps", () => {
  const files = [...sources("src/sections"), "src/blocks/product-card/product-card.tsx"];

  it.each(files)("%s uses only site type steps", (file) => {
    expect(readFileSync(file, "utf8").match(OFF_SCALE) ?? []).toEqual([]);
  });

  it.each(files)("%s keeps figures out of the display font", (file) => {
    const classes = readFileSync(file, "utf8").match(/className="[^"]*"/g) ?? [];
    expect(classes.filter((name) => name.includes("font-display") && /tabular-nums|text-site-figure/.test(name))).toEqual([]);
  });
});

describe("site type steps own tracking and light weights", () => {
  const files = ["src/sections", "src/blocks", "src/components", "src/details", "src/utils"].flatMap((dir) =>
    readdirSync(dir, { recursive: true, encoding: "utf8" })
      .filter((file) => /\.tsx?$/.test(file) && !file.includes(".stories."))
      .map((file) => join(dir, file)),
  );

  it.each(files)("%s sets no tracking or light weight over the steps", (file) => {
    expect(readFileSync(file, "utf8").match(/ez:(?:[a-z0-9-]+:)*(?:tracking-\S+|font-(?:extra)?light)\b/g) ?? []).toEqual([]);
  });

  it("keeps large titles balanced and in the title weight", () => {
    const future = readFileSync("src/styles/future.css", "utf8");
    const legacy = readFileSync("src/styles/legacy.css", "utf8");
    expect(future).not.toMatch(/font-weight: (?:200|300);/);
    expect(future.match(/text-wrap: balance;/g)).toHaveLength(2);
    expect(legacy).toMatch(/\[class\*="text-site-display"\][^{]*\[class\*="text-site-name"\]\):not\(\[class\*="line-clamp"\]\) \{\s+text-wrap: balance;/);
    expect(legacy).not.toMatch(/font-weight: (?:200|300);/);
  });
});

describe("proportional figures", () => {
  const TABULAR: Record<string, string> = {
    "src/components/quantity/quantity.tsx": "수량 조절기 수량",
    "src/blocks/product-gallery/product-gallery.tsx": "사진을 넘길 때 바뀌는 순번",
    "src/blocks/review-form/review-form.tsx": "글자 수 카운터",
    "src/sections/shop/b.tsx": "더 보기 진행률",
    "src/sections/shop/c.tsx": "더 보기 진행률",
    "src/sections/shop/d.tsx": "더 보기 진행률",
    "src/sections/shop/e.tsx": "더 보기 진행률",
    "src/sections/shop/f.tsx": "더 보기 진행률",
  };
  const files = ["src/sections", "src/blocks", "src/components", "src/details", "src/utils"].flatMap((dir) =>
    readdirSync(dir, { recursive: true, encoding: "utf8" })
      .filter((file) => /\.tsx?$/.test(file) && !file.includes(".stories."))
      .map((file) => join(dir, file)),
  );

  it("keeps the gallery root free of tabular figures", () => {
    const legacy = readFileSync("src/styles/legacy.css", "utf8");
    expect(legacy).not.toMatch(/tnum/);
    for (const sheet of ["base", "future", "kit", "night-screens", "script"]) expect(readFileSync(`src/styles/${sheet}.css`, "utf8")).not.toMatch(/tnum|tabular/);
  });

  it.each(files)("%s uses tabular figures only where a live value must not shift", (file) => {
    const found = readFileSync(file, "utf8").match(/ez:(?:[a-z0-9-]+:)*tabular-nums/g)?.length ?? 0;
    expect(found).toBe(TABULAR[file] ? 1 : 0);
  });
});
