import type { SectionProps } from "../../renderer/registry";

export function Maker({ data }: SectionProps<"maker_profile">) {
  if (!data.line) return null;
  return (
    <section data-slot="maker-profile" className="ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-6">
      <p className="ez:m-0 ez:max-w-170 ez:text-site-item ez:font-normal ez:text-fg">{data.line}</p>
    </section>
  );
}
