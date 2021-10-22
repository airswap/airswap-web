import { Story, Meta } from "@storybook/react";

import ErrorToast, { ErrorToastProps } from "./ErrorToast";

export default {
  title: "components/Toasts/ErrorToast",
  component: ErrorToast,
  argTypes: {
    onClose: { control: { type: "function" } },
    heading: { control: { type: "string" } },
    cta: { control: { type: "string" } },
  },
} as Meta;

const Template: Story<ErrorToastProps> = (args) => <ErrorToast {...args} />;

export const Error = Template.bind({});
Error.args = {
  onClose: () => void 1,
  heading: "Swap rejected",
  cta: "Please try again",
};
