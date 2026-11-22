import { ClassList, ClassSchedule, Gates } from "./class";
import { Gallery, Location, Numbers, PayPlan, PhotoBand, ProcessSteps, Reviews, Testimonial, TrustLine } from "./common";
import { CategoryTiles, Curation, StoreInfo } from "./shop";
import { Amenities, Booking, Info, Rooms } from "../stay/a";
import { Cases, Prices, Request } from "../quote/a";
import { Packages } from "../quote/b";

export const templateSections = {
  photo_band: PhotoBand,
  testimonial: Testimonial,
  reviews: Reviews,
  trust_line: TrustLine,
  process_steps: ProcessSteps,
  numbers: Numbers,
  gallery: Gallery,
  location: Location,
  pay_plan: PayPlan,
  category_tiles: CategoryTiles,
  curation: Curation,
  store_info: StoreInfo,
  class_schedule: ClassSchedule,
  class_list: ClassList,
  gates: Gates,
  booking_strip: Booking,
  amenities: Amenities,
  house_rules: Info,
  room_list: Rooms,
  price_tiers: Prices,
  package_cards: Packages,
  case_grid: Cases,
  quote_starter: Request,
};

export { SessionList, SessionRow, SessionStatus } from "./class";
export type * from "./data";
