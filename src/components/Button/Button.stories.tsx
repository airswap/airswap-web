import { Story, Meta } from "@storybook/react";

import { Button, ButtonProps } from "./Button";

export default {
  title: "components/Button",
  component: Button,
  argTypes: {
    disabled: { control: { type: "boolean" } },
    loading: { control: { type: "boolean" } },
    className: { control: { type: "text" } },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: "Click me",
  intent: "primary",
};

export const Loading = Template.bind({});
Loading.args = {
  ...Primary.args,
  loading: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Primary.args,
  disabled: true,
};
