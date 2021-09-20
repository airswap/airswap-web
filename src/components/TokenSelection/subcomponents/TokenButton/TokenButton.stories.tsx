import { Story, Meta } from "@storybook/react";

import styled from "styled-components/macro";

import TokenButton, { TokenRowProps } from "./TokenButton";

const Container = styled.div`
  background: ${(props) => props.theme.colors.black};
`;

export default {
  title: "components/TokenSelection/TokenButton",
  component: TokenButton,
  argTypes: {
    token: { control: { type: "object" } },
    balance: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
    setToken: { control: { type: "function" } },
    showDeleteButton: { control: { type: "boolean" } },
  },
} as Meta;

const Template: Story<TokenRowProps> = (args) => (
  <Container>
    <TokenButton {...args} />
  </Container>
);

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
};

export const ShowDeleteButton = Template.bind({});
ShowDeleteButton.args = {
  token: {
    chainId: 1,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a3",
    name: "Inactive",
    decimals: 18,
    symbol: "INA",
  },
  balance: "230",
  disabled: false,
  showDeleteButton: true,
  setToken: () => void 1,
};
