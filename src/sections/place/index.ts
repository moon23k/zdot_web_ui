import type { ShopSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import type { PlaceDesign } from "./types";

export const PLACE_DESIGNS: Record<ShopSkin, PlaceDesign> = {
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
};

export { menuItems, paragraphs, PLACE_ID, PLACE_TITLE, placeFooter, placeLinks, placeNav, telHref } from "./shared";
export type { StoreLinks } from "./shared";
export type * from "./types";
