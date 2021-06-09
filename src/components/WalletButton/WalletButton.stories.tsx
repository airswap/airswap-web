import { Story, Meta } from "@storybook/react";

import { WalletButton, WalletButtonProps } from "./WalletButton";

export default {
  title: "components/Wallet/WalletButton",
  component: WalletButton,
  argTypes: {
    // disabled: { control: { type: "boolean" } },
    // loading: { control: { type: "boolean" } },
    address: { control: { type: "text" } },
    className: { control: { type: "text" } },
  },
} as Meta;

const Template: Story<WalletButtonProps> = (args) => <WalletButton {...args} />;

export const NotConnected = Template.bind({});
NotConnected.args = {};

export const Connected = Template.bind({});
Connected.args = {
  address: "0x73580000000000000000000000000000000bcBE5",
};
