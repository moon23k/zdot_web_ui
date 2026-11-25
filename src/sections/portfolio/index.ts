import type { CommonSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import * as D from "./d";
import * as E from "./e";
import type { PortfolioDesign } from "./types";

export const PORTFOLIO_DESIGNS: Record<CommonSkin, PortfolioDesign> = {
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
  aurora: {
    Header: D.Header,
    Footer: D.Footer,
    sections: { hero: D.Hero, case_grid: D.Cases, intro: D.Intro, store_info: D.Store },
  },
  night: {
    Header: E.Header,
    Footer: E.Footer,
    sections: { hero: E.Hero, case_grid: E.Cases, intro: E.Intro, store_info: E.Store },
  },
};

export { PORTFOLIO_ID, PORTFOLIO_TITLE, portfolioNav } from "./shared";
export type * from "./types";
