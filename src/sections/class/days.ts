"use client";

import { useMemo, useState } from "react";
import type { Session } from "../template/data";
import type { DayCell, DayGroup } from "./types";

const WEEK = "일월화수목금토";

const YMD = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" });

function shift(ymd: string, days: number): string {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function cell(ymd: string, today: string, count: number): DayCell {
  const d = new Date(`${ymd}T00:00:00Z`);
  return { ymd, month: d.getUTCMonth() + 1, date: d.getUTCDate(), weekday: WEEK[d.getUTCDay()], count, past: ymd < today };
}

export function useScheduleDays(sessions: Session[], { span = 7, follow = 2 }: { span?: number; follow?: number } = {}) {
  const today = YMD.format(new Date());
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) if (s.ymd) map.set(s.ymd, (map.get(s.ymd) ?? 0) + 1);
    return map;
  }, [sessions]);
  const dates = useMemo(() => [...counts.keys()].sort(), [counts]);
  const [start, setStart] = useState(today);
  const [picked, setPicked] = useState<string | null>(null);
  const days = Array.from({ length: span }, (_, i) => {
    const ymd = shift(start, i);
    return cell(ymd, today, counts.get(ymd) ?? 0);
  });
  const end = shift(start, span - 1);
  const selected = picked ?? days.find((d) => d.count > 0)?.ymd ?? null;
  const picks = selected ? [selected, ...dates.filter((d) => d > selected).slice(0, follow)] : dates.filter((d) => d > end).slice(0, follow + 1);
  const groups: DayGroup[] = picks
    .filter((ymd) => counts.has(ymd))
    .map((ymd) => {
      const rows = sessions.filter((s) => s.ymd === ymd);
      const first = rows[0];
      return { ymd, label: [first?.date, first?.day].filter(Boolean).join(" "), sessions: rows };
    });
  return {
    days,
    selected,
    groups,
    select: (ymd: string) => setPicked(ymd),
    canPrev: start > today,
    canNext: dates.some((d) => d > end),
    prev: () => {
      setStart((s) => (shift(s, -span) < today ? today : shift(s, -span)));
      setPicked(null);
    },
    next: () => {
      setStart((s) => shift(s, span));
      setPicked(null);
    },
  };
}
