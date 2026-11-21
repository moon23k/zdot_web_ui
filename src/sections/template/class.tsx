import NextLink from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "../../components/button";
import { Icon } from "../../components/icon";
import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { countSup, figure, focusRing } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, Pic, statusText } from "../kit";
import type { ClassCard, Session, Tile } from "./data";

const seatText = (s: Pick<Session, "status" | "seats_left">) => (s.status === "few" && s.seats_left ? `남은 자리 ${s.seats_left}` : statusText[s.status]);

export function SessionStatus({ session }: { session: Session }) {
  return (
    <span data-slot="badge" className={cn("ez:inline-flex ez:items-center ez:text-site-small ez:whitespace-nowrap", session.status === "full" ? "ez:text-muted" : "ez:font-medium ez:text-primary")}>
      {seatText(session)}
    </span>
  );
}

const rowGrid = "ez:grid ez:grid-cols-[72px_1fr] ez:items-center ez:gap-x-4 ez:gap-y-2 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:py-4 ez:md:grid-cols-[120px_1fr_auto] ez:md:gap-x-6";

export function SessionRow({ session, tone }: { session: Session; tone?: number }) {
  return (
    <NextLink href={session.href ?? "#"} className={cn(rowGrid, "ez:text-fg ez:no-underline", focusRing)}>
      <Pic src={session.image} ratio={4 / 3} tone={tone} />
      <span className="ez:grid ez:gap-0.5">
        <span className="ez:text-site-item ez:tabular-nums">{`${session.date} · ${session.time}`}</span>
        <span className="ez:text-site-small ez:text-muted">{[session.name, session.length].filter(Boolean).join(" · ")}</span>
      </span>
      <span className="ez:col-span-2 ez:md:col-span-1">
        <SessionStatus session={session} />
      </span>
    </NextLink>
  );
}

export function SessionList({ sessions }: { sessions: Session[] }) {
  return (
    <div className="ez:grid ez:border-0 ez:border-t ez:border-solid ez:border-site-line">
      {sessions.map((s, i) => (
        <SessionRow key={s.id} session={s} tone={i} />
      ))}
    </div>
  );
}

function Heading({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <h2 className="ez:m-0 ez:text-site-section">
      {children}
      {count ? <span className={countSup}>{count}</span> : null}
    </h2>
  );
}

function GalleryRow({ s, i }: { s: Session | null; i: number }) {
  const full = s?.status === "full";
  return (
    <li className={cn("ez:grid ez:grid-cols-[1fr_auto] ez:items-center ez:gap-x-6 ez:gap-y-2 ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:py-5 ez:lg:grid-cols-[140px_96px_minmax(0,1fr)_140px_120px_120px]", full && "ez:text-muted")}>
      <span className="ez:flex ez:flex-col">
        <span className="ez:text-site-heading ez:tabular-nums">{s ? (s.day ?? s.date) : <Bar size="short" />}</span>
        {s && <span className="ez:text-site-small ez:text-muted ez:tabular-nums">{s.time}</span>}
      </span>
      <Pic src={s?.image} tone={i} className={cn("ez:aspect-[4/3] ez:w-24 ez:max-lg:hidden", full && "ez:opacity-45")} />
      <span className="ez:col-span-2 ez:flex ez:flex-col ez:lg:col-span-1">
        <span className="ez:text-site-item ez:font-normal">{s ? s.name : <Bar />}</span>
        <span className="ez:text-site-small ez:text-muted">{s ? s.length : <Bar size="short" />}</span>
      </span>
      <span className={cn("ez:text-site-small", s?.status === "few" && "ez:font-medium ez:text-primary")}>{s ? (full ? "마감" : `${s.seats_left ?? 0}자리 남음`) : null}</span>
      <span className="ez:font-medium ez:tabular-nums ez:lg:text-right">{s?.price}</span>
      <span className="ez:flex ez:justify-end">
        {s && !full ? (
          <ButtonLink href={s.href ?? "#"} size="sm">
            예약하기
          </ButtonLink>
        ) : s ? null : (
          <BlankButton>예약하기</BlankButton>
        )}
      </span>
    </li>
  );
}

const cohortGrid =
  "ez:grid ez:grid-cols-[88px_minmax(0,1fr)_auto] ez:items-center ez:gap-x-4 ez:gap-y-1 ez:lg:grid-cols-[150px_minmax(0,1.6fr)_minmax(0,1.2fr)_110px_minmax(0,1.1fr)_130px_110px] ez:lg:gap-x-6";

