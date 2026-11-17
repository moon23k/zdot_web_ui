import { ButtonLink } from "../../components/button";
import { StarRow } from "../../sections/template/common";
import { kstDate } from "../../utils/cn";
import { countSup, figure } from "../../utils/styles";
import { lineList } from "../parts/line-item";
import { PencilIcon } from "../parts/empty-icons";

export type ReviewItem = {
  id: string;
  rating: number;
  body: string;
  reply?: string | null;
  created_at: string;
  author?: string | null;
  option?: string | null;
};

function Spread({ items }: { items: ReviewItem[] }) {
  const max = Math.max(1, ...[1, 2, 3, 4, 5].map((n) => items.filter((r) => r.rating === n).length));
  return (
    <dl className="ez:m-0 ez:grid ez:max-w-75 ez:gap-2.5 ez:text-site-small">
      {[5, 4, 3, 2, 1].map((n) => {
        const c = items.filter((r) => r.rating === n).length;
        return (
          <div key={n} className="ez:flex ez:items-center ez:gap-3">
            <dt className="ez:w-5.5 ez:text-muted">{n}점</dt>
            <dd className="ez:relative ez:m-0 ez:h-0.5 ez:flex-1 ez:bg-site-line">
              <span className="ez:absolute ez:inset-y-0 ez:left-0 ez:bg-primary" style={{ width: `${(c / max) * 100}%` }} />
            </dd>
            <dd className="ez:m-0 ez:w-5 ez:text-right ez:text-muted ez:tabular-nums">{c}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export function ReviewList({
  count = 0,
  average,
  items,
  notice,
  writeHref,
  title = "리뷰",
}: {
  count?: number;
  average?: number | null;
  items: ReviewItem[];
  notice?: { title?: string; body?: string }[];
  writeHref?: string;
  title?: string;
}) {
  const total = Math.max(count, items.length);
  const mean = !total ? null : (average ?? (items.length ? items.reduce((sum, r) => sum + r.rating, 0) / items.length : null));
  return (
    <section data-slot="review-list" id="reviews" aria-label={title} className="ez:mx-[calc(50%-50vw)] ez:bg-surface-alt ez:text-fg">
      <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:gap-10 ez:px-page ez:py-16 ez:lg:grid-cols-[4fr_8fr] ez:lg:gap-6 ez:lg:py-24">
        <div className="ez:flex ez:flex-col ez:items-start ez:gap-7">
          <h2 className="ez:m-0 ez:text-site-section">
            {title}
            {total > 0 && <span className={countSup}>{total}</span>}
          </h2>
          {mean !== null && (
            <div className="ez:flex ez:items-baseline ez:gap-4">
              <span className={`${figure} ez:text-site-figure-xl`}>{mean.toFixed(1)}</span>
              <StarRow rating={mean} />
            </div>
          )}
          {items.length > 0 && items.length === total && <Spread items={items} />}
          {writeHref && (
            <ButtonLink href={writeHref} variant="outline" size="sm" className="ez:bg-surface">
              <PencilIcon />
              리뷰 쓰기
            </ButtonLink>
          )}
        </div>
        <div className="ez:grid ez:content-start">
          {!items.length && <p className="ez:m-0 ez:border-0 ez:border-t ez:border-solid ez:border-site-field ez:py-7 ez:text-muted">아직 {title}가 없어요</p>}
          <ul className={lineList}>
            {items.map((r) => (
              <li key={r.id} className="ez:grid ez:gap-2.5 ez:border-0 ez:border-t ez:border-solid ez:border-site-field ez:py-7">
                <div className="ez:flex ez:flex-wrap ez:items-center ez:gap-x-3 ez:text-site-small">
                  <StarRow rating={r.rating} />
                  <span className="ez:font-medium ez:tabular-nums">{r.rating.toFixed(1)}</span>
                  <span className="ez:text-muted">{[r.author, kstDate(r.created_at)].filter(Boolean).join(" · ")}</span>
                  {r.option && <span className="ez:text-muted">{r.option}</span>}
                </div>
                <p className="ez:m-0 ez:whitespace-pre-line">{r.body}</p>
                {r.reply && (
                  <p className="ez:m-0 ez:ml-3 ez:rounded-sm ez:bg-surface ez:px-4 ez:py-3 ez:text-site-small">
                    <span className="ez:font-medium">판매자</span> {r.reply}
                  </p>
                )}
              </li>
            ))}
          </ul>
          {notice && notice.length > 0 && (
            <details className="ez:border-0 ez:border-t ez:border-solid ez:border-site-field ez:pt-5 ez:text-site-small ez:text-muted">
              <summary className="ez:cursor-pointer">후기 운영 기준</summary>
              <div className="ez:mt-2 ez:grid ez:gap-1">
                {notice.map((n, i) => (
                  <p key={i} className="ez:m-0">
                    {n.title} {n.body}
                  </p>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}
