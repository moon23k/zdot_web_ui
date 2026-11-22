import type { ShopSkin } from "../../templates/types";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import type { StayDesign } from "./types";

export const STAY_DESIGNS: Record<ShopSkin, StayDesign> = {
  editorial: {
    Header: A.Header,
    Footer: A.Footer,
    List: A.List,
    sections: {
      hero: A.Hero,
      booking_strip: A.Booking,
      testimonial: A.Story,
      room_list: A.Rooms,
      gallery: A.Gallery,
      amenities: A.Amenities,
      house_rules: A.Info,
      photo_band: A.Wide,
      location: A.Location,
      reviews: A.Reviews,
    },
  },
  catalog: {
    Header: B.Header,
    Footer: B.Footer,
    List: B.List,
    sections: {
      hero: B.Hero,
      booking_strip: B.Booking,
      room_list: B.Rooms,
      amenities: B.Amenities,
      gallery: B.Gallery,
      add_ons: B.AddOns,
      house_rules: B.Info,
      reviews: B.Reviews,
      location: B.Location,
    },
  },
  showroom: {
    Header: C.Header,
    Footer: C.Footer,
    List: C.List,
    sections: {
      hero: C.Hero,
      amenities: C.Amenities,
      room_list: C.Rooms,
      add_ons: C.AddOns,
      gallery: C.Gallery,
      house_rules: C.Info,
      location: C.Location,
      reviews: C.Reviews,
    },
  },
};

export { addOnView, peakOf, roomNotes, roomView, sameExtra, STAY_TITLE, stayDate, stayDates, stayFooter, stayLinks, stayNav } from "./shared";
export type * from "./types";
