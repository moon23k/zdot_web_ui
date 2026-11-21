import type { TemplateDesign } from "../templates/types";
import type { Design } from "../types";
import { kitVars } from "./kit";
import { SYSTEM_COLOR, SYSTEM_DURATION, SYSTEM_FIGURE_FONT, SYSTEM_FONT, SYSTEM_RADIUS, SYSTEM_SITE, SYSTEM_TONE } from "./system";

const FALLBACK: typeof SYSTEM_COLOR = SYSTEM_COLOR;

function family(name: string | undefined): string {
  return name ? `"${name}", ${SYSTEM_FONT}` : SYSTEM_FONT;
}

function buttonRadius(design: Design): string {
  const shape = design.shape ?? {};
  if (shape.button_shape === "pill") return "999px";
  if (shape.button_shape === "square") return `${shape.radius_sm ?? 2}px`;
  return `${shape.radius_md ?? SYSTEM_RADIUS.md}px`;
}

function siteVars(): Record<string, string> {
  return {
    "--ezd-wrap": `${SYSTEM_SITE.gallery}px`,
    "--ezd-wrap-home": `${SYSTEM_SITE.gallery}px`,
    "--ezd-pad-home": `${SYSTEM_SITE["gallery-pad"]}px`,
    "--ezd-section-gap": `${SYSTEM_SITE["gallery-section"]}px`,
    "--ezd-control": `${SYSTEM_SITE["gallery-control"]}px`,
    "--ezd-control-sm": `${SYSTEM_SITE["gallery-control-sm"]}px`,
    "--ezd-gutter": "24px",
  };
}

export function designVars(design: Design | null | undefined, site?: boolean): Record<string, string> {
  const d = design ?? {};
  const color = { ...FALLBACK, ...(d.color ?? {}) };
  const ratio = (d.imagery?.photo_ratio ?? "1:1").replace(":", " / ");
  const styles = d.font?.styles;
  return {
    "--ezd-primary": color.primary,
    "--ezd-on-primary": color.on_primary,
    "--ezd-primary-hover": color.primary_hover,
    "--ezd-primary-tint": color.primary_tint,
    "--ezd-point-soft": `color-mix(in srgb, ${color.primary} 8%, ${color.surface})`,
    "--ezd-primary-border": color.primary_border,
    "--ezd-surface": color.surface,
    "--ezd-surface-alt": color.surface_alt,
    "--ezd-text": color.text,
    "--ezd-muted": color.text_muted,
    "--ezd-radius-sm": `${d.shape?.radius_sm ?? SYSTEM_RADIUS.sm}px`,
    "--ezd-radius-md": `${d.shape?.radius_md ?? SYSTEM_RADIUS.md}px`,
    "--ezd-radius-lg": `${d.shape?.radius_lg ?? SYSTEM_RADIUS.lg}px`,
    "--ezd-halo": (d.shape?.radius_lg ?? SYSTEM_RADIUS.lg) === 0 ? "0%" : "5%",
    "--ezd-button-radius": buttonRadius(d),
    "--ezd-line": `${d.shape?.line ?? 0}px`,
    "--ezd-section-gap": `${Math.min(d.density?.section_gap ?? 72, 120)}px`,
    "--ezd-pad": "16px",
    "--ezd-pad-home": `${SYSTEM_SITE.pad}px`,
    "--ezd-wrap": `${SYSTEM_SITE["content-narrow"]}px`,
    "--ezd-wrap-home": `${SYSTEM_SITE.content + SYSTEM_SITE.pad * 2}px`,
    "--ezd-gutter": `${d.density?.grid_gutter ?? 20}px`,
    "--ezd-font-display": family(d.font?.display),
    "--ezd-font-body": family(d.font?.body),
    "--ezd-font-figure": `var(--zdot-font-figure, ${SYSTEM_FIGURE_FONT})`,
    "--ezd-display-weight": String(styles?.title?.weight ?? d.font?.display_weight ?? 600),
    "--ezd-title-weight": String(styles?.title?.weight ?? 700),
    "--ezd-title-style": styles?.title?.style ?? "normal",
    "--ezd-subtitle-weight": String(styles?.subtitle?.weight ?? 600),
    "--ezd-subtitle-style": styles?.subtitle?.style ?? "normal",
    "--ezd-body-weight": String(styles?.body?.weight ?? 400),
    "--ezd-body-style": styles?.body?.style ?? "normal",
    "--ezd-tracking": "0em",
    "--ezd-duration": `${d.motion?.duration_ms ?? SYSTEM_DURATION}ms`,
    "--ezd-photo-ratio": ratio,
    "--ezd-control": "48px",
    "--ezd-control-sm": "40px",
    ...kitVars(color),
    ...(site ? siteVars() : {}),
  };
}

