import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { orders } from "../../__stories__/fixtures/commerce";
import { AccountShell, OrderList } from "../../index";

const meta: Meta<typeof AccountShell> = {
  title: "Blocks/AccountShell",
  component: AccountShell,
  parameters: { layout: "padded" },
};
export default meta;

function DefaultExample() {
  return (
    <AccountShell
      current="/orders"
      name="김온기"
      summary={[
        { label: "적립금", value: "3,200원" },
        { label: "쿠폰", value: "2" },
      ]}
      counts={{ "/me/likes": 4, "/me/coupons": 2 }}
      logoutAction={async () => ({ redirect: "/" })}
    >
      <h1>주문 내역</h1>
      <OrderList orders={orders} />
    </AccountShell>
  );
}

function PlainExample() {
  return (
    <AccountShell current="/inquiries">
      <h1>문의</h1>
    </AccountShell>
  );
}

export const Default: StoryObj = { render: () => <DefaultExample /> };

export const Plain: StoryObj = { render: () => <PlainExample /> };
