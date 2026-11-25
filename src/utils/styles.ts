export const focusRing =
  "ez:outline-none ez:focus-visible:outline-2 ez:focus-visible:outline-offset-2 ez:focus-visible:outline-primary";

export const textLink =
  "ez:inline-flex ez:items-center ez:gap-2 ez:pb-1 ez:border-0 ez:border-b ez:border-solid ez:border-site-faint ez:text-fg ez:font-normal ez:no-underline ez:hover:border-fg";

export const chip =
  "ez:inline-flex ez:h-9.5 ez:items-center ez:gap-1.5 ez:rounded-button ez:border ez:border-solid ez:border-site-line ez:bg-transparent ez:px-4 ez:text-site-note ez:text-fg ez:no-underline ez:whitespace-nowrap ez:cursor-pointer";

export const chipOn = "ez:border-primary ez:text-primary ez:font-medium";

export const pointTag = "ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-caption ez:font-normal ez:text-primary";

export const countSup = "ez:ml-1.5 ez:align-top ez:text-site-small ez:font-normal ez:tracking-normal ez:text-primary";

export const figure = "ez:font-figure ez:italic ez:font-normal ez:tracking-normal";

export const numeral = "ez:font-body ez:not-italic ez:font-light ez:tracking-normal ez:tabular-nums";

export const numeralStep = "ez:font-body ez:not-italic ez:font-normal ez:tracking-normal ez:tabular-nums";

export const summaryBox = "ez:rounded-lg ez:bg-surface-alt ez:p-8";

export const hairline = "ez:border-0 ez:border-solid ez:border-site-line";

export const infoRows = {
  table: "ez:w-full ez:border-collapse",
  row: "ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:last:border-b-0",
  label: "ez:w-[32%] ez:border-0 ez:py-2.5 ez:pr-3 ez:text-left ez:align-baseline ez:text-site-small ez:font-normal ez:text-muted",
  value: "ez:border-0 ez:py-2.5 ez:text-left ez:align-baseline ez:text-site-body ez:text-fg ez:tabular-nums",
} as const;

const latinMark = "ez:font-body ez:not-italic ez:font-light ez:tracking-normal";

export function wordmark(name: string): string {
  return /[ㄱ-ㆎ가-힣]/.test(name) ? "ez:font-body ez:font-normal ez:tracking-[-0.03em]" : "ez:font-body ez:not-italic ez:font-normal ez:tracking-normal";
}

export function footerMark(name: string): string {
  return /[ㄱ-ㆎ가-힣]/.test(name) ? "ez:font-body ez:font-light ez:text-site-figure-lg ez:tracking-[-0.03em]" : `${latinMark} ez:text-site-display-md`;
}

const PC_COLS: Record<number, string> = {
  1: "ez:md:grid-cols-1",
  2: "ez:md:grid-cols-2",
  3: "ez:md:grid-cols-3",
  4: "ez:md:grid-cols-4",
  5: "ez:md:grid-cols-5",
  6: "ez:md:grid-cols-6",
};

export function pcCols(pc: number, count: number): string {
  return PC_COLS[Math.max(1, Math.min(pc, count))];
}
