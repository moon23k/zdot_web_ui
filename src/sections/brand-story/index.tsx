import type { SectionProps } from "../../renderer/registry";
import { Bar, Lines } from "../kit";

export function BrandStory({ data, variant }: SectionProps<"story">) {
  const body = data.body ?? [];
  const strengths = data.strengths ?? [];
  const band = variant === "gallery" || variant === "band";
  if (!data.title && !body.length && band) {
    return (
      <section data-slot="story" data-variant="gallery" id="story" data-blank="" className="ez:mx-[calc(50%-50vw)] ez:bg-surface-alt ez:text-fg">
        <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:gap-8 ez:px-page ez:py-16 ez:lg:grid-cols-[5fr_1fr_6fr] ez:lg:py-30">
          <span className="ez:text-site-page-sm ez:lg:text-site-page">
            <Bar size="long" />
          </span>
          <span aria-hidden="true" className="ez:max-lg:hidden" />
          <Lines />
        </div>
      </section>
    );
  }
  return (
    <section data-slot="story" id="story" data-blank={data.title || body.length ? undefined : ""} className="ez:grid ez:gap-6 ez:text-fg ez:lg:grid-cols-[4fr_8fr]">
      {data.title ? (
        <h2 className="ez:m-0 ez:text-site-section">{data.title}</h2>
      ) : (
        <span className="ez:text-site-section">
          <Bar />
        </span>
      )}
      <div className="ez:grid ez:gap-6">
        <div className="ez:grid ez:max-w-170 ez:gap-3 ez:text-site-item ez:font-normal">
          {body.length ? body.map((p) => (
            <p key={p} className="ez:m-0">
              {p}
            </p>
          )) : <Lines />}
        </div>
        {strengths.length > 0 && (
          <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-6 ez:p-0 ez:md:grid-cols-3">
            {strengths.map((x) => (
              <li key={x.title} className="ez:grid ez:content-start ez:gap-1.5 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:py-5">
                <span className="ez:font-medium">{x.title}</span>
                <p className="ez:m-0 ez:text-site-small ez:text-muted">{x.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
