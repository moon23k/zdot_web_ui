"use client";

import { cn } from "../../utils/cn";
import { OverlayFrame, type OverlayProps } from "../dialog/dialog";

export function Sheet({ tall = false, ...props }: OverlayProps & { tall?: boolean }) {
  return (
    <OverlayFrame
      {...props}
      slot="sheet"
      className={cn(
        "ez:inset-x-0 ez:bottom-0 ez:mx-auto ez:w-full ez:max-w-140 ez:overflow-y-auto ez:rounded-t-lg ez:px-page ez:pt-5 ez:pb-7",
        tall ? "ez:max-h-[calc(100dvh-2rem)]" : "ez:max-h-[85dvh]",
      )}
    />
  );
}
