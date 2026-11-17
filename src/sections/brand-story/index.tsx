import type { SectionProps } from "../../renderer/registry";
import { cn } from "../../utils/cn";
import { Bar, Lines } from "../kit";

export function BrandStory({ data, variant, blank }: SectionProps<"story">) {
  const body = data.body ?? [];
  const strengths = data.strengths ?? [];
  if (!data.title && !body.length && !blank) return null;
  if (!data.title && !body.length) {
    return (
      <section data-slot="story" data-blank="" data-variant={variant} className={cn("ez:grid ez:gap-6 ez:text-fg", variant === "band" && "ez:justify-items-center ez:py-8 ez:text-center")}>
        <div className="ez:grid ez:w-full ez:max-w-170 ez:gap-3">
          <span className="ez:font-display ez:text-site-section">
            <Bar size="long" />
          </span>
          <Lines />
        </div>
      </section>
    );
  }
  if (variant === "gallery") {
    return (
      <section data-slot="story" data-variant="gallery" id="story" className="ez:mx-[calc(50%-50vw)] ez:bg-surface-alt ez:text-fg">
        <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:gap-8 ez:px-page ez:py-16 ez:lg:grid-cols-[5fr_1fr_6fr] ez:lg:items-center ez:lg:py-30">
          <h2 className="ez:m-0 ez:text-site-page-sm ez:font-light ez:tracking-[-0.035em] ez:text-balance ez:lg:text-site-page">{data.title}</h2>
          <span aria-hidden="true" className="ez:max-lg:hidden" />
          <div className="ez:grid ez:gap-4 ez:text-site-item ez:font-normal">
            {body.map((p) => (
              <p key={p} className="ez:m-0">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section data-slot="story" data-variant={variant} className={cn("ez:grid ez:gap-6 ez:text-fg", variant === "band" && "ez:justify-items-center ez:py-8 ez:text-center")}>
      <div className="ez:grid ez:max-w-170 ez:gap-3">
        {variant === "band" && <span className="ez:text-site-note ez:text-muted">Story</span>}
        {data.title && <h2 className="ez:m-0 ez:font-display ez:text-site-section">{data.title}</h2>}
        {body.map((p) => (
          <p key={p} className="ez:m-0">
            {p}
          </p>
        ))}
      </div>
      {strengths.length > 0 && (
        <ul className="ez:m-0 ez:grid ez:list-none ez:gap-gutter ez:p-0 ez:md:grid-cols-3">
          {strengths.map((s) => (
            <li key={s.title} className="ez:grid ez:content-start ez:gap-1.5 ez:rounded-md ez:bg-surface-alt ez:p-5">
              <strong className="ez:font-semibold">{s.title}</strong>
              <p className="ez:m-0 ez:text-site-note ez:text-muted">{s.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
