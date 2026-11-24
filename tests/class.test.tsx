import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { classCards, classSessions, homeSections } from "../src/__stories__/fixtures/templates";
import { BookingHead, ClassCatalog, resolveTemplate, SiteFooter, SiteHeader, SiteRenderer } from "../src/index";

const letters = ["a", "b", "c"] as const;
const policies = [
  { key: "returns", title: "교환·반품 안내" },
  { key: "terms", title: "이용약관" },
  { key: "privacy", title: "개인정보처리방침" },
];
const context = { products: [], categories: [], faqs: [{ id: "f1", question: "주차되나요?", answer: "건물 뒤 주차장이 있어요." }], shipping: null, storeName: "흙손 공방" };

function mainColored(root: Element): Element[] {
  return [...root.querySelectorAll("[class]")].filter((el) => !el.closest(".ez\\:invisible") && /(^|\s)ez:(?:[a-z-]+:)*(bg|text|border|fill|stroke)-primary(\/|\s|$)/.test(el.getAttribute("class") ?? ""));
}

function catalog(letter: (typeof letters)[number], view: "classes" | "schedule" = "classes") {
  return render(
    <ClassCatalog
      skin={resolveTemplate("class", letter).skin}
      view={view}
      title="전체 클래스"
      count={classCards.length}
      crumbs={[
        { label: "홈", href: "/" },
        { label: "전체 클래스", href: "/classes" },
      ]}
      tabs={[
        { label: "전체", href: "/classes", on: true, count: 3 },
        { label: "원데이", href: "/classes?category=k1", count: 2 },
        { label: "단체", href: "/classes?category=k3", count: 0 },
      ]}
      sorts={[
        { label: "가까운 일정순", href: "/classes", on: true },
        { label: "낮은 가격순", href: "/classes?sort=price_asc" },
      ]}
      classes={classCards}
      sessions={classSessions}
      links={{ classes: "/classes", schedule: "/classes?view=schedule" }}
    />,
  ).container;
}

function home(letter: (typeof letters)[number], sections = homeSections.class) {
  return render(<SiteRenderer page={{ sections, arranged: true }} context={context} template={resolveTemplate("class", letter)} />).container;
}

describe.each(letters)("class %s", (letter) => {
  const template = resolveTemplate("class", letter);

  it("draws its own header and footer with the class menu and booking links", () => {
    const head = render(<SiteHeader name="흙손 공방" variant={template.header} main="class" sections={["hero", "class_list", "class_schedule", "location"]} categories={[{ id: "k1", name: "원데이" }]} />).container;
    expect(head.querySelector('[data-slot="site-header"]')).not.toBeNull();
    expect(head.querySelector('a[href="/classes"]')).not.toBeNull();
    expect(head.querySelector('a[href="/#schedule"]')).not.toBeNull();
    expect(head.querySelector('a[href="/#location"]')).not.toBeNull();
    expect(head.querySelector('a[href="/#reviews"]')).toBeNull();
    expect(head.querySelector('a[href="/orders/lookup"]')).not.toBeNull();
    expect(mainColored(head)).toHaveLength(0);
    const foot = render(<SiteFooter storeName="흙손 공방" business={null} hosting="자사닷" policies={policies} main="class" skin={template.skin} />).container;
    expect(foot.querySelector('[data-slot="site-footer"]')).not.toHaveAttribute("data-variant", "full");
    for (const href of ["/login", "/orders", "/classes", "/policy/returns", "/policy/terms", "/policy/privacy"]) expect(foot.querySelector(`a[href="${href}"]`)).not.toBeNull();
  });

  it("moves between kinds with text tabs, counts and no empty kind", () => {
    const list = catalog(letter);
    const tabs = list.querySelector('nav[aria-label="카테고리"], nav[aria-label="종류"]') as HTMLElement;
    expect(tabs.querySelector('a[href="/classes?category=k3"]')).toBeNull();
    expect(tabs.querySelector('a[href="/classes?category=k1"]')).toHaveTextContent("원데이2");
    expect(tabs.querySelector('[aria-current="page"]')).toHaveTextContent("전체");
    expect(list.querySelectorAll('[data-slot="class-card"]').length).toBe(classCards.length);
    expect(list.querySelector('a.ez\\:rounded-full')).toBeNull();
    expect(mainColored(list)).toHaveLength(letter === "b" ? 1 : 0);
  });

  it("shows full sessions faded without booking and few seats by weight only", () => {
    const root = home(letter);
    const rows = [...root.querySelectorAll('[data-slot="class-schedule"] [data-slot="session-row"]')];
    expect(rows.length).toBeGreaterThan(0);
    const full = rows.find((r) => r.hasAttribute("data-full"));
    if (full) {
      expect(full).toHaveTextContent("마감");
      expect(within(full as HTMLElement).queryByText("예약하기")).toBeNull();
    }
    const few = rows.find((r) => r.textContent?.includes("남은 자리 1"));
    if (few) expect(mainColored(few)).toHaveLength(0);
    expect(mainColored(root)).toHaveLength(letter === "b" ? 1 : 0);
  });

  it("keeps a blank hero and blank sections without links", () => {
    const root = render(<SiteRenderer page={{ sections: [] }} context={{ ...context, faqs: [] }} template={template} />).container;
    const hero = root.querySelector('[data-slot="hero"]');
    expect(hero).toHaveAttribute("data-blank");
    expect(root.querySelectorAll("a")).toHaveLength(0);
  });
});

