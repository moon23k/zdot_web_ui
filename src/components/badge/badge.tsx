import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import type { Tone } from "../../theme/contract";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "ez:inline-flex ez:items-center ez:rounded-button ez:px-2 ez:py-0.5 ez:text-site-caption ez:font-normal ez:whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "ez:bg-mark ez:text-mark-ink",
        primary: "ez:bg-point-soft ez:text-primary",
        danger: "ez:bg-danger-tint ez:text-danger",
      } satisfies Partial<Record<Tone, string>>,
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({ tone, className, ...rest }: VariantProps<typeof badgeVariants> & HTMLAttributes<HTMLSpanElement>) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...rest} />;
}
