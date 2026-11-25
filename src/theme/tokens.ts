import type { ShopSkin, TemplateDesign } from "../templates/types";
import type { Design } from "../types";
import { kitVars } from "./kit";
import { NIGHT_PALETTE, nightTheme, nightVars, type NightTheme } from "./night";
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

type SiteLook = Pick<TemplateDesign["look"], "section" | "pad" | "kit"> & Partial<Pick<TemplateDesign["look"], "tone">> & { skin?: ShopSkin; night?: NightTheme | null };

type Color = NonNullable<Design["color"]>;

const NIGHT = "night";

const NIGHT_BASE = "warm";

const GLOW_SKIN = "night";

const AURORA = "aurora";

const AURORA_TONE = { surface: "#f6f6fa", "surface-alt": "#ffffff" } as const;

const AURORA_LINE = { line: "rgb(20 20 30 / 0.1)", hair: "rgb(20 20 30 / 0.09)" } as const;

const GLASS = { face: "rgb(255 255 255 / 0.6)", edge: "rgb(255 255 255 / 0.88)" } as const;

const FIELD = "#ffffff";

const NIGHT_MIX = {
  surface: 90,
  surfaceAlt: 80,
  muted: 72,
  border: 22,
  tint: 18,
  line: 16,
  edge: 26,
  field: 32,
  faint: 40,
  off: 50,
  hairline: 14,
  blank: 14,
  blankStrong: 30,
  ink: 62,
} as const;

const mix = (color: string, share: number, base: string) => `color-mix(in srgb, ${color} ${share}%, ${base})`;

const OFF_MIX = { fill: 6, ink: 45 } as const;

const ON_PRIMARY_MIN = 4.5;

const ON_LIGHT = "#ffffff";

const ON_DARK = "#111111";

const INK_SOFTEN = 16;

const INK_MIN = 7;

type Rgb = [number, number, number];

