import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PhotoCollage } from "../src/blocks/booking";

function cells(images: (string | null)[], kind: "stay" | "class") {
  const html = renderToStaticMarkup(<PhotoCollage images={images} name="객실" kind={kind} />);
  return Number(/data-count="(\d)"/.exec(html)?.[1]);
}

const photo = (n: number) => Array.from({ length: n }, (_, i) => `/p${i}.jpg`);

describe("PhotoCollage", () => {
  it("keeps the full frame when there is no photo", () => {
    expect(cells([], "stay")).toBe(5);
    expect(cells([null, null], "class")).toBe(3);
  });

  it("fits the cells to the photos it has", () => {
    expect([1, 2, 3, 4, 5, 7].map((n) => cells(photo(n), "stay"))).toEqual([1, 2, 3, 3, 5, 5]);
    expect([1, 2, 3, 4].map((n) => cells(photo(n), "class"))).toEqual([1, 2, 3, 3]);
  });

  it("skips empty entries between photos", () => {
    expect(cells(["/a.jpg", null, "/b.jpg"], "stay")).toBe(2);
  });
});
