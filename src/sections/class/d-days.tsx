"use client";

import NextLink from "next/link";
import { useId } from "react";
import { Icon } from "../../components/icon";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import { Bar, BlankPrice } from "../kit";
import type { Session } from "../template/data";
import { useScheduleDays } from "./days";
import { CLASS_TITLE, sessionView } from "./shared";
import type { SessionView } from "./types";

const WEEK = "일월화수목금토";

const hair = "ez:border-0 ez:border-solid ez:border-hairline";

const insetRing = "ez:outline-none ez:focus-visible:outline-2 ez:focus-visible:-outline-offset-2 ez:focus-visible:outline-primary";

const pill = "ez:inline-flex ez:h-10 ez:items-center ez:justify-center ez:rounded-full ez:px-5 ez:text-site-note ez:font-medium ez:whitespace-nowrap ez:no-underline ez:lg:w-full ez:lg:px-0";

const rowGrid =
  "ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-x-4 ez:gap-y-1 ez:border-t ez:py-4 ez:lg:h-21 ez:lg:grid-cols-[6rem_minmax(0,1fr)_10rem_10rem_8.75rem_6.25rem] ez:lg:gap-x-0 ez:lg:py-0";

function State({ v }: { v: SessionView }) {
  if (!v.seats) return null;
  const tone = v.full ? "ez:text-site-off" : v.few ? "ez:text-warning-text" : "ez:text-success";
  return (
    <span className={cn("ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-note ez:whitespace-nowrap", tone)}>
      <span aria-hidden="true" className="ez:size-1.5 ez:shrink-0 ez:rounded-full ez:bg-current" />
      {v.seats}
    </span>
  );
}

function SessionRow({ session }: { session: Session }) {
  const v = sessionView(session);
  const meta = [v.length, v.count].filter(Boolean).join(" · ");
  return (
    <li data-slot="session-row" data-full={v.full || undefined} className={cn(hair, rowGrid)}>
      <span className="ez:col-span-2 ez:text-site-item ez:font-normal ez:tabular-nums ez:text-fg ez:lg:col-span-1">{v.time}</span>
      <span className="ez:grid ez:min-w-0 ez:gap-1">
        <span className="ez:truncate ez:text-site-item ez:font-normal ez:text-fg">{v.name}</span>
        <span className="ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:gap-y-1 ez:text-site-note ez:lg:hidden">
          {meta && <span className="ez:text-muted">{meta}</span>}
          <State v={v} />
          {v.price && <span className="ez:tabular-nums ez:text-fg">{v.price}</span>}
        </span>
      </span>
      <span className="ez:truncate ez:text-site-body ez:text-muted ez:max-lg:hidden">{meta}</span>
      <span className="ez:max-lg:hidden">
        <State v={v} />
      </span>
      <span className="ez:pr-6 ez:text-right ez:text-site-body ez:tabular-nums ez:text-fg ez:max-lg:hidden">{v.price}</span>
      {v.full ? (
        <span className={cn(pill, "ez:bg-surface ez:text-site-off")}>{CLASS_TITLE.full}</span>
      ) : (
        <NextLink href={v.href} aria-label={`${v.name} ${v.time} ${CLASS_TITLE.book}`} className={cn(pill, "ez:bg-surface-alt ez:text-fg ez:hover:bg-surface", focusRing)}>
          {CLASS_TITLE.book}
        </NextLink>
      )}
    </li>
  );
}

export function BlankRow() {
  return (
    <li className={cn(hair, rowGrid)}>
      <span className="ez:col-span-2 ez:text-site-item ez:lg:col-span-1">
        <Bar size="short" />
      </span>
      <span className="ez:text-site-item">
        <Bar />
      </span>
      <span className="ez:text-site-body ez:max-lg:hidden">
        <Bar size="short" />
      </span>
      <span className="ez:text-site-note ez:max-lg:hidden">
        <Bar size="short" />
      </span>
      <span className="ez:pr-6 ez:text-right ez:max-lg:hidden">
        <BlankPrice className="ez:text-site-body ez:text-muted" />
      </span>
      <span />
    </li>
  );
}

