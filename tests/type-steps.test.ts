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

const LEGACY_OFF_SCALE: Record<string, number> = {
  "src/details/blocks.tsx": 13,
  "src/details/interactive.tsx": 4,
  "src/blocks/address-book/address-book.tsx": 3,
  "src/blocks/buy-box/buy-box.tsx": 1,
  "src/blocks/cart-line/cart-line.tsx": 1,
  "src/blocks/checkout-items/checkout-items.tsx": 1,
  "src/blocks/claim-form/claim-form.tsx": 1,
  "src/blocks/claim-status/claim-status.tsx": 2,
  "src/blocks/inquiry/inquiry.tsx": 4,
  "src/blocks/order-detail/order-detail.tsx": 11,
  "src/blocks/parts/address-text.tsx": 1,
  "src/blocks/parts/choice.tsx": 1,
  "src/blocks/parts/deposit-info.tsx": 3,
  "src/blocks/parts/line-item.tsx": 5,
  "src/blocks/parts/notice.tsx": 3,
  "src/blocks/parts/status.tsx": 1,
  "src/blocks/policy-doc/policy-doc.tsx": 2,
  "src/components/dialog/dialog.tsx": 3,
  "src/components/empty-state/empty-state.tsx": 4,
  "src/components/price/price.tsx": 1,
  "src/components/quantity/quantity.tsx": 2,
};

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
