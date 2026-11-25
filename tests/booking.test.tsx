import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { BookingFrame, CardPrice, Quantity } from "../src";

function Harness() {
  const [qty, setQty] = useState(1);
  return (
    <BookingFrame
      action="/checkout"
      bar={{ title: "물레 원데이", label: "예약하기", amount: "48,000원", unit: "1인" }}
      main={<input type="hidden" name="item" value="v1" />}
      card={
        <>
          <CardPrice amount="48,000원" unit="1인" tag="1실 남음" />
          <input type="hidden" name="slot" value="s1" />
          <Quantity name="qty" label="인원" value={qty} onChange={setQty} min={1} max={5} size="sm" />
          <button type="submit">제출</button>
        </>
      }
    />
  );
}

describe("BookingFrame 모바일 시트", () => {
  it("시트 안에서 고른 값이 예약 폼 제출에 그대로 들어간다", async () => {
    const { container } = render(<Harness />);
    const form = container.querySelector("form")!;
    expect(container.querySelectorAll("input[name=slot]")).toHaveLength(1);
    await userEvent.click(screen.getByRole("button", { name: "예약하기" }));
    const sheet = screen.getByRole("dialog");
    expect(sheet).toHaveAccessibleName("물레 원데이");
    expect(form.contains(sheet)).toBe(true);
    expect(sheet.className).toContain("ez:max-h-[calc(100dvh-2rem)]");
    expect(container.querySelector("aside[data-slot=booking-card]")).toBeNull();
    expect(sheet).toHaveTextContent("1실 남음");
    expect(sheet).not.toHaveTextContent("48,000원");
    await userEvent.click(screen.getByRole("button", { name: "인원 수량 늘리기" }));
    const data = new FormData(form);
    expect(data.getAll("slot")).toEqual(["s1"]);
    expect(data.getAll("qty")).toEqual(["2"]);
    expect(data.getAll("item")).toEqual(["v1"]);
    expect(form.contains(screen.getByRole("button", { name: "제출" }))).toBe(true);
  });

  it("막대가 없으면 시트 · 막대 없이 예약 상자만", () => {
    const { container } = render(<BookingFrame action="/checkout" main={null} card={<CardPrice amount="95,000원" unit="1박" />} />);
    expect(container.querySelector("[data-slot=booking-bar]")).toBeNull();
    expect(container.querySelector("aside[data-slot=booking-card]")).toHaveTextContent("95,000원");
  });
});
