import type { CommonSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import * as D from "./d";
import * as E from "./e";
import type { CareDesign } from "./types";

export const CARE_DESIGNS: Record<CommonSkin, CareDesign> = {
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
  aurora: {
    Header: D.Header,
    Footer: D.Footer,
    sections: { hero: D.Hero, menu: D.Menu, photo_band: D.Band, store_info: D.Store },
  },
  night: {
    Header: E.Header,
    Footer: E.Footer,
    sections: { hero: E.Hero, menu: E.Menu, photo_band: E.Band, store_info: E.Store },
  },
};

export { CARE_ID, CARE_MENU_TITLE, CARE_TITLE, careMenuTitle, careNav } from "./shared";
export type * from "./types";
