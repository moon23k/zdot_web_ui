import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { homeSections, paletteDesign, stayAddOns, stayRooms, staySearched } from "../src/__stories__/fixtures/templates";
import { applyTemplate, designVars, resolveTemplate, SiteFooter, SiteHeader, SiteRenderer, StayRooms } from "../src/index";
import { dateBounds } from "../src/sections/stay/booking";
import { roomNotes, roomView, stayDate, stayNav } from "../src/sections/stay/shared";

const letters = ["a", "b", "c"] as const;

const context = { products: [], categories: [], faqs: [], shipping: null, storeName: "로렘 입숨" };

const policies = [
  { key: "returns", title: "취소 · 환불 규정" },
  { key: "terms", title: "이용약관" },
  { key: "privacy", title: "개인정보처리방침" },
];

function mainColored(root: Element): Element[] {
  return [...root.querySelectorAll("[class]")].filter((el) => /(^|\s)ez:(?:[a-z-]+:)*(bg|text|border|fill|stroke)-primary(\/|\s|$)/.test(el.getAttribute("class") ?? ""));
}

function list(letter: (typeof letters)[number], searched = true) {
  const template = resolveTemplate("stay", letter);
  return render(
    <StayRooms
      skin={template.skin}
      title="객실"
      count={4}
      crumbs={[
        { label: "홈", href: "/" },
        { label: "객실", href: "/products" },
      ]}
      search={{ check_in: searched ? "2026-12-12" : null, check_out: searched ? "2026-12-13" : null, adults: 2, children: 0, max: 6 }}
      rooms={searched ? staySearched : stayRooms}
      peak
      addOns={stayAddOns}
      photo="/sample/hero.jpg"
    />,
  ).container;
}

