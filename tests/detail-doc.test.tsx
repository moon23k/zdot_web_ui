import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DetailDoc, type DetailBlock, type DetailLayer } from "../src/blocks/detail-doc/detail-doc";

const text = (id: string, value: string, hidden = false): DetailLayer => ({ id, type: "text", text: value, hidden });

const draw = (block: DetailBlock) => render(<DetailDoc doc={{ blocks: [block] }} />).container;

const rows = (root: HTMLElement) =>
  [...root.querySelectorAll('[data-layout="table"] [data-row]')].map((row) => [...row.children].map((c) => c.textContent));

describe("DetailDoc table", () => {
  it("pairs labels and values in order", () => {
    const root = draw({
      id: "b",
      layout: "table",
      layers: [text("k0", "크기"), text("v0", "지름 17cm"), { id: "p", type: "image", url: "x.jpg" }, text("k1", "용량"), text("v1", "750ml")],
    });
    expect(rows(root)).toEqual([
      ["크기", "지름 17cm"],
      ["용량", "750ml"],
    ]);
    expect(root.querySelector("img")).toBeNull();
  });

  it("skips empty and hidden rows without shifting later rows", () => {
    const root = draw({
      id: "b",
      layout: "table",
      layers: [
        text("k0", ""),
        text("v0", " "),
        text("k1", "무게", true),
        text("v1", "420g", true),
        text("k2", "소재"),
        text("v2", "백자토", true),
        text("k3", "제조"),
        text("v3", "국내"),
      ],
    });
    expect(rows(root)).toEqual([
      ["소재", ""],
      ["제조", "국내"],
    ]);
  });

  it("leaves the last value empty for an odd layer count", () => {
    const root = draw({ id: "b", layout: "table", layers: [text("k0", "크기"), text("v0", "17cm"), text("k1", "제조")] });
    expect(rows(root)).toEqual([
      ["크기", "17cm"],
      ["제조", ""],
    ]);
  });

  it("draws rows with the shared info row rule instead of the value colour", () => {
    const root = draw({
      id: "b",
      layout: "table",
      layers: [text("k0", "크기"), { id: "v0", type: "text", text: "17cm", style: { color: "#FFFFFF" } }],
    });
    const row = root.querySelector<HTMLElement>("[data-row]")!;
    expect(row.style.borderTop).toBe("");
    expect(row.className).toContain("ez:border-site-line");
  });

  it("renders nothing for a table without values", () => {
    const root = draw({ id: "b", layout: "table", layers: [text("k0", ""), text("v0", "")] });
    expect(root.querySelector('[data-layout="table"]')?.children).toHaveLength(0);
  });
});

describe("DetailDoc steps", () => {
  it("numbers visible steps from one", () => {
    const root = draw({
      id: "b",
      layout: "steps",
      layers: [text("s0", "물레 성형"), text("s1", ""), text("s2", "초벌", true), text("s3", "유약"), text("s4", "재벌")],
    });
    const items = [...root.querySelectorAll('[data-layout="steps"] li')];
    expect(items.map((li) => li.querySelector("span")?.textContent)).toEqual(["1", "2", "3"]);
    expect(items.map((li) => li.querySelector("p")?.textContent)).toEqual(["물레 성형", "유약", "재벌"]);
    expect(root.querySelector<HTMLElement>("ol")!.style.gridTemplateColumns).toBe("repeat(3, minmax(0, 1fr))");
  });

  it("wraps after four columns", () => {
    const root = draw({ id: "b", layout: "steps", layers: ["a", "b", "c", "d", "e", "f"].map((v, i) => text(`s${i}`, v)) });
    expect(root.querySelectorAll("li")).toHaveLength(6);
    expect(root.querySelector<HTMLElement>("ol")!.style.gridTemplateColumns).toBe("repeat(4, minmax(0, 1fr))");
  });
});

it("falls back to the default branch for an unknown layout", () => {
  const root = draw({
    id: "b",
    layout: "mosaic" as DetailBlock["layout"],
    layers: [{ id: "p", type: "image", url: "x.jpg" }, text("t", "본문")],
  });
  const block = root.querySelector('[data-layout="mosaic"]')!;
  expect(block.querySelector("img")).not.toBeNull();
  expect(block.textContent).toContain("본문");
});
