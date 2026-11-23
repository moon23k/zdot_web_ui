export type PaySetting = {
  show_summary?: boolean | null;
  button_amount?: boolean | null;
};

export type PayShape = { [K in keyof PaySetting]-?: NonNullable<PaySetting[K]> };

export function payOf(setting?: PaySetting | null): PayShape {
  const button_amount = setting?.button_amount ?? true;
  return {
    show_summary: (setting?.show_summary ?? true) || !button_amount,
    button_amount,
  };
}