function CohortRow({ s }: { s: Session | null }) {
  const full = s?.status === "full";
  const [md, wd] = (s?.day ?? "").split(" ");
  const seats = s ? (full ? "마감" : s.seats_left != null ? `${s.seats_left}자리` : statusText[s.status]) : null;
  return (
    <li className={cn(cohortGrid, "ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:py-6", full && "ez:text-muted")}>
      <span className="ez:flex ez:flex-col">
        <span className={cn(figure, "ez:text-site-section ez:leading-tight ez:tabular-nums")}>{s ? (md || s.date) : <Bar size="short" />}</span>
        {wd && <span className="ez:text-site-small ez:text-muted">{`${wd}요일 개강`}</span>}
      </span>
      <span className="ez:flex ez:min-w-0 ez:flex-col ez:gap-0.5">
        <span className="ez:text-site-item">{s ? s.name : <Bar />}</span>
        {s && (
          <span className="ez:text-site-small ez:text-muted ez:lg:hidden">{[wd ? `${wd} · ${s.time}` : s.time, s.length, seats, s.price].filter(Boolean).join(" · ")}</span>
        )}
      </span>
      <span className="ez:tabular-nums ez:max-lg:hidden">{s ? (wd ? `${wd} · ${s.time}` : s.time) : <Bar size="short" />}</span>
      <span className="ez:max-lg:hidden">{s ? s.length : <Bar size="short" />}</span>
      <span className={cn("ez:text-site-small ez:max-lg:hidden", s && !full && "ez:font-medium ez:text-primary")}>{seats ?? <Bar size="short" />}</span>
      <span className="ez:text-right ez:font-medium ez:tabular-nums ez:max-lg:hidden">{s ? s.price : <BlankPrice />}</span>
      <span className="ez:flex ez:justify-end">
        {s && !full ? (
          <ButtonLink href={s.href ?? "#"} size="sm">
            신청
          </ButtonLink>
        ) : s ? null : (
          <BlankButton className="ez:min-h-(--ezd-control-sm) ez:px-4.5 ez:text-site-small">신청</BlankButton>
        )}
      </span>
    </li>
  );
}

