import { care } from "./care";
import { klass } from "./class";
import { office } from "./office";
import { place } from "./place";
import { portfolio } from "./portfolio";
import { quote } from "./quote";
import { shop } from "./shop";
import { stay } from "./stay";
import type { TemplateDesign, TemplateLetter, TemplateMain } from "./types";

export type * from "./types";

export const templates: Record<TemplateMain, TemplateDesign[]> = { shop, class: klass, stay, quote, place, care, portfolio, office };

export function templateHome(): Record<TemplateMain, Partial<Record<TemplateLetter, string[]>>> {
  return Object.fromEntries(
    Object.entries(templates).map(([main, list]) => [main, Object.fromEntries(list.map((t) => [t.letter, t.home.map((slot) => slot.kind)]))]),
  ) as Record<TemplateMain, Partial<Record<TemplateLetter, string[]>>>;
}

export function resolveTemplate(main: string | null | undefined, letter: string | null | undefined): TemplateDesign {
  const list = templates[(main ?? "shop") as TemplateMain] ?? templates.shop;
  return list.find((t) => t.letter === letter) ?? list[0];
}
