import type { ComponentType } from "react";
import type { TemplateDesign } from "../templates/types";
import type { Section } from "../types";
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

export function SiteRenderer({ page, context, template }: { page: { sections: Section[]; arranged?: boolean }; context: SiteContext; template: TemplateDesign }) {
  const placed = place(page.sections, template, page.arranged);
  const ctx = { ...context, main: template.main };
  const lead = !placed.some((s) => s.kind === "hero");
  return (
    <div data-slot="site-renderer" data-template={template.id} className="ez:grid ez:gap-section ez:text-site-body">
      {placed.map((section, i) => {
        if (!isKind(section.kind)) return null;
        const Component = sections[section.kind] as ComponentType<SectionProps>;
        return <Component key={`${section.kind}-${i}`} data={section.data ?? {}} context={ctx} variant={section.variant} grid={section.grid} lead={lead} blank />;
      })}
    </div>
  );
}
