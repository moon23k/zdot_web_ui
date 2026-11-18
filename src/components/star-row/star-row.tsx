import { cn } from "../../utils/cn";

export const STAR_PATH = "M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z";

export function StarRow({ rating, className }: { rating: number; className?: string }) {
  return (
    <span role="img" aria-label={`별점 ${rating}점`} className={cn("ez:inline-flex ez:gap-0.5 ez:text-primary", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" aria-hidden="true" className={cn("ez:size-3.25", n > Math.round(rating) && "ez:opacity-25")}>
          <path fill="currentColor" d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}
