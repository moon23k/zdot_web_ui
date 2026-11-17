import { cva, type VariantProps } from "class-variance-authority";
import NextLink from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import type { ButtonSize, ButtonVariant } from "../../theme/contract";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";

export const buttonVariants = cva(
  [
    "ez:inline-flex ez:items-center ez:justify-center ez:gap-2.5 ez:box-border ez:m-0 ez:whitespace-nowrap",
    "ez:rounded-button ez:border ez:border-solid ez:border-transparent",
    "ez:font-body ez:no-underline ez:cursor-pointer ez:select-none",
    "ez:transition-colors ez:disabled:cursor-not-allowed ez:disabled:opacity-45",
    focusRing,
  ],
  {
    variants: {
      variant: {
        primary: "ez:bg-point-soft ez:text-primary ez:font-medium ez:hover:border-primary",
        secondary: "ez:bg-transparent ez:border-site-edge ez:text-fg ez:font-medium ez:hover:border-muted",
        ghost: "ez:bg-transparent ez:text-fg ez:font-medium ez:hover:bg-surface-alt",
        outline: "ez:bg-transparent ez:border-site-edge ez:text-fg ez:font-medium ez:hover:border-muted",
        danger: "ez:bg-danger ez:text-on-danger ez:hover:bg-danger/90",
      } satisfies Record<ButtonVariant, string>,
      size: {
        md: "ez:min-h-(--ezd-control) ez:px-7 ez:text-site-lead ez:font-medium",
        sm: "ez:min-h-(--ezd-control-sm) ez:px-4.5 ez:text-site-small ez:font-medium",
      } satisfies Partial<Record<ButtonSize, string>>,
      block: { true: "ez:w-full" },
      icon: { true: "ez:aspect-square ez:px-0" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export function Button({
  variant,
  size,
  block,
  icon,
  loading = false,
  disabled,
  className,
  type = "button",
  children,
  ...rest
}: Variants & { loading?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      data-slot="button"
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, block, icon }), className)}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="ez:size-4 ez:shrink-0 ez:animate-spin ez:rounded-full ez:border-2 ez:border-solid ez:border-current ez:border-r-transparent"
        />
      )}
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, block, icon, className, ...rest }: Variants & ComponentProps<typeof NextLink>) {
  return (
    <NextLink data-slot="button" className={cn(buttonVariants({ variant, size, block, icon }), className)} {...rest} />
  );
}
