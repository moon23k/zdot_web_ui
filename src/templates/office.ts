import type { TemplateDesign } from "./types";

export const office: TemplateDesign[] = [
  {
    id: "O1",
    main: "office",
    letter: "a",
    name: "사례형",
    look: { tone: "paper", radius: 0, font: "sans", shape: "square", kit: "off", section: 128, pad: 80 },
    header: "editorial",
    skin: "editorial",
    home: [
      { kind: "hero", variant: "editorial" },
      { kind: "case_grid", variant: "editorial" },
      { kind: "faq", variant: "editorial" },
    ],
    detail: [],
  },
  {
    id: "O2",
    main: "office",
    letter: "b",
    name: "선언형",
    look: { tone: "white", radius: 0, font: "sans", shape: "square", kit: "off", section: 128, pad: 80 },
    header: "catalog",
    skin: "catalog",
    home: [
      { kind: "hero", variant: "catalog" },
      { kind: "intro", variant: "catalog" },
      { kind: "menu", variant: "catalog" },
      { kind: "store_info", variant: "catalog" },
    ],
    detail: [],
  },
];
