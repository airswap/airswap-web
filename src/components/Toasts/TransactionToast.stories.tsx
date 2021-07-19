import { Story, Meta } from "@storybook/react";

import TransactionToast, { TransactionToastProps } from "./TransactionToast";

export default {
  title: "components/Toasts/TransactionToast",
  component: TransactionToast,
  argTypes: {
    onClose: { control: { type: "function" } },
    duration: { control: { type: "number" } },
    startTime: { control: { type: "date" } },
    text: { control: { type: "text" } },
  },
} as Meta;

const Template: Story<TransactionToastProps> = (args) => (
  <TransactionToast {...args} />
);

export const ApprovalTransaction = Template.bind({});
ApprovalTransaction.args = {
  onClose: () => void 1,
  duration: 30,
  startTime: new Date(),
  text: "Please approve 1434.25 AST for withdrawl."
};

export const TransactionPending = Template.bind({});
ApprovalTransaction.args = {
  onClose: () => void 1,
  duration: 30,
  startTime: new Date(),
  text: "Your transaction has been sent to the network."
};

export const TransactionComplete = Template.bind({});
ApprovalTransaction.args = {
  onClose: () => void 1,
  duration: 30,
  startTime: new Date(),
  text: "Your transaction has successfully been complete."
};

export const TransactionError = Template.bind({});
ApprovalTransaction.args = {
  onClose: () => void 1,
  duration: 30,
  startTime: new Date(),
  text: "Transaction has failed! Offer expired."
};

