import type { ShopSkin } from "../../templates/types";
import { cn } from "../../utils/cn";
import type { ProductView } from "./shared";

export type ShelfRatio = "1:1" | "4:5" | "3:4";

export type ShelfSort = "recent" | "popular" | "price_asc" | "price_desc";

export type ShelfSetting = {
  cols_web?: 3 | 4 | 5 | null;
  cols_mobile?: 1 | 2 | 3 | null;
  ratio?: ShelfRatio | null;
  show_discount?: boolean | null;
  show_list_price?: boolean | null;
  show_sold_out?: boolean | null;
  sort?: ShelfSort | null;
};

export type Shelf = { [K in keyof ShelfSetting]-?: NonNullable<ShelfSetting[K]> };

const BASE = { show_discount: true, show_list_price: true, show_sold_out: true, sort: "recent" } as const;

export const SHELF_DEFAULTS: Record<ShopSkin, Shelf> = {
  editorial: { ...BASE, cols_web: 3, cols_mobile: 2, ratio: "4:5" },
  catalog: { ...BASE, cols_web: 4, cols_mobile: 2, ratio: "1:1" },
  showroom: { ...BASE, cols_web: 3, cols_mobile: 2, ratio: "1:1" },
  aurora: { ...BASE, cols_web: 4, cols_mobile: 2, ratio: "4:5" },
  night: { ...BASE, cols_web: 4, cols_mobile: 2, ratio: "4:5" },
  stage: { ...BASE, cols_web: 4, cols_mobile: 2, ratio: "1:1" },
};

export function shelfOf(skin: ShopSkin | undefined, setting?: ShelfSetting | null): Shelf {
  const base = SHELF_DEFAULTS[skin ?? "editorial"] ?? SHELF_DEFAULTS.editorial;
  const own = Object.fromEntries(Object.entries(setting ?? {}).filter(([, v]) => v != null)) as Partial<Shelf>;
  return { ...base, ...own };
}

export const SHELF_RATIO: Record<ShelfRatio, string> = {
  "1:1": "ez:aspect-square",
  "4:5": "ez:aspect-[4/5]",
  "3:4": "ez:aspect-[3/4]",
};

const MOBILE_COLS = { 1: "ez:grid-cols-1", 2: "ez:grid-cols-2", 3: "ez:grid-cols-3" } as const;

const WEB_COLS = { 3: "ez:lg:grid-cols-3", 4: "ez:lg:grid-cols-4", 5: "ez:lg:grid-cols-5" } as const;

export function shelfCols(shelf: Shelf, tablet?: string): string {
  return cn(MOBILE_COLS[shelf.cols_mobile], tablet, WEB_COLS[shelf.cols_web]);
}

export function shelfSizes(shelf: Shelf, skin: ShopSkin, sizes: string): string {
  const base = SHELF_DEFAULTS[skin];
  if (shelf.cols_mobile === base.cols_mobile && shelf.cols_web === base.cols_web) return sizes;
  return `(max-width: 1024px) ${Math.round(100 / shelf.cols_mobile)}vw, ${Math.round(1320 / shelf.cols_web)}px`;
}

export function shelfView(v: ProductView, shelf: Shelf): ProductView {
  return {
    ...v,
    rate: shelf.show_discount ? v.rate : 0,
    list: shelf.show_list_price ? v.list : null,
    soldOut: shelf.show_sold_out ? v.soldOut : false,
  };
}
