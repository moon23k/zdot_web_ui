import type { ReactNode } from "react";
import type { DetailSlot } from "../templates/types";
import { cn } from "../utils/cn";
import { detailBlocks } from "./blocks";
import type { DetailData } from "./data";

type Group = { side: boolean; slots: DetailSlot[] };

function group(slots: DetailSlot[]): Group[] {
  const first = slots.findIndex((s) => s.side);
  if (first < 0) return [{ side: false, slots }];
  const out: Group[] = [];
  if (first > 0) out.push({ side: false, slots: slots.slice(0, first) });
  out.push({ side: true, slots: slots.filter((s) => s.side) });
  const rest = slots.slice(first).filter((s) => !s.side);
  if (rest.length) out.push({ side: false, slots: rest });
  return out;
}

export function DetailLayout({
  slots,
  data,
  nodes = {},
  head,
}: {
  slots: DetailSlot[];
  data: DetailData;
  nodes?: Record<string, ReactNode>;
  head?: ReactNode;
}) {
  const render = (slot: DetailSlot) => {
    const node = nodes[slot.kind];
    if (node !== undefined) return <div key={slot.kind}>{node}</div>;
    const Block = detailBlocks[slot.kind];
    return Block ? <Block key={slot.kind} data={data} variant={slot.variant} /> : null;
  };
  const groups = group(slots.filter((s) => !s.full));
  const full = slots.filter((s) => s.full);
  const hasSide = groups.some((g) => g.side);
  const grid = (
    <div
      data-slot="detail-layout"
      className={cn("ez:grid ez:gap-8 ez:text-fg", hasSide && "ez:md:grid-flow-dense ez:md:grid-cols-[1.2fr_1fr] ez:md:gap-x-10 ez:md:gap-y-0 ez:lg:grid-cols-[minmax(0,744px)_minmax(0,1fr)] ez:lg:gap-x-20")}
    >
      {groups.map((g, i) =>
        g.side ? (
          <aside key={`side-${i}`} className="ez:grid ez:content-start ez:gap-7 ez:md:sticky ez:md:top-20 ez:md:col-start-2 ez:md:row-span-[12] ez:md:row-start-1 ez:md:self-start">
            {g.slots.map(render)}
          </aside>
        ) : (
          g.slots.map((slot) => (
            <div key={slot.kind} className={cn(hasSide && "ez:md:col-start-1 ez:md:mb-8")}>
              {render(slot)}
            </div>
          ))
        ),
      )}
    </div>
  );
  const top = head ? (
    <div className="ez:grid ez:gap-7">
      {head}
      {grid}
    </div>
  ) : (
    grid
  );
  if (!full.length) return top;
  return (
    <div className="ez:grid ez:gap-section">
      {top}
      {full.map(render)}
    </div>
  );
}
