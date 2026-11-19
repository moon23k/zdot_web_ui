import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

export const CONTRACT_SOURCE = process.env.ZDOT_CONTRACTS ?? resolve(HERE, "../../zdot/contracts/types/generated/api.d.ts");

export const CONTRACT_COPY = resolve(HERE, "../src/types/contract.ts");

const ROOTS = [
  "OrderOut",
  "OrderSummary",
  "CartOut",
  "CustomerProduct",
  "CustomerProductSummary",
  "AddressOut",
  "ReviewOut",
  "ClaimOut",
  "ClaimPreviewOut",
  "CustomerProvider",
  "PublicReviewOut",
  "ProductReviewsOut",
];

export function contractCopy(text: string): { body: string; count: number } {
  const start = text.indexOf("    schemas: {\n");
  const lines = text.slice(start).split("\n").slice(1);
  const blocks = new Map<string, string>();
  for (let i = 0; i < lines.length; i++) {
    const head = /^ {8}(\w+): (.*)$/.exec(lines[i]);
    if (!head) {
      if (/^ {4}\};?$/.test(lines[i])) break;
      continue;
    }
    const body = [lines[i]];
    if (head[2] === "{") while (!/^ {8}\};$/.test(lines[i])) body.push(lines[++i]);
    blocks.set(head[1], body.join("\n"));
  }

  const picked = new Set<string>();
  const visit = (name: string) => {
    if (picked.has(name)) return;
    const block = blocks.get(name);
    if (!block) throw new Error(`schema ${name} not found in ${CONTRACT_SOURCE}`);
    picked.add(name);
    for (const [, ref] of block.matchAll(/components\["schemas"\]\["(\w+)"\]/g)) visit(ref);
  };
  ROOTS.forEach(visit);

  const body = [...picked]
    .sort()
    .map((name) =>
      blocks
        .get(name)!
        .replace(/^\s*\/\*\*.*\*\/\n/gm, "")
        .replace(/^\s*\/\*\*[\s\S]*?\*\/\n/gm, "")
        .replace(/components\["schemas"\]\["(\w+)"\]/g, 'Schemas["$1"]')
        .replace(/^ {12}/gm, "    ")
        .replace(/^ {8}/gm, "  "),
    )
    .join("\n");
  return { body: `export interface Schemas {\n${body}\n}\n`, count: picked.size };
}
