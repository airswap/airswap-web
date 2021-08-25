import { Story, Meta } from "@storybook/react";

import TokenButton, { TokenRowProps } from "./TokenButton";

export default {
  title: "components/TokenSelection/TokenButton",
  component: TokenButton,
  argTypes: {
    token: { control: { type: "object" } },
    balance: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
    setToken: { control: { type: "function" } },
    removeActiveToken: { control: { type: "function" } },
  },
} as Meta;

const Template: Story<TokenRowProps> = (args) => <TokenButton {...args} />;

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
};
