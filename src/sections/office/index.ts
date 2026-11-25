import type { CommonSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as D from "./d";
import * as E from "./e";
import type { OfficeDesign } from "./types";

export const OFFICE_DESIGNS: Partial<Record<CommonSkin, OfficeDesign>> = {
  editorial: {
    Header: A.Header,
    Footer: A.Footer,
    sections: { hero: A.Hero, case_grid: A.Cases, faq: A.Faq },
  },
  catalog: {
    Header: B.Header,
    Footer: B.Footer,
    sections: { hero: B.Hero, intro: B.Intro, menu: B.Services, store_info: B.Company },
  },
  aurora: {
    Header: D.Header,
    Footer: D.Footer,
    sections: { hero: D.Hero, menu: D.Menu, case_grid: D.Cases, intro: D.Intro, store_info: D.Store },
  },
  night: {
    Header: E.Header,
    Footer: E.Footer,
    sections: { hero: E.Hero, menu: E.Menu, case_grid: E.Cases, intro: E.Intro, store_info: E.Store },
  },
};

export { OFFICE_ID, OFFICE_TITLE, officeNav } from "./shared";
export type * from "./types";
