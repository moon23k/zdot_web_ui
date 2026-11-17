export const focusRing =
  "ez:outline-none ez:focus-visible:outline-2 ez:focus-visible:outline-offset-2 ez:focus-visible:outline-primary";

export const textLink =
  "ez:inline-flex ez:items-center ez:gap-2 ez:pb-1 ez:border-0 ez:border-b ez:border-solid ez:border-site-faint ez:text-fg ez:font-medium ez:no-underline ez:hover:border-fg";

export const chip =
  "ez:inline-flex ez:h-9.5 ez:items-center ez:gap-1.5 ez:rounded-full ez:border ez:border-solid ez:border-site-line ez:bg-transparent ez:px-4 ez:text-site-note ez:text-fg ez:no-underline ez:whitespace-nowrap ez:cursor-pointer";

export const chipOn = "ez:border-primary ez:text-primary ez:font-medium";

export const pointTag = "ez:inline-flex ez:items-center ez:gap-1.5 ez:text-site-caption ez:font-medium ez:text-primary";

export const countSup = "ez:ml-1.5 ez:align-top ez:text-site-small ez:font-medium ez:tracking-normal ez:text-primary";

export const figure = "ez:font-figure ez:italic ez:font-normal ez:tracking-normal";

export const summaryBox = "ez:rounded-lg ez:bg-surface-alt ez:p-8";

export const hairline = "ez:border-0 ez:border-solid ez:border-site-line";

export function wordmark(name: string): string {
  return /[ㄱ-ㆎ가-힣]/.test(name) ? "ez:font-body ez:font-normal ez:tracking-[-0.03em]" : figure;
}

const GENERIC: Record<string, string> = { "대표 물건": "신상품", "클래스 안내": "클래스", "객실 안내": "객실" };

export function sectionTitle(title: string | null | undefined, fallback: string): string {
  return !title ? fallback : (GENERIC[title] ?? title);
}

export function footerMark(name: string): string {
  return /[ㄱ-ㆎ가-힣]/.test(name) ? "ez:font-body ez:font-light ez:text-site-figure-lg ez:tracking-[-0.03em]" : `${figure} ez:text-site-display-md`;
}
