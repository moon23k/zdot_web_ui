"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ButtonLink } from "../components/button";
import { Fold, statusText } from "../sections/kit";
import { cn } from "../utils/cn";
import type { DetailData } from "./data";

export type DetailBlockProps = { data: DetailData; variant?: string };

export function Info({ data, variant }: DetailBlockProps) {
  const items = data.info ?? [];
  const [tab, setTab] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  if (!items.length) return null;
  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    const next = { ArrowRight: tab === last ? 0 : tab + 1, ArrowLeft: tab === 0 ? last : tab - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setTab(next);
    tabs.current[next]?.focus();
  };
  if (variant === "tabs") {
    return (
      <section data-slot="detail-info" className="ez:grid ez:gap-4">
        <div role="tablist" onKeyDown={move} className="ez:flex ez:gap-9 ez:overflow-x-auto ez:border-0 ez:border-b ez:border-solid ez:border-site-line">
          {items.map((it, i) => (
            <button
              key={it.title}
              ref={(node) => {
                tabs.current[i] = node;
              }}
              id={`${id}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={tab === i}
              aria-controls={`${id}-panel`}
              tabIndex={tab === i ? 0 : -1}
              onClick={() => setTab(i)}
              className={cn(
                "ez:-mb-px ez:min-h-14 ez:shrink-0 ez:cursor-pointer ez:border-0 ez:border-b ez:border-solid ez:bg-transparent ez:px-0 ez:font-body ez:text-site-lead ez:text-fg",
                tab === i ? "ez:border-primary ez:font-medium" : "ez:border-transparent ez:text-muted",
              )}
            >
              {it.title}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${tab}`}>
          {items[tab]?.node}
        </div>
      </section>
    );
  }
  return (
    <section data-slot="detail-info">
      {items.map((it) => (
        <Fold key={it.title} title={it.title} open={it.open}>
          {it.node}
        </Fold>
      ))}
    </section>
  );
}

export function BookingBox({ data }: DetailBlockProps) {
  const sessions = data.sessions ?? [];
  const [pick, setPick] = useState(sessions.find((s) => s.status !== "full")?.id ?? "");
  if (!sessions.length) return null;
  const chosen = sessions.find((s) => s.id === pick);
  return (
    <section data-slot="booking-box" className="ez:grid ez:gap-3 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-6 ez:text-fg">
      <strong className="ez:font-medium">날짜 고르기</strong>
      <ul className="ez:m-0 ez:grid ez:list-none ez:gap-1 ez:p-0">
        {sessions.map((s) => (
          <li key={s.id}>
            <label className={cn("ez:flex ez:min-h-11 ez:cursor-pointer ez:items-center ez:justify-between ez:gap-3 ez:border-0 ez:border-b ez:border-solid ez:border-site-line", s.status === "full" && "ez:opacity-60")}>
              <span className="ez:flex ez:items-center ez:gap-2">
                <input type="radio" name="session" value={s.id} checked={pick === s.id} disabled={s.status === "full"} onChange={() => setPick(s.id)} />
                <span className="ez:tabular-nums">{`${s.date} ${s.time}`}</span>
              </span>
              <span className="ez:text-sm">{s.status === "few" && s.seats_left ? `남은 자리 ${s.seats_left}` : statusText[s.status]}</span>
            </label>
          </li>
        ))}
      </ul>
      <ButtonLink href={chosen?.href ?? "#"} variant="primary">
        예약하기
      </ButtonLink>
    </section>
  );
}

export function QuoteForm({ data, variant }: DetailBlockProps) {
  const f = data.form;
  const [step, setStep] = useState(0);
  if (!f) return null;
  return (
    <form data-slot="quote-form" data-variant={variant} className="ez:grid ez:gap-5 ez:text-fg ez:md:grid-cols-[1.4fr_1fr] ez:md:items-start">
      <div className="ez:grid ez:gap-5">
        <ol className="ez:m-0 ez:grid ez:list-none ez:auto-cols-fr ez:grid-flow-col ez:gap-1 ez:p-0 ez:text-xs">
          {f.steps.map((s, i) => (
            <li key={s} className={cn("ez:border-0 ez:border-t-4 ez:border-solid ez:pt-1.5", i <= step ? "ez:border-primary ez:text-fg" : "ez:border-primary-border ez:text-muted")}>
              {s}
            </li>
          ))}
        </ol>
        {f.groups.map((g) => (
          <fieldset key={g.label} className="ez:m-0 ez:grid ez:gap-2 ez:border-0 ez:p-0">
            <legend className="ez:mb-2 ez:font-medium">{g.label}</legend>
            <div className="ez:flex ez:flex-wrap ez:gap-2">
              {g.options.map((o, i) => (
                <label key={o} className="ez:cursor-pointer">
                  <input type="radio" name={g.label} value={o} defaultChecked={i === 0} className="ez:peer ez:sr-only" />
                  <span className="ez:inline-flex ez:min-h-11 ez:items-center ez:rounded-button ez:border ez:border-solid ez:border-primary-border ez:px-4 ez:peer-checked:border-primary ez:peer-checked:font-medium ez:peer-checked:text-primary">
                    {o}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {variant === "steps" && (
          <div className="ez:grid ez:grid-cols-2 ez:gap-2">
            <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className="ez:min-h-11 ez:rounded-button ez:border ez:border-solid ez:border-primary ez:bg-surface ez:text-primary">
              이전
            </button>
            <button type="button" onClick={() => setStep((s) => Math.min(f.steps.length - 1, s + 1))} className="ez:min-h-11 ez:rounded-button ez:border-0 ez:bg-point-soft ez:font-medium ez:text-primary">
              다음
            </button>
          </div>
        )}
      </div>
      <aside className="ez:sticky ez:bottom-0 ez:grid ez:gap-3 ez:rounded-lg ez:border ez:border-solid ez:border-primary-border ez:bg-surface ez:p-4 ez:md:top-20">
        {f.total && (
          <span className="ez:flex ez:items-baseline ez:justify-between">
            <span className="ez:text-sm ez:text-muted">예상 금액</span>
            <strong className="ez:text-xl ez:tabular-nums">{f.total}</strong>
          </span>
        )}
        <button type="submit" className="ez:min-h-12 ez:rounded-button ez:border-0 ez:bg-point-soft ez:font-medium ez:text-primary">
          {f.button}
        </button>
      </aside>
    </form>
  );
}
