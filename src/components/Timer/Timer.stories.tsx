import { Story, Meta } from "@storybook/react";

import { Timer, TimerProps } from "../Timer/Timer";

export default {
  title: "components/Timer",
  component: Timer,
  argTypes: {
    className: { control: {type: "text"}},
    initialMinute: { control: {type: "number"}},
    initialSeconds: { control: {type: "number"}}
  },
} as Meta

const Template: Story<TimerProps> = (args) => <Timer {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  initialMinute: 1,
  initialSeconds: 2,
}

export const Completed = Template.bind({});
Completed.args = {
  initialMinute: 0,
  initialSeconds: 0,
}
