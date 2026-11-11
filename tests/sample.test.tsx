import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RoomList } from "../src/sections/template/stay";

const rooms = [
  { id: "prd_1", name: "커플룸", specs: ["기준 2명"], price: "1박 110,000원부터", href: "/products/prd_1", sample: true },
  { id: "prd_2", name: "가족룸", specs: ["기준 4명"], price: "1박 150,000원부터", href: "/products/prd_2" },
];

describe("RoomList", () => {
  it("marks sample rooms and leaves them without a booking button", () => {
    render(<RoomList data={{ rooms }} context={{ products: [], categories: [], faqs: [], shipping: null, flags: {} } as never} />);
    expect(screen.getAllByText("예시")).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: "예약" })).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: "자세히" })).toHaveLength(2);
  });
});
