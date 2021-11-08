import { Story, Meta } from "@storybook/react";

import styled from "styled-components/macro";

import { WalletButton, WalletButtonProps } from "./WalletButton";

export default {
  title: "components/Wallet/WalletButton",
  component: WalletButton,
  argTypes: {
    address: { control: { type: "text" } },
    isConnecting: { control: { type: "boolean" } },
    onDisconnectWalletClicked: { control: { type: "function" } },
    transactions: { control: { type: "array" } },
    chainId: { control: { type: "number" } },
    tokens: { control: { type: "array" } },
  },
} as Meta;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 20rem;
`;

const Template: Story<WalletButtonProps> = (args) => (
  <Container>
    <WalletButton {...args} />
  </Container>
);

export const NotConnected = Template.bind({});
NotConnected.args = {};

export const Connected = Template.bind({});
Connected.args = {
  address: "0x73580000000000000000000000000000000bcBE5",
};
