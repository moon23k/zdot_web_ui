import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { order } from "../../__stories__/fixtures/commerce";
import { ClaimForm } from "../../index";

const meta: Meta<typeof ClaimForm> = {
  title: "Blocks/ClaimForm",
  component: ClaimForm,
  parameters: { layout: "padded" },
};
export default meta;

const preview = async () => ({
  item_amount: 38000,
  delivery_fee: 0,
  withheld_back: 0,
  return_fee: 3000,
  coupon_clawback: 0,
  shipping_charge: 3000,
  cash: 32000,
  points: 2000,
  point_clawback: 0,
});

function ReturnExample() {
  return <ClaimForm kind="return" items={order.items} imageSrc={{}} preview={preview} action={async () => ({ ok: true, message: "반품 신청을 접수했어요." })} />;
}

export const Return: StoryObj = { render: () => <ReturnExample /> };
