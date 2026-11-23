import type { CSSProperties, ReactNode } from "react";

export type DetailFont = "gothic" | "serif" | "display" | "hand";
export type DetailTextStyle = {
  font?: DetailFont;
  size?: number;
  weight?: "regular" | "bold" | "heavy";
  color?: string;
  align?: "left" | "center" | "right";
  effect?: "none" | "shadow" | "outline" | "band";
  line?: number;
  tracking?: number;
};
export type DetailLayer = {
  id: string;
  type: "text" | "image";
  text?: string | null;
  url?: string | null;
  style?: DetailTextStyle | null;
  hidden?: boolean;
};
export type DetailBlock = {
  id: string;
  layout: "text" | "image" | "image_top" | "text_top" | "side" | "two_images" | "card" | "table" | "steps";
  background?: { color?: string | null; url?: string | null };
  space_top?: number;
  space_bottom?: number;
  layers: DetailLayer[];
};
export type DetailDocValue = { version?: number; background?: string | null; blocks?: DetailBlock[] };

export const DETAIL_FONTS: Record<DetailFont, { family: string; href: string }> = {
  gothic: {
    family: "Pretendard, system-ui, sans-serif",
    href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
  },
  serif: { family: "'Nanum Myeongjo', serif", href: "https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap" },
  display: { family: "'Black Han Sans', sans-serif", href: "https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap" },
  hand: { family: "'Nanum Pen Script', cursive", href: "https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap" },
};

const WEIGHT = { regular: 400, bold: 700, heavy: 800 } as const;

export function detailFontSize(size = 5): number {
  return 12 + (Math.min(10, Math.max(1, size)) - 1) * 2;
}

const clamp = (value: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, value));

export function detailLineHeight(line = 5): number {
  return 1.05 + clamp(line, 1, 10) * 0.08;
}

export function detailTracking(tracking = 0): number {
  return clamp(tracking, -5, 10) * 0.01;
}

export function detailBlockSpace(space = 0): number {
  return clamp(space, 0, 10) * 8;
}

function textStyle(style: DetailTextStyle | null | undefined): CSSProperties {
  const s = style ?? {};
  const font = DETAIL_FONTS[s.font ?? "gothic"];
  const css: CSSProperties = {
    fontFamily: font.family,
    fontSize: detailFontSize(s.size),
    fontWeight: WEIGHT[s.weight ?? "regular"],
    color: s.color,
    textAlign: s.align ?? "left",
    lineHeight: detailLineHeight(s.line),
    letterSpacing: `${detailTracking(s.tracking)}em`,
    whiteSpace: "pre-line",
    margin: 0,
  };
  if (s.effect === "shadow") css.textShadow = "0 1px 3px rgba(0, 0, 0, 0.35)";
  if (s.effect === "outline") Object.assign(css, { border: "1.5px solid currentColor", padding: "4px 8px", display: "inline-block" });
  if (s.effect === "band") Object.assign(css, { backgroundColor: s.color, color: "var(--ezd-surface, white)", padding: "2px 8px", display: "inline-block" });
  return css;
}

function Texts({ layers, under = false }: { layers: DetailLayer[]; under?: boolean }) {
  const texts = layers.filter((l) => l.type === "text" && l.text);
  if (!texts.length) return null;
  return (
    <div className={under ? "ez:grid ez:gap-2 ez:px-5 ez:pt-8 ez:pb-6" : "ez:grid ez:gap-2 ez:px-5 ez:py-6"}>
      {texts.map((l) => (
        <div key={l.id} style={{ textAlign: l.style?.align ?? "left" }}>
          <p style={textStyle(l.style)}>{l.text}</p>
        </div>
      ))}
    </div>
  );
}

const LINE_INK = "#1A1A1A";
const STEP_COLUMNS = 4;
const STEP_DOT = 2.4;

function lineColor(color?: string | null): string {
  return `${color && /^#[0-9a-fA-F]{6}$/.test(color) ? color : LINE_INK}33`;
}

const filled = (l: DetailLayer | undefined): l is DetailLayer => !!l && !l.hidden && !!l.text?.trim();

function Cell({ layer }: { layer: DetailLayer | undefined }) {
  if (!filled(layer)) return <div />;
  return (
    <div style={{ textAlign: layer.style?.align ?? "left" }}>
      <p style={textStyle(layer.style)}>{layer.text}</p>
    </div>
  );
}

function Table({ layers }: { layers: DetailLayer[] }) {
  const texts = layers.filter((l) => l.type === "text");
  const rows: [DetailLayer, DetailLayer | undefined][] = [];
  texts.forEach((label, i) => {
    const value = texts[i + 1];
    if (i % 2 === 0 && (filled(label) || filled(value))) rows.push([label, value]);
  });
  if (!rows.length) return null;
  const line = `1px solid ${lineColor(texts[1]?.style?.color)}`;
  return (
    <div className="ez:px-5 ez:py-6">
      {rows.map(([label, value], i) => (
        <div
          key={label.id}
          data-row=""
          className="ez:grid ez:grid-cols-[28%_1fr] ez:items-baseline ez:py-3"
          style={{ borderTop: line, borderBottom: i === rows.length - 1 ? line : undefined }}
        >
          <Cell layer={label} />
          <Cell layer={value} />
        </div>
      ))}
    </div>
  );
}

