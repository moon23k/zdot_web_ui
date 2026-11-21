import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { business } from "../../__stories__/fixtures/commerce";
import { SiteFooter } from "../../index";

const meta: Meta<typeof SiteFooter> = {
  title: "Blocks/SiteFooter",
  component: SiteFooter,
  parameters: { layout: "padded" },
};
export default meta;

function DefaultExample() {
  return (
    <SiteFooter
      storeName="온기상점"
      business={business}
      hosting="자사닷"
      policies={[
        { key: "terms", title: "이용약관" },
        { key: "privacy", title: "개인정보처리방침" },
      ]}
    />
  );
}

function NoBusinessExample() {
  return (
    <SiteFooter
      storeName="온기상점"
      business={null}
      hosting="자사닷"
      policies={[
        { key: "terms", title: "이용약관" },
        { key: "privacy", title: "개인정보처리방침" },
      ]}
    />
  );
}

export const Default: StoryObj = { render: () => <DefaultExample /> };

export const NoBusiness: StoryObj = { render: () => <NoBusinessExample /> };
