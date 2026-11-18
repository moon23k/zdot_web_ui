import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CONTRACT_COPY, CONTRACT_SOURCE, contractCopy } from "../scripts/contract-copy";

describe.skipIf(!existsSync(CONTRACT_SOURCE))("contract copy", () => {
  it("src/types/contract.ts 는 계약(api.d.ts)에서 만든 결과와 같다 — 다르면 EZPG 에서 npm run ui:sync", () => {
    expect(readFileSync(CONTRACT_COPY, "utf8")).toBe(contractCopy(readFileSync(CONTRACT_SOURCE, "utf8")).body);
  });

  it("계약에서 스키마가 빠지면 실패한다", () => {
    const text = readFileSync(CONTRACT_SOURCE, "utf8").replace(/^ {8}OrderOut: \{/m, "        OrderGone: {");
    expect(() => contractCopy(text)).toThrow(/OrderOut/);
  });
});
