import { expect, test } from "vitest";
import { templates } from "../src/templates";
import { applyTemplate } from "../src/theme/tokens";

const color = { surface: "#FBF0EA", surface_alt: "#FAEADF", primary: "#9D6038" };

test("템플릿 바탕은 팔레트가 없을 때만 덮는다", () => {
  const template = templates.shop[3]!;
  const plain = applyTemplate({ color }, template);
  expect(plain.color?.surface).not.toBe(color.surface);
  const picked = applyTemplate({ color, palette: { color: "05-C06", harmony: "tonal" } }, template);
  expect(picked.color?.surface).toBe(color.surface);
  expect(picked.color?.surface_alt).toBe(color.surface_alt);
});
