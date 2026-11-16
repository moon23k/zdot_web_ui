import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { templates } from "../src/index";

const FRAME = "../EZPG/contracts/rules/frame.json";

describe.skipIf(!existsSync(FRAME))("template slots", () => {
  const list = Object.entries(templates).flatMap(([main, items]) => items.map((t) => [t.id, main, t] as const));

  it.each(list)("%s matches the frame rule", (_, main, template) => {
    const frame = JSON.parse(readFileSync(FRAME, "utf8")) as { mains: Record<string, { home: Record<string, string[]> }> };
    const rule = frame.mains[main].home[template.letter];
    const kinds = template.home.map((slot) => slot.kind);
    if (template.look.frame !== "gallery") {
      expect(rule).toEqual(kinds);
      return;
    }
    expect(kinds.filter((kind) => !rule.includes(kind))).toEqual([]);
    expect(rule.filter((kind) => kinds.includes(kind))).toEqual(kinds);
  });
});