function rgbOf(value: string): Rgb | null {
  const hex = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16)) as Rgb;
  const mixed = /^color-mix\(in srgb, (#[0-9a-f]{6}) (\d+(?:\.\d+)?)%, (#[0-9a-f]{6})\)$/i.exec(value.trim());
  if (!mixed) return null;
  const a = rgbOf(mixed[1]);
  const b = rgbOf(mixed[3]);
  return a && b ? blend(a, Number(mixed[2]), b) : null;
}

function blend(a: Rgb, share: number, b: Rgb): Rgb {
  return a.map((v, i) => Math.round((v * share + b[i] * (100 - share)) / 100)) as Rgb;
}

function hexOf(rgb: Rgb): string {
  return `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function lum(rgb: Rgb): number {
  const [r, g, b] = rgb.map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function luminance(value: string): number | null {
  const rgb = rgbOf(value);
  return rgb ? lum(rgb) : null;
}

function contrast(a: number, b: number): number {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const HEAD_WEIGHT = { base: 400, max: 500 } as const;

function headWeight(weight: number | undefined): string {
  return String(Math.min(weight ?? HEAD_WEIGHT.base, HEAD_WEIGHT.max));
}

export function inkOf(text: string, surface: string): string {
  const t = rgbOf(text);
  const s = rgbOf(surface);
  if (!t || !s) return text;
  for (let soften = INK_SOFTEN; soften > 0; soften -= 1) {
    const ink = blend(t, 100 - soften, s);
    if (contrast(lum(ink), lum(s)) >= INK_MIN) return hexOf(ink);
  }
  return text;
}

export function onPrimary(primary: string, on: string): string {
  const p = luminance(primary);
  const o = luminance(on);
  if (p === null || (o !== null && contrast(p, o) >= ON_PRIMARY_MIN)) return on;
  const light = contrast(p, luminance(ON_LIGHT) ?? 1);
  const dark = contrast(p, luminance(ON_DARK) ?? 0);
  return light >= dark ? ON_LIGHT : ON_DARK;
}

function nightColor(color: Color): Color {
  const ink = color.text ?? FALLBACK.text;
  const paper = color.surface ?? FALLBACK.surface;
  return {
    ...color,
    surface: mix(ink, NIGHT_MIX.surface, paper),
    surface_alt: mix(ink, NIGHT_MIX.surfaceAlt, paper),
    text: paper,
    text_muted: mix(paper, NIGHT_MIX.muted, ink),
    primary_border: mix(paper, NIGHT_MIX.border, ink),
    primary_tint: mix(color.primary ?? FALLBACK.primary, NIGHT_MIX.tint, ink),
  };
}

const GLOW_PRIMARY_MIN = 4.5;

const GLOW_PRIMARY_STEP = 6;

const GLOW_PRIMARY_MAX = 72;

function glowPrimary(primary: string, ground: string): string {
  const from = rgbOf(primary);
  const base = rgbOf(ground);
  const white = rgbOf(ON_LIGHT);
  if (!from || !base || !white) return primary;
  for (let share = 0; share <= GLOW_PRIMARY_MAX; share += GLOW_PRIMARY_STEP) {
    const next = blend(white, share, from);
    if (contrast(lum(next), lum(base)) >= GLOW_PRIMARY_MIN) return hexOf(next);
  }
  return hexOf(blend(white, GLOW_PRIMARY_MAX, from));
}

function glowColor(color: Color, night: NightTheme | null | undefined): Color {
  const p = NIGHT_PALETTE[nightTheme(night)];
  const primary = glowPrimary(color.primary ?? FALLBACK.primary, p.bg);
  return {
    ...color,
    primary,
    primary_hover: primary,
    surface: p.bg,
    surface_alt: p.sf,
    text: p.ink,
    text_muted: p.ink2,
    primary_border: p.cur,
    primary_tint: mix(primary, NIGHT_MIX.tint, p.bg),
  };
}

function fxVars(color: typeof FALLBACK): Record<string, string> {
  const from = (rest: string) => `oklch(from ${color.primary} ${rest})`;
  return {
    "--ezd-sky": color.surface,
    "--ezd-deep": color.surface_alt,
    "--ezd-raised": color.surface_alt,
    "--ezd-select": color.primary_tint,
    "--ezd-star": color.text,
    "--ezd-field": FIELD,
    "--ezd-glass": GLASS.face,
    "--ezd-glass-edge": GLASS.edge,
    "--ezd-glow": from("0.72 0.18 h / 0.8"),
    "--ezd-glow-soft": from("0.7 0.15 h / 0.22"),
    "--ezd-glow-line": from("0.93 0.07 h / 0.95"),
    "--ezd-aurora-1": from("0.88 0.075 calc(h - 46)"),
    "--ezd-aurora-2": from("0.88 0.085 h"),
    "--ezd-aurora-3": from("0.9 0.07 calc(h + 56)"),
    "--ezd-aurora-wash": from("0.93 0.045 h"),
    "--ezd-stage": from("0.955 0.014 h"),
    "--ezd-stage-2": from("0.925 0.03 h"),
  };
}

function toneVars(site: SiteLook): Record<string, string> {
  if (site.tone === NIGHT && site.skin === GLOW_SKIN) return nightVars(NIGHT_PALETTE[nightTheme(site.night)]);
  if (site.tone === AURORA) return { "--ez-color-site-line": AURORA_LINE.line, "--ez-color-hairline": AURORA_LINE.hair };
  return {};
}

function groundVars(text: string): Record<string, string> {
  const veil = (share: number) => mix(text, share, "transparent");
  return {
    "--ez-color-site-line": veil(NIGHT_MIX.line),
    "--ez-color-site-edge": veil(NIGHT_MIX.edge),
    "--ez-color-site-field": veil(NIGHT_MIX.field),
    "--ez-color-site-faint": veil(NIGHT_MIX.faint),
    "--ez-color-site-off": veil(NIGHT_MIX.off),
    "--ez-color-hairline": veil(NIGHT_MIX.hairline),
    "--ez-color-border": veil(NIGHT_MIX.line),
    "--ez-color-tile-blank": veil(NIGHT_MIX.blank),
    "--ez-color-tile-blank-strong": veil(NIGHT_MIX.blankStrong),
    "--ez-color-tile-ink": veil(NIGHT_MIX.ink),
  };
}

const LAYERED = "revert-layer";

const LIGHT_ERROR = "#b42318";

function resetVars(): Record<string, string> {
  const keys = new Set([...Object.keys(nightVars(NIGHT_PALETTE.dracula)), ...Object.keys(groundVars(FALLBACK.text)), "--ez-color-site-line", "--ez-color-hairline"]);
  const layered = [...keys].filter((key) => key.startsWith("--ez-color-")).map((key) => [key, LAYERED]);
  return { ...Object.fromEntries(layered), "--ezd-error": LIGHT_ERROR };
}

function siteVars(look?: SiteLook): Record<string, string> {
  return {
    "--ezd-wrap": `${SYSTEM_SITE.gallery}px`,
    "--ezd-wrap-home": `${SYSTEM_SITE.gallery}px`,
    "--ezd-pad-home": `${look?.pad ?? SYSTEM_SITE["gallery-pad"]}px`,
    "--ezd-section-gap": `${look?.section ?? SYSTEM_SITE["gallery-section"]}px`,
    "--ezd-control": `${SYSTEM_SITE["gallery-control"]}px`,
    "--ezd-control-sm": `${SYSTEM_SITE["gallery-control-sm"]}px`,
    "--ezd-gutter": "24px",
  };
}

export function designVars(design: Design | null | undefined, site?: boolean | SiteLook): Record<string, string> {
  const d = design ?? {};
  const color = { ...FALLBACK, ...(d.color ?? {}) };
  const ratio = (d.imagery?.photo_ratio ?? "1:1").replace(":", " / ");
  const styles = d.font?.styles;
  const ink = inkOf(color.text, color.surface);
  return {
    "--ezd-primary": color.primary,
    "--ezd-on-primary": onPrimary(color.primary, color.on_primary),
    "--ezd-primary-hover": color.primary_hover,
    "--ezd-primary-tint": color.primary_tint,
    "--ezd-point-soft": `color-mix(in srgb, ${color.primary} 8%, ${color.surface})`,
    "--ezd-off": mix(color.text, OFF_MIX.fill, color.surface),
    "--ezd-off-ink": mix(color.text, OFF_MIX.ink, color.surface),
    "--ezd-primary-border": color.primary_border,
    "--ezd-surface": color.surface,
    "--ezd-surface-alt": color.surface_alt,
    "--ezd-text": ink,
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
    "--ezd-display-weight": headWeight(styles?.title?.weight ?? d.font?.display_weight),
    "--ezd-title-weight": headWeight(styles?.title?.weight),
    "--ezd-title-style": styles?.title?.style ?? "normal",
    "--ezd-subtitle-weight": headWeight(styles?.subtitle?.weight),
    "--ezd-subtitle-style": styles?.subtitle?.style ?? "normal",
    "--ezd-body-weight": String(styles?.body?.weight ?? 400),
    "--ezd-body-style": styles?.body?.style ?? "normal",
    "--ezd-tracking": "0em",
    "--ezd-duration": `${d.motion?.duration_ms ?? SYSTEM_DURATION}ms`,
    "--ezd-photo-ratio": ratio,
    "--ezd-control": "48px",
    "--ezd-control-sm": "40px",
    ...kitVars({ ...color, text: ink }, typeof site === "object" && site.kit === "off"),
    ...(site ? siteVars(site === true ? undefined : site) : {}),
    ...resetVars(),
    ...(typeof site === "object" && site.tone === NIGHT ? groundVars(color.text) : {}),
    ...fxVars(color),
    ...(typeof site === "object" ? toneVars(site) : {}),
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

const SHAPES: Record<NonNullable<TemplateDesign["look"]["shape"]>, NonNullable<Design["shape"]>> = {
  square: { radius_sm: 0, radius_md: 0, radius_lg: 0, button_shape: "square", line: 0 },
  soft: { radius_sm: 4, radius_md: 6, radius_lg: 6, button_shape: "rounded", line: 0 },
  round: { radius_sm: 14, radius_md: 14, radius_lg: 14, button_shape: "rounded", line: 0 },
};

const KIT_FACES = ["secondary", "accent", "on_accent"] as const;

function plainKit(color: Design["color"]): Design["color"] {
  if (!color) return color;
  return Object.fromEntries(Object.entries(color).filter(([key]) => !(KIT_FACES as readonly string[]).includes(key)));
}

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

function toneOf(look: TemplateDesign["look"]): { surface: string; "surface-alt": string } {
  if (look.frame === "gallery") return SYSTEM_TONE.gallery;
  if (look.tone === AURORA) return AURORA_TONE;
  return SYSTEM_TONE[look.tone === NIGHT ? NIGHT_BASE : look.tone];
}

export function applyTemplate(design: Design | null | undefined, template: TemplateDesign | null | undefined, night?: NightTheme | null): Design {
  const d = design ?? {};
  if (!template) return d;
  const { look } = template;
  const dark = look.tone === NIGHT && look.frame !== "gallery";
  const glow = dark && template.skin === GLOW_SKIN;
  const tone = toneOf(look);
  const ink = SYSTEM_TONE.gallery;
  const base = d.palette ? d.color : { ...d.color, surface: tone.surface, surface_alt: tone["surface-alt"], text: ink.text, text_muted: ink["text-muted"] };
  const color = glow ? glowColor(base ?? {}, night) : dark ? nightColor(base ?? {}) : base;
  return {
    ...d,
    font: lookTitles(d.font, look),
    shape: look.shape ? SHAPES[look.shape] : { radius_sm: 8, radius_md: 14, radius_lg: PHOTO_CORNER[String(look.radius)] ?? 0, button_shape: "pill", line: 0 },
    color: look.kit === "off" ? plainKit(color) : color,
  };
}
