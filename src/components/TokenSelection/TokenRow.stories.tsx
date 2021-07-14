import { Story, Meta } from "@storybook/react";

import TokenRow, { TokenRowProps } from "./TokenRow";

export default {
  title: "components/TokenSelection/TokenRow",
  component: TokenRow,
  argTypes: {
    token: { control: { type: "object" } },
    balance: { control: { type: "text" } },
    selected: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    setToken: { control: { type: "function" } },
    removeActiveToken: { control: { type: "function" } },
    defaultToken: { control: { type: "boolean" } },
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
  setToken: () => void 1,
  removeActiveToken: () => void 1,
  defaultToken: true,
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
  setToken: () => void 1,
  removeActiveToken: () => void 1,
  defaultToken: true,
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
  setToken: () => void 1,
  removeActiveToken: () => void 1,
  defaultToken: true,
};

export const DefaultToken = Template.bind({});
DefaultToken.args = {
  token: {
    chainId: 1,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    name: "Ethereum",
    decimals: 18,
    symbol: "ETH",
  },
  balance: "230",
  disabled: false,
  setToken: () => void 1,
  removeActiveToken: () => void 1,
  defaultToken: true,
};

export const InactiveToken = Template.bind({});
InactiveToken.args = {
  token: {
    chainId: 1,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a3",
    name: "Inactive",
    decimals: 18,
    symbol: "INA",
  },
  balance: "230",
  disabled: false,
  setToken: () => void 1,
  removeActiveToken: () => void 1,
  defaultToken: false,
};
