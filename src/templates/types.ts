export type TemplateMain = "shop" | "class" | "stay" | "quote" | "place" | "care" | "portfolio" | "office";

export type TemplateLetter = "a" | "b" | "c" | "d" | "e" | "f";

export type SurfaceTone = "white" | "paper" | "cream" | "warm" | "mist" | "gallery" | "night" | "aurora";

export type ShopSkin = "editorial" | "catalog" | "showroom" | "aurora" | "night" | "stage";

export type CommonSkin = Exclude<ShopSkin, "stage">;

export type Look = {
  tone: SurfaceTone;
  radius: 0 | 4 | 6 | 16 | "pill";
  frame?: "gallery";
  shape?: "square" | "soft" | "round";
  kit?: "off";
  section?: number;
  pad?: number;
};

export type HeaderVariant = "center" | "transparent" | "dark" | "left" | "pill" | "cta" | "band" | "gallery" | ShopSkin;

export type GridSpec = { m: 1 | 2 | 3; pc: 3 | 4 | 5 | 6; ratio: number };

export type HomeSlot = { kind: string; variant?: string; grid?: GridSpec };

export type DetailSlot = { kind: string; variant?: string; side?: boolean; full?: boolean };

export type TemplateDesign = {
  id: string;
  main: TemplateMain;
  letter: TemplateLetter;
  name: string;
  look: Look;
  header: HeaderVariant;
  skin?: ShopSkin;
  cta?: string;
  home: HomeSlot[];
  detail: DetailSlot[];
};
