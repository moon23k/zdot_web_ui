import { describe, expect, it } from "vitest";
import manifest from "../manifest.json";
import { sections } from "../src/renderer/registry";
import { templateHome, templates } from "../src/templates";

describe("section registry", () => {
  it("matches manifest.json (run `npm run manifest` after changing the registry)", () => {
    expect(manifest.kinds).toEqual(Object.keys(sections).sort());
    expect(manifest.home).toEqual(templateHome());
  });

  it("draws every template home slot", () => {
    const missing = Object.values(templates)
      .flat()
      .flatMap((t) => t.home.filter((slot) => !(slot.kind in sections)).map((slot) => `${t.id}.${slot.kind}`));
    expect(missing).toEqual([]);
  });
});
