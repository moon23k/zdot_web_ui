import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cartLines } from "../src/__stories__/fixtures/commerce";
import { AddressForm, CartLine, CartView, OrderNumber } from "../src";

const noop = async () => {};

describe("AddressForm contact", () => {
  it("draws the recipient and phone fields by default", () => {
    const { container } = render(<AddressForm mock />);
    expect(container.querySelector('input[name="recipient"]')).not.toBeNull();
    expect(container.querySelector('input[name="phone"]')).not.toBeNull();
  });

  it("leaves the recipient and phone fields out when contact is off", () => {
    const { container } = render(<AddressForm mock contact={false} />);
    expect(container.querySelector('input[name="recipient"]')).toBeNull();
    expect(container.querySelector('input[name="phone"]')).toBeNull();
    expect(container.querySelector('input[name="postal_code"]')).not.toBeNull();
    expect(container.querySelector('input[name="address_detail"]')).not.toBeNull();
  });
});

describe("CartLine", () => {
  it("stacks name, option, amount, then quantity inside the photo column", () => {
    const { container } = render(
      <ul>
        <CartLine line={cartLines[0]} updateAction={noop} removeAction={noop} />
      </ul>,
    );
    const info = container.querySelector('[data-slot="cart-line"] > div')!;
    const text = info.textContent ?? "";
    const at = (s: string) => text.indexOf(s);
    expect(at("린넨 셔츠")).toBeLessThan(at("M"));
    expect(at("M")).toBeLessThan(at("52,000원"));
    const amount = screen.getByText((_, el) => el?.tagName === "STRONG" && el.textContent?.endsWith("52,000원") === true);
    expect(amount).toHaveClass("ez:text-site-body", "ez:font-medium");
    expect(amount.nextElementSibling?.querySelector("form")).not.toBeNull();
    const stepper = screen.getByRole("button", { name: "린넨 셔츠 수량 늘리기" }).closest("form")!;
    expect(stepper).toHaveClass("ez:rounded-button");
    expect(stepper.className).not.toContain("rounded-full");
  });
});

describe("CartView", () => {
  it("keeps the order button on the primary look and squares the boxes with the button radius", () => {
    render(<CartView lines={cartLines} updateAction={noop} removeAction={noop} />);
    expect(screen.getByRole("link", { name: "주문하기" }).className).not.toContain("bg-surface");
    for (const box of screen.getAllByRole("checkbox")) {
      expect(box.className).toContain("ez:rounded-[min(var(--ezd-button-radius),6px)]");
      expect(box.className).not.toContain("rounded-[6px]");
    }
  });

  it("draws the disabled order button without a surface fill", async () => {
    render(<CartView lines={cartLines} updateAction={noop} removeAction={noop} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "전체 선택" }));
    const off = screen.getByRole("button", { name: "주문하기" });
    expect(off).toBeDisabled();
    expect(off.className).not.toContain("ez:bg-surface");
  });
});

describe("OrderNumber", () => {
  const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  afterEach(() => {
    if (original) Object.defineProperty(navigator, "clipboard", original);
    else Reflect.deleteProperty(navigator, "clipboard");
  });
  const clipboard = (writeText: (text: string) => Promise<void>) =>
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

  it("shows the label and number and copies the number", async () => {
    const writeText = vi.fn(async () => {});
    clipboard(writeText);
    const { container } = render(<OrderNumber number="20261125-00015" />);
    expect(screen.getByText("주문번호")).toHaveClass("ez:text-site-small", "ez:text-muted");
    expect(container.querySelector("dd")).toHaveClass("ez:text-site-heading", "ez:tabular-nums");
    expect(screen.getByRole("status")).toHaveTextContent("");
    screen.getByRole("button", { name: "주문번호 복사" }).click();
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("복사됨"));
    expect(writeText).toHaveBeenCalledWith("20261125-00015");
  });

  it("does not claim a copy when the clipboard refuses", async () => {
    const writeText = vi.fn(async () => {
      throw new Error("denied");
    });
    clipboard(writeText);
    render(<OrderNumber number="20261125-00015" />);
    screen.getByRole("button", { name: "주문번호 복사" }).click();
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(screen.getByRole("status")).toHaveTextContent("");
  });
});
