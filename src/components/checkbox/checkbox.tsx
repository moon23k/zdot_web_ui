"use client";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";

export function Checkbox({
  label,
  description,
  className,
  id,
  ...rest
}: { label: ReactNode; description?: ReactNode } & ComponentProps<typeof CheckboxPrimitive.Root>) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div data-slot="checkbox" className={cn("ez:flex ez:items-start ez:gap-2.5 ez:text-fg", className)}>
      <CheckboxPrimitive.Root
        id={inputId}
        className={cn(
          "ez:mt-0.5 ez:size-5 ez:shrink-0 ez:box-border ez:p-0 ez:rounded-[6px] ez:border ez:border-solid ez:border-site-faint ez:bg-surface ez:cursor-pointer",
          "ez:data-[state=checked]:bg-point-soft ez:data-[state=checked]:border-primary ez:text-primary",
          "ez:disabled:cursor-not-allowed ez:disabled:opacity-45",
          focusRing,
        )}
        {...rest}
      >
        <CheckboxPrimitive.Indicator className="ez:flex ez:items-center ez:justify-center">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label htmlFor={inputId} className="ez:grid ez:gap-1 ez:cursor-pointer">
        <span className="ez:text-site-lead">{label}</span>
        {description && <span className="ez:text-site-small ez:text-muted">{description}</span>}
      </label>
    </div>
  );
}
