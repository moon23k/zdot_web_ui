import { cn } from "../../utils/cn";
import { won } from "../../utils/format";

export type SummaryRow = { label: string; value: number | string; minus?: boolean; strong?: boolean };

const amount = (row: SummaryRow) => (typeof row.value === "string" ? row.value : row.minus ? `− ${won(row.value)}` : won(row.value));

export function SummaryRows({ rows, total, after }: { rows: SummaryRow[]; total?: { label: string; value: number }; after?: SummaryRow[] }) {
  return (
    <dl data-slot="summary" className="ez:m-0 ez:grid ez:gap-3 ez:tabular-nums ez:text-fg">
      {rows.map((row, i) => (
        <div key={`${i}-${row.label}`} className="ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:text-site-lead">
          <dt className={row.strong ? undefined : "ez:text-muted"}>{row.label}</dt>
          <dd className={cn("ez:m-0", typeof row.value === "string" && "ez:text-muted", row.minus && "ez:text-primary")}>{amount(row)}</dd>
        </div>
      ))}
      {total && (
        <div className="ez:mt-4 ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-field ez:pt-7">
          <dt className="ez:text-site-lead">{total.label}</dt>
          <dd className="ez:m-0 ez:text-site-title">{won(total.value)}</dd>
        </div>
      )}
      {after?.map((row, i) => (
        <div key={`${i}-${row.label}`} className="ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:text-site-small ez:text-muted">
          <dt>{row.label}</dt>
          <dd className="ez:m-0">{amount(row)}</dd>
        </div>
      ))}
    </dl>
  );
}
