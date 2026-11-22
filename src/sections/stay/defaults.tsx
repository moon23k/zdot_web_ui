import type { SectionProps } from "../../renderer/registry";
import { Bar } from "../kit";
import { addOnView, STAY_TITLE } from "./shared";

export function AddOns({ data }: SectionProps<"add_ons">) {
  const items = data.items ?? [];
  return (
    <section data-slot="add-ons" id="add-ons" data-blank={items.length ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg">
      <h2 className="ez:m-0 ez:text-site-section ez:font-normal">{STAY_TITLE.addOns}</h2>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-gutter ez:p-0 ez:md:grid-cols-3">
        {(items.length ? items.map(addOnView) : [null, null, null]).map((a, i) => (
          <li key={a?.name ?? i} className="ez:grid ez:gap-1 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:py-5">
            <span>{a ? a.name : <Bar />}</span>
            <span className="ez:text-site-small ez:text-muted">{a ? `${a.price} · ${a.unit} · ${a.pay}` : <Bar size="short" />}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
