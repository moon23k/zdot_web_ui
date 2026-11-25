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
