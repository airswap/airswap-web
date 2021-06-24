import { Story, Meta } from "@storybook/react";

import { Timer, TimerProps } from "../Timer/Timer";

export default {
  title: "components/Timer",
  component: Timer,
  argTypes: {
    className: { control: {type: "text"}},
    unixTimestamp: { control: {type: "number"}},
    timerDisabled: { control: {type: "boolean"}},
  },
} as Meta

const Template: Story<TimerProps> = (args) => <Timer {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  unixTimestamp: parseInt(((new Date().getTime() + 300000) / 1000).toFixed(0)),
  timerDisabled: false,
}

export const Completed = Template.bind({});
Completed.args = {
  unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
  timerDisabled: true,
}
