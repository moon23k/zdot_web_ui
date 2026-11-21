import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DetailLayout, ProductGallery, resolveTemplate, SiteRenderer, templates } from "../src";

const context = { products: [], categories: [], faqs: [], shipping: null, storeName: "온기상점" };
const designs = Object.values(templates)
  .flat()
  .map((t) => [t.main, t.letter] as const);

describe("page structure", () => {
  it.each(designs)("names the %s %s home after the store when no section carries a title", (main, letter) => {
    const photo = { kind: "hero", data: { image: "https://img.test/a.jpg" } };
    render(<SiteRenderer page={{ sections: [photo, { kind: "intro", data: { images: ["https://img.test/b.jpg"] } }] }} context={context} template={resolveTemplate(main, letter)} />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings.map((h) => h.textContent)).toEqual(["온기상점"]);
    expect(headings[0]).toHaveClass("ez:sr-only");
  });

  it("lets a partner banner title be the only page heading", () => {
    render(<SiteRenderer page={{ sections: [{ kind: "hero", data: { title: "겨울 정규반 모집", image: "https://img.test/a.jpg" } }] }} context={context} template={resolveTemplate("class", "b")} />);
    expect(screen.getAllByRole("heading", { level: 1 }).map((h) => h.textContent)).toEqual(["겨울 정규반 모집"]);
  });

  it("links info tabs to their panel and moves with arrow keys", async () => {
    render(
      <DetailLayout
        slots={[{ kind: "info", variant: "tabs" }]}
        data={{ info: [{ title: "상세 정보", node: <p>본문</p> }, { title: "배송", node: <p>배송 안내</p> }] }}
      />,
    );
    const [first, second] = screen.getAllByRole("tab");
    expect(first).toHaveAttribute("aria-controls", screen.getByRole("tabpanel").id);
    expect(second).toHaveAttribute("tabindex", "-1");
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("배송 안내");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", second.id);
  });

  it("uses pressed buttons for gallery thumbnails", () => {
    render(<ProductGallery images={["https://img.test/a.jpg", "https://img.test/b.jpg"]} name="머그" />);
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.getByRole("button", { name: "사진 1" })).toHaveAttribute("aria-pressed", "true");
  });
});
