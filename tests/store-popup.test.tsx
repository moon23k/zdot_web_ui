import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StorePopup, type StorePopupItem } from "../src";
import { expectNoA11yViolations } from "./a11y";

const one: StorePopupItem = { id: "p1", title: "겨울 햇차 입고", body: "11월 30일까지 전 상품 10% 할인", image_url: null, href: "/products", external: false };
const two: StorePopupItem = { id: "p2", title: "12월 정기 휴무", body: null, image_url: null, href: "https://example.com", external: true };
const three: StorePopupItem = { id: "p3", title: "연말 선물 포장", body: null, image_url: null, href: null, external: false };

const day = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date());

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe("StorePopup", () => {
  it("opens after mount with title, body and link", async () => {
    render(<StorePopup popups={[one]} store="a.test" />);
    const dialog = await screen.findByRole("dialog", { name: "겨울 햇차 입고" });
    expect(dialog).toHaveAccessibleDescription("11월 30일까지 전 상품 10% 할인");
    expect(screen.getByRole("link", { name: "보러 가기" })).toHaveAttribute("href", "/products");
    expect(screen.getByRole("button", { name: "닫기" })).toBeTruthy();
    await expectNoA11yViolations(document.body);
  });

  it("renders nothing without popups", () => {
    render(<StorePopup popups={[]} store="a.test" />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("hides for today after 오늘 하루 열지 않기", async () => {
    const first = render(<StorePopup popups={[one]} store="a.test" />);
    await userEvent.click(await screen.findByRole("button", { name: "오늘 하루 열지 않기" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(localStorage.getItem("ez-popup-today:a.test")).toBe(day());
    first.unmount();
    sessionStorage.clear();
    render(<StorePopup popups={[one]} store="a.test" />);
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("counts today in KST, not the device time zone", async () => {
    vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-01-01T15:30:00Z") });
    try {
      render(<StorePopup popups={[one]} store="a.test" />);
      await userEvent.click(await screen.findByRole("button", { name: "오늘 하루 열지 않기" }));
      expect(localStorage.getItem("ez-popup-today:a.test")).toBe("2026-01-02");
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows again on another day", async () => {
    localStorage.setItem("ez-popup-today:a.test", "2000-01-01");
    render(<StorePopup popups={[one]} store="a.test" />);
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });

  it("stays closed for the tab after closing", async () => {
    const first = render(<StorePopup popups={[one]} store="a.test" />);
    await userEvent.click(await screen.findByRole("button", { name: "닫기" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(localStorage.getItem("ez-popup-today:a.test")).toBeNull();
    first.unmount();
    render(<StorePopup popups={[one]} store="a.test" />);
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByRole("dialog")).toBeNull();
    render(<StorePopup popups={[one]} store="b.test" />);
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });

  it("closes on escape", async () => {
    render(<StorePopup popups={[one]} store="a.test" />);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(sessionStorage.getItem("ez-popup-closed:a.test")).toBe("1");
  });

  it("steps through up to three popups", async () => {
    render(<StorePopup popups={[one, two, three, { ...three, id: "p4", title: "넷째" }]} store="a.test" />);
    await screen.findByRole("dialog", { name: "겨울 햇차 입고" });
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(screen.getByRole("dialog", { name: "12월 정기 휴무" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "보러 가기" })).toHaveAttribute("target", "_blank");
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(screen.getByRole("dialog", { name: "겨울 햇차 입고" })).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "이전" }));
    expect(screen.getByRole("dialog", { name: "연말 선물 포장" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "보러 가기" })).toBeNull();
  });

  it("still opens when storage throws", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<StorePopup popups={[one]} store="a.test" />);
    await userEvent.click(await screen.findByRole("button", { name: "오늘 하루 열지 않기" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("StorePopup shape", () => {
  const overlay = () => document.querySelector(".ez\\:bg-overlay");

  it("keeps the centred modal with no shape", async () => {
    render(<StorePopup popups={[one]} store="a.test" shape={null} />);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).not.toHaveAttribute("data-position");
    expect(overlay()).not.toBeNull();
    expect(dialog.className).toContain("ez:max-w-112");
  });

  it("floats a bottom card without overlay and leaves the page usable", async () => {
    const onPage = vi.fn();
    render(
      <>
        <button type="button" onClick={onPage}>
          뒤 화면
        </button>
        <StorePopup popups={[one]} store="a.test" shape={{ position: "bottom" }} />
      </>,
    );
    const dialog = await screen.findByRole("dialog", { name: "겨울 햇차 입고" });
    expect(dialog).toHaveAttribute("data-position", "bottom");
    expect(dialog).not.toHaveAttribute("aria-modal");
    expect(overlay()).toBeNull();
    expect(dialog.contains(document.activeElement)).toBe(false);
    await userEvent.click(screen.getByRole("button", { name: "뒤 화면" }));
    expect(onPage).toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("button", { name: "오늘 하루 열지 않기" })).toBeTruthy();
    await expectNoA11yViolations(document.body);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes the bar with its 닫기 text and steps through popups", async () => {
    render(<StorePopup popups={[one, two]} store="a.test" shape={{ position: "bar" }} />);
    const dialog = await screen.findByRole("dialog", { name: "겨울 햇차 입고" });
    expect(dialog).toHaveAttribute("data-position", "bar");
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(screen.getByRole("dialog", { name: "12월 정기 휴무" })).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(sessionStorage.getItem("ez-popup-closed:a.test")).toBe("1");
  });

  it("adds the overlay back as a modal when asked", async () => {
    render(<StorePopup popups={[one]} store="a.test" shape={{ position: "bottom", overlay: true }} />);
    await screen.findByRole("dialog");
    expect(overlay()).not.toBeNull();
  });

  it("drops 오늘 하루 열지 않기 and sizes the centre box", async () => {
    render(<StorePopup popups={[one]} store="a.test" shape={{ size: "sm", hide_today: false }} />);
    const dialog = await screen.findByRole("dialog");
    expect(screen.queryByRole("button", { name: "오늘 하루 열지 않기" })).toBeNull();
    expect(screen.getByRole("button", { name: "닫기" })).toBeTruthy();
    expect(dialog.className).toContain("ez:max-w-96");
  });

  it("stays open in preview whatever was stored or pressed", async () => {
    localStorage.setItem("ez-popup-today:a.test", day());
    render(<StorePopup popups={[one]} store="a.test" preview shape={{ position: "bottom" }} />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "닫기" }));
    await userEvent.click(screen.getByRole("button", { name: "오늘 하루 열지 않기" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(sessionStorage.getItem("ez-popup-closed:a.test")).toBeNull();
  });
});
