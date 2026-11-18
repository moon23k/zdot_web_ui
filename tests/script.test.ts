import { afterEach, describe, expect, it } from "vitest";
import { loadScript } from "../src/utils/script";

const SRC = "https://cdn.test/sdk.js";

afterEach(() => {
  document.head.querySelectorAll("script").forEach((tag) => tag.remove());
});

describe("loadScript", () => {
  it("adds one script tag for calls made while it loads", async () => {
    const first = loadScript(SRC, () => false);
    const second = loadScript(SRC, () => false);
    const tags = document.head.querySelectorAll(`script[src="${SRC}"]`);
    expect(tags).toHaveLength(1);
    tags[0].dispatchEvent(new Event("load"));
    await expect(Promise.all([first, second])).resolves.toBeDefined();
  });

  it("skips loading when the script is ready", async () => {
    await loadScript("https://cdn.test/ready.js", () => true);
    expect(document.head.querySelector('script[src="https://cdn.test/ready.js"]')).toBeNull();
  });
});
