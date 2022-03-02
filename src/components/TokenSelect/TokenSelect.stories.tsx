import { TokenInfo } from "@airswap/typescript";
import { Story, Meta } from "@storybook/react";

import TokenSelect, { TokenSelectProps } from "./TokenSelect";

const wethTokenInfo: TokenInfo = {
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  chainId: 1,
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  name: "WETH",
  symbol: "WETH",
};

export default {
  title: "components/TokenList/TokenSelect",
  component: TokenSelect,
} as Meta;

const Template: Story<TokenSelectProps> = (args) => <TokenSelect {...args} />;

export const EmptyWithoutAmountInput = Template.bind({});
EmptyWithoutAmountInput.args = {
  readOnly: false,
  includeAmountInput: false,
  label: "To",
  selectedToken: null,
  onChangeTokenClicked: () => {
    /* do nothing */
  },
};

export const EmptyWithAmountInput = Template.bind({});
EmptyWithAmountInput.args = {
  readOnly: false,
  includeAmountInput: true,
  label: "To",
  selectedToken: null,
  onChangeTokenClicked: () => {
    /* do nothing */
  },
};

export const Populated = Template.bind({});
Populated.args = {
  readOnly: false,
  includeAmountInput: true,
  label: "From",
  selectedToken: wethTokenInfo,
  amount: "12.33",
  onChangeTokenClicked: () => {
    /* do nothing */
  },
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  readOnly: true,
  includeAmountInput: true,
  label: "From",
  selectedToken: wethTokenInfo,
  amount: "12.33",
  onChangeTokenClicked: () => {
    /* do nothing */
  },
};
