import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Column, Section } from "../../__stories__/helpers";
import { Won } from "./won";

const meta = {
  title: "Components/Won",
  component: Won,
  args: { amount: 52000 },
} satisfies Meta<typeof Won>;
export default meta;

export const AllVariants: StoryObj<typeof meta> = {
  render: () => (
    <Section title="amount · value">
      <Column>
        <span className="ez:text-site-heading ez:tabular-nums">
          <Won amount={52000} />
        </span>
        <span className="ez:text-site-body ez:tabular-nums">
          <Won value="30만원" />
        </span>
        <span className="ez:text-site-body ez:tabular-nums">
          <Won value="1박 95,000원~" />
        </span>
      </Column>
    </Section>
  ),
};

export const Playground: StoryObj<typeof meta> = {};
