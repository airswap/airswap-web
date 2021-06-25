import { Story, Meta } from "@storybook/react";

import { Timer, TimerProps } from "../Timer/Timer";

export default {
  title: "components/Timer",
  component: Timer,
  argTypes: {
    className: { control: { type: "text" } },
    expiryTime: { control: { type: "number" } },
  },
} as Meta;

const Template: Story<TimerProps> = (args) => <Timer {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  expiryTime: parseInt((Date.now() / 1000 + 300).toFixed(0)),
};

export const Completed = Template.bind({});
Completed.args = {
  expiryTime: parseInt((Date.now() / 1000).toFixed(0)),
};
