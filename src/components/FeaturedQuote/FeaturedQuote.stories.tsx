import { Story, Meta } from "@storybook/react";
import { TokenInfo } from "@uniswap/token-lists";

import FeaturedQuote from "./FeaturedQuote";
import { LightOrder } from "@airswap/types";

const irrelevantOrderProps: Pick<LightOrder, "nonce" | "r" | "s" | "v"> = {
  nonce: "123",
  r: "r",
  s: "s",
  v: "v",
};

const airSwapTokenInfo: TokenInfo = {
  symbol: "AST",
  address: "0x27054b13b1b798b345b591a4d22e6562d47ea75a",
  chainId: 1,
  decimals: 4,
  logoURI:
    "https://assets.coingecko.com/coins/images/1019/thumb/AST.png?1547034939",
  name: "AirSwap",
};

const wethTokenInfo: TokenInfo = {
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  chainId: 1,
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  name: "WETH",
  symbol: "WETH",
};

const mockOrder: LightOrder & { signerFee: string } = {
  expiry: "123",
  senderAmount: "170637000",
  signerAmount: "1000000000000000000",
  senderToken: "0x27054b13b1b798b345b591a4d22e6562d47ea75a",
  signerToken: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  signerWallet: "0x00ed0000830A2E222f9b139E90483A37142bdead",
  signerFee: "7",
  ...irrelevantOrderProps,
};

export default {
  title: "components/Quotes/FeaturedQuote",
  component: FeaturedQuote,
} as Meta;

const Template: Story<{}> = (args) => (
  <FeaturedQuote
    quote={mockOrder}
    senderTokenInfo={airSwapTokenInfo}
    signerTokenInfo={wethTokenInfo}
  />
);

export const featuredQuote = Template.bind({});
featuredQuote.args = {};
