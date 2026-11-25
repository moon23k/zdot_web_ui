import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ButtonLink } from "../components/button";
import { Fold } from "../sections/kit";
import { DetailSplit } from "./split";

const meta: Meta<typeof DetailSplit> = {
  title: "Details/DetailSplit",
  component: DetailSplit,
  parameters: { layout: "padded" },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <DetailSplit
      id="qna"
      title="문의"
      action={
        <ButtonLink href="/inquiries/new" variant="outline">
          상품 문의
        </ButtonLink>
      }
    >
      <div>
        <Fold title="주문하면 언제 받나요?">
          <p>평일 오후 2시 전 주문은 당일 발송해요.</p>
        </Fold>
      </div>
    </DetailSplit>
  ),
};

export const Empty: StoryObj = {
  render: () => (
    <DetailSplit
      title="문의"
      action={
        <ButtonLink href="/inquiries/new" variant="outline">
          상품 문의
        </ButtonLink>
      }
    />
  ),
};
