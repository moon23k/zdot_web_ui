import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { applyTemplate, Button, ButtonLink, Checkbox, CheckoutSection, designVars, EmptyState, OrderSummary, Quantity, resolveTemplate } from "../src";
import { SiteLogo } from "../src/blocks/site-header/site-logo";
import { Rows } from "../src/sections/kit";
import { inkOf, onPrimary } from "../src/theme/tokens";
import { footerMark, wordmark } from "../src/utils/styles";

const css = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("R1 buttons", () => {
  it("fills the primary button with the main color and on-primary ink", () => {
    render(<Button>주문하기</Button>);
    const cls = screen.getByRole("button", { name: "주문하기" }).className;
    expect(cls).toContain("ez:bg-primary");
    expect(cls).toContain("ez:text-on-primary");
    expect(cls).toContain("ez:border-transparent");
    expect(cls).not.toContain("ez:bg-point-soft");
    expect(cls).not.toMatch(/shadow/);
  });

  it("keeps secondary and outline as the same hairline button", () => {
    render(
      <>
        <Button variant="secondary">장바구니</Button>
        <ButtonLink href="/x" variant="outline">
          더 보기
        </ButtonLink>
      </>,
    );
    const a = screen.getByRole("button", { name: "장바구니" }).className;
    const b = screen.getByRole("link", { name: "더 보기" }).className;
    for (const cls of [a, b]) {
      expect(cls).toContain("ez:bg-transparent");
      expect(cls).toContain("ez:border-site-edge");
      expect(cls).toContain("ez:text-fg");
    }
  });

  it("shows disabled as an opaque off face without a border", () => {
    render(<Button disabled>주문하기</Button>);
    const cls = screen.getByRole("button", { name: "주문하기" }).className;
    expect(cls).toContain("ez:disabled:bg-off");
    expect(cls).toContain("ez:disabled:text-off-ink");
    expect(cls).toContain("ez:disabled:border-transparent");
    expect(cls).not.toContain("opacity");
  });

  it("gives the legacy button the same faces", () => {
    const legacy = css("../src/styles/legacy.css").replace(/\s+/g, " ");
    expect(legacy).toContain("background: var(--ezd-primary); color: var(--ezd-on-primary);");
    expect(legacy).toContain(".ez-btn--secondary { background: transparent; border-color: var(--ez-color-site-edge); color: var(--ezd-text); }");
    expect(legacy).toContain(".ez-btn:disabled { background: var(--ezd-off); border-color: transparent; color: var(--ezd-off-ink);");
  });

  it("derives the off face from ink and surface", () => {
    const vars = designVars({ color: { text: "#1d1d1b", surface: "#ffffff" } });
    expect(vars["--ezd-off"]).toBe("color-mix(in srgb, #1d1d1b 6%, #ffffff)");
    expect(vars["--ezd-off-ink"]).toBe("color-mix(in srgb, #1d1d1b 45%, #ffffff)");
  });

  it("keeps on-primary at 4.5 or more against the main color", () => {
    expect(onPrimary("#2d5b8a", "#ffffff")).toBe("#ffffff");
    expect(onPrimary("#f5d76e", "#ffffff")).toBe("#111111");
    expect(onPrimary("#1a1a1a", "#111111")).toBe("#ffffff");
    expect(designVars({ color: { primary: "#f5d76e" } })["--ezd-on-primary"]).toBe("#111111");
  });
});

