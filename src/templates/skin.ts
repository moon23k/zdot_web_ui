import type { ShopSkin } from "./types";

export function bySkin<T>(map: Partial<Record<ShopSkin, T>>, skin: string | null | undefined): T | undefined {
  return skin && Object.hasOwn(map, skin) ? map[skin as ShopSkin] : undefined;
}
