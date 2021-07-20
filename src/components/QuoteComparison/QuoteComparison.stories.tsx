import { LightOrder } from "@airswap/types";
import { Story, Meta } from "@storybook/react";

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
    senderAmount: "1000000000",
    signerAmount: "1000000000",
    senderToken: "0xabc",
    signerToken: "0xdef",
    signerWallet: "0x00ed0000830A2E222f9b139E90483A37142beded",
    ...irrelevantOrderProps,
  },
  {
    expiry: "123",
    senderAmount: "1000000000",
    signerAmount: "1000000000",
    senderToken: "0xabc",
    signerToken: "0xdef",
    signerWallet: "0x00ed0000830A2E222f9b139E90483A37142beded",
    ...irrelevantOrderProps,
  },
  {
    expiry: "123",
    senderAmount: "1000000000",
    signerAmount: "1000000000",
    senderToken: "0xabc",
    signerToken: "0xdef",
    signerWallet: "0x00ed0000830A2E222f9b139E90483A37142beded",
    ...irrelevantOrderProps,
  },
];

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
};
