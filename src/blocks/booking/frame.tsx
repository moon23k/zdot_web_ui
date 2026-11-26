"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Button } from "../../components/button";
import { Sheet } from "../../components/sheet";
import { cn } from "../../utils/cn";
import { pointTag } from "../../utils/styles";

const InSheet = createContext(false);

const WIDE = "(min-width: 64rem)";

export type BookingBar = { title: string; label: string; amount?: string | null; unit?: string };

function Amount({ amount, unit }: { amount: string; unit?: string }) {
  return (
    <p className="ez:m-0 ez:text-site-heading ez:tabular-nums">
      {amount}
      {unit && <span className="ez:text-site-small ez:font-normal ez:text-muted"> / {unit}</span>}
    </p>
  );
}

export function BookingFrame({ action, main, card, bar }: { action: string; main: ReactNode; card: ReactNode; bar?: BookingBar | null }) {
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const sheet = Boolean(bar && open);
  useEffect(() => {
    if (!sheet || typeof window.matchMedia !== "function") return;
    const wide = window.matchMedia(WIDE);
    const shut = () => {
      if (wide.matches) setOpen(false);
    };
    wide.addEventListener("change", shut);
    return () => wide.removeEventListener("change", shut);
  }, [sheet]);
  return (
    <form action={action} method="get" data-slot="booking-frame" className="ez:grid ez:gap-10 ez:text-fg ez:lg:grid-cols-[minmax(0,1fr)_420px] ez:lg:items-start ez:lg:gap-x-24">
      <div className="ez:min-w-0">
        <div className="ez:grid ez:min-w-0 ez:content-start ez:gap-12 ez:lg:gap-16">{main}</div>
        {bar && (
          <div
            data-slot="booking-bar"
            className="ez:sticky ez:bottom-0 ez:z-40 ez:mx-[calc(50%-50vw)] ez:mt-10 ez:flex ez:items-center ez:justify-between ez:gap-4 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:bg-surface ez:px-page ez:pt-3 ez:pb-[max(0.75rem,env(safe-area-inset-bottom))] ez:lg:hidden"
          >
            {bar.amount ? <Amount amount={bar.amount} unit={bar.unit} /> : <span />}
            <Button type="button" aria-haspopup="dialog" className="ez:w-1/2 ez:shrink-0" onClick={() => setOpen(true)}>
              {bar.label}
            </Button>
          </div>
        )}
        {bar && <div ref={setHost} data-slot="booking-sheet-host" />}
      </div>
      {!sheet && (
        <aside
          data-slot="booking-card"
          className={cn("ez:grid ez:gap-6 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-6 ez:lg:sticky ez:lg:top-8 ez:lg:p-8", bar && "ez:max-lg:hidden")}
        >
          {card}
        </aside>
      )}
      {bar && host && (
        <Sheet open={open} onOpenChange={setOpen} title={bar.title} container={host} tall>
          <InSheet.Provider value>
            <div data-slot="booking-card" data-sheet="" className="ez:grid ez:gap-6">
              {card}
            </div>
          </InSheet.Provider>
        </Sheet>
      )}
    </form>
  );
}

export function CardPrice({ amount, unit, tag }: { amount: string; unit: string; tag?: string | null }) {
  const inSheet = useContext(InSheet);
  if (inSheet && !tag) return null;
  return (
    <div className={cn("ez:flex ez:items-baseline ez:gap-3", inSheet ? "ez:justify-end" : "ez:justify-between")}>
      {!inSheet && <Amount amount={amount} unit={unit} />}
      {tag && (
        <span className={pointTag}>
          <span aria-hidden="true" className="ez:size-1.25 ez:rounded-full ez:bg-primary" />
          {tag}
        </span>
      )}
    </div>
  );
}
