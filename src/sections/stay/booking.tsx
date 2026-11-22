"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { kstToday } from "../../utils/format";
import { ROOMS_HREF, STAY_TITLE, stayDate } from "./shared";
import type { StaySearch } from "./types";

type Which = "check_in" | "check_out";

type Who = "adults" | "children";

type State = { check_in: string; check_out: string; adults: number; children: number; max: number };

type Ctx = { state: State; set: (patch: Partial<State>) => void; today: string | null };

const StayCtx = createContext<Ctx | null>(null);

function useStay(): Ctx {
  const ctx = useContext(StayCtx);
  if (!ctx) throw new Error("StayForm 안에서만 쓸 수 있습니다.");
  return ctx;
}

const still = () => () => {};

const clientToday = (): string | null => kstToday();

const serverToday = (): string | null => null;

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export const STAY_HORIZON = 365;

export const STAY_SPAN = 92;

export function dateBounds(which: Which, checkIn: string, today: string | null): { min?: string; max?: string } {
  if (which === "check_in") return today ? { min: today, max: addDays(today, STAY_HORIZON) } : {};
  const from = checkIn || today;
  if (!from) return {};
  return { min: addDays(from, 1), max: addDays(from, checkIn ? STAY_SPAN : STAY_HORIZON + 1) };
}

function nightsOf(state: State): number {
  if (!state.check_in || !state.check_out) return 0;
  const [a, b] = [state.check_in, state.check_out].map((iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  });
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

export function StayForm({
  initial,
  max = 1,
  action = ROOMS_HREF,
  label = "객실 찾기",
  className,
  children,
}: {
  initial?: Partial<StaySearch> | null;
  max?: number | null;
  action?: string;
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const top = Math.max(1, initial?.max ?? max ?? 1);
  const [state, setState] = useState<State>(() => {
    const adults = Math.min(top, Math.max(1, initial?.adults ?? 2));
    return {
      check_in: initial?.check_in ?? "",
      check_out: initial?.check_out ?? "",
      adults,
      children: Math.min(Math.max(0, top - adults), Math.max(0, initial?.children ?? 0)),
      max: top,
    };
  });
  const today = useSyncExternalStore(still, clientToday, serverToday);
  const set = (patch: Partial<State>) =>
    setState((prev) => {
      const next = { ...prev, ...patch };
      if (next.check_in && next.check_out && (next.check_out <= next.check_in || next.check_out > addDays(next.check_in, STAY_SPAN))) next.check_out = "";
      next.children = Math.min(next.children, Math.max(0, next.max - next.adults));
      return next;
    });
  return (
    <form method="get" action={action} role="search" aria-label={label} data-slot="stay-form" className={className}>
      <StayCtx.Provider value={{ state, set, today }}>{children}</StayCtx.Provider>
    </form>
  );
}

export function DateInput({ which, label }: { which: Which; label?: string }) {
  const { state, set, today } = useStay();
  const value = state[which];
  const { min, max } = dateBounds(which, state.check_in, today);
  return (
    <input
      type="date"
      name={value ? which : undefined}
      value={value}
      min={min}
      max={max}
      aria-label={label ?? (which === "check_in" ? STAY_TITLE.dateIn : STAY_TITLE.dateOut)}
      onChange={(e) => set({ [which]: e.target.value })}
      onClick={(e) => {
        try {
          e.currentTarget.showPicker?.();
        } catch {
          return;
        }
      }}
      className="ez:absolute ez:inset-0 ez:z-1 ez:m-0 ez:size-full ez:cursor-pointer ez:appearance-none ez:border-0 ez:p-0 ez:opacity-0"
    />
  );
}

export function DateText({ which, placeholder = STAY_TITLE.pick, className, emptyClassName }: { which: Which; placeholder?: string; className?: string; emptyClassName?: string }) {
  const { state } = useStay();
  const value = state[which];
  return <span className={cn(className, !value && emptyClassName)}>{value ? stayDate(value) : placeholder}</span>;
}

export function SelectedDot({ which = "check_in", className }: { which?: Which; className?: string }) {
  const { state } = useStay();
  if (!state[which]) return null;
  return <span aria-hidden="true" data-slot="stay-dot" className={cn("ez:inline-block ez:size-1.75 ez:shrink-0 ez:rounded-full ez:bg-primary", className)} />;
}

export function NightsText({ className }: { className?: string }) {
  const { state } = useStay();
  const nights = nightsOf(state);
  return nights ? <span className={className}>{nights}박</span> : null;
}

export function GuestText({ className }: { className?: string }) {
  const { state } = useStay();
  return <span className={className}>{`${STAY_TITLE.adults} ${state.adults} · ${STAY_TITLE.children} ${state.children}`}</span>;
}

export function GuestSelect({ who, label, className }: { who: Who; label?: string; className?: string }) {
  const { state, set } = useStay();
  const from = who === "adults" ? 1 : 0;
  const to = who === "adults" ? state.max : Math.max(0, state.max - state.adults);
  return (
    <select
      name={who}
      value={state[who]}
      aria-label={label ?? (who === "adults" ? STAY_TITLE.adults : STAY_TITLE.children)}
      onChange={(e) => set({ [who]: Number(e.target.value) })}
      className={className}
    >
      {Array.from({ length: to - from + 1 }, (_, i) => from + i).map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );
}
