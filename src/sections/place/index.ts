import type { CommonSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import * as D from "./d";
import * as E from "./e";
import type { PlaceDesign } from "./types";

export const PLACE_DESIGNS: Record<CommonSkin, PlaceDesign> = {
  editorial: {
    Header: A.Header,
    Footer: A.Footer,
    sections: {
      hero: A.Hero,
      intro: A.Intro,
      photo_band: A.Band,
      menu: A.Menu,
      store_info: A.Store,
    },
  },
  catalog: {
    Header: B.Header,
    Footer: B.Footer,
    sections: {
      hero: B.Hero,
      intro: B.Intro,
      menu: B.Menu,
      location: B.Location,
    },
  },
  showroom: {
    Header: C.Header,
    Footer: C.Footer,
    sections: {
      hero: C.Hero,
      intro: C.Intro,
      menu: C.Menu,
      store_info: C.Store,
      faq: C.Faq,
      photo_band: C.Band,
    },
  },
  aurora: {
    Header: D.Header,
    Footer: D.Footer,
    sections: { hero: D.Hero, menu: D.Menu, intro: D.Intro, store_info: D.Store },
  },
  night: {
    Header: E.Header,
    Footer: E.Footer,
    sections: { hero: E.Hero, menu: E.Menu, intro: E.Intro, store_info: E.Store },
  },
};

export { menuItems, paragraphs, PLACE_ID, PLACE_TITLE, placeFooter, placeLinks, placeNav, telHref } from "./shared";
export type { StoreLinks } from "./shared";
export type * from "./types";
