import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import products from "../src/__stories__/fixtures/products.json";
import { homeSections, paletteDesign, quoteCases, quoteIncludes, quoteStarter } from "../src/__stories__/fixtures/templates";
import { business } from "../src/__stories__/fixtures/commerce";
import { applyTemplate, QUOTE_CONSENT, QuoteCases, resolveTemplate, SiteFooter, SiteHeader, SiteRenderer } from "../src/index";
import { caseView, quoteNav } from "../src/sections/quote/shared";

const letters = ["a", "b", "c"] as const;

const context = { products: products.slice(0, 4), categories: [], faqs: [{ id: "f1", question: "실측은 무료인가요?", answer: "네" }], shipping: null, storeName: "로렘 입숨" };

const policies = [
  { key: "returns", title: "취소 · 환불 규정" },
  { key: "terms", title: "이용약관" },
  { key: "privacy", title: "개인정보처리방침" },
];

function mainColored(root: Element): Element[] {
  return [...root.querySelectorAll("[class]")].filter((el) => /(^|\s)ez:(?:[a-z-]+:)*(bg|text|border|fill|stroke)-primary(\/|\s|$)/.test(el.getAttribute("class") ?? ""));
}

function home(letter: (typeof letters)[number], sections = homeSections.quote, arranged = false) {
  return render(<SiteRenderer page={{ sections, arranged }} context={context} template={resolveTemplate("quote", letter)} />).container.querySelector('[data-slot="site-renderer"]') as HTMLElement;
}

function list(letter: (typeof letters)[number]) {
  const template = resolveTemplate("quote", letter);
  return render(
    <QuoteCases
      skin={template.skin}
      title="작업 사례"
      count={quoteCases.length}
      crumbs={[
        { label: "홈", href: "/" },
        { label: "작업 사례", href: "/cases" },
      ]}
      tabs={[
        { label: "전체", href: "/cases", count: 8, on: true },
        { label: "아파트", href: "/cases?category=%EC%95%84%ED%8C%8C%ED%8A%B8", count: 4 },
      ]}
      cases={quoteCases}
      rating={{ average: 4.9, count: 128 }}
      request={quoteStarter}
      storeName="로렘 입숨"
    />,
  ).container;
}

