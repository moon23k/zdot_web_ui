import type { Design } from "../types";

type Color = NonNullable<Design["color"]>;

type Kit = { primary: string; surface: string; secondary: string; accent: string; on_accent: string };

const mix = (color: string, share: number, base: string) => `color-mix(in srgb, ${color} ${share}%, ${base})`;

export const KIT_MIX = {
  tile2: 24,
  tile3: 20,
  tile4: 55,
  tile5: 10,
  mark: 14,
  footLine: 26,
} as const;

export const TILE_VARS = ["--ez-color-tile-1", "--ez-color-tile-2", "--ez-color-tile-3", "--ez-color-tile-4", "--ez-color-tile-5"] as const;

export function kitOf(color: Color): Kit | null {
  const { primary, surface, secondary, accent, on_accent } = color;
  if (!primary || !surface || !secondary || !accent || !on_accent) return null;
  return { primary, surface, secondary, accent, on_accent };
}

function tiles(kit: Kit | null, plain?: string): Record<string, string> {
  if (plain) return Object.fromEntries(TILE_VARS.map((name) => [name, plain]));
  const values = kit
    ? [
        kit.secondary,
        mix(kit.primary, KIT_MIX.tile2, kit.surface),
        mix(kit.accent, KIT_MIX.tile3, kit.surface),
        mix(kit.secondary, KIT_MIX.tile4, kit.surface),
        mix(kit.accent, KIT_MIX.tile5, kit.secondary),
      ]
    : TILE_VARS.map(() => "revert-layer");
  return Object.fromEntries(TILE_VARS.map((name, i) => [name, values[i]]));
}

function foot(kit: Kit | null, color: Required<Pick<Color, "primary" | "text" | "text_muted">>): Record<string, string> {
  if (!kit) {
    return {
      "--ezd-foot": "transparent",
      "--ezd-foot-ink": color.text,
      "--ezd-foot-muted": color.text_muted,
      "--ezd-foot-faint": "var(--ez-color-site-faint)",
      "--ezd-foot-hover": color.primary,
      "--ezd-foot-line": "var(--ez-color-site-line)",
      "--ezd-foot-edge": "var(--ez-color-site-edge)",
      "--ezd-foot-rule": "var(--ez-color-site-line)",
    };
  }
  const line = mix(kit.on_accent, KIT_MIX.footLine, "transparent");
  return {
    "--ezd-foot": kit.accent,
    "--ezd-foot-ink": kit.on_accent,
    "--ezd-foot-muted": kit.on_accent,
    "--ezd-foot-faint": kit.on_accent,
    "--ezd-foot-hover": kit.on_accent,
    "--ezd-foot-line": line,
    "--ezd-foot-edge": line,
    "--ezd-foot-rule": "transparent",
  };
}

function mark(kit: Kit | null, color: Required<Pick<Color, "surface_alt" | "text">>): Record<string, string> {
  return kit
    ? { "--ezd-mark": mix(kit.primary, KIT_MIX.mark, kit.surface), "--ezd-mark-ink": kit.primary }
    : { "--ezd-mark": color.surface_alt, "--ezd-mark-ink": color.text };
}

export function kitVars(color: Required<Pick<Color, "primary" | "surface" | "surface_alt" | "text" | "text_muted">> & Color, plain?: boolean): Record<string, string> {
  const kit = plain ? null : kitOf(color);
  return { ...tiles(kit, plain ? color.surface_alt : undefined), ...foot(kit, color), ...mark(kit, color) };
}
