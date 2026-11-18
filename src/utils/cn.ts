import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { SITE_TEXT_STEPS } from "../theme/system";

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
      text: [...SITE_TEXT_STEPS],
      container: ["wrap"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
