import { Story, Meta } from "@storybook/react";

import TokenRow, { TokenRowProps } from "./TokenRow";

export default {
  title: "components/TokenSelection/TokenRow",
  component: TokenRow,
  argTypes: {
    token: { control: { type: "object" } },
    balance: { control: { type: "text" } },
    onClick: { control: { type: "function" } },
    selected: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
  },
} as Meta;

const Template: Story<TokenRowProps> = (args) => <TokenRow {...args} />;

export const Default = Template.bind({});
Default.args = {
  token: {
    chainId: 1,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    name: "Ethereum",
    decimals: 18,
    symbol: "ETH",
  },
  balance: "230",
  onClick: () => void 1,
};

export const Selected = Template.bind({});
Selected.args = {
  token: {
    chainId: 1,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    name: "Ethereum",
    decimals: 18,
    symbol: "ETH",
  },
  balance: "230",
  selected: true,
  onClick: () => void 1,
};

export const Disabled = Template.bind({});
Disabled.args = {
  token: {
    chainId: 1,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    name: "Ethereum",
    decimals: 18,
    symbol: "ETH",
  },
  balance: "230",
  disabled: true,
  onClick: () => void 1,
};