describe("R2 · R3 type", () => {
  it("defaults titles to 400, keeps kit weights and caps them at 500", () => {
    const vars = designVars({});
    expect([vars["--ezd-display-weight"], vars["--ezd-title-weight"], vars["--ezd-subtitle-weight"]]).toEqual(["400", "400", "400"]);
    const kit = designVars({ font: { styles: { title: { weight: 300, style: "normal" }, subtitle: { weight: 500, style: "normal" } } } });
    expect([kit["--ezd-title-weight"], kit["--ezd-subtitle-weight"]]).toEqual(["300", "500"]);
    const bold = designVars({ font: { display_weight: 800, styles: { title: { weight: 700, style: "normal" }, subtitle: { weight: 600, style: "normal" } } } });
    expect([bold["--ezd-display-weight"], bold["--ezd-title-weight"], bold["--ezd-subtitle-weight"]]).toEqual(["500", "500", "500"]);
  });

  it("softens the ink 16% toward the ground and keeps body contrast at 7 or more", () => {
    expect(inkOf("#1d1d1b", "#faf6f1")).toBe("#40403d");
    expect(designVars({ color: { text: "#1d1d1b", surface: "#faf6f1" } })["--ezd-text"]).toBe("#40403d");
    expect(inkOf("#fcfcfc", "color-mix(in srgb, #1d1d1b 90%, #fcfcfc)")).toBe("#dcdcdc");
    expect(inkOf("#555555", "#ffffff")).toBe("#585858");
    expect(inkOf("#777777", "#ffffff")).toBe("#777777");
    expect(inkOf("var(--x)", "#ffffff")).toBe("var(--x)");
  });

  it("keeps muted, lines and the off face on the raw ink", () => {
    const vars = designVars({ color: { text: "#1d1d1b", text_muted: "#6a6a65", surface: "#ffffff" } });
    expect(vars["--ezd-muted"]).toBe("#6a6a65");
    expect(vars["--ezd-off"]).toBe("color-mix(in srgb, #1d1d1b 6%, #ffffff)");
  });

  it("gives the footer the same softened ink as the body", () => {
    const vars = designVars(applyTemplate({}, resolveTemplate("shop", "a")), resolveTemplate("shop", "a").look);
    expect(vars["--ezd-foot-ink"]).toBe(vars["--ezd-text"]);
    expect(vars["--ezd-text"]).not.toBe("#1d1d1b");
  });

  it("drops medium from labels and keeps it on buttons", () => {
    expect(wordmark("ONGI")).toContain("ez:font-normal");
    render(<Button>주문하기</Button>);
    expect(screen.getByRole("button", { name: "주문하기" }).className).toContain("ez:font-medium");
  });

  it("holds the site type ladder in the generated theme", () => {
    const system = css("../src/styles/system.css");
    const size = (name: string) => system.match(new RegExp(`--text-site-${name}: ([\\d.]+)rem;`))?.[1];
    const px = (name: string) => Number(size(name)) * 16;
    expect(["hero", "figure-xl", "display-lg", "display"].map(px)).toEqual([64, 64, 64, 64]);
    expect(["display-md", "figure-lg", "page"].map(px)).toEqual([44, 44, 44]);
    expect(["name", "logo", "section"].map(px)).toEqual([30, 30, 30]);
    expect(["rank", "counter", "heading"].map(px)).toEqual([22, 22, 22]);
    expect(["note", "caption", "small"].map(px)).toEqual([13, 13, 13]);
    expect(px("badge")).toBe(12);
  });

  it("numbers checkout steps in the body face", () => {
    render(
      <CheckoutSection n={1} title="주문자">
        <span />
      </CheckoutSection>,
    );
    const n = screen.getByText("1");
    expect(n.className).toContain("ez:font-body");
    expect(n.className).not.toContain("ez:font-figure");
    expect(n.className).not.toContain("ez:italic");
  });

  it("sets latin store names in the body face", () => {
    expect(wordmark("ONGI")).toContain("ez:font-body");
    expect(wordmark("ONGI")).not.toContain("ez:font-figure");
    expect(footerMark("ONGI")).not.toContain("ez:italic");
  });
});

describe("R4 corners", () => {
  it("rounds quantity and checkbox no more than the button", () => {
    const { container } = render(
      <>
        <Quantity />
        <Checkbox label="동의" />
      </>,
    );
    expect(container.querySelector('[data-slot="quantity"]')?.className).toContain("ez:rounded-button");
    expect(container.querySelector('[data-slot="quantity"]')?.className).not.toContain("ez:rounded-full");
    expect(screen.getByRole("checkbox").className).toContain("ez:rounded-[min(var(--ezd-button-radius),6px)]");
  });

  it("caps the round shape at 14px with no pill button", () => {
    const vars = designVars(applyTemplate({}, resolveTemplate("shop", "c")));
    expect([vars["--ezd-button-radius"], vars["--ezd-radius-sm"], vars["--ezd-radius-md"], vars["--ezd-radius-lg"]]).toEqual(["14px", "14px", "14px", "14px"]);
  });

  it("squares the legacy consent box to the button radius", () => {
    expect(css("../src/styles/legacy.css")).toContain("border-radius: min(var(--ezd-button-radius), 6px);");
  });
});

