import { act, fireEvent } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { GuestLookupForm, ReviewForm } from "../src";

async function hydrate(element: ReactElement, before: (root: HTMLElement) => void): Promise<HTMLElement> {
  const container = document.createElement("div");
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  before(container);
  await act(async () => {
    hydrateRoot(container, element);
  });
  return container;
}

const action = async () => ({});

describe("typing before hydration", () => {
  it("keeps the review body after picking a rating", async () => {
    const root = await hydrate(<ReviewForm orderItemId="i1" productName="머그" action={action} />, (c) => {
      (c.querySelector("textarea") as HTMLTextAreaElement).value = "아주 마음에 들어요";
    });
    fireEvent.click(root.querySelector('input[name="rating"][value="5"]') as HTMLInputElement);
    expect((root.querySelector("textarea") as HTMLTextAreaElement).value).toBe("아주 마음에 들어요");
    expect(root.querySelector('button[type="submit"]')).not.toBeDisabled();
  });

  it("keeps the phone after typing the order number", async () => {
    const root = await hydrate(<GuestLookupForm action={action} />, (c) => {
      (c.querySelector('input[name="phone"]') as HTMLInputElement).value = "010-1234-5678";
    });
    fireEvent.change(root.querySelector('input[name="number"]') as HTMLInputElement, { target: { value: "20261022-00001" } });
    expect((root.querySelector('input[name="phone"]') as HTMLInputElement).value).toBe("010-1234-5678");
  });
});
