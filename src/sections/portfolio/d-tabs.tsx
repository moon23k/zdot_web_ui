"use client";

import { Fragment, useState, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";

export type TabItem = { key: string; cat: string | null; node: ReactNode };

export function CaseTabs({ title, all, items, className }: { title: ReactNode; all: string; items: TabItem[]; className: string }) {
  const cats = [...new Set(items.map((i) => i.cat?.trim()).filter((c): c is string => Boolean(c)))];
  const [on, setOn] = useState<string | null>(null);
  const shown = on ? items.filter((i) => i.cat?.trim() === on) : items;
  return (
    <>
      <div className="ez:flex ez:flex-wrap ez:items-end ez:justify-between ez:gap-x-6 ez:gap-y-4">
        {title}
        {cats.length > 1 && (
          <div role="group" className="ez:flex ez:flex-wrap ez:gap-x-7 ez:gap-y-2">
            {[null, ...cats].map((c) => (
              <button
                key={c ?? ""}
                type="button"
                aria-pressed={on === c}
                onClick={() => setOn(c)}
                className={cn(
                  "ez:cursor-pointer ez:appearance-none ez:border-0 ez:bg-transparent ez:p-0 ez:pb-1.5 ez:font-body ez:text-site-body",
                  on === c ? "ez:fx-tab ez:font-medium ez:text-fg" : "ez:font-normal ez:text-muted ez:hover:text-fg",
                  focusRing,
                )}
              >
                {c ?? all}
              </button>
            ))}
          </div>
        )}
      </div>
      <ul className={className}>
        {shown.map((i) => (
          <Fragment key={i.key}>{i.node}</Fragment>
        ))}
      </ul>
    </>
  );
}
