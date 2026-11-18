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
      text: ["site-page", "site-page-sm", "site-section", "site-item", "site-figure", "site-body", "site-note", "site-display", "site-display-sm", "site-title", "site-heading", "site-lead", "site-small", "site-caption", "site-label", "site-hero", "site-display-lg", "site-display-md", "site-figure-xl", "site-figure-lg", "site-name", "site-logo", "site-rank", "site-counter", "site-badge"],
      container: ["wrap"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
