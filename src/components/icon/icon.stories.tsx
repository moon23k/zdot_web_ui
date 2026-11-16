import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Row, Section } from "../../__stories__/helpers";
import { Icon, type IconName } from "./icon";

const NAMES: IconName[] = ["search", "user", "heart", "bag", "truck", "box", "users", "clock", "pin", "phone", "right", "down", "plus", "minus", "check", "x", "copy", "grid", "calendar"];

const meta = {
  title: "Components/Icon",
  component: Icon,
  args: { name: "search" },
} satisfies Meta<typeof Icon>;
export default meta;

export const AllVariants: StoryObj<typeof meta> = {
  render: () => (
    <Section title="name">
      <Row>
        {NAMES.map((name) => (
          <Icon key={name} name={name} label={name} />
        ))}
      </Row>
    </Section>
  ),
};

export const Playground: StoryObj<typeof meta> = {};
