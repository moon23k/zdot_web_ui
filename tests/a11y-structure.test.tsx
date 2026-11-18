import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DetailLayout, ProductGallery, resolveTemplate, SiteRenderer } from "../src";

const context = { products: [], categories: [], faqs: [], shipping: null };

describe("page structure", () => {
  it.each([
    ["shop", "d"],
    ["quote", "b"],
  ] as const)("gives the %s %s home a page heading", (main, letter) => {
    render(<SiteRenderer page={{ sections: [{ kind: "intro", data: { title: "작은 공방의 계절 차" } }] }} context={context} template={resolveTemplate(main, letter)} />);
    expect(screen.getByRole("heading", { level: 1, name: "작은 공방의 계절 차" })).toBeTruthy();
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
