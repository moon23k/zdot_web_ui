import type { ShopSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
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
};

export { shopFooter, shopLinks, shopNav } from "./shared";
export type * from "./types";
