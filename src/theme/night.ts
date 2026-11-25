export const NIGHT_THEMES = ["dracula", "tokyo", "mocha", "nord", "rose"] as const;

export type NightTheme = (typeof NIGHT_THEMES)[number];

export const NIGHT_DEFAULT: NightTheme = "dracula";

export type NightPalette = {
  bg: string;
  sky: string;
  deep: string;
  sf: string;
  sf2: string;
  cur: string;
  ink: string;
  ink2: string;
  ink3: string;
  ok: string;
  warn: string;
  err: string;
  info: string;
  star: string;
};

const oklab = (color: string, share: number, base: string) => `color-mix(in oklab, ${color} ${share}%, ${base})`;

export const NIGHT_PALETTE: Record<NightTheme, NightPalette> = {
  dracula: {
    bg: "#282a36",
    sky: "#191a21",
    deep: "#21222c",
    sf: "#343746",
    sf2: "#424450",
    cur: "#44475a",
    ink: "#f8f8f2",
    ink2: oklab("#f8f8f2", 72, "#6272a4"),
    ink3: oklab("#f8f8f2", 38, "#6272a4"),
    ok: "#50fa7b",
    warn: "#ffb86c",
    err: "#ff5555",
    info: "#8be9fd",
    star: "#f1fa8c",
  },
  tokyo: {
    bg: "#1a1b26",
    sky: "#13131a",
    deep: "#16161e",
    sf: "#1e202e",
    sf2: "#202330",
    cur: "#363b54",
    ink: "#c0caf5",
    ink2: "#a9b1d6",
    ink3: oklab("#787c99", 62, "#a9b1d6"),
    ok: "#9ece6a",
    warn: "#ff9e64",
    err: "#f7768e",
    info: "#7dcfff",
    star: "#e0af68",
  },
  mocha: {
    bg: "#1e1e2e",
    sky: "#11111b",
    deep: "#181825",
    sf: "#313244",
    sf2: "#45475a",
    cur: "#45475a",
    ink: "#cdd6f4",
    ink2: "#bac2de",
    ink3: "#9399b2",
    ok: "#a6e3a1",
    warn: "#fab387",
    err: "#f38ba8",
    info: "#89dceb",
    star: "#f9e2af",
  },
  nord: {
    bg: "#2e3440",
    sky: oklab("#2e3440", 68, "#000"),
    deep: oklab("#2e3440", 84, "#000"),
    sf: "#3b4252",
    sf2: "#434c5e",
    cur: "#4c566a",
    ink: "#eceff4",
    ink2: "#d8dee9",
    ink3: oklab("#d8dee9", 62, "#4c566a"),
    ok: "#a3be8c",
    warn: oklab("#d08770", 80, "#eceff4"),
    err: oklab("#bf616a", 62, "#eceff4"),
    info: "#88c0d0",
    star: "#ebcb8b",
  },
  rose: {
    bg: "#191724",
    sky: oklab("#191724", 66, "#000"),
    deep: oklab("#191724", 82, "#000"),
    sf: "#1f1d2e",
    sf2: "#26233a",
    cur: "#403d52",
    ink: "#e0def4",
    ink2: oklab("#e0def4", 60, "#908caa"),
    ink3: "#908caa",
    ok: "#9ccfd8",
    warn: "#f6c177",
    err: "#eb6f92",
    info: "#9ccfd8",
    star: "#f6c177",
  },
};

export function nightTheme(value: unknown): NightTheme {
  return typeof value === "string" && (NIGHT_THEMES as readonly string[]).includes(value) ? (value as NightTheme) : NIGHT_DEFAULT;
}

const LINE = 62;
const HAIR = 40;
const EDGE = 80;
const FAINT = 60;
const TINT = 16;
const GLASS = 60;
const OVERLAY = "rgb(0 0 0 / 0.55)";

export function nightVars(p: NightPalette): Record<string, string> {
  const veil = (color: string, share: number) => oklab(color, share, "transparent");
  const tint = (color: string) => oklab(color, TINT, p.bg);
  return {
    "--ezd-sky": p.sky,
    "--ezd-deep": p.deep,
    "--ezd-raised": p.sf2,
    "--ezd-select": p.cur,
    "--ezd-star": p.star,
    "--ezd-field": p.deep,
    "--ezd-error": p.err,
    "--ezd-glass": veil(p.sf, GLASS),
    "--ezd-glass-edge": veil(p.cur, LINE),
    "--ez-color-site-line": veil(p.cur, LINE),
    "--ez-color-border": veil(p.cur, LINE),
    "--ez-color-hairline": veil(p.cur, HAIR),
    "--ez-color-site-edge": veil(p.cur, EDGE),
    "--ez-color-site-field": p.cur,
    "--ez-color-site-faint": veil(p.ink3, FAINT),
    "--ez-color-site-off": p.ink3,
    "--ez-color-danger": p.err,
    "--ez-color-on-danger": p.deep,
    "--ez-color-danger-tint": tint(p.err),
    "--ez-color-success": p.ok,
    "--ez-color-on-success": p.deep,
    "--ez-color-success-tint": tint(p.ok),
    "--ez-color-warning": p.warn,
    "--ez-color-on-warning": p.deep,
    "--ez-color-warning-tint": tint(p.warn),
    "--ez-color-warning-text": p.warn,
    "--ez-color-info": p.info,
    "--ez-color-on-info": p.deep,
    "--ez-color-info-tint": tint(p.info),
    "--ez-color-overlay": OVERLAY,
  };
}
