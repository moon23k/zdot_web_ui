export type TemplateMain = "shop" | "class" | "stay" | "quote";

export type TemplateLetter = "a" | "b" | "c" | "d";

export type SurfaceTone = "white" | "paper" | "cream" | "warm" | "mist" | "gallery";

export type Look = {
  tone: SurfaceTone;
  radius: 0 | 4 | 6 | 16 | "pill";
  font: "sans" | "serif" | "light";
  frame?: "gallery";
};

export type HeaderVariant = "center" | "transparent" | "dark" | "left" | "pill" | "cta" | "band" | "gallery";

export type GridSpec = { m: 1 | 2 | 3; pc: 3 | 4 | 6; ratio: number; meta?: "price" | "status" };

export type HomeSlot = { kind: string; variant?: string; grid?: GridSpec };

export type DetailSlot = { kind: string; variant?: string; side?: boolean; full?: boolean };

export type TemplateDesign = {
  id: string;
  main: TemplateMain;
  letter: TemplateLetter;
  name: string;
  look: Look;
  header: HeaderVariant;
  cta?: string;
  home: HomeSlot[];
  detail: DetailSlot[];
};
