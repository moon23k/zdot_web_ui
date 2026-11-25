import type { CommonSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import * as D from "./d";
import * as E from "./e";
import type { ClassDesign } from "./types";

export const CLASS_DESIGNS: Record<CommonSkin, ClassDesign> = {
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
  aurora: {
    Header: D.Header,
    Footer: D.Footer,
    List: D.List,
    sections: { hero: D.Hero, class_schedule: D.Schedule, class_list: D.Classes, reviews: D.Reviews, location: D.Location },
  },
  night: {
    Header: E.Header,
    Footer: E.Footer,
    List: E.List,
    sections: { hero: E.Hero, class_schedule: E.Schedule, class_list: E.Classes, reviews: E.Reviews, location: E.Location },
  },
};

export { bookable, CLASS_TITLE, classFooter, classLinks, classNav, sessionView } from "./shared";
export type * from "./types";