describe("class b day strip", () => {
  it("picks the first day with classes and switches the rows to the picked day", () => {
    const root = home("b", homeSections.class.filter((s) => s.kind === "class_schedule"));
    const days = [...root.querySelectorAll('[role="group"][aria-label="날짜"] button')] as HTMLButtonElement[];
    expect(days).toHaveLength(7);
    const pressed = days.find((d) => d.getAttribute("aria-pressed") === "true") as HTMLButtonElement;
    expect(pressed).toBeDefined();
    const target = classSessions[3];
    const button = days.find((d) => !d.disabled && d !== pressed && d.getAttribute("aria-label")?.includes(`${Number(target.ymd!.slice(8))}일`)) as HTMLButtonElement;
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(root.querySelector('[data-slot="class-schedule"]')).toHaveTextContent("커플 물레 체험");
    expect(days.filter((d) => d.disabled).every((d) => d.textContent?.includes("–"))).toBe(true);
  });

  it("lists the nearest days when this week has no class", () => {
    const later = classSessions.filter((s) => s.id === "s6");
    const root = home("b", [{ kind: "class_schedule", data: { sessions: later } }]);
    expect(root.querySelectorAll('[data-slot="session-row"]')).toHaveLength(1);
  });
});

describe("class dates and rows", () => {
  it.each(letters)("shows one date format per session in %s", (letter) => {
    const root = home(letter, homeSections.class.filter((s) => s.kind === "class_schedule" || s.kind === "hero"));
    for (const slot of ["hero", "class-schedule"]) {
      const text = root.querySelector(`[data-slot="${slot}"]`)?.textContent ?? "";
      if (slot === "class-schedule") expect(text).toMatch(/\d{1,2}\.\d{2}/);
      expect(text).not.toMatch(/\d+월 \d+일/);
    }
  });

  it("fills the catalog class row with as many columns as classes", () => {
    const sections = [{ kind: "class_list", data: { classes: classCards.slice(0, 3) } }];
    const grid = home("b", sections).querySelector('[data-slot="class-list"] .ez\\:grid') as HTMLElement;
    expect(grid.className).toContain("ez:md:grid-cols-3");
    expect(grid.className).not.toContain("ez:lg:grid-cols-4");
  });
});

describe("course rows: length is one class, sessions are counted apart", () => {
  const course = classSessions.filter((s) => s.id === "s6");

  it.each(letters)("home schedule in %s", (letter) => {
    const row = home(letter, [{ kind: "class_schedule", data: { sessions: course } }]).querySelector('[data-slot="session-row"]')!;
    expect(row.textContent).toContain("회차 4회");
    expect(row.textContent).not.toContain("소요 4회");
    if (letter !== "a") expect(row.textContent).toContain("소요 120분");
  });

  it.each(letters)("catalog schedule in %s", (letter) => {
    const rows = [...catalog(letter, "schedule").querySelectorAll('[data-slot="session-row"]')];
    const text = rows.map((r) => r.textContent).join("|");
    expect(rows.length).toBeGreaterThan(0);
    expect(text).toContain("회차 4회");
    expect(text).not.toContain("소요 4회");
    expect(text).not.toContain("회차 1회");
  });
});

describe("booking head facts", () => {
  const all = [
    { label: "소요", value: "2시간" },
    { label: "정원", value: "6명" },
    { label: "회차", value: "4회" },
    { label: "장소", value: "공방" },
    { label: "난이도", value: "입문" },
  ];

  it.each([1, 2, 3, 4, 5])("wide columns follow %i facts", (count) => {
    const { container } = render(<BookingHead title="물레 원데이" facts={all.slice(0, count)} />);
    const classes = (container.querySelector("dl")?.getAttribute("class") ?? "").split(" ");
    expect(classes).toContain("ez:grid-cols-2");
    expect(classes.filter((c) => c.startsWith("ez:md:grid-cols-"))).toEqual([`ez:md:grid-cols-${Math.min(count, 4)}`]);
  });

  it("keeps the four-column classes", () => {
    const { container } = render(<BookingHead title="물레 원데이" facts={all.slice(0, 4)} />);
    expect(container.querySelector("dl")?.getAttribute("class")).toBe("ez:m-0 ez:grid ez:grid-cols-2 ez:border-0 ez:border-y ez:border-solid ez:border-site-line ez:md:grid-cols-4");
  });
});
