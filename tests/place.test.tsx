import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { business } from "../src/__stories__/fixtures/commerce";
import { homeSections, paletteDesign, placeInfo, placeIntro, placeMenu, placeStoreLinks } from "../src/__stories__/fixtures/templates";
import { applyTemplate, designVars, resolveTemplate, SiteFooter, SiteHeader, SiteRenderer, templates } from "../src/index";
import { paragraphs, placeLinks, placeNav } from "../src/sections/place/shared";

const letters = ["a", "b", "c"] as const;

const context = { products: [], categories: [], faqs: [{ id: "f1", question: "주차할 수 있나요?", answer: "네" }], shipping: null, storeName: "로렘 입숨" };

const policies = [
  { key: "returns", title: "취소 · 환불 규정" },
  { key: "terms", title: "이용약관" },
  { key: "privacy", title: "개인정보처리방침" },
];

const TRADE = /^\/(products|cart|checkout|login|signup|me|orders|inquiries|quote)(\/|\?|$)/;

function mainColored(root: Element): Element[] {
  return [...root.querySelectorAll("[class]")].filter((el) => /(^|\s)ez:(?:[a-z-]+:)*(bg|text|border|fill|stroke)-primary(\/|\s|$)/.test(el.getAttribute("class") ?? ""));
}

function home(letter: (typeof letters)[number]) {
  const template = resolveTemplate("place", letter);
  const root = render(<SiteRenderer page={{ sections: homeSections.place }} context={context} template={template} />).container.querySelector('[data-slot="site-renderer"]') as HTMLElement;
  return { template, root };
}

function hrefs(root: Element): string[] {
  return [...root.querySelectorAll("a")].map((a) => a.getAttribute("href") ?? "");
}

