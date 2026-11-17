import { cn } from "../../utils/cn";

const PATHS = {
  search: ["M11 4.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z", "M16 16l4.5 4.5"],
  user: ["M12 5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z", "M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"],
  bag: ["M5.5 8.5h13l1 11.5h-15z", "M9 8.5V7a3 3 0 0 1 6 0v1.5"],
  heart: ["M12 19.5s-7-4.3-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.2c0 5-7 9.3-7 9.3z"],
  users: ["M9 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6z", "M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5", "M15.5 6.3a3 3 0 0 1 0 5.4M17 14.8c1.9.5 3.1 1.9 3.5 4.2"],
  clock: ["M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z", "M12 7.5V12l3 2"],
  pin: ["M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z", "M12 7.7a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6z"],
  phone: ["M6 4h3.5l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5V18a2 2 0 0 1-2 2A14 14 0 0 1 4 6a2 2 0 0 1 2-2z"],
  truck: ["M3 7h11v9.5H3zM14 10.5h4l3 3v3h-7z", "M7.5 15.8a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zM17.5 15.8a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4z"],
  box: ["M4 8l8-4 8 4v8.5l-8 4-8-4z", "M4 8l8 4 8-4M12 12v8.5"],
  down: ["M6 9.5l6 6 6-6"],
  right: ["M5 12h14M13.5 6.5L19 12l-5.5 5.5"],
  plus: ["M12 5.5v13M5.5 12h13"],
  minus: ["M5.5 12h13"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  x: ["M6 6l12 12M18 6L6 18"],
  copy: ["M8.5 8.5h11v11h-11z", "M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"],
  grid: ["M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z"],
  left: ["M19 12H5M10.5 6.5L5 12l5.5 5.5"],
  back: ["M14.5 6l-6 6 6 6"],
  next: ["M9.5 6l6 6-6 6"],
  star: ["M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z"],
  upload: ["M12 15.5V5M7.5 9.5L12 5l4.5 4.5", "M5 15v4h14v-4"],
  calendar: ["M4 5.5h16V20H4z", "M4 10h16M8.5 3.5v4M15.5 3.5v4"],
} as const;

export type IconName = keyof typeof PATHS;

const SIZES = { sm: "ez:size-4", md: "ez:size-5", lg: "ez:size-5.5" } as const;

export function Icon({ name, size = "md", className, label }: { name: IconName; size?: keyof typeof SIZES; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-slot="icon"
      className={cn("ez:inline-block ez:shrink-0", SIZES[size], className)}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
