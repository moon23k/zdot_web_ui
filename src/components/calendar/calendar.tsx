"use client";

import { useState } from "react";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";

export type CalendarDate = { date: string; label?: string; disabled?: boolean };
export type CalendarValue = { start?: string; end?: string };

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function parts(iso: string): [number, number, number] {
  const [y, m, d] = iso.split("-").map(Number);
  return [y, m, d];
}

function weekday(iso: string): number {
  const [y, m, d] = parts(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function nightsBetween(start: string, end: string): number {
  const [a, b] = [start, end].map((iso) => {
    const [y, m, d] = parts(iso);
    return Date.UTC(y, m - 1, d);
  });
  return Math.round((b - a) / 86_400_000);
}

function dayText(iso: string): string {
  const [, m, d] = parts(iso);
  return `${m}월 ${d}일`;
}

function monthKeys(days: CalendarDate[]): string[] {
  return [...new Set(days.map((d) => d.date.slice(0, 7)))];
}

export function Calendar({
  days,
  mode = "single",
  value,
  onChange,
  name = "date",
  startName = "in",
  endName = "out",
  months = 1,
  dots,
  className,
}: {
  days: CalendarDate[];
  mode?: "single" | "range";
  value?: CalendarValue;
  onChange?: (value: CalendarValue) => void;
  name?: string;
  startName?: string;
  endName?: string;
  months?: 1 | 2;
  dots?: boolean;
  className?: string;
}) {
  const [own, setOwn] = useState<CalendarValue>(value ?? {});
  const current = value ?? own;
  const list = monthKeys(days);
  const [page, setPage] = useState(() => Math.max(0, list.indexOf((current.start ?? "").slice(0, 7))));
  const set = (next: CalendarValue) => {
    setOwn(next);
    onChange?.(next);
  };
  const openBetween = (start: string, end: string) =>
    days.filter((d) => d.date >= start && d.date < end).every((d) => !d.disabled) &&
    nightsBetween(start, end) === days.filter((d) => d.date >= start && d.date < end).length;
  const canEnd = (iso: string) => mode === "range" && Boolean(current.start) && !current.end && iso > current.start! && openBetween(current.start!, iso);
  const pick = (day: CalendarDate) => {
    if (mode === "single") return set({ start: day.date });
    if (canEnd(day.date)) return set({ start: current.start, end: day.date });
    if (!day.disabled) set({ start: day.date });
  };
  const state = (iso: string) => {
    if (iso === current.start || iso === current.end) return "edge";
    if (current.start && current.end && iso > current.start && iso < current.end) return "inside";
    return "none";
  };
  const pages = list.slice(page, page + months);
  const nav = cn(
    "ez:flex ez:size-9 ez:items-center ez:justify-center ez:rounded-full ez:border ez:border-solid ez:border-site-edge ez:bg-transparent ez:font-body ez:text-site-lead ez:text-fg ez:cursor-pointer ez:disabled:text-site-off ez:disabled:cursor-default",
    focusRing,
  );
  return (
    <div data-slot="calendar" className={cn("ez:grid ez:gap-3 ez:text-fg", className)}>
      <div className={cn("ez:grid ez:gap-10", months > 1 && "ez:md:grid-cols-2")}>
        {pages.map((key, k) => {
          const [y, m] = key.split("-").map(Number);
          const known = new Map(days.filter((d) => d.date.startsWith(key)).map((d) => [d.date, d]));
          const size = new Date(Date.UTC(y, m, 0)).getUTCDate();
          const shownDays = Array.from({ length: size }, (_, i) => {
            const iso = `${key}-${String(i + 1).padStart(2, "0")}`;
            return known.get(iso) ?? ({ date: iso, disabled: true, outside: true } as CalendarDate & { outside?: boolean });
          });
          const blanks = weekday(shownDays[0].date);
          return (
            <div key={key} className="ez:grid ez:gap-3">
              <div className="ez:flex ez:h-9 ez:items-center ez:justify-between">
                <strong className="ez:font-medium">{`${y}년 ${m}월`}</strong>
                <span className="ez:flex ez:gap-1.5">
                  {k === 0 && (
                    <button type="button" className={nav} onClick={() => setPage(page - 1)} disabled={page <= 0} aria-label="이전 달">
                      ‹
                    </button>
                  )}
                  {k === pages.length - 1 && (
                    <button type="button" className={nav} onClick={() => setPage(page + 1)} disabled={page + months >= list.length} aria-label="다음 달">
                      ›
                    </button>
                  )}
                </span>
              </div>
              <ol className="ez:m-0 ez:grid ez:list-none ez:grid-cols-7 ez:gap-y-1 ez:p-0 ez:text-center">
                {WEEKDAYS.map((w) => (
                  <li key={w} className="ez:py-2 ez:text-site-caption ez:text-muted" aria-hidden="true">
                    {w}
                  </li>
                ))}
                {Array.from({ length: blanks }, (_, i) => (
                  <li key={`blank-${i}`} aria-hidden="true" />
                ))}
                {shownDays.map((day) => {
                  const look = state(day.date);
                  const blocked = Boolean(day.disabled) && !canEnd(day.date);
                  const outside = "outside" in day && Boolean(day.outside);
                  return (
                    <li key={day.date} className={look === "inside" ? "ez:bg-point-soft" : undefined}>
                      <button
                        type="button"
                        onClick={() => pick(day)}
                        disabled={blocked}
                        data-outside={outside || undefined}
                        aria-pressed={look === "edge"}
                        aria-label={[dayText(day.date), `${WEEKDAYS[weekday(day.date)]}요일`, day.label].filter(Boolean).join(" ")}
                        className={cn(
                          "ez:relative ez:mx-auto ez:grid ez:size-11 ez:content-center ez:rounded-full ez:border-0 ez:bg-transparent ez:p-0 ez:font-body ez:text-site-note ez:tabular-nums ez:text-fg ez:cursor-pointer",
                          look === "edge" && "ez:bg-point-soft ez:font-medium ez:text-primary ez:shadow-[inset_0_0_0_1px_var(--ezd-primary)]",
                          dots && !blocked && look === "none" && "ez:after:absolute ez:after:bottom-1.5 ez:after:left-1/2 ez:after:size-1 ez:after:-translate-x-1/2 ez:after:rounded-full ez:after:bg-primary",
                          "ez:disabled:cursor-not-allowed ez:disabled:text-site-off",
                          blocked && !outside && "ez:line-through",
                          focusRing,
                        )}
                      >
                        <span>{parts(day.date)[2]}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
      {mode === "range" ? (
        <>
          <input type="hidden" name={startName} value={current.start ?? ""} />
          <input type="hidden" name={endName} value={current.end ?? ""} />
          {current.start && (
            <p className="ez:m-0 ez:text-site-small ez:text-muted">
              {current.end
                ? `${dayText(current.start)} ~ ${dayText(current.end)} · ${nightsBetween(current.start, current.end)}박`
                : `${dayText(current.start)} ~`}
            </p>
          )}
        </>
      ) : (
        <input type="hidden" name={name} value={current.start ?? ""} />
      )}
    </div>
  );
}
