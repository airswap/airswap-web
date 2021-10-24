import { Story, Meta } from "@storybook/react";

import styled from "styled-components/macro";

import TokenList, { TokenListProps } from "./TokenList";

export default {
  title: "components/TokenList/TokenList",
  component: TokenList,
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

const Template: Story<TokenListProps> = (args) => (
  <Container>
    <TokenList {...args} />
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

const USDC = {
  chainId: 1,
  address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a4",
  name: "USD Coin",
  decimals: 18,
  symbol: "USDC",
};

const allTokens = [ETH, DAI, USDC];

const activeTokens = [ETH, DAI];

export const Default = Template.bind({});
Default.args = {
  onSelectToken: () => void 1,
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
  // TODO:
  supportedTokenAddresses: [],
  addActiveToken: () => void 1,
  removeActiveToken: () => void 1,
};
