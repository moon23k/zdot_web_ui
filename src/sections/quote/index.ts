import type { ShopSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import type { QuoteDesign } from "./types";

export const QUOTE_DESIGNS: Record<ShopSkin, QuoteDesign> = {
  editorial: {
    Header: A.Header,
    Footer: A.Footer,
    List: A.List,
    join: ["trust_line"],
    sections: {
      hero: A.Hero,
      trust_line: A.Trust,
      case_grid: A.Cases,
      price_tiers: A.Prices,
      process_steps: A.Process,
      reviews: A.Reviews,
      faq: A.Faq,
      quote_starter: A.Request,
    },
  },
  catalog: {
    Header: B.Header,
    Footer: B.Footer,
    List: B.List,
    sections: {
      hero: B.Hero,
      trust_line: B.Trust,
      package_cards: B.Packages,
      process_steps: B.Process,
      case_grid: B.Cases,
      reviews: B.Reviews,
      faq: B.Faq,
      quote_starter: B.Request,
    },
  },
  showroom: {
    Header: C.Header,
    Footer: C.Footer,
    List: C.List,
    join: ["trust_line"],
    sections: {
      hero: C.Hero,
      trust_line: C.Trust,
      reviews: C.Reviews,
      case_grid: C.Cases,
      package_cards: C.Packages,
      process_steps: C.Process,
      faq: C.Faq,
      quote_starter: C.Request,
    },
  },
};

export { average, CASES_HREF, caseView, hasFigures, leadCase, LOOKUP_HREF, QUOTE_CONSENT, QUOTE_HREF, QUOTE_TITLE, quoteFooter, quoteLinks, quoteNav, restCases, reviewCount } from "./shared";
export type * from "./types";
