import type { ShopSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import type { PortfolioDesign } from "./types";

export const PORTFOLIO_DESIGNS: Record<ShopSkin, PortfolioDesign> = {
  editorial: {
    Header: A.Header,
    Footer: A.Footer,
    sections: { hero: A.Hero, case_grid: A.Work, intro: A.Intro, store_info: A.Contact },
  },
  catalog: {
    Header: B.Header,
    Footer: B.Footer,
    sections: { case_grid: B.Work, intro: B.Intro, store_info: B.Contact },
    join: ["intro", "store_info"],
    into: "case_grid",
  },
  showroom: {
    Header: C.Header,
    Footer: C.Footer,
    sections: { hero: C.Hero, intro: C.Intro, case_grid: C.Work, store_info: C.Contact },
    join: ["intro"],
  },
};

export { PORTFOLIO_ID, PORTFOLIO_TITLE, portfolioNav } from "./shared";
export type * from "./types";
