import type { TemplateDesign } from "./types";

export const portfolio: TemplateDesign[] = [
  {
    id: "W1",
    main: "portfolio",
    letter: "a",
    name: "격자형",
    look: { tone: "paper", radius: 0, font: "sans", shape: "square", kit: "off", section: 128, pad: 80 },
    header: "editorial",
    skin: "editorial",
    home: [
      { kind: "hero", variant: "editorial" },
      { kind: "case_grid", variant: "editorial" },
      { kind: "intro", variant: "editorial" },
      { kind: "store_info", variant: "editorial" },
    ],
    detail: [],
  },
  {
    id: "W2",
    main: "portfolio",
    letter: "b",
    name: "목록형",
    look: { tone: "white", radius: 0, font: "sans", shape: "square", kit: "off", section: 96, pad: 80 },
    header: "catalog",
    skin: "catalog",
    home: [
      { kind: "case_grid", variant: "catalog" },
      { kind: "intro", variant: "catalog" },
      { kind: "store_info", variant: "catalog" },
    ],
    detail: [],
  },
  {
    id: "W3",
    main: "portfolio",
    letter: "c",
    name: "프로필형",
    look: { tone: "mist", radius: 0, font: "sans", shape: "square", kit: "off", section: 128, pad: 80 },
    header: "showroom",
    skin: "showroom",
    home: [
      { kind: "hero", variant: "showroom" },
      { kind: "intro", variant: "showroom" },
      { kind: "case_grid", variant: "showroom" },
      { kind: "store_info", variant: "showroom" },
    ],
    detail: [],
  },
];
