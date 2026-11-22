import type { SectionProps } from "../../renderer/registry";
import { Bar, Block, Pairs, Rows, Split, Title } from "../kit";

export function Amenities({ data, variant }: SectionProps<"amenities">) {
  const items = data.items ?? [];
  if (variant === "gallery") {
    return (
      <Split slot="amenities" id="amenities" title="편의 시설" blank={!items.length}>
        <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-6 ez:p-0 ez:md:grid-cols-3">
          {(items.length ? items : [null, null, null]).map((it, i) => (
            <li key={it?.name ?? i} className="ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:py-4.5">
              <span>{it ? it.name : <Bar />}</span>
              {it?.group && <span className="ez:text-site-small ez:text-muted">{it.group}</span>}
            </li>
          ))}
        </ul>
      </Split>
    );
  }
  const empty = !items.length;
  return (
    <section data-slot="amenities" id="amenities" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-6 ez:text-fg ez:lg:grid-cols-[4fr_8fr]">
      <h2 className="ez:m-0 ez:text-site-section">편의시설</h2>
      <ul className="ez:m-0 ez:grid ez:min-w-0 ez:list-none ez:grid-cols-2 ez:gap-x-6 ez:p-0 ez:md:grid-cols-4">
        {(empty ? [null, null, null, null] : items).map((it, i) => (
          <li key={it?.name ?? i} className="ez:flex ez:flex-col ez:gap-1.5 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:py-5">
            <span>{it ? it.name : <Bar />}</span>
            {it?.group && <span className="ez:text-site-small ez:text-muted">{it.group}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HouseRules({ data, variant }: SectionProps<"house_rules">) {
  const rules = data.rules ?? [];
  if (variant === "gallery") {
    const empty = !data.check_in && !rules.length;
    return (
      <Split slot="house-rules" id="rules" title="이용 안내" blank={empty}>
        <Pairs
          cols={2}
          rows={
            empty
              ? [
                  { label: "체크인", value: <Bar size="short" /> },
                  { label: "체크아웃", value: <Bar size="short" /> },
                ]
              : [
                  ...(data.check_in ? [{ label: "체크인", value: data.check_in }] : []),
                  ...(data.check_out ? [{ label: "체크아웃", value: data.check_out }] : []),
                  ...rules.map((r) => ({ label: r })),
                ]
          }
        />
      </Split>
    );
  }
  if (!data.check_in && !rules.length) {
    return (
      <Block slot="house-rules" blank>
        <Title>이용 규칙</Title>
        <Rows rows={[{ label: "입실", value: <Bar size="short" /> }, { label: "퇴실", value: <Bar size="short" /> }, { label: <Bar size="long" /> }]} />
      </Block>
    );
  }
  return (
    <Block slot="house-rules">
      <Title>이용 규칙</Title>
      <Rows
        rows={[
          ...(data.check_in ? [{ label: "입실", value: data.check_in }] : []),
          ...(data.check_out ? [{ label: "퇴실", value: data.check_out }] : []),
          ...rules.map((r) => ({ label: r })),
        ]}
      />
    </Block>
  );
}
