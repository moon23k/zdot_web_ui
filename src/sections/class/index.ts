import type { ShopSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import type { ClassDesign } from "./types";

export const CLASS_DESIGNS: Record<ShopSkin, ClassDesign> = {
  editorial: {
    Header: A.Header,
    Footer: A.Footer,
    List: A.List,
    sections: { hero: A.Hero, class_list: A.Classes, photo_band: A.Studio, class_schedule: A.Schedule, testimonial: A.Story, location: A.Location },
  },
  catalog: {
    Header: B.Header,
    Footer: B.Footer,
    List: B.List,
    sections: { hero: B.Hero, class_schedule: B.Schedule, class_list: B.Classes, reviews: B.Reviews, faq: B.Faq, location: B.Location },
  },
  showroom: {
    Header: C.Header,
    Footer: C.Footer,
    List: C.List,
    sections: { hero: C.Hero, class_list: C.Classes, class_schedule: C.Schedule, reviews: C.Reviews, location: C.Location },
  },
};

export { bookable, CLASS_TITLE, classFooter, classLinks, classNav, sessionView } from "./shared";
export type * from "./types";
