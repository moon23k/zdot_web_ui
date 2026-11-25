"use client";

import { useState, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { lastOdd } from "./shared";

export type BestCard = { id: string; category: string | null; node: ReactNode };

export type BestTab = { id: string; label: string };

const tab = cn("ez:shrink-0 ez:cursor-pointer ez:border-0 ez:bg-transparent ez:px-0 ez:py-1.5 ez:font-body ez:text-site-lead ez:no-underline", focusRing);

export function BestShelf({ title, all, tabs, cards, grid, pair }: { title: ReactNode; all: string; tabs: BestTab[]; cards: BestCard[]; grid: string; pair: boolean }) {
  const [on, setOn] = useState<string | null>(null);
  const shown = on ? cards.filter((c) => c.category === on) : cards;
  const items: { id: string | null; label: string }[] = [{ id: null, label: all }, ...tabs];
  return (
    <>
      <div className="ez:mb-7 ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-x-8 ez:gap-y-3">
        {title}
        <div role="group" aria-label={all} className="ez:-mx-page ez:flex ez:max-w-full ez:gap-7 ez:overflow-x-auto ez:px-page ez:md:mx-0 ez:md:px-0">
          {items.map((t) => {
            const current = t.id === on;
            return (
              <button
                key={t.id ?? "all"}
                type="button"
                aria-pressed={current}
                onClick={() => setOn(t.id)}
                className={cn(tab, current ? "ez:fx-tab ez:text-fg" : "ez:text-site-off ez:hover:text-fg")}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className={grid}>
        {shown.map((c, i) => (
          <div key={c.id} className={cn("ez:min-w-0", pair && lastOdd(i, shown.length, 4))}>
            {c.node}
          </div>
        ))}
      </div>
    </>
  );
}
