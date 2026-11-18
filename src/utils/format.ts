const KST = "Asia/Seoul";
const WEEK = "일월화수목금토";

function kst(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat("ko-KR", { timeZone: KST, ...options });
}

const DATE = kst({ year: "numeric", month: "2-digit", day: "2-digit" });
const MONTH_DAY = kst({ month: "2-digit", day: "2-digit" });
const MONTH_DAY_TIME = kst({ month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
const LONG_DAY_TIME = kst({ month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
const LONG_WEEKDAY = kst({ month: "long", day: "numeric", weekday: "short" });
const LONG_WEEKDAY_TIME = kst({ month: "long", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit" });
const CLOCK = new Intl.DateTimeFormat("en-GB", { timeZone: KST, hour: "2-digit", minute: "2-digit" });
const ISO_DAY = new Intl.DateTimeFormat("sv-SE", { timeZone: KST });

export function won(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function kstDate(value: string | null | undefined): string {
  if (!value) return "";
  return DATE.format(new Date(value));
}

export function kstDotDate(value: string): string {
  const parts = DATE.formatToParts(new Date(value));
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}.${part("month")}.${part("day")}`;
}

export function kstMonthDay(value: string): string {
  return MONTH_DAY.format(new Date(value));
}

export function kstMonthDayTime(value: string): string {
  return MONTH_DAY_TIME.format(new Date(value));
}

export function kstDueTime(value: string): string {
  return LONG_DAY_TIME.format(new Date(value));
}

export function kstSchedule(value: string): string {
  const date = new Date(value);
  return (CLOCK.format(date) === "00:00" ? LONG_WEEKDAY : LONG_WEEKDAY_TIME).format(date);
}

export function kstToday(now: Date = new Date()): string {
  return ISO_DAY.format(now);
}

export function dayLabel(day: string, style: "long" | "dot" | "date" = "long"): string {
  const [y, m, d] = day.split("-").map(Number);
  if (style === "date") return `${m}월 ${d}일`;
  const weekday = WEEK[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return style === "dot" ? `${m}.${d} ${weekday}` : `${m}월 ${d}일 ${weekday}`;
}
