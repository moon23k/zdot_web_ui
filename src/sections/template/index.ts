import { ClassList, ClassSchedule, Gates } from "./class";
import { Gallery, Intro, Location, Numbers, PayPlan, PhotoBand, ProcessSteps, Reviews, Testimonial, TrustLine } from "./common";
import { CaseCards, CaseGrid, PackageCards, PriceTiers } from "./quote";
import { CategoryTiles, Curation, StoreInfo } from "./shop";
import { Amenities, BookingStrip, HouseRules, RoomBox, RoomList, SearchBar } from "./stay";

export const templateSections = {
  intro: Intro,
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
  search_bar: SearchBar,
  booking_strip: BookingStrip,
  amenities: Amenities,
  house_rules: HouseRules,
  room_list: RoomList,
  room_box: RoomBox,
  price_tiers: PriceTiers,
  package_cards: PackageCards,
  case_grid: CaseGrid,
  case_cards: CaseCards,
};

export { SessionList, SessionRow, SessionStatus } from "./class";
export type * from "./data";
