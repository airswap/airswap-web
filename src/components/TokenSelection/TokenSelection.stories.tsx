import { Story, Meta } from "@storybook/react";

import styled from "styled-components/macro";

import TokenSelection, { TokenSelectionProps } from "./TokenSelection";

export default {
  title: "components/TokenSelection/TokenSelection",
  component: TokenSelection,
  argTypes: {
    onClose: { control: { type: "function" } },
    signerToken: { control: { type: "text" } },
    senderToken: { control: { type: "function" } },
    setSignerToken: { control: { type: "boolean" } },
    setSenderToken: { control: { type: "boolean" } },
    tokenSelectType: { control: { type: "text" } },
    balances: { control: { type: "object" } },
    allTokens: { control: { type: "array" } },
    activeTokens: { control: { type: "array" } },
    addActiveToken: { control: { type: "function" } },
    removeActiveToken: { control: { type: "function" } },
    chainId: { control: { type: "number" } },
  },
} as Meta;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30rem;
  max-width: 30rem;
`;

const Template: Story<TokenSelectionProps> = (args) => (
  <Container>
    <TokenSelection {...args} />
  </Container>
);

const ETH = {
  chainId: 1,
  address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  name: "Ethereum",
  decimals: 18,
  symbol: "ETH",
};

const DAI = {
  chainId: 1,
  address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a3",
  name: "Dai Stablecoin",
  decimals: 18,
  symbol: "DAI",
};

const allTokens = {
  // these are all dummy data
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2": ETH,
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a3": DAI,
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a4": {
    chainId: 1,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a4",
    name: "Airswap",
    decimals: 18,
    symbol: "AST",
  },
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a5": {
    chainId: 1,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a5",
    name: "USD Coin",
    decimals: 18,
    symbol: "USDC",
  },
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a6": {
    chainId: 1,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a6",
    name: "Ethereum 2.0",
    decimals: 18,
    symbol: "ETH2",
  },
};

const activeTokens = [ETH, DAI];

export const Default = Template.bind({});
Default.args = {
  onClose: () => void 1,
  signerToken: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  senderToken: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  setSignerToken: () => void 1,
  setSenderToken: () => void 1,
  tokenSelectType: "senderToken",
  balances: {
    status: "idle",
    lastFetch: 1626131560953,
    inFlightFetchTokens: null,
    values: {
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "0",
      "0xdac17f958d2ee523a2206206994597c13d831ec7": "0",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "0",
    },
  },
  allTokens: allTokens,
  activeTokens: activeTokens,
  addActiveToken: () => void 1,
  removeActiveToken: () => void 1,
  chainId: 1,
};

export const TestNet = Template.bind({});
TestNet.args = {
  onClose: () => void 1,
  signerToken: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  senderToken: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  setSignerToken: () => void 1,
  setSenderToken: () => void 1,
  tokenSelectType: "senderToken",
  balances: {
    status: "idle",
    lastFetch: 1626131560953,
    inFlightFetchTokens: null,
    values: {
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "0",
      "0xdac17f958d2ee523a2206206994597c13d831ec7": "0",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "0",
    },
  },
  allTokens: allTokens,
  activeTokens: activeTokens,
  addActiveToken: () => void 1,
  removeActiveToken: () => void 1,
  chainId: 4,
};
