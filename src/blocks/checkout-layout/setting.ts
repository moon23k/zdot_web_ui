export type CheckoutNote = "door" | "guard" | "call" | "box";

export const CHECKOUT_NOTES: Record<CheckoutNote, string> = {
  door: "문 앞에 놓아 주세요",
  guard: "경비실에 맡겨 주세요",
  call: "배송 전 연락 주세요",
  box: "택배함에 넣어 주세요",
};

export type CheckoutSetting = {
  show_email?: boolean | null;
  notes?: CheckoutNote[] | null;
  note_custom?: boolean | null;
  fold_coupon?: boolean | null;
  button_amount?: boolean | null;
};

export type CheckoutShape = { [K in keyof CheckoutSetting]-?: NonNullable<CheckoutSetting[K]> };

const ORDER = Object.keys(CHECKOUT_NOTES) as CheckoutNote[];

export function checkoutOf(setting?: CheckoutSetting | null): CheckoutShape {
  const picked = new Set(setting?.notes ?? []);
  return {
    show_email: setting?.show_email ?? true,
    notes: ORDER.filter((note) => picked.has(note)),
    note_custom: setting?.note_custom ?? true,
    fold_coupon: setting?.fold_coupon ?? false,
    button_amount: setting?.button_amount ?? true,
  };
}
