import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { business } from "../src/__stories__/fixtures/commerce";
import { homeSections, placeInfo, placeStoreLinks, quoteCases } from "../src/__stories__/fixtures/templates";
import { resolveTemplate, SiteFooter, SiteHeader, SiteRenderer } from "../src/index";
import { careNav } from "../src/sections/care/shared";
import { bookingLink, isLanding, LANDINGS, landingLinks } from "../src/sections/landing";
import type { TemplateMain } from "../src/templates/types";

const designs: [TemplateMain, "a" | "b" | "c"][] = [
  ["care", "a"],
  ["care", "b"],
  ["care", "c"],
  ["portfolio", "a"],
  ["portfolio", "b"],
  ["portfolio", "c"],
  ["office", "a"],
  ["office", "b"],
];

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

function hrefs(root: Element): string[] {
  return [...root.querySelectorAll("a")].map((a) => a.getAttribute("href") ?? "");
}

function home(main: TemplateMain, letter: string) {
  const template = resolveTemplate(main, letter);
  const root = render(<SiteRenderer page={{ sections: homeSections[main] }} context={context} template={template} />).container.querySelector('[data-slot="site-renderer"]') as HTMLElement;
  return { template, root };
}

describe.each(designs)("landing %s %s", (main, letter) => {
  it("resolves its own design and draws every template section in order", () => {
    const { template, root } = home(main, letter);
    expect(template.main).toBe(main);
    expect(template.letter).toBe(letter);
    const join = LANDINGS[main].designs[template.skin!]?.join ?? [];
    expect([...root.children].map((el) => el.getAttribute("data-slot"))).toEqual(template.home.filter((slot) => !join.includes(slot.kind as never)).map((slot) => slot.kind.replace(/_/g, "-")));
    for (const slot of template.home) expect(root.querySelector(`[data-slot="${slot.kind.replace(/_/g, "-")}"]`)).not.toBeNull();
  });

  it("sells nothing and keeps tables, main color and the quote list out", () => {
    const { root } = home(main, letter);
    const links = hrefs(root);
    expect(links.filter((href) => TRADE.test(href))).toEqual([]);
    expect(links).not.toContain("/cases");
    expect(root.querySelectorAll("th")).toHaveLength(0);
    expect(mainColored(root)).toHaveLength(0);
  });

  it("opens work only on its own case page", () => {
    const { root } = home(main, letter);
    const grid = root.querySelector('[data-slot="case-grid"]');
    if (!grid) return;
    for (const c of quoteCases) expect(hrefs(grid)).toContain(`/cases/${c.id}`);
  });

  it("keeps the header and footer free of cart, account and order links", () => {
    const template = resolveTemplate(main, letter);
    const kinds = template.home.map((slot) => slot.kind);
    const { container } = render(
      <>
        <SiteHeader name="로렘 입숨" variant={template.header} main={main} phone="02-000-0000" address={placeInfo.address} sections={kinds} links={placeStoreLinks} cartCount={3} signedIn />
        <SiteFooter storeName="로렘 입숨" business={business} hosting="자사닷" policies={policies} hours="매일 11:00 – 21:00" main={main} skin={template.skin} sections={kinds} address={placeInfo.address} links={placeStoreLinks} />
      </>,
    );
    const links = hrefs(container);
    expect(links.filter((href) => TRADE.test(href))).toEqual([]);
    expect(links).not.toContain("/policy/returns");
    expect(links).toContain("/policy/privacy");
    for (const n of LANDINGS[main].nav(kinds, template.skin)) expect(links).toContain(n.href);
    for (const l of landingLinks(placeStoreLinks)) expect(links).toContain(l.href);
  });
});

describe("landing data", () => {
  it("puts the portfolio b intro and contact in the work column", () => {
    const { root } = home("portfolio", "b");
    const grid = root.querySelector('[data-slot="case-grid"]')!;
    expect(grid.querySelector('[data-slot="intro"]')).not.toBeNull();
    expect(grid.querySelector('[data-slot="store-info"]')).not.toBeNull();
  });

  it("puts the portfolio c name, intro and links beside the portrait", () => {
    const { root } = home("portfolio", "c");
    const hero = root.querySelector('[data-slot="hero"]')!;
    expect(hero.querySelector('[data-slot="intro"]')).not.toBeNull();
    for (const l of placeInfo.links) expect(hrefs(hero)).toContain(l.href);
    expect([...root.children].map((el) => el.getAttribute("data-slot"))).toEqual(["hero", "case-grid", "store-info"]);
  });

  it("shows the portfolio c work even when there is none yet", () => {
    const template = resolveTemplate("portfolio", "c");
    const { container } = render(<SiteRenderer page={{ sections: [] }} context={context} template={template} />);
    const grid = container.querySelector('[data-slot="case-grid"]');
    expect(grid).toHaveAttribute("data-blank");
    expect(grid?.querySelectorAll("a")).toHaveLength(0);
  });

  it("puts the phone and the booking link on the care first screens", () => {
    for (const letter of ["a", "b", "c"]) {
      const { root } = home("care", letter);
      const hero = root.querySelector('[data-slot="hero"]')!;
      expect(hrefs(hero).some((href) => href.startsWith("tel:"))).toBe(true);
      expect(hrefs(hero)).toContain(placeInfo.links[0].href);
    }
  });

  it("hugs the header with the full width first photo on landing designs only", () => {
    for (const [main, letter] of [["place", "a"], ["portfolio", "a"], ["office", "a"]] as const) {
      expect(home(main, letter).root.firstElementChild).toHaveAttribute("data-flush");
    }
    for (const [main, letter] of [["shop", "a"], ["stay", "a"], ["class", "a"], ["quote", "a"]] as const) {
      expect(home(main, letter).root.querySelector("[data-flush]")).toBeNull();
    }
  });
});

describe("landing rules", () => {
  it("knows every landing kind and nothing else", () => {
    for (const main of ["place", "care", "portfolio", "office"]) expect(isLanding(main)).toBe(true);
    for (const main of ["shop", "class", "stay", "quote", null]) expect(isLanding(main)).toBe(false);
  });

  it("gives office no showroom design", () => {
    expect(resolveTemplate("office", "c").letter).toBe("a");
    expect(Object.keys(LANDINGS.office.designs)).toEqual(["editorial", "catalog", "aurora", "night"]);
  });

  it("names the care price list the same on every design", () => {
    expect(careNav(["menu"], "editorial")[0].label).toBe("가격 안내");
    expect(careNav(["menu"], "catalog")[0].label).toBe("가격 안내");
    expect(careNav(["menu"], "showroom")[0].label).toBe("가격 안내");
  });

  it("books through naver booking or the kakao channel only", () => {
    expect(bookingLink(landingLinks({ instagram: "https://instagram.com/x" }))).toBeNull();
    expect(bookingLink(landingLinks({ instagram: "https://instagram.com/x", kakao_channel: "https://pf.kakao.com/x" }))?.key).toBe("kakao_channel");
    expect(bookingLink(landingLinks({ kakao_channel: "https://pf.kakao.com/x", naver_booking: "https://booking.naver.com/x" }))?.key).toBe("naver_booking");
  });
});
