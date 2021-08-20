import { Story, Meta } from "@storybook/react";

import TransactionToast, { TransactionToastProps } from "./TransactionToast";

export default {
  title: "components/Toasts/TransactionToast",
  component: TransactionToast,
  argTypes: {
    onClose: { control: { type: "function" } },
    error: { control: { type: "boolean" } },
  },
} as Meta;

const Template: Story<TransactionToastProps> = (args) => (
  <TransactionToast {...args} />
);


export const TransactionSuccess = Template.bind({});
TransactionSuccess.args = {
  onClose: () => void 1,
  error: false,
};

export const TransactionFail = Template.bind({});
TransactionFail.args = {
  onClose: () => void 1,
  error: true,
};
