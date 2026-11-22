import type { ShopSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import type { OfficeDesign } from "./types";

export const OFFICE_DESIGNS: Partial<Record<ShopSkin, OfficeDesign>> = {
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
};

export { OFFICE_ID, OFFICE_TITLE, officeNav } from "./shared";
export type * from "./types";