function Cohorts({ title, sessions }: { title: string; sessions: Session[] }) {
  return (
    <section data-slot="class-schedule" data-variant="upcoming" id="schedule" data-blank={sessions.length ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg">
      <Heading count={sessions.length}>{title}</Heading>
      <div>
        <div aria-hidden="true" className={cn(cohortGrid, "ez:border-0 ez:border-y ez:border-solid ez:border-site-line ez:py-3.5 ez:text-site-small ez:text-muted ez:max-lg:hidden")}>
          <span>개강</span>
          <span>과정</span>
          <span>요일 · 시간</span>
          <span>기간</span>
          <span>남은 자리</span>
          <span className="ez:text-right">수강료</span>
          <span />
        </div>
        <ul className="ez:m-0 ez:list-none ez:p-0 ez:max-lg:border-0 ez:max-lg:border-t ez:max-lg:border-solid ez:max-lg:border-site-line">
          {(sessions.length ? sessions : [null, null, null]).map((s, i) => (
            <CohortRow key={s?.id ?? i} s={s} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ClassSchedule({ data, variant }: SectionProps<"class_schedule">) {
  const sessions = data.sessions ?? [];
  if (variant === "gallery") {
    return (
      <section data-slot="class-schedule" data-variant="gallery" id="schedule" data-blank={sessions.length ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-8">
        <h2 className="ez:m-0 ez:text-site-section">수업 일정</h2>
        <ul className="ez:m-0 ez:list-none ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:p-0">
          {(sessions.length ? sessions : [null, null, null]).map((s, i) => (
            <GalleryRow key={s?.id ?? i} s={s} i={i} />
          ))}
        </ul>
      </section>
    );
  }
  return <Cohorts title="모집 중인 반" sessions={sessions} />;
}

function ClassBox({ c, i }: { c: ClassCard | null; i: number }) {
  const meta = c ? [c.chips?.join(" · "), c.next].filter(Boolean) : [];
  const body = (
    <>
      <Pic src={c?.image} ratio={4 / 3} tone={i} className="ez:[&>[data-slot=photo]]:rounded-none" />
      <span className="ez:flex ez:flex-1 ez:flex-col ez:gap-4 ez:p-6">
        <span className="ez:flex ez:flex-col ez:gap-1.5">
          <span className="ez:text-site-heading">{c ? c.name : <Bar />}</span>
          {c ? (
            meta.map((m) => (
              <span key={m} className="ez:text-site-small ez:text-muted">
                {m}
              </span>
            ))
          ) : (
            <span className="ez:text-site-small">
              <Bar size="long" />
            </span>
          )}
        </span>
        <span className="ez:mt-auto ez:flex ez:items-center ez:justify-between ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-4">
          <span className="ez:text-site-item ez:font-medium ez:tabular-nums">{c ? c.price : <BlankPrice />}</span>
          {c && (
            <span className="ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-small ez:font-medium ez:text-primary">
              예약
              <Icon name="right" size="sm" />
            </span>
          )}
        </span>
      </span>
    </>
  );
  const box = "ez:flex ez:flex-col ez:overflow-hidden ez:rounded-lg ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:text-fg ez:no-underline";
  return c ? (
    <NextLink href={c.href ?? "#"} className={cn(box, focusRing)}>
      {body}
    </NextLink>
  ) : (
    <div className={box}>{body}</div>
  );
}

export function ClassList({ data, variant }: SectionProps<"class_list">) {
  const classes = data.classes ?? [];
  if (variant === "gallery") {
    return (
      <section data-slot="class-list" data-variant="gallery" id="classes" data-blank={classes.length ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-9">
        <h2 className="ez:m-0 ez:text-site-section">
          클래스
          {classes.length > 0 && <span className={countSup}>{classes.length}</span>}
        </h2>
        <div className="ez:grid ez:gap-x-gutter ez:gap-y-10 ez:md:grid-cols-3 ez:lg:gap-y-14">
          {(classes.length ? classes : [null, null, null]).map((c, i) => {
            const body = (
              <>
                <Pic src={c?.image} ratio={4 / 3} tone={i} />
                <span className="ez:flex ez:flex-col ez:gap-1.5">
                  <span className="ez:text-site-heading">{c ? c.name : <Bar />}</span>
                  <span className="ez:flex ez:items-baseline ez:justify-between ez:gap-3">
                    <span className="ez:text-site-small ez:text-muted">{c?.next}</span>
                    <span className="ez:font-medium ez:tabular-nums">{c ? c.price : <BlankPrice />}</span>
                  </span>
                </span>
              </>
            );
            return c ? (
              <NextLink key={c.id} href={c.href ?? "#"} className={cn("ez:grid ez:content-start ez:gap-3.5 ez:text-fg ez:no-underline", focusRing)}>
                {body}
              </NextLink>
            ) : (
              <div key={i} className="ez:grid ez:content-start ez:gap-3.5">
                {body}
              </div>
            );
          })}
        </div>
      </section>
    );
  }
  return (
    <section data-slot="class-list" data-variant="cards" id="classes" data-blank={classes.length ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg ez:lg:gap-8">
      <Heading count={classes.length}>클래스</Heading>
      <div className="ez:grid ez:gap-gutter ez:md:grid-cols-2 ez:lg:grid-cols-3">
        {(classes.length ? classes : [null, null, null]).map((c, i) => (
          <ClassBox key={c?.id ?? i} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}

type Gate = Tile & { price?: string | null };

function GateBox({ g, i }: { g: Gate | null; i: number }) {
  const body = (
    <>
      <span className="ez:flex ez:items-center ez:justify-between">
        <span className={cn(figure, "ez:text-site-page ez:leading-none ez:text-primary")}>{g ? i + 1 : <Bar size="short" />}</span>
        {g && <Icon name="right" />}
      </span>
      <span className="ez:text-site-section ez:font-light">{g ? g.title : <Bar size="long" />}</span>
      {(g?.price || !g) && (
        <span className="ez:mt-auto ez:flex ez:justify-end ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-4 ez:font-medium ez:tabular-nums">{g ? g.price : <Bar size="short" />}</span>
      )}
    </>
  );
  const box = "ez:flex ez:min-h-60 ez:flex-col ez:gap-7 ez:rounded-lg ez:bg-surface ez:p-9 ez:text-fg ez:no-underline";
  return g ? (
    <NextLink href={g.href ?? "#"} className={cn(box, focusRing)}>
      {body}
    </NextLink>
  ) : (
    <div className={box}>{body}</div>
  );
}

export function Gates({ data }: SectionProps<"gates">) {
  const items: Gate[] = data.items ?? [];
  return (
    <section data-slot="gates" id="courses" data-blank={items.length ? undefined : ""} className="ez:mx-[calc(50%-50vw)] ez:bg-surface-alt ez:text-fg">
      <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:gap-8 ez:px-page ez:py-16 ez:lg:gap-10 ez:lg:py-24">
        <Heading>과정</Heading>
        <div className="ez:grid ez:gap-gutter ez:md:grid-cols-3">
          {(items.length ? items.slice(0, 3) : [null, null, null]).map((g, i) => (
            <GateBox key={g?.title ?? i} g={g} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
