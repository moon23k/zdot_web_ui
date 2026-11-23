export type PopupPosition = "center" | "bottom" | "bar";

export type PopupSize = "sm" | "md" | "lg";

export type PopupStyleSetting = {
  position?: PopupPosition | null;
  size?: PopupSize | null;
  overlay?: boolean | null;
  hide_today?: boolean | null;
};

export type PopupStyle = { [K in keyof PopupStyleSetting]-?: NonNullable<PopupStyleSetting[K]> };

export function popupStyleOf(setting?: PopupStyleSetting | null): PopupStyle {
  const position = setting?.position ?? "center";
  return {
    position,
    size: setting?.size ?? "md",
    overlay: setting?.overlay ?? position === "center",
    hide_today: setting?.hide_today ?? true,
  };
}
