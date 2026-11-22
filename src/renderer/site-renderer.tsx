import type { ComponentType } from "react";
import type { TemplateDesign } from "../templates/types";
import type { Section } from "../types";
import { SHOP_DESIGNS } from "../sections/shop";
import { STAY_DESIGNS } from "../sections/stay";
import { CLASS_DESIGNS } from "../sections/class";
import { QUOTE_DESIGNS } from "../sections/quote";
import { PLACE_DESIGNS } from "../sections/place";
import { sections, type SectionProps, type SiteContext } from "./registry";

const isKind = (kind: string): kind is keyof typeof sections => kind in sections;

const LEAD = new Set(["hero", "intro"]);

type Placed = Section & { variant?: string; grid?: TemplateDesign["home"][number]["grid"] };

function place(sections: Section[], template: TemplateDesign, arranged = false): Placed[] {
  const slots = new Map(template.home.map((slot) => [slot.kind, slot]));
  if (arranged) {
    const lead = LEAD.has(template.home[0]?.kind ?? "") ? template.home[0].kind : null;
    const ordered = lead ? [...sections.filter((s) => s.kind === lead), ...sections.filter((s) => s.kind !== lead)] : sections;
    return ordered.flatMap((s) => {
      const slot = slots.get(s.kind);
      return slot ? [{ ...s, variant: slot.variant, grid: slot.grid }] : [];
    });
  }
  const byKind = new Map(sections.map((s) => [s.kind, s]));
  return template.home.map((slot) => ({ ...(byKind.get(slot.kind) ?? { kind: slot.kind, data: {} }), variant: slot.variant, grid: slot.grid }));
}

function joined(placed: Placed[], join: readonly string[] | undefined): Placed[] {
  if (!join?.length) return placed;
  const out: Placed[] = [];
  for (const section of placed) {
    const prev = out[out.length - 1];
    if (prev?.kind === "hero" && join.includes(section.kind)) {
      out[out.length - 1] = { ...prev, data: { ...prev.data, [section.kind]: section.data ?? {} } };
      continue;
    }
    out.push(section);
  }
  return out;
}

function titled(placed: Placed[]): boolean {
  return placed.some((s) => {
    const title = s.kind === "hero" ? (s.data as { title?: unknown } | undefined)?.title : null;
    return typeof title === "string" && title.trim() !== "";
  });
}

export function SiteRenderer({ page, context, template }: { page: { sections: Section[]; arranged?: boolean }; context: SiteContext; template: TemplateDesign }) {
  const placed = place(page.sections, template, page.arranged);
  const ctx = { ...context, main: template.main };
  const quote = template.main === "quote" && template.skin ? QUOTE_DESIGNS[template.skin] : undefined;
  const venue = template.main === "place" && template.skin ? PLACE_DESIGNS[template.skin] : undefined;
  const skin = template.skin ? (venue ?? quote ?? (template.main === "stay" ? STAY_DESIGNS : template.main === "class" ? CLASS_DESIGNS : SHOP_DESIGNS)[template.skin])?.sections : undefined;
  const drawn = joined(placed, quote?.join);
  return (
    <>
      {context.storeName && !titled(placed) && <h1 className="ez:sr-only">{context.storeName}</h1>}
      <div data-slot="site-renderer" data-template={template.id} className="ez:grid ez:gap-section ez:text-site-body">
        {drawn.map((section, i) => {
          if (!isKind(section.kind)) return null;
          const Component = (skin?.[section.kind] ?? sections[section.kind]) as ComponentType<SectionProps>;
          return <Component key={`${section.kind}-${i}`} data={section.data ?? {}} context={ctx} variant={section.variant} grid={section.grid} />;
        })}
      </div>
    </>
  );
}