export function fontHref(design: Design | null | undefined): string | null {
  const font = design?.font;
  const load = font?.load ?? [font?.display, font?.body]
    .filter((name, i, all): name is string => Boolean(name) && all.indexOf(name) === i)
    .map((family) => ({ family, weights: [400, 700] }));
  if (!load.length) return null;
  const families = load.map(({ family, weights }) => `family=${encodeURIComponent(family)}:wght@${weights.join(";")}`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

const LIGHT = new Set(["Noto Sans KR", "Gothic A1", "IBM Plex Sans KR", "Noto Serif KR"]);

function plainTitles(font: Design["font"]): Design["font"] {
  const body = font?.body;
  const plain = { weight: 400, style: "normal" as const };
  const load = font?.load
    ?.filter((f) => f.family === body)
    .map((f) => (LIGHT.has(f.family) ? { ...f, weights: [...new Set([300, ...f.weights, 500])].sort((x, y) => x - y) } : f));
  return {
    ...font,
    display: body,
    display_weight: 400,
    load: load?.length ? load : undefined,
    styles: { ...font?.styles, title: plain, subtitle: { weight: 500, style: "normal" } },
  };
}

const PHOTO_CORNER: Record<string, number> = { "0": 0, "4": 4, "6": 6, "16": 16, pill: 16 };

const SERIF = new Set(["Noto Serif KR", "Nanum Myeongjo", "Gowun Batang", "Hahmlet", "Song Myung"]);

function lookTitles(font: Design["font"], look: TemplateDesign["look"]): Design["font"] {
  if (look.frame === "gallery") return plainTitles(font);
  const picked: Design["font"] = font ?? (look.font === "serif" ? { display: "Noto Serif KR", load: [{ family: "Noto Serif KR", weights: [400, 600] }] } : undefined);
  if (!picked?.display || !SERIF.has(picked.display)) return plainTitles(picked);
  const light = { weight: 300, style: "normal" as const };
  return {
    ...picked,
    display_weight: 300,
    load: picked.load?.map((f) => (LIGHT.has(f.family) ? { ...f, weights: [...new Set([300, ...f.weights])].sort((x, y) => x - y) } : f)),
    styles: { ...picked.styles, title: light, subtitle: { weight: 500, style: "normal" } },
  };
}

export function applyTemplate(design: Design | null | undefined, template: TemplateDesign | null | undefined): Design {
  const d = design ?? {};
  if (!template) return d;
  const { look } = template;
  const tone = SYSTEM_TONE[look.frame === "gallery" ? "gallery" : look.tone];
  const ink = SYSTEM_TONE.gallery;
  return {
    ...d,
    font: lookTitles(d.font, look),
    shape: { radius_sm: 8, radius_md: 14, radius_lg: PHOTO_CORNER[String(look.radius)] ?? 0, button_shape: "pill", line: 0 },
    color: d.palette ? d.color : { ...d.color, surface: tone.surface, surface_alt: tone["surface-alt"], text: ink.text, text_muted: ink["text-muted"] },
  };
}
