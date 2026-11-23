import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StorePopup, type StorePopupItem } from "./store-popup";

const meta: Meta<typeof StorePopup> = {
  title: "Blocks/StorePopup",
  component: StorePopup,
  parameters: { layout: "fullscreen" },
};
export default meta;

const photo: StorePopupItem = {
  id: "pop_1",
  title: "겨울 햇차 입고",
  body: "11월 30일까지 전 상품 10% 할인",
  image_url: "https://picsum.photos/seed/zdot-tea/800/960",
  href: "/products",
  external: false,
};

const text: StorePopupItem = {
  id: "pop_2",
  title: "12월 정기 휴무",
  body: "12월 24일 – 26일 예약을 받지 않습니다.\n27일 체크인부터 정상 운영합니다.",
  image_url: null,
  href: null,
  external: false,
};

const gift: StorePopupItem = {
  id: "pop_3",
  title: "연말 선물 포장",
  body: "12월 20일 주문까지 무료",
  image_url: "https://picsum.photos/seed/zdot-gift/800/960",
  href: "https://example.com/gift",
  external: true,
};

export const Photo: StoryObj<typeof meta> = {
  args: { popups: [photo], store: "story-photo" },
};

export const Text: StoryObj<typeof meta> = {
  args: { popups: [text], store: "story-text" },
};

export const Slides: StoryObj<typeof meta> = {
  args: { popups: [gift, photo, text], store: "story-slides" },
};

export const Bottom: StoryObj<typeof meta> = {
  args: { popups: [photo], store: "story-bottom", preview: true, shape: { position: "bottom" } },
};

export const BottomLarge: StoryObj<typeof meta> = {
  args: { popups: [gift, text], store: "story-bottom-lg", preview: true, shape: { position: "bottom", size: "lg", overlay: true } },
};

export const Bar: StoryObj<typeof meta> = {
  args: { popups: [photo], store: "story-bar", preview: true, shape: { position: "bar", hide_today: false } },
};

export const CenterSmall: StoryObj<typeof meta> = {
  args: { popups: [photo], store: "story-center-sm", preview: true, shape: { size: "sm", overlay: false } },
};
