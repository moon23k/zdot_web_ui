import type { ShopSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import type { CareDesign } from "./types";

export const CARE_DESIGNS: Record<ShopSkin, CareDesign> = {
  editorial: {
    Header: A.Header,
    Footer: A.Footer,
    sections: { hero: A.Hero, intro: A.Intro, menu: A.Menu, store_info: A.Store, photo_band: A.Band },
  },
  catalog: {
    Header: B.Header,
    Footer: B.Footer,
    sections: { hero: B.Hero, intro: B.Intro, menu: B.Menu, location: B.Location },
  },
  showroom: {
    Header: C.Header,
    Footer: C.Footer,
    sections: { hero: C.Hero, intro: C.Intro, menu: C.Menu, location: C.Location, faq: C.Faq },
  },
};

export { CARE_ID, CARE_MENU_TITLE, CARE_TITLE, careMenuTitle, careNav } from "./shared";
export type * from "./types";
