import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

const SHAPES: { words: string[]; body: ReactNode }[] = [
  {
    words: ["와이파이", "인터넷", "wifi", "wi-fi"],
    body: (
      <>
        <path d="M4 9.5a11.5 11.5 0 0 1 16 0" />
        <path d="M7 12.8a7 7 0 0 1 10 0" />
        <path d="M10 16a2.6 2.6 0 0 1 4 0" />
        <circle cx="12" cy="18.8" r=".6" />
      </>
    ),
  },
  {
    words: ["주차"],
    body: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M10 16.5V8h3a2.5 2.5 0 0 1 0 5h-3" />
      </>
    ),
  },
  {
    words: ["주방", "취사", "조리"],
    body: (
      <>
        <path d="M5 10h14v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" />
        <path d="M3 10h18M9 7V5M12 7V4.5M15 7V5" />
      </>
    ),
  },
  {
    words: ["욕조", "스파", "자쿠지", "월풀"],
    body: (
      <>
        <path d="M3.5 12h17v1.5a5 5 0 0 1-5 5h-7a5 5 0 0 1-5-5z" />
        <path d="M6 12V6.5a2 2 0 0 1 3.8-.9M7 18.5l-1 2M17 18.5l1 2" />
      </>
    ),
  },
  {
    words: ["바비큐", "그릴", "bbq"],
    body: (
      <>
        <path d="M4.5 10h15a7.5 7.5 0 0 1-15 0z" />
        <path d="M8 16.5l-2 4M16 16.5l2 4M12 17.5v3M9.5 4c0 1.5 1.2 1.5 1.2 3M13.3 4c0 1.5 1.2 1.5 1.2 3" />
      </>
    ),
  },
  {
    words: ["에어컨", "냉방"],
    body: (
      <>
        <rect x="3" y="5" width="18" height="8" rx="2" />
        <path d="M6.5 10h11M8 16v2.5M12 16v3M16 16v2.5" />
      </>
    ),
  },
  {
    words: ["난방", "보일러", "온돌"],
    body: (
      <>
        <path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0z" />
        <path d="M12 9v7" />
      </>
    ),
  },
  {
    words: ["세탁"],
    body: (
      <>
        <rect x="4.5" y="3" width="15" height="18" rx="2" />
        <circle cx="12" cy="13" r="4" />
        <path d="M7.5 6.5h2" />
      </>
    ),
  },
  {
    words: ["수건", "타월"],
    body: (
      <>
        <rect x="6" y="3.5" width="12" height="17" rx="2" />
        <path d="M6 15h12M9.5 18h5" />
      </>
    ),
  },
  {
    words: ["드라이기", "헤어"],
    body: (
      <>
        <circle cx="9" cy="9" r="5" />
        <circle cx="9" cy="9" r="1.5" />
        <path d="M14 7h6v4h-6M8 14l1 6h2l-.5-6" />
      </>
    ),
  },
];

const FALLBACK = <path d="M5 12.5l4.5 4.5L19 7.5" />;

export function amenityShape(name: string): ReactNode {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return SHAPES.find((s) => s.words.some((w) => key.includes(w)))?.body ?? FALLBACK;
}

const SIZES = { sm: "ez:size-4", md: "ez:size-5", lg: "ez:size-6" } as const;

export function AmenityIcon({ name, size = "md", className }: { name: string; size?: keyof typeof SIZES; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-slot="icon"
      className={cn("ez:inline-block ez:shrink-0", SIZES[size], className)}
    >
      {amenityShape(name)}
    </svg>
  );
}
