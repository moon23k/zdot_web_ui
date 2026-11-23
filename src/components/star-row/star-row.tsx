import { useId } from "react";
import { cn } from "../../utils/cn";

export const STAR_PATH = "M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z";

const STAR_LEFT = 3.8;
const STAR_WIDTH = 16.4;

function starFill(rating: number, n: number): number {
  return Math.round(Math.min(1, Math.max(0, rating - (n - 1))) * 100) / 100;
}

export function StarRow({ rating, className }: { rating: number; className?: string }) {
  const id = `star${useId().replace(/[^\w-]/g, "")}`;
  return (
    <span role="img" aria-label={`별점 ${rating}점`} className={cn("ez:inline-flex ez:gap-0.5 ez:text-primary", className)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = starFill(rating, n);
        if (fill === 1 || fill === 0) {
          return (
            <svg key={n} viewBox="0 0 24 24" aria-hidden="true" className={cn("ez:size-3.25", fill === 0 && "ez:opacity-25")}>
              <path fill="currentColor" d={STAR_PATH} />
            </svg>
          );
        }
        return (
          <svg key={n} viewBox="0 0 24 24" aria-hidden="true" data-fill={fill} className="ez:size-3.25">
            <clipPath id={`${id}-${n}`}>
              <rect width={Number((STAR_LEFT + STAR_WIDTH * fill).toFixed(2))} height="24" />
            </clipPath>
            <path fill="currentColor" d={STAR_PATH} className="ez:opacity-25" />
            <path fill="currentColor" d={STAR_PATH} clipPath={`url(#${id}-${n})`} />
          </svg>
        );
      })}
    </span>
  );
}