describe.each(letters)("place %s", (letter) => {
  it("draws the template sections in order", () => {
    const { template, root } = home(letter);
    const slots = [...root.children].map((el) => el.getAttribute("data-slot"));
    expect(slots).toEqual(template.home.map((slot) => slot.kind.replace(/_/g, "-")));
  });

  it("sells nothing on the home", () => {
    const { root } = home(letter);
    expect(hrefs(root).filter((href) => TRADE.test(href))).toEqual([]);
    expect(root.querySelectorAll("th")).toHaveLength(0);
    expect(mainColored(root)).toHaveLength(0);
  });

  it("lists the menu names and prices without links", () => {
    const { template, root } = home(letter);
    const menu = root.querySelector('[data-slot="menu"]');
    if (!template.home.some((slot) => slot.kind === "menu")) {
      expect(menu).toBeNull();
      return;
    }
    expect(menu).toHaveAttribute("id", "menu");
    for (const item of placeMenu.flatMap((g) => g.items)) {
      expect(menu).toHaveTextContent(item.name);
      expect(menu).toHaveTextContent(item.price);
    }
    expect(menu!.querySelectorAll("a")).toHaveLength(0);
  });

  it("shows the intro text as written", () => {
    const { root } = home(letter);
    const intro = root.querySelector('[data-slot="intro"]');
    expect(intro).toHaveAttribute("id", "intro");
    for (const p of paragraphs(placeIntro)) expect(intro).toHaveTextContent(p);
  });

  it("points the visit block at the map, the phone and the store links", () => {
    const { root } = home(letter);
    const place = root.querySelector('[data-slot="store-info"], [data-slot="location"]') as HTMLElement;
    expect(place).toHaveTextContent(placeInfo.address);
    expect(place).toHaveTextContent(placeInfo.hours);
    const links = hrefs(place);
    expect(links).toContain(placeInfo.href);
    expect(links.some((href) => href.startsWith("tel:"))).toBe(true);
    for (const l of placeInfo.links) expect(links).toContain(l.href);
    for (const a of place.querySelectorAll('a[href^="http"]')) expect(a).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("keeps the header and footer free of cart, account and order links", () => {
    const template = resolveTemplate("place", letter);
    const kinds = template.home.map((slot) => slot.kind);
    const { container } = render(
      <>
        <SiteHeader name="로렘 입숨" variant={template.header} main="place" phone="02-000-0000" sections={kinds} links={placeStoreLinks} cartCount={3} signedIn />
        <SiteFooter storeName="로렘 입숨" business={business} hosting="자사닷" policies={policies} hours="매일 11:00 – 21:00" main="place" skin={template.skin} sections={kinds} address={placeInfo.address} links={placeStoreLinks} />
      </>,
    );
    const links = hrefs(container);
    expect(links.filter((href) => TRADE.test(href))).toEqual([]);
    expect(links).not.toContain("/policy/returns");
    expect(links).toContain("/policy/privacy");
    for (const n of placeNav(kinds)) expect(links).toContain(n.href);
    for (const l of placeLinks(placeStoreLinks)) expect(links).toContain(l.href);
    expect(container.querySelectorAll("th")).toHaveLength(0);
  });
});

describe("place home", () => {
  it("puts the menu on every design, right after the intro on c", () => {
    for (const letter of letters) expect(resolveTemplate("place", letter).home.map((slot) => slot.kind)).toContain("menu");
    expect(resolveTemplate("place", "c").home.map((slot) => slot.kind)).toEqual(["hero", "intro", "menu", "store_info", "faq", "photo_band"]);
  });
});

describe("place a night ground", () => {
  const night = resolveTemplate("place", "a");

  it("turns the kit colors over instead of using fixed colors", () => {
    const color = applyTemplate(paletteDesign, night).color!;
    const kit = paletteDesign.color!;
    expect(color.surface).toBe(`color-mix(in srgb, ${kit.text} 90%, ${kit.surface})`);
    expect(color.surface_alt).toBe(`color-mix(in srgb, ${kit.text} 80%, ${kit.surface})`);
    expect(color.text).toBe(kit.surface);
    expect(color.text_muted).toBe(`color-mix(in srgb, ${kit.surface} 72%, ${kit.text})`);
    expect(color.primary).toBe(kit.primary);
  });

  it("starts from the warm tone and the system ink without a palette, never pure black", () => {
    const color = applyTemplate({}, night).color!;
    expect(color.text).toBe("#faf6f1");
    expect(color.surface).toBe("color-mix(in srgb, #1d1d1b 90%, #faf6f1)");
    expect(Object.values(color).join(" ")).not.toMatch(/#000(000)?\b/i);
  });

  it("redraws lines, blank bars and tiles from the light text", () => {
    const vars = designVars(applyTemplate(paletteDesign, night), night.look);
    const text = paletteDesign.color!.surface;
    expect(vars["--ezd-surface"]).toContain(paletteDesign.color!.text);
    expect(vars["--ez-color-site-line"]).toBe(`color-mix(in srgb, ${text} 16%, transparent)`);
    expect(vars["--ez-color-tile-blank"]).toBe(`color-mix(in srgb, ${text} 14%, transparent)`);
    expect(vars["--ez-color-tile-1"]).toBe(vars["--ezd-surface-alt"]);
  });

  it("leaves every other design on its light tone", () => {
    for (const t of Object.values(templates).flat().filter((t) => t.id !== night.id)) {
      expect(t.look.tone).not.toBe("night");
      const vars = designVars(applyTemplate(paletteDesign, t), t.look);
      expect(vars["--ez-color-site-line"]).toBeUndefined();
      expect(vars["--ezd-surface"]).toBe(paletteDesign.color!.surface);
    }
  });
});

describe("place helpers", () => {
  it("keeps only the store links that have a value", () => {
    expect(placeLinks({ instagram: " https://instagram.com/x ", kakao_channel: "", naver_booking: null })).toEqual([{ key: "instagram", label: "인스타그램", href: "https://instagram.com/x" }]);
    expect(placeLinks(null)).toEqual([]);
  });

  it("anchors only the sections on the home", () => {
    expect(placeNav(["hero", "intro", "menu"]).map((n) => n.href)).toEqual(["/#intro", "/#menu"]);
  });
});
