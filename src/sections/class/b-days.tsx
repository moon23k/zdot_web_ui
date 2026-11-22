"use client";

import NextLink from "next/link";
import { useId } from "react";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";
import type { Session } from "../template/data";
import { useScheduleDays } from "./days";
import { CLASS_TITLE, sessionView } from "./shared";
import type { SessionView } from "./types";

const WEEK = "일월화수목금토";

const insetRing = "ez:outline-none ez:focus-visible:outline-2 ez:focus-visible:-outline-offset-2 ez:focus-visible:outline-primary";

const soft = cn(
  "ez:inline-flex ez:h-10 ez:items-center ez:justify-center ez:rounded-sm ez:border ez:border-solid ez:border-site-line ez:bg-surface-alt ez:px-4 ez:font-body ez:text-site-note ez:font-medium ez:whitespace-nowrap ez:text-fg ez:no-underline ez:hover:border-site-edge",
  focusRing,
);

const price = "ez:text-site-figure ez:font-medium ez:tabular-nums ez:text-fg";

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

function Seats({ v }: { v: SessionView }) {
  if (!v.seats) return null;
  return <span className={cn("ez:text-site-note ez:whitespace-nowrap", v.few ? "ez:font-medium ez:text-fg" : v.full ? "ez:font-medium ez:text-muted" : "ez:text-muted")}>{v.seats}</span>;
}

function Row({ session, tone }: { session: Session; tone: number }) {
  const v = sessionView(session);
  const spec = [v.kind, v.length && `${CLASS_TITLE.length} ${v.length}`].filter(Boolean).join(" · ");
  const dim = v.full && "ez:opacity-45";
  return (
    <li
      data-slot="session-row"
      data-full={v.full || undefined}
      className="ez:grid ez:grid-cols-[4rem_minmax(0,1fr)_auto] ez:items-center ez:gap-x-4 ez:gap-y-2 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:py-3.5 ez:lg:grid-cols-[5.5rem_4rem_minmax(0,1fr)_8.75rem_7.5rem_7.5rem] ez:lg:gap-x-5"
    >
      <span className={cn("ez:col-span-3 ez:text-site-item ez:font-medium ez:tabular-nums ez:text-fg ez:lg:col-span-1", dim)}>{v.time}</span>
      <Photo src={v.image} alt="" tone={tone} sizes="64px" className={cn("ez:aspect-square ez:size-16 ez:rounded-sm", dim)} />
      <span className="ez:grid ez:min-w-0 ez:gap-0.5">
        <span className={cn("ez:truncate ez:text-site-body ez:text-fg", dim)}>{v.name}</span>
        {spec && <span className={cn("ez:truncate ez:text-site-small ez:text-muted", dim)}>{spec}</span>}
        <span className="ez:mt-1 ez:flex ez:flex-wrap ez:items-baseline ez:gap-x-3 ez:lg:hidden">
          <Seats v={v} />
          {v.price && <span className={cn(price, dim)}>{v.price}</span>}
        </span>
      </span>
      <span className="ez:max-lg:hidden">
        <Seats v={v} />
      </span>
      <span className={cn(price, "ez:text-right ez:max-lg:hidden", dim)}>{v.price}</span>
      {v.full ? (
        <span aria-hidden="true" />
      ) : (
        <NextLink href={v.href} aria-label={`${v.name} ${v.time} ${CLASS_TITLE.book}`} className={cn(soft, "ez:lg:w-full")}>
          {CLASS_TITLE.book}
        </NextLink>
      )}
    </li>
  );
}

export function SessionGroups({ sessions, id }: { sessions: Session[]; id?: string }) {
  const tones = new Map(sessions.map((s, i) => [s.id, i]));
  return (
    <div id={id} className="ez:grid">
      {group(sessions).map((g) => (
        <div key={g.key} className="ez:grid">
          <h3 className="ez:m-0 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:pt-5 ez:pb-2 ez:font-body ez:text-site-note ez:font-medium ez:text-muted">{g.label}</h3>
          <ul className="ez:m-0 ez:list-none ez:p-0">
            {g.sessions.map((s) => (
              <Row key={s.id} session={s} tone={tones.get(s.id) ?? 0} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const navButton = cn(
  "ez:flex ez:items-center ez:justify-center ez:border-0 ez:bg-transparent ez:p-0 ez:text-muted ez:cursor-pointer ez:hover:text-fg ez:disabled:cursor-default ez:disabled:opacity-40 ez:disabled:hover:text-muted",
  insetRing,
);

export function DayStrip({ sessions }: { sessions: Session[] }) {
  const { days, selected, groups, select, canPrev, canNext, prev, next } = useScheduleDays(sessions, { span: 7, follow: 2 });
  const id = useId();
  const shown = groups.flatMap((g) => g.sessions);
  return (
    <div className="ez:grid">
      <div className="ez:grid ez:grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] ez:overflow-hidden ez:rounded-md ez:border ez:border-solid ez:border-site-line">
        <button type="button" onClick={prev} disabled={!canPrev} aria-label="이전 주" className={navButton}>
          <Icon name="back" size="sm" />
        </button>
        <div role="group" aria-label="날짜" className="ez:grid ez:grid-cols-7 ez:border-0 ez:border-x ez:border-solid ez:border-site-line">
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
                  "ez:flex ez:min-w-0 ez:flex-col ez:items-center ez:gap-0.5 ez:border-0 ez:bg-transparent ez:px-0 ez:pt-2.5 ez:pb-3 ez:font-body ez:cursor-pointer ez:disabled:cursor-default ez:md:pt-3.5 ez:md:pb-4",
                  i > 0 && "ez:border-l ez:border-solid ez:border-site-line",
                  on && "ez:bg-surface-alt",
                  insetRing,
                )}
              >
                <span className="ez:relative ez:text-site-small ez:text-muted">
                  {d.weekday}
                  {on && <span aria-hidden="true" className="ez:absolute ez:-top-0.5 ez:-right-2.5 ez:size-1.5 ez:rounded-full ez:bg-primary" />}
                </span>
                <span
                  aria-hidden="true"
                  className={cn("ez:text-site-item ez:tabular-nums ez:md:text-site-heading", on ? "ez:font-semibold ez:text-fg" : d.count ? "ez:font-normal ez:text-fg" : "ez:font-normal ez:text-muted")}
                >
                  {d.date}
                </span>
                <span aria-hidden="true" className="ez:text-site-small ez:text-muted ez:tabular-nums">
                  {d.count || "–"}
                </span>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={next} disabled={!canNext} aria-label="다음 주" className={navButton}>
          <Icon name="next" size="sm" />
        </button>
      </div>
      <SessionGroups sessions={shown} id={id} />
    </div>
  );
}
