import type { ShopSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import * as D from "./d";
import * as E from "./e";
import * as F from "./f";
import type { ShopDesign } from "./types";

export const SHOP_DESIGNS: Record<ShopSkin, ShopDesign> = {
  editorial: {
    Header: A.Header,
    Footer: A.Footer,
    List: A.List,
    sections: { hero: A.Hero, product_grid: A.NewArrivals, testimonial: A.Story, category_tiles: A.Categories, best_grid: A.Best, photo_band: A.Wide },
  },
  catalog: {
    Header: B.Header,
    Footer: B.Footer,
    List: B.List,
    sections: { hero: B.Hero, category_tiles: B.Categories, product_grid: B.NewArrivals, photo_band: B.Strip, best_grid: B.Best, reviews: B.Reviews },
  },
  showroom: {
    Header: C.Header,
    Footer: C.Footer,
    List: C.List,
    sections: { hero: C.Hero, category_tiles: C.Categories, product_grid: C.NewArrivals, curation: C.Curation, best_grid: C.Best, shop_guide: C.Guide },
  },
  aurora: {
    Header: D.Header,
    Footer: D.Footer,
    List: D.List,
    sections: { hero: D.Hero, best_grid: D.Best, photo_band: D.Band, product_grid: D.NewArrivals, reviews: D.Reviews, shop_guide: D.Guide },
  },
  night: {
    Header: E.Header,
    Footer: E.Footer,
    List: E.List,
    sections: { hero: E.Hero, best_grid: E.Best, photo_band: E.Band, product_grid: E.NewArrivals, reviews: E.Reviews, shop_guide: E.Guide },
  },
  stage: {
    Header: F.Header,
    Footer: F.Footer,
    List: F.List,
    sections: { hero: F.Hero, best_grid: F.Best, photo_band: F.Band, product_grid: F.NewArrivals, reviews: F.Reviews, shop_guide: F.Guide },
  },
};

export { shopFooter, shopLinks, shopNav } from "./shared";
export type * from "./types";
