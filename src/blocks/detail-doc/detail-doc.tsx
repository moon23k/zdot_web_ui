import type { CSSProperties, ReactNode } from "react";

export type DetailFont = "gothic" | "serif" | "display" | "hand";
export type DetailTextStyle = {
  font?: DetailFont;
  size?: number;
  weight?: "regular" | "bold" | "heavy";
  color?: string;
  align?: "left" | "center" | "right";
  effect?: "none" | "shadow" | "outline" | "band";
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
  layout: "text" | "image" | "image_top" | "text_top" | "side" | "two_images" | "card";
  background?: { color?: string | null; url?: string | null };
  layers: DetailLayer[];
};
export type DetailDocValue = { version?: number; blocks?: DetailBlock[] };

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

function textStyle(style: DetailTextStyle | null | undefined): CSSProperties {
  const s = style ?? {};
  const font = DETAIL_FONTS[s.font ?? "gothic"];
  const css: CSSProperties = {
    fontFamily: font.family,
    fontSize: detailFontSize(s.size),
    fontWeight: WEIGHT[s.weight ?? "regular"],
    color: s.color,
    textAlign: s.align ?? "left",
    lineHeight: 1.45,
    whiteSpace: "pre-line",
    margin: 0,
  };
  if (s.effect === "shadow") css.textShadow = "0 1px 3px rgba(0, 0, 0, 0.35)";
  if (s.effect === "outline") Object.assign(css, { border: "1.5px solid currentColor", padding: "4px 8px", display: "inline-block" });
  if (s.effect === "band") Object.assign(css, { backgroundColor: s.color, color: "var(--ezd-surface, white)", padding: "2px 8px", display: "inline-block" });
  return css;
}

function Texts({ layers }: { layers: DetailLayer[] }) {
  const texts = layers.filter((l) => l.type === "text" && l.text);
  if (!texts.length) return null;
  return (
    <div className="ez:grid ez:gap-2 ez:px-5 ez:py-6">
      {texts.map((l) => (
        <div key={l.id} style={{ textAlign: l.style?.align ?? "left" }}>
          <p style={textStyle(l.style)}>{l.text}</p>
        </div>
      ))}
    </div>
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
          <Texts layers={shown} />
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
    <section data-slot="detail-doc" aria-label="상세 정보" className="ez:mx-auto ez:grid ez:w-full ez:max-w-180">
      {[...fonts].map((f) => (
        <link key={f} rel="stylesheet" href={DETAIL_FONTS[f].href} precedence="default" />
      ))}
      {blocks.map((b) => (
        <Block key={b.id} block={b} />
      ))}
    </section>
  );
}
