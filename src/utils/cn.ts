import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const merge = extendTailwindMerge({
  prefix: "ez",
  extend: {
    theme: {
      radius: ["button"],
      spacing: ["gutter", "section", "page"],
      font: ["display", "body", "figure"],
      "font-weight": ["title"],
      tracking: ["brand"],
      aspect: ["photo"],
      text: ["site-page", "site-page-sm", "site-section", "site-item", "site-figure", "site-body", "site-note", "site-display", "site-display-sm", "site-title", "site-heading", "site-lead", "site-small", "site-caption", "site-label", "site-hero", "site-display-md", "site-figure-xl", "site-figure-lg", "site-name", "site-logo", "site-rank", "site-counter", "site-badge"],
      container: ["wrap"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}

export function won(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function kstDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
