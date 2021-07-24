import { Story, Meta } from "@storybook/react";

import GenericToast, { GenericToastProps } from "./GenericToast";

export default {
  title: "components/Toasts/GenericToast",
  component: GenericToast,
  argTypes: {
    onClose: { control: { type: "function" } },
    type: { control: { type: "text" } },
    intent: { control: { type: "text" } },
  },
} as Meta;

const Template: Story<GenericToastProps> = (args) => (
  <GenericToast {...args} />
);

export const WalletBalanceError = Template.bind({});
WalletBalanceError.args = {
  onClose: () => void 1,
  type: "toast:insufficientWalletBalance",
  intent: "error"
};

export const GasWarning = Template.bind({});
GasWarning.args = {
  onClose: () => void 1,
  type: "toast:gasWarning",
  intent: "warning",
};
