import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { classCards } from "../src/__stories__/fixtures/templates";
import { CLASS_DESIGNS } from "../src/sections/class";
import { STAY_DESIGNS } from "../src/sections/stay";
import { templateSections } from "../src/sections/template";

const rooms = [
  { id: "prd_1", name: "커플룸", specs: [], price: "1박 110,000원부터", href: "/products/prd_1", sample: true, price_from: 110000, base_guests: 2, max_guests: 2 },
  { id: "prd_2", name: "가족룸", specs: [], price: "1박 150,000원부터", href: "/products/prd_2", price_from: 150000, base_guests: 4, max_guests: 4 },
];

const context = { products: [], categories: [], faqs: [], shipping: null };

describe.each(Object.entries(STAY_DESIGNS))("stay %s rooms", (_, design) => {
  it("marks sample rooms and leaves them without a booking button", () => {
    const Rooms = design.sections.room_list!;
    const { container } = render(<Rooms data={{ rooms }} context={context} />);
    expect(container.querySelectorAll('[data-sample]')).toHaveLength(1);
    expect(container.querySelector('[data-sample]')).toHaveTextContent("예시");
    expect([...container.querySelectorAll("a")].filter((a) => a.textContent?.includes("예약"))).toHaveLength(0);
  });
});

const lessons = [{ ...classCards[0], sample: true }, classCards[1]];

const classLists = [...Object.entries(CLASS_DESIGNS).map(([name, design]) => [name, design.sections.class_list!] as const), ["template", templateSections.class_list] as const];

describe.each(classLists)("class %s list", (_, Classes) => {
  it("marks only sample classes", () => {
    const { container } = render(<Classes data={{ classes: lessons }} context={context} />);
    const marked = container.querySelectorAll("[data-sample]");
    expect(marked).toHaveLength(1);
    expect(marked[0]).toHaveTextContent("예시");
    expect(marked[0]).toHaveTextContent(lessons[0].name);
    const real = [...container.querySelectorAll("a")].find((a) => a.textContent?.includes(lessons[1].name));
    expect(real).toBeDefined();
    expect(real).not.toHaveTextContent("예시");
  });

  it("draws real classes the same with or without the sample flag", () => {
    const plain = render(<Classes data={{ classes: classCards }} context={context} />).container.innerHTML;
    const flagged = render(<Classes data={{ classes: classCards.map((c) => ({ ...c, sample: false })) }} context={context} />).container.innerHTML;
    expect(flagged).toBe(plain);
    expect(plain).not.toContain("예시");
  });
});