describe("R5 info rows", () => {
  it("lines a dim 13px label up with a left 15px value", () => {
    render(<Rows rows={[{ label: "배송비", value: "3,000원" }]} />);
    const th = screen.getByRole("rowheader", { name: "배송비" });
    const td = screen.getByText("3,000원");
    expect(th.className).toContain("ez:w-[32%]");
    expect(th.className).toContain("ez:text-site-small");
    expect(th.className).toContain("ez:text-muted");
    expect(td.className).toContain("ez:text-site-body");
    expect(td.className).toContain("ez:text-left");
    expect(td.className).not.toContain("ez:text-right");
  });

  it("sets bare gallery tables the same way", () => {
    const legacy = css("../src/styles/legacy.css").replace(/\s+/g, " ");
    expect(legacy).toContain(':where(.ez-root[data-frame="gallery"] table:not([class])) td { font-size: var(--ez-text-site-body);');
  });
});

describe("site logo", () => {
  const load = (img: HTMLElement, width: number, height: number) => {
    Object.defineProperty(img, "complete", { value: true });
    Object.defineProperty(img, "naturalWidth", { value: width });
    Object.defineProperty(img, "naturalHeight", { value: height });
    fireEvent.load(img);
  };

  it("adds the store name beside a square mark", () => {
    render(<SiteLogo name="한컷 스튜디오" src="/mark.png" />);
    load(screen.getByRole("img", { name: "한컷 스튜디오" }), 64, 64);
    const label = screen.getByText("한컷 스튜디오");
    expect(label.className).toContain("ez:tracking-normal");
    expect(label.className).toContain("ez:font-normal");
    expect(label.className).toContain("ez:text-site-heading");
    expect(document.querySelector('[data-slot="site-logo"]')).toHaveAttribute("data-shape", "mark");
  });

  it("shows the logo picture before it is judged", () => {
    const { container } = render(<SiteLogo name="온기상점" src="/pending.png" />);
    const wrap = container.querySelector('[data-slot="site-logo"]');
    expect(wrap).toHaveAttribute("data-shape", "pending");
    expect(wrap?.className).not.toMatch(/opacity|invisible|hidden/);
    expect(screen.getByRole("img", { name: "온기상점" })).toBeInTheDocument();
    expect(screen.queryByText("온기상점")).toBeNull();
  });

  it("names a known mark on the first render", () => {
    const first = render(<SiteLogo name="한컷 스튜디오" src="/known-mark.png" />);
    load(screen.getByRole("img", { name: "한컷 스튜디오" }), 48, 48);
    first.unmount();
    const { container } = render(<SiteLogo name="한컷 스튜디오" src="/known-mark.png" />);
    expect(container.querySelector('[data-slot="site-logo"]')).toHaveAttribute("data-shape", "mark");
    expect(screen.getByText("한컷 스튜디오")).toBeInTheDocument();
  });

  it("shows a wide wordmark alone", () => {
    render(<SiteLogo name="한컷 스튜디오" src="/word.png" />);
    load(screen.getByRole("img", { name: "한컷 스튜디오" }), 240, 48);
    expect(screen.queryByText("한컷 스튜디오")).toBeNull();
    expect(document.querySelector('[data-slot="site-logo"]')).toHaveAttribute("data-shape", "wide");
  });
});

describe("order summary", () => {
  const quote = { items_total: 120000, product_discount: 0, coupon_discount: 0, delivery_fee: 0, region_fee: 0, shipping_discount: 0, point_used: 0, total: 120000 };

  it("keeps the free shipping row for shipped orders", () => {
    render(<OrderSummary quote={{ ...quote, fulfillment: "ship" }} />);
    expect(screen.getByText("배송비")).toBeInTheDocument();
  });

  it("drops the zero shipping row for visit orders", () => {
    render(<OrderSummary quote={{ ...quote, fulfillment: "visit" }} />);
    expect(screen.queryByText("배송비")).toBeNull();
  });
});

describe("empty state", () => {
  it("centers by default and starts left on account screens", () => {
    const { container } = render(
      <>
        <EmptyState title="받은 쿠폰이 없어요" />
        <EmptyState title="찜한 상품이 없어요" align="start" />
      </>,
    );
    const [center, start] = container.querySelectorAll('[data-slot="empty-state"]');
    expect(center.className).toContain("ez:text-center");
    expect(start.className).toContain("ez:justify-items-start");
    expect(start.className).toContain("ez:text-left");
    expect(start.className).not.toContain("ez:text-center");
    expect(start.querySelector("p")?.className).toContain("ez:text-muted");
  });
});