function Steps({ layers }: { layers: DetailLayer[] }) {
  const steps = layers.filter((l) => l.type === "text" && filled(l));
  if (!steps.length) return null;
  return (
    <ol
      className="ez:m-0 ez:grid ez:list-none ez:gap-2 ez:px-5 ez:py-6"
      style={{ gridTemplateColumns: `repeat(${Math.min(steps.length, STEP_COLUMNS)}, minmax(0, 1fr))` }}
    >
      {steps.map((l, i) => {
        const css = textStyle(l.style);
        const size = detailFontSize(l.style?.size);
        return (
          <li key={l.id} className="ez:flex ez:flex-col ez:items-center ez:gap-2">
            <span
              aria-hidden="true"
              className="ez:flex ez:items-center ez:justify-center ez:rounded-full"
              style={{
                width: size * STEP_DOT,
                height: size * STEP_DOT,
                border: `1px solid ${lineColor(l.style?.color)}`,
                fontFamily: css.fontFamily,
                fontSize: size,
                fontWeight: WEIGHT.bold,
                lineHeight: 1,
                color: l.style?.color,
              }}
            >
              {i + 1}
            </span>
            <p className="ez:self-stretch" style={css}>
              {l.text}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function Img({ layer }: { layer: DetailLayer }) {
  if (!layer.url) return null;
  return <img src={layer.url} alt="" loading="lazy" decoding="async" className="ez:block ez:h-auto ez:w-full" />;
}

function Block({ block }: { block: DetailBlock }) {
  const shown = block.layers.filter((l) => !l.hidden);
  const images = shown.filter((l) => l.type === "image");
  const bg: CSSProperties = {
    backgroundColor: block.background?.color ?? undefined,
    backgroundImage: block.background?.url ? `url(${block.background.url})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    paddingTop: detailBlockSpace(block.space_top) || undefined,
    paddingBottom: detailBlockSpace(block.space_bottom) || undefined,
  };
  let body: ReactNode;
  switch (block.layout) {
    case "text":
      body = <Texts layers={shown} />;
      break;
    case "image":
      body = images.map((l) => <Img key={l.id} layer={l} />);
      break;
    case "text_top":
      body = (
        <>
          <Texts layers={shown} />
          {images.map((l) => <Img key={l.id} layer={l} />)}
        </>
      );
      break;
    case "side":
      body = (
        <div className="ez:grid ez:grid-cols-2 ez:items-center">
          <div>{images.slice(0, 1).map((l) => <Img key={l.id} layer={l} />)}</div>
          <Texts layers={shown} />
        </div>
      );
      break;
    case "two_images":
      body = (
        <>
          <div className="ez:grid ez:grid-cols-2 ez:gap-2 ez:px-5 ez:pt-5">{images.slice(0, 2).map((l) => <Img key={l.id} layer={l} />)}</div>
          <Texts layers={shown} />
        </>
      );
      break;
    case "table":
      body = <Table layers={block.layers} />;
      break;
    case "steps":
      body = <Steps layers={block.layers} />;
      break;
    case "card":
      body = (
        <div className="ez:p-4">
          <div className="ez:overflow-hidden ez:rounded-lg ez:bg-surface">
            {images.slice(0, 1).map((l) => <Img key={l.id} layer={l} />)}
            <Texts layers={shown} />
          </div>
        </div>
      );
      break;
    default:
      body = (
        <>
          {images.map((l) => <Img key={l.id} layer={l} />)}
          <Texts layers={shown} under={images.length > 0} />
        </>
      );
  }
  return (
    <div data-layout={block.layout} style={bg}>
      {body}
    </div>
  );
}

export function DetailDoc({ doc }: { doc: DetailDocValue | null | undefined }) {
  const blocks = doc?.blocks ?? [];
  if (!blocks.length) return null;
  const fonts = new Set<DetailFont>();
  for (const b of blocks) for (const l of b.layers) if (l.type === "text") fonts.add(l.style?.font ?? "gothic");
  return (
    <section data-slot="detail-doc" aria-label="상세 정보" className="ez:mx-auto ez:grid ez:w-full ez:max-w-180" style={{ backgroundColor: doc?.background ?? undefined }}>
      {[...fonts].map((f) => (
        <link key={f} rel="stylesheet" href={DETAIL_FONTS[f].href} precedence="default" />
      ))}
      {blocks.map((b) => (
        <Block key={b.id} block={b} />
      ))}
    </section>
  );
}