describe.each(letters)("stay %s", (letter) => {
  const template = resolveTemplate("stay", letter);

  it("draws its own header and footer with menus only for sections on the home", () => {
    const head = render(<SiteHeader name="로렘 입숨" main="stay" variant={template.header} sections={["hero", "room_list", "house_rules"]} />).container;
    const nav = head.querySelector('nav[aria-label="주요 메뉴"]') as HTMLElement;
    expect([...nav.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual(["/products", "/#rules"]);
    expect(head.querySelector('a[href="/products"]:not(nav a)')).toHaveTextContent("예약하기");
    expect(head.querySelector('a[href="/login"]')).not.toBeNull();
    const foot = render(<SiteFooter storeName="로렘 입숨" business={null} hosting="자사닷" policies={policies} main="stay" skin={template.skin} />).container;
    expect(foot.querySelector('[data-slot="site-footer"]')).not.toHaveAttribute("data-variant", "full");
    for (const href of ["/products", "/products#rates", "/orders", "/orders/lookup", "/policy/returns", "/policy/terms", "/policy/privacy"]) expect(foot.querySelector(`a[href="${href}"]`)).not.toBeNull();
  });

  it("sends real dates and guests from the booking form", () => {
    const home = render(<SiteRenderer page={{ sections: homeSections.stay }} context={context} template={template} />).container;
    const form = home.querySelector('form[role="search"]') as HTMLFormElement;
    expect(form.getAttribute("action")).toBe("/products");
    expect(form.getAttribute("method")).toBe("get");
    expect(form.querySelector('input[type="date"][aria-label="체크인"]')).not.toBeNull();
    expect(form.querySelector('input[type="date"][aria-label="체크아웃"]')).not.toBeNull();
    expect(form.querySelector('select[name="adults"][aria-label="성인"]')).not.toBeNull();
    expect(form.querySelector('select[name="children"][aria-label="아동"]')).not.toBeNull();
    expect(form.querySelector('button[type="submit"]')).toHaveTextContent("예약 가능 객실 보기");
    const picked = list(letter).querySelector('form[role="search"]') as HTMLFormElement;
    expect(picked.querySelector('input[name="check_in"]')).toHaveValue("2026-12-12");
    expect(picked.querySelector('input[name="check_out"]')).toHaveValue("2026-12-13");
  });

  it("keeps the main colour to the picked-date dot", () => {
    const home = render(<SiteRenderer page={{ sections: homeSections.stay }} context={context} template={template} />).container;
    expect(mainColored(home)).toHaveLength(0);
    const head = render(<SiteHeader name="로렘 입숨" main="stay" variant={template.header} />).container;
    expect(mainColored(head)).toHaveLength(0);
    const picked = list(letter);
    expect(mainColored(picked).map((el) => el.getAttribute("data-slot"))).toEqual(["stay-dot"]);
    expect(mainColored(list(letter, false))).toHaveLength(0);
    const blank = render(<SiteRenderer page={{ sections: [] }} context={{ ...context, storeName: undefined }} template={template} />).container;
    expect(mainColored(blank)).toHaveLength(0);
  });

  it("books only open rooms and shows the rate table with peak columns", () => {
    const view = list(letter);
    const cards = [...view.querySelectorAll('[data-slot="room-card"]')];
    expect(cards.map((c) => c.getAttribute("data-state"))).toEqual(["open", "open", "full", "nights"]);
    expect(cards.map((c) => [...c.querySelectorAll("a")].some((a) => a.textContent?.trim() === "예약하기"))).toEqual([true, true, false, false]);
    expect(cards[2]).toHaveTextContent("예약 마감");
    expect(cards[3]).toHaveTextContent("2박부터");
    const rates = view.querySelector("#rates") as HTMLElement;
    expect(rates).toHaveTextContent("성수기 주말");
    expect(rates).toHaveTextContent("440,000원");
  });

  it("turns the kit faces off and uses the shop look of the same skin", () => {
    const design = applyTemplate(paletteDesign, template);
    expect(design.color?.accent).toBeUndefined();
    const vars = designVars(design, template.look);
    expect(vars["--ezd-foot"]).toBe("transparent");
    expect(vars["--ezd-section-gap"]).toBe(`${resolveTemplate("shop", letter).look.section}px`);
    expect(template.skin).toBe(resolveTemplate("shop", letter).skin);
  });

  it("draws every home section blank without links when there is no data", () => {
    const root = render(<SiteRenderer page={{ sections: [] }} context={{ ...context, storeName: undefined }} template={template} />).container;
    for (const slot of root.querySelectorAll("[data-blank]")) {
      expect(slot.querySelectorAll("a, button, input, select")).toHaveLength(0);
    }
  });
});

describe("stay shared wording", () => {
  it("writes dates, prices and states the same way for every design", () => {
    expect(stayDate("2026-12-12")).toBe("12.12 (토)");
    const views = staySearched.map(roomView);
    expect(views.map(roomNotes)).toEqual([["남은 객실 1"], ["남은 객실 2"], ["예약 마감"], ["2박부터"]]);
    expect(stayRooms.map(roomView).map((v) => v.from)[1]).toBe("1박 180,000원~");
    expect(stayRooms.map(roomView).map(roomNotes)[2]).toEqual(["오늘 마감"]);
    expect(stayNav(["hero", "reviews"]).map((n) => n.label)).toEqual(["객실", "리뷰"]);
  });

  it("limits the date inputs to what the room search accepts", () => {
    expect(dateBounds("check_in", "", "2026-11-22")).toEqual({ min: "2026-11-22", max: "2027-11-22" });
    expect(dateBounds("check_out", "2026-12-12", "2026-11-22")).toEqual({ min: "2026-12-13", max: "2027-03-14" });
  });

  it("keeps one visible review heading on the editorial home", () => {
    const home = render(<SiteRenderer page={{ sections: homeSections.stay }} context={context} template={resolveTemplate("stay", "a")} />).container;
    expect([...home.querySelectorAll("h2")].filter((h) => h.textContent === "리뷰")).toHaveLength(1);
  });
});
