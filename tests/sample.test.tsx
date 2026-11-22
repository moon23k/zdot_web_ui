import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { STAY_DESIGNS } from "../src/sections/stay";

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