function dayText(s: Session): string {
  if (!s.ymd) return s.day ?? s.date;
  const [, m, d] = s.ymd.split("-");
  return `${Number(m)}.${d} ${WEEK[new Date(`${s.ymd}T00:00:00Z`).getUTCDay()]}`;
}

function grouped(sessions: Session[]): { key: string; label: string; sessions: Session[] }[] {
  const map = new Map<string, Session[]>();
  for (const s of sessions) {
    const key = s.ymd ?? s.date;
    map.set(key, [...(map.get(key) ?? []), s]);
  }
  return [...map].map(([key, rows]) => ({ key, label: dayText(rows[0]), sessions: rows }));
}

export function SessionGroups({ sessions, labels = true, id }: { sessions: Session[]; labels?: boolean; id?: string }) {
  return (
    <div id={id} className="ez:grid">
      {grouped(sessions).map((g) => (
        <div key={g.key} className="ez:grid">
          {labels && <h3 className="ez:m-0 ez:pt-5 ez:pb-2.5 ez:font-body ez:text-site-note ez:font-normal ez:text-muted">{g.label}</h3>}
          <ul className="ez:m-0 ez:list-none ez:p-0">
            {g.sessions.map((s) => (
              <SessionRow key={s.id} session={s} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const glassBoard = "ez:fx-glass ez:fx-round-md ez:px-3 ez:pt-3 ez:pb-2 ez:md:px-7 ez:md:pt-7 ez:md:pb-4";

const navButton = cn(
  "ez:flex ez:h-10 ez:items-center ez:justify-center ez:border-0 ez:bg-transparent ez:p-0 ez:text-muted ez:cursor-pointer ez:hover:text-fg ez:disabled:cursor-default ez:disabled:opacity-40 ez:disabled:hover:text-muted",
  insetRing,
);

export function DayBoard({ sessions }: { sessions: Session[] }) {
  const { days, selected, groups, select, canPrev, canNext, prev, next } = useScheduleDays(sessions, { span: 7, follow: 0 });
  const id = useId();
  return (
    <div className={glassBoard}>
      <div className="ez:grid ez:grid-cols-[1.75rem_minmax(0,1fr)_1.75rem] ez:items-center ez:gap-1 ez:md:grid-cols-[2.5rem_minmax(0,1fr)_2.5rem]">
        <button type="button" onClick={prev} disabled={!canPrev} aria-label="이전 주" className={navButton}>
          <Icon name="back" size="sm" />
        </button>
        <div role="group" aria-label="날짜" className="ez:grid ez:grid-cols-7 ez:gap-1 ez:md:gap-2">
          {days.map((d) => {
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
                  "ez:flex ez:h-16 ez:min-w-0 ez:flex-col ez:items-center ez:justify-center ez:gap-0.5 ez:rounded-lg ez:border-0 ez:bg-transparent ez:p-0 ez:font-body ez:cursor-pointer ez:disabled:cursor-default ez:md:h-21",
                  on && "ez:fx-lift ez:bg-surface-alt",
                  insetRing,
                )}
              >
                <span className={cn("ez:text-site-small", on ? "ez:text-fg" : "ez:text-muted")}>{d.weekday}</span>
                <span
                  aria-hidden="true"
                  className={cn("ez:text-site-item ez:tabular-nums ez:md:text-site-heading", on ? "ez:font-medium ez:text-fg" : d.count ? "ez:font-light ez:text-muted" : "ez:font-light ez:text-site-off")}
                >
                  {d.date}
                </span>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={next} disabled={!canNext} aria-label="다음 주" className={navButton}>
          <Icon name="next" size="sm" />
        </button>
      </div>
      <div className="ez:mt-3 ez:md:mt-5">
        <SessionGroups id={id} sessions={groups.flatMap((g) => g.sessions)} labels={selected === null} />
      </div>
    </div>
  );
}
