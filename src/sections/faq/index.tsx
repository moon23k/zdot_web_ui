import { Icon } from "../../components/icon";
import type { SectionProps } from "../../renderer/registry";
import { Bar, Split } from "../kit";

export function FaqSection({ context }: SectionProps<"faq">) {
  if (!context.faqs.length) {
    return (
      <Split slot="faq" id="faq" title="자주 묻는 질문" blank>
        <div className="ez:border-0 ez:border-t ez:border-solid ez:border-site-line">
          {[0, 1, 2].map((i) => (
            <div key={i} className="ez:flex ez:min-h-14 ez:items-center ez:border-0 ez:border-b ez:border-solid ez:border-site-line ez:py-4">
              <Bar size="long" />
            </div>
          ))}
        </div>
      </Split>
    );
  }
  return (
    <Split slot="faq" id="faq" title="자주 묻는 질문">
      <div className="ez:border-0 ez:border-t ez:border-solid ez:border-site-line">
        {context.faqs.map((f) => (
          <details key={f.id} className="ez:group ez:border-0 ez:border-b ez:border-solid ez:border-site-line">
            <summary className="ez:flex ez:min-h-14 ez:cursor-pointer ez:list-none ez:items-center ez:justify-between ez:gap-3 ez:py-4 ez:font-normal ez:[&::-webkit-details-marker]:hidden">
              {f.question}
              <Icon name="down" size="sm" className="ez:text-muted ez:transition-transform ez:group-open:rotate-180" />
            </summary>
            <p className="ez:m-0 ez:pb-5 ez:whitespace-pre-line ez:text-muted">{f.answer}</p>
          </details>
        ))}
      </div>
    </Split>
  );
}
