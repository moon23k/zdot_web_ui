import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteHeader } from "../../index";

const meta: Meta<typeof SiteHeader> = {
  title: "Blocks/SiteHeader",
  component: SiteHeader,
  parameters: { layout: "padded" },
};
export default meta;

function DefaultExample() {
  return <SiteHeader name="온기상점" cartCount={2} signedIn />;
}

function GuestExample() {
  return <SiteHeader name="온기상점 마포 본점 리빙 스튜디오 앤 쇼룸" />;
}

export const Default: StoryObj = { render: () => <DefaultExample /> };

export const Guest: StoryObj = { render: () => <GuestExample /> };

function StayExample() {
  return <SiteHeader name="로렘 입숨" main="stay" variant="catalog" sections={["hero", "booking_strip", "room_list", "amenities", "house_rules", "location"]} />;
}

export const Stay: StoryObj = { name: "숙박 · 홈에 있는 구획만 메뉴", render: () => <StayExample /> };
