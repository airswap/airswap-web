import { Story, Meta } from "@storybook/react";

import TransactionToast, { TransactionToastProps } from "./TransactionToast";

export default {
  title: "components/Toasts/TransactionToast",
  component: TransactionToast,
  argTypes: {
    onClose: { control: { type: "function" } },
    duration: { control: { type: "number" } },
    startTime: { control: { type: "text" } },
    type: { control: { type: "text" } },
    error: { control: { type: "boolean" } },
    amount: { control: { type: "text" } },
    token: { control: { type: "text" } },
  },
} as Meta;

const Template: Story<TransactionToastProps> = (args) => (
  <TransactionToast {...args} />
);

export const ApprovalTransaction = Template.bind({});
ApprovalTransaction.args = {
  onClose: () => void 1,
  duration: 30000,
  startTime: "02:00am",
  type: "toast:approval",
  error: false,
  amount: "10.2",
  token: "AST",
};

export const TransactionPending = Template.bind({});
TransactionPending.args = {
  onClose: () => void 1,
  duration: 30000,
  startTime: "02:00am",
  type: "toast:transactionPending",
  error: false,
};

export const TransactionSuccess = Template.bind({});
TransactionSuccess.args = {
  onClose: () => void 1,
  duration: 30000,
  startTime: "02:00am",
  type: "toast:transactionSuccess",
  error: false,
};

export const TransactionFail = Template.bind({});
TransactionFail.args = {
  onClose: () => void 1,
  duration: 30000,
  startTime: "02:00am",
  type: "toast:transactionFail",
  error: true,
};
