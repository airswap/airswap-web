import { LightOrder } from "@airswap/types";
import { Story, Meta } from "@storybook/react";
import { TokenInfo } from "@uniswap/token-lists";

import QuoteComparison, { QuoteComparisonProps } from "./QuoteComparison";

const irrelevantOrderProps: Pick<LightOrder, "nonce" | "r" | "s" | "v"> = {
  nonce: "123",
  r: "r",
  s: "s",
  v: "v",
};

const mockOrders: LightOrder[] = [
  {
    expiry: "123",
    senderAmount: "1000000",
    signerAmount: "1210000",
    senderToken: "0xabc",
    signerToken: "0xdef",
    signerWallet: "0x00ed0000830A2E222f9b139E90483A37142bdead",
    ...irrelevantOrderProps,
  },
  {
    expiry: "123",
    senderAmount: "1000000",
    signerAmount: "1205634",
    senderToken: "0xabc",
    signerToken: "0xdef",
    signerWallet: "0x00000000830A2E222f9b139E90483A37142b0fee",
    ...irrelevantOrderProps,
  },
  {
    expiry: "123",
    senderAmount: "1000000",
    signerAmount: "1203445",
    senderToken: "0xabc",
    signerToken: "0xdef",
    signerWallet: "0x00c00000830A2E222f9b139E90483A37142bcffee",
    ...irrelevantOrderProps,
  },
];

const airSwapTokenInfo: TokenInfo = {
  symbol: "AST",
  address: "0x27054b13b1b798b345b591a4d22e6562d47ea75a",
  chainId: 1,
  decimals: 4,
  logoURI:
    "https://assets.coingecko.com/coins/images/1019/thumb/AST.png?1547034939",
  name: "AirSwap",
};

export default {
  title: "components/Quotes/QuoteComparison",
  component: QuoteComparison,
  // argTypes: {
  //   disabled: { control: { type: "boolean" } },
  //   loading: { control: { type: "boolean" } },
  //   className: { control: { type: "text" } },
  // },
} as Meta;

const Template: Story<QuoteComparisonProps> = (args) => (
  <QuoteComparison {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  quotes: mockOrders,
  bestQuoteIndex: 0,
  signerTokenInfo: airSwapTokenInfo,
};
