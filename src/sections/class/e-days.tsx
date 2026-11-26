"use client";

import NextLink from "next/link";
import { useId, type ReactNode } from "react";
import { buttonVariants } from "../../components/button";
import { Icon } from "../../components/icon";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import type { Session } from "../template/data";
import { useScheduleDays } from "./days";
import { CLASS_TITLE, sessionView } from "./shared";
import type { SessionView } from "./types";

const WEEK = "일월화수목금토";

const insetRing = "ez:outline-none ez:focus-visible:outline-2 ez:focus-visible:-outline-offset-2 ez:focus-visible:outline-primary";

const price = "ez:text-site-body ez:tabular-nums ez:whitespace-nowrap ez:text-fg";

const pick = cn(buttonVariants({ variant: "outline", size: "sm" }), "ez:rounded-full ez:border-site-line ez:font-normal ez:lg:w-full");

const STATE = { ok: "ez:text-success", warn: "ez:text-warning-text", err: "ez:text-danger" } as const;

function tone(v: SessionView): string {
  return v.full ? STATE.err : v.few ? STATE.warn : STATE.ok;
}

function dayText(s: Session): string {
  if (!s.ymd) return s.day ?? s.date;
  const [, m, d] = s.ymd.split("-");
  return `${Number(m)}.${d} ${WEEK[new Date(`${s.ymd}T00:00:00Z`).getUTCDay()]}`;
}

function group(sessions: Session[]): { key: string; label: string; sessions: Session[] }[] {
  const map = new Map<string, Session[]>();
  for (const s of sessions) {
    const key = s.ymd ?? s.date;
    map.set(key, [...(map.get(key) ?? []), s]);
  }
  return [...map].map(([key, rows]) => ({ key, label: dayText(rows[0]), sessions: rows }));
}

export function Seats({ v }: { v: SessionView }) {
  if (!v.seats) return null;
  return (
    <span className={cn("ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-small ez:tabular-nums ez:whitespace-nowrap", tone(v))}>
      <span aria-hidden="true" className="ez:size-1.5 ez:shrink-0 ez:rounded-full ez:bg-current" />
      {v.seats}
    </span>
  );
}

function Row({ session }: { session: Session }) {
  const v = sessionView(session);
  const spec = [v.kind, v.length && `${CLASS_TITLE.length} ${v.length}`, v.count].filter(Boolean).join(" · ");
  return (
    <li
      data-slot="session-row"
      data-full={v.full || undefined}
      className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-x-4 ez:gap-y-1.5 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:py-4 ez:lg:min-h-24 ez:lg:grid-cols-[6.875rem_minmax(0,1fr)_11.25rem_11.25rem_8.75rem_6.25rem] ez:lg:gap-x-0 ez:lg:py-0"
    >
      <span className="ez:col-span-2 ez:text-site-item ez:tabular-nums ez:text-muted ez:lg:col-span-1">{v.time}</span>
      <span className="ez:grid ez:min-w-0 ez:gap-1.5 ez:lg:pr-6">
        <span className={cn("ez:truncate ez:text-site-heading", v.full ? "ez:text-muted" : "ez:text-fg")}>{v.name}</span>
        <span className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1 ez:lg:hidden">
          {spec && <span className="ez:text-site-small ez:text-site-off">{spec}</span>}
          <Seats v={v} />
          {v.price && <span className={price}>{v.price}</span>}
        </span>
      </span>
      <span className="ez:truncate ez:pr-6 ez:text-site-small ez:text-site-off ez:max-lg:hidden">{spec}</span>
      <span className="ez:max-lg:hidden">
        <Seats v={v} />
      </span>
      <span className={cn(price, "ez:pr-6 ez:text-right ez:max-lg:hidden")}>{v.price}</span>
      {v.full ? (
        <span aria-hidden="true" className={cn(pick, "ez:cursor-default ez:border-hairline ez:text-site-off")}>
          {CLASS_TITLE.full}
        </span>
      ) : (
        <NextLink href={v.href} aria-label={`${v.name} ${v.time} ${CLASS_TITLE.book}`} className={pick}>
          {CLASS_TITLE.book}
        </NextLink>
      )}
    </li>
  );
}

export function SessionGroups({ sessions, id, labels = true }: { sessions: Session[]; id?: string; labels?: boolean }) {
  return (
    <div id={id} className="ez:grid">
      {group(sessions).map((g) => (
        <div key={g.key} className="ez:grid">
          {labels && <h3 className="ez:m-0 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:pt-6 ez:pb-2.5 ez:font-body ez:text-site-small ez:font-normal ez:text-site-off">{g.label}</h3>}
          <ul className="ez:m-0 ez:list-none ez:p-0">
            {g.sessions.map((s) => (
              <Row key={s.id} session={s} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const arrow = cn(
  "ez:flex ez:size-10 ez:items-center ez:justify-center ez:border-0 ez:bg-transparent ez:p-0 ez:text-muted ez:cursor-pointer ez:hover:text-fg ez:disabled:cursor-default ez:disabled:text-site-off",
  focusRing,
);

export function DayStrip({ sessions, heading, more }: { sessions: Session[]; heading: ReactNode; more: ReactNode }) {
  const { days, selected, groups, select, canPrev, canNext, prev, next } = useScheduleDays(sessions, { span: 7, follow: 0 });
  const id = useId();
  const shown = groups.flatMap((g) => g.sessions);
  return (
    <>
      <div className="ez:mb-7 ez:flex ez:flex-wrap ez:items-baseline ez:justify-between ez:gap-x-8 ez:gap-y-3">
        {heading}
        <div className="ez:flex ez:items-center ez:gap-4">
          <span className="ez:flex ez:items-center">
            <button type="button" onClick={prev} disabled={!canPrev} aria-label="이전 주" className={arrow}>
              <Icon name="back" size="sm" />
            </button>
            <button type="button" onClick={next} disabled={!canNext} aria-label="다음 주" className={arrow}>
              <Icon name="next" size="sm" />
            </button>
          </span>
          {more}
        </div>
      </div>
      <div role="group" aria-label="날짜" className="ez:grid ez:grid-cols-7 ez:border-0 ez:border-y ez:border-solid ez:border-site-line">
        {days.map((d, i) => {
          const on = d.ymd === selected;
          return (
            <button
              key={d.ymd}
              type="button"
              onClick={() => select(d.ymd)}
              disabled={!d.count}
              aria-pressed={on}
              aria-controls={id}
              aria-label={`${d.month}월 ${d.date}일 ${d.weekday}요일${d.count ? `, 수업 ${d.count}개` : ""}`}
              className={cn(
                "ez:flex ez:h-18 ez:min-w-0 ez:flex-col ez:items-center ez:justify-center ez:gap-0.5 ez:border-0 ez:bg-transparent ez:px-0 ez:font-body ez:cursor-pointer ez:disabled:cursor-default ez:lg:h-23 ez:lg:items-start ez:lg:pl-5",
                i > 0 && "ez:border-l ez:border-solid ez:border-hairline",
                on && "ez:fx-tab ez:bg-select",
                insetRing,
              )}
            >
              <span aria-hidden="true" className={cn("ez:text-site-small", on ? "ez:text-muted" : "ez:text-site-off")}>
                {d.weekday}
              </span>
              <span aria-hidden="true" className={cn("ez:text-site-heading ez:tabular-nums", on ? "ez:text-fg" : d.count ? "ez:text-muted" : "ez:text-site-off")}>
                {d.date}
              </span>
            </button>
          );
        })}
      </div>
      <SessionGroups sessions={shown} id={id} labels={!groups.some((g) => g.ymd === selected)} />
    </>
  );
}
