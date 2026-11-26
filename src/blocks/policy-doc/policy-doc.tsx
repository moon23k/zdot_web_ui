import { scriptOf } from "../../utils/writing";
export function PolicyDoc({ title, sections }: { title: string; sections: { heading: string; text: string }[] }) {
  return (
    <article data-slot="policy-doc" className="ez:grid ez:max-w-180 ez:gap-6 ez:text-fg">
      <h1 data-script={scriptOf(title)} className="ez:m-0 ez:font-display ez:font-title ez:text-site-heading">{title}</h1>
      {sections.map((s) => (
        <section key={s.heading} className="ez:grid ez:gap-2">
          <h2 data-script={scriptOf(s.heading)} className="ez:m-0 ez:text-site-item ez:font-normal">{s.heading}</h2>
          <p className="ez:m-0 ez:whitespace-pre-line ez:leading-relaxed">{s.text}</p>
        </section>
      ))}
    </article>
  );
}