describe.each(letters)("quote %s", (letter) => {
  const template = resolveTemplate("quote", letter);

  it("draws its own header with the phone, the lookup and only the menus on the home", () => {
    const kinds = template.home.map((slot) => slot.kind).filter((k) => k !== "faq");
    const head = render(<SiteHeader name="로렘 입숨" main="quote" variant={template.header} phone="02-000-0000" sections={kinds} />).container;
    const nav = head.querySelector('nav[aria-label="주요 메뉴"]') as HTMLElement;
    expect([...nav.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual(quoteNav(kinds).map((n) => n.href));
    expect(nav.querySelector('a[href="/#faq"]')).toBeNull();
    expect(head.querySelector('a[href^="tel:"]')).toHaveTextContent("02-000-0000");
    expect(head.querySelector('a[href="/quote/lookup"]')).toHaveTextContent("견적 요청 조회");
    expect(head.querySelector('a[href="/quote"]')).toHaveTextContent("견적 요청");
  });

  it("puts the business information, customer center and terms in its footer", () => {
    const foot = render(<SiteFooter storeName="로렘 입숨" business={business} hours="평일 10:00 – 18:00" hosting="자사닷" policies={policies} main="quote" skin={template.skin} sections={template.home.map((s) => s.kind)} />).container;
    expect(foot.querySelector('[data-slot="site-footer"]')).not.toHaveAttribute("data-variant", "full");
    for (const text of [business.registration_no, business.ceo_name, "자사닷", "평일 10:00 – 18:00"]) expect(foot.textContent).toContain(text);
    for (const href of ["/cases", "/quote/lookup", "/policy/terms", "/policy/privacy"]) expect(foot.querySelector(`a[href="${href}"]`)).not.toBeNull();
  });

  it("sends the chosen first questions to the request form", () => {
    const root = home(letter);
    const form = root.querySelector('form[data-slot="quote-starter-form"]') as HTMLFormElement;
    expect(form.getAttribute("action")).toBe("/quote");
    expect(form.getAttribute("method")).toBe("get");
    expect(form.getAttribute("aria-label")).toBe("견적 요청");
    for (const q of quoteStarter.questions ?? []) {
      const radios = [...form.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${q.id}"]`)];
      expect(radios.map((r) => r.value)).toEqual(q.options);
      expect(radios.every((r) => !r.checked)).toBe(true);
      expect(radios[0].closest("fieldset")?.querySelector("legend")).toHaveTextContent(q.label);
    }
    expect(form.querySelector('button[type="submit"]')).toHaveTextContent("견적 요청");
    expect(root.textContent).toContain(QUOTE_CONSENT);
  });

  it("uses the main color only for the chosen option check", () => {
    const root = home(letter);
    const colored = mainColored(root);
    expect(colored.length).toBeGreaterThan(0);
    for (const el of colored) {
      expect(el.tagName.toLowerCase()).toBe("svg");
      expect(el.closest("label")?.querySelector('input[type="radio"]')).not.toBeNull();
    }
    expect(applyTemplate(paletteDesign, template).color?.accent).toBeUndefined();
  });

  it("shows the closed state without option cells or a form", () => {
    const closed = { ...quoteStarter, open: false, questions: [] };
    const root = home(letter, [{ kind: "hero", v: 1, data: {} }, { kind: "quote_starter", v: 1, data: closed }], true);
    const block = root.querySelector('[data-slot="quote-starter"]') as HTMLElement;
    expect(block).toHaveTextContent("지금은 견적 요청을 받지 않아요");
    expect(block.querySelector("form")).toBeNull();
    expect(block).not.toHaveAttribute("data-blank");
  });

  it("links every case to its page and the list ends with the request block", () => {
    const root = list(letter);
    const items = [...root.querySelectorAll('[data-slot="case-item"]')];
    expect(items).toHaveLength(quoteCases.length);
    expect(root.querySelector(`a[href="${caseView(quoteCases[0]).href}"]`)).not.toBeNull();
    expect(root.querySelector('nav[aria-label="분류"] a[aria-current="page"]')).toHaveTextContent("전체");
    expect(root.querySelector("h1")).toHaveTextContent("작업 사례");
    expect(root.textContent).toContain("02-000-0000");
    expect(mainColored(root).filter((el) => !el.closest("label")?.querySelector('input[type="radio"]'))).toEqual([]);
  });
});

describe("quote trust line", () => {
  it("draws the trust line inside the first screen for a and c only when it follows the hero", () => {
    for (const letter of ["a", "c"] as const) {
      const root = home(letter);
      expect(root.querySelector(':scope > [data-slot="trust-line"]')).toBeNull();
      expect(root.querySelector('[data-slot="hero"] [data-slot="trust-line"]')).toHaveTextContent("A/S 1년");
      const moved = home(letter, [homeSections.quote[0], homeSections.quote[2], homeSections.quote[1]], true);
      expect(moved.querySelector(':scope > [data-slot="trust-line"]')).toHaveTextContent("A/S 1년");
      expect(moved.querySelector('[data-slot="hero"] [data-slot="trust-line"]')).toBeNull();
    }
    expect(home("b").querySelector(':scope > [data-slot="trust-line"]')).toHaveTextContent("A/S 1년");
  });

  it("keeps a blank hero free of links and forms even when the request questions exist", () => {
    for (const letter of letters) {
      const root = home(letter, [{ kind: "hero", v: 1, data: { request: quoteStarter } }], true);
      const hero = root.querySelector('[data-slot="hero"]') as HTMLElement;
      expect(hero).toHaveAttribute("data-blank");
      expect(hero.querySelectorAll("a, button, form, input")).toHaveLength(0);
    }
  });
});

describe("quote package includes", () => {
  it("lists what each package includes in b and c, with nothing for a package without lines", () => {
    for (const letter of ["b", "c"] as const) {
      const block = home(letter).querySelector('[data-slot="package-cards"]') as HTMLElement;
      const lists = [...block.querySelectorAll('[data-slot="package-includes"]')];
      expect(lists.map((l) => [...l.querySelectorAll("li")].map((li) => li.textContent))).toEqual(quoteIncludes.filter((lines) => lines.length));
      expect(lists.every((l) => l.getAttribute("aria-label") === "포함")).toBe(true);
      expect(mainColored(block)).toEqual([]);
      expect(block.querySelectorAll('a[href="/quote"]')).toHaveLength(4);
    }
  });

  it("draws no include rows when the packages have none", () => {
    for (const letter of ["b", "c"] as const) {
      const root = home(letter, [{ kind: "package_cards", v: 1, data: { items: [{ name: "기본", price: "100,000원" }, { name: "표준", price: "200,000원", includes: [" "] }, { name: "확장", price: "300,000원" }] } }], true);
      expect(root.querySelector('[data-slot="package-includes"]')).toBeNull();
    }
  });
});
