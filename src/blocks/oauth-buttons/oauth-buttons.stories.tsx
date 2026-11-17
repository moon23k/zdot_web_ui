import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OAuthButtons } from "../../index";

const meta: Meta<typeof OAuthButtons> = {
  title: "Blocks/OAuthButtons",
  component: OAuthButtons,
  parameters: { layout: "padded" },
};
export default meta;

function DefaultExample() {
  return <OAuthButtons next="/checkout" />;
}

function PanelExample() {
  return <OAuthButtons next="/me" title="로그인" guestHref="/orders/lookup" />;
}

export const Default: StoryObj = { render: () => <DefaultExample /> };

export const Panel: StoryObj = { render: () => <PanelExample /> };
