import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { addresses, quote } from "../../__stories__/fixtures/commerce";
import { AddressForm, Button, CheckoutLayout, CheckoutLines, CheckoutSection, ChipChoice, DropZone, Field, FormLayout, Input, OrderSummary, PhotoAttach, RequestNote, StepList } from "../../index";

const meta: Meta<typeof CheckoutLayout> = {
  title: "Blocks/CheckoutLayout",
  component: CheckoutLayout,
  parameters: { layout: "padded" },
};
export default meta;

function DefaultExample() {
  return (
    <CheckoutLayout
      title="주문/결제"
      main={
        <>
          <CheckoutSection n={1} title="주문자">
            <Field label="이름">
              <Input name="orderer_name" defaultValue="김소담" />
            </Field>
            <Field label="휴대폰 번호">
              <Input name="orderer_phone" defaultValue="010-1234-5678" />
            </Field>
          </CheckoutSection>
          <CheckoutSection n={2} title="배송지" last>
            <AddressForm initial={addresses[0]} mock bare />
          </CheckoutSection>
        </>
      }
      aside={
        <>
          <CheckoutLines lines={[{ id: "v1", name: "청자 다완", option: "중", quantity: 1, amount: "58,000원" }]} />
          <OrderSummary quote={quote} />
        </>
      }
    />
  );
}

function FormExample() {
  return (
    <FormLayout title="견적 요청" aside={<StepList items={[{ label: "공간", value: "아파트" }, { label: "사진 · 연락처" }]} />}>
      <CheckoutSection n={1} title="공간">
        <ChipChoice name="space" label="공간" options={["아파트", "주택", "상가"]} />
      </CheckoutSection>
      <CheckoutSection n={2} title="사진 · 연락처" last>
        <DropZone label="사진 추가 0 / 5" previews={[]} onPick={() => {}} />
      </CheckoutSection>
    </FormLayout>
  );
}

function SettingExample() {
  return (
    <CheckoutLayout
      title="주문/결제"
      main={
        <>
          <CheckoutSection n={1} title="주문자">
            <Field label="이름">
              <Input name="orderer_name" />
            </Field>
            <Field label="휴대폰 번호">
              <Input name="orderer_phone" />
            </Field>
          </CheckoutSection>
          <CheckoutSection n={2} title="배송지">
            <AddressForm mock bare />
            <RequestNote label="배송 요청 사항(선택)" notes={["door", "guard", "call"]} />
          </CheckoutSection>
          <CheckoutSection n={3} title="쿠폰 · 적립금" last fold>
            <Field label="주문 쿠폰">
              <select className="ez-input" name="order_coupon_id">
                <option value="">사용 안 함</option>
              </select>
            </Field>
          </CheckoutSection>
        </>
      }
      aside={
        <>
          <CheckoutLines lines={[{ id: "v1", name: "청자 다완", option: "중", quantity: 1, amount: "58,000원" }]} />
          <OrderSummary quote={quote} />
          <Button type="button" block>
            주문하기
          </Button>
        </>
      }
    />
  );
}

function AttachExample() {
  return <PhotoAttach count={0} max={3} previews={[]} onPick={() => {}} onRemove={() => {}} />;
}

export const Default: StoryObj = { render: () => <DefaultExample /> };

export const Form: StoryObj = { render: () => <FormExample /> };

export const Setting: StoryObj = { render: () => <SettingExample /> };

export const Attach: StoryObj = { render: () => <AttachExample /> };
