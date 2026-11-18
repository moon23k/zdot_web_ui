import NextLink from "next/link";
import type { ReactNode } from "react";
import { Button } from "../../components/button";
import { EmptyState } from "../../components/empty-state";
import { Photo } from "../../components/photo";
import { cn } from "../../utils/cn";
import { lineList } from "../parts/line-item";
import { kstMonthDayTime } from "../../utils/format";

export type InquiryRow = {
  id: string;
  status: "open" | "answered" | "closed";
  needs_partner: boolean;
  preview: string;
  product_name?: string | null;
  order_number?: string | null;
  last_message_at: string;
};

export type InquiryMessageView = {
  author: "customer" | "partner" | "ai";
  body: string;
  created_at: string;
  photos?: string[];
};

const STATUS: Record<InquiryRow["status"], string> = {
  open: "답변 대기",
  answered: "답변 완료",
  closed: "종료",
};

const AI_NOTICE = "빠른 답변을 위해 AI의 도움을 받고 있어요";

function hasFinal(name: string): boolean {
  const code = name.trim().charCodeAt(name.trim().length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
}

export function greetingOf(store: string): string {
  return `안녕하세요, ${store}${hasFinal(store) ? "이에요" : "예요"}`;
}

function Sparkle() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinejoin="round"
      className="ez:size-3 ez:shrink-0"
    >
      <path d="M12 3l1.6 4.8L18.5 9.5l-4.9 1.7L12 16l-1.6-4.8L5.5 9.5l4.9-1.7z" />
    </svg>
  );
}

export function InquiryGreeting({
  store,
  aiNotice,
  topics = [],
  busy = false,
}: {
  store: string;
  aiNotice: boolean;
  topics?: string[];
  busy?: boolean;
}) {
  return (
    <section
      data-slot="inquiry-greeting"
      className="ez:grid ez:max-w-180 ez:gap-3"
    >
      <p className="ez:m-0">{greetingOf(store)}</p>
      {aiNotice && (
        <span className="ez:flex ez:items-center ez:gap-1 ez:text-[13px] ez:text-muted">
          <Sparkle />
          {AI_NOTICE}
        </span>
      )}
      {topics.length > 0 && (
        <span className="ez:flex ez:flex-wrap ez:gap-2">
          {topics.map((topic) => (
            <Button
              key={topic}
              type="submit"
              name="body"
              value={topic}
              variant="secondary"
              size="sm"
              disabled={busy}
            >
              {topic}
            </Button>
          ))}
        </span>
      )}
    </section>
  );
}

export function InquiryList({
  inquiries,
  href = (id) => `/inquiries/${id}`,
}: {
  inquiries: InquiryRow[];
  href?: (id: string) => string;
}) {
  if (!inquiries.length) return <EmptyState title="남긴 문의가 없어요" />;
  return (
    <ul data-slot="inquiry-list" className={cn(lineList, "ez:max-w-180")}>
      {inquiries.map((q) => (
        <li key={q.id}>
          <NextLink
            href={href(q.id)}
            className="ez:grid ez:gap-0.5 ez:border-0 ez:border-b ez:border-solid ez:border-primary-border ez:py-3.5 ez:text-fg ez:no-underline ez:hover:bg-surface-alt"
          >
            <span className="ez:flex ez:items-baseline ez:justify-between ez:gap-3">
              <span className="ez:line-clamp-1">
                {q.preview}
              </span>
              <span
                className={cn(
                  "ez:shrink-0 ez:text-[13px]",
                  q.status === "answered"
                    ? "ez:font-medium ez:text-primary"
                    : "ez:text-muted"
                )}
              >
                {STATUS[q.status]}
              </span>
            </span>
            <span className="ez:text-[13px] ez:tabular-nums ez:text-muted">
              {[
                q.product_name,
                q.order_number && `주문 ${q.order_number}`,
                kstMonthDayTime(q.last_message_at),
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </NextLink>
        </li>
      ))}
    </ul>
  );
}

export function InquiryThread({
  messages,
  store,
  header,
  footer,
}: {
  messages: InquiryMessageView[];
  store: string;
  header?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section
      data-slot="inquiry-thread"
      className="ez:grid ez:max-w-180 ez:gap-4"
    >
      {header}
      <ol className={cn(lineList, "ez:grid ez:gap-3")}>
        {messages.map((m, i) => (
          <li
            key={`${m.created_at}-${i}`}
            className={cn(
              "ez:grid ez:gap-1 ez:rounded-lg ez:p-3.5",
              m.author === "customer"
                ? "ez:bg-surface-alt"
                : "ez:border ez:border-solid ez:border-primary-border"
            )}
          >
            <span className="ez:flex ez:items-center ez:gap-2 ez:text-[13px] ez:text-muted">
              <span className="ez:font-medium ez:text-fg">
                {m.author === "customer" ? "나" : store}
              </span>
              <span className="ez:tabular-nums">{kstMonthDayTime(m.created_at)}</span>
            </span>
            <p className="ez:m-0 ez:whitespace-pre-wrap">{m.body}</p>
            {m.photos && m.photos.length > 0 && (
              <span className="ez:grid ez:grid-cols-3 ez:gap-2">
                {m.photos.map((src, k) => (
                  <Photo
                    key={src}
                    src={src}
                    alt={`보낸 사진 ${k + 1}`}
                    sizes="120px"
                  />
                ))}
              </span>
            )}
          </li>
        ))}
      </ol>
      {footer}
    </section>
  );
}
