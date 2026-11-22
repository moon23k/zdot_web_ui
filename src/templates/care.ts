import type { TemplateDesign } from "./types";

export const care: TemplateDesign[] = [
  {
    id: "K1",
    main: "care",
    letter: "a",
    name: "안내형",
    look: { tone: "white", radius: 0, font: "serif", shape: "square", kit: "off", section: 128, pad: 80 },
    header: "editorial",
    skin: "editorial",
    home: [
      { kind: "hero", variant: "editorial" },
      { kind: "intro", variant: "editorial" },
      { kind: "menu", variant: "editorial" },
      { kind: "store_info", variant: "editorial" },
      { kind: "photo_band", variant: "editorial" },
    ],
    detail: [],
  },
  {
    id: "K2",
    main: "care",
    letter: "b",
    name: "살롱형",
    look: { tone: "warm", radius: 0, font: "serif", shape: "square", kit: "off", section: 128, pad: 80 },
    header: "catalog",
    skin: "catalog",
    home: [
      { kind: "hero", variant: "catalog" },
      { kind: "intro", variant: "catalog" },
      { kind: "menu", variant: "catalog" },
      { kind: "location", variant: "catalog" },
    ],
    detail: [],
  },
  {
    id: "K3",
    main: "care",
    letter: "c",
    name: "스튜디오형",
    look: { tone: "paper", radius: 0, font: "sans", shape: "soft", kit: "off", section: 112, pad: 80 },
    header: "showroom",
    skin: "showroom",
    home: [
      { kind: "hero", variant: "showroom" },
      { kind: "intro", variant: "showroom" },
      { kind: "menu", variant: "showroom" },
      { kind: "location", variant: "showroom" },
      { kind: "faq", variant: "showroom" },
    ],
    detail: [],
  },
];
