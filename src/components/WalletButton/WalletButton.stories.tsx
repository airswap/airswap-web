import { Meta, Story } from "@storybook/react";

import styled from "styled-components";

import { SubmittedTransaction } from "../../features/transactions/transactionsSlice";
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

const transactions: SubmittedTransaction[] = [
  {
    type: "Order",
    nonce: "69",
    order: {
      expiry: "1628840480",
      nonce: "1628840180688",
      signerWallet: "0xE6fDF902a9CB2C443FCc84723d7aaaaaaBCc27F5",
      signerToken: "0xc778417e063141139fce010982780140aa0cd5ab",
      signerAmount: "10009999999999998",
      signerFee: "7",
      senderWallet: "0x73580000000000000000000000000000000bcBE5",
      senderToken: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
      senderAmount: "10000000000000000",
      r: "0x43cff0758ed93222938094c2f016b3f73ca8ec7b6e73fbeb11fc04f88c452cde",
      s: "0x43fa4900adf33a6011c26d96186b02d5920afbf73f3a1bd807cde1113bea4d3a",
      v: "27",
    },
    hash: "0xa1ea8106cca703f5286c3ca4c739f74463db991cfdaf96bba638b628bbad5f68",
    status: "succeeded",
    timestamp: 1628840183271,
  } as SubmittedTransaction,
  {
    type: "Order",
    nonce: "69",
    order: {
      expiry: "1628840474",
      nonce: "1628840174080",
      signerWallet: "0xE6fDF902a9CB2C443FCc84723d7aaaaaaBCc27F5",
      signerToken: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
      signerAmount: "10009999999999998",
      signerFee: "7",
      senderWallet: "0x73580000000000000000000000000000000bcBE5",
      senderToken: "0xc778417e063141139fce010982780140aa0cd5ab",
      senderAmount: "10000000000000000",
      r: "0xde1bb784ad81abf3f62f906543b5d8320172cffbb181e9336dba2640d9702bcb",
      s: "0x4266def0208ca3ae5bd3acb5b8ec949a9d0ad974ca76bb145d72ab69c72f8eac",
      v: "28",
    },
    hash: "0x0268eddd12d466b19fb1ba05789e4fc8e6a4cfbdb2faf488acc93709dc567263",
    status: "processing",
    timestamp: 1628840176458,
  } as SubmittedTransaction,
  {
    type: "Order",
    nonce: "69",
    order: {
      expiry: "1628840464",
      nonce: "1628840164346",
      signerWallet: "0xE6fDF902a9CB2C443FCc84723d7aaaaaaBCc27F5",
      signerToken: "0xc778417e063141139fce010982780140aa0cd5ab",
      signerAmount: "10009999999999998",
      signerFee: "7",
      senderWallet: "0x73580000000000000000000000000000000bcBE5",
      senderToken: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
      senderAmount: "10000000000000000",
      r: "0x32fcfd8d0fdd8cbf1087f296511755fb6525ddd577b1178eebc69ea041c0721c",
      s: "0x65ae2d37ef4a8b3694c443d15579b0ee1720392581a3f181414c3289cb1fa7b8",
      v: "27",
    },
    hash: "0xe594e34a2353164b9ecf1c91d00fcc6c07f8ae281e90d34b3a02f05321f79475",
    status: "reverted",
    timestamp: 1628840166870,
  } as SubmittedTransaction,
];

const tokens = [
  {
    chainId: 4,
    address: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
    name: "Dai Stablecoin",
    symbol: "DAI",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_DAI.svg",
  },
  {
    chainId: 4,
    address: "0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02",
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_USDT.svg",
  },
  {
    chainId: 4,
    address: "0xbf7a7169562078c96f0ec1a8afd6ae50f12e5a99",
    name: "Basic Attention Token",
    symbol: "BAT",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_BAT.svg",
  },
  {
    chainId: 4,
    address: "0xd6801a1dffcd0a410336ef88def4320d6df1883e",
    name: "Compound Ether",
    symbol: "cETH",
    decimals: 8,
    logoURI:
      "https://raw.githubusercontent.com/compound-finance/token-list/master/assets/ctoken_eth.svg",
  },
  {
    chainId: 4,
    address: "0x577d296678535e4903d59a4c929b718e1d575e0a",
    name: "Wrapped BTC",
    symbol: "WBTC",
    decimals: 8,
  },
  {
    name: "Wrapped Ether",
    address: "0xc778417e063141139fce010982780140aa0cd5ab",
    decimals: 18,
    symbol: "WETH",
    chainId: 4,
  },
  {
    name: "AirSwap Token",
    address: "0xcc1cbd4f67cceb7c001bd4adf98451237a193ff8",
    decimals: 4,
    symbol: "AST",
    chainId: 4,
  },
];

export const NotConnected = Template.bind({});
NotConnected.args = {};

export const Connecting = Template.bind({});
Connecting.args = {
  address: "0x73580000000000000000000000000000000bcBE5",
  isConnecting: true,
  onDisconnectWalletClicked: () => void 0,
  transactions: transactions,
  chainId: 4,
  tokens: tokens,
};

export const Connected = Template.bind({});
Connected.args = {
  address: "0x73580000000000000000000000000000000bcBE5",
  isConnecting: false,
  onDisconnectWalletClicked: () => void 0,
  transactions: transactions,
  chainId: 4,
  tokens: tokens,
};

export const NoTransactions = Template.bind({});
NoTransactions.args = {
  address: "0x73580000000000000000000000000000000bcBE5",
  isConnecting: false,
  onDisconnectWalletClicked: () => void 0,
  transactions: [],
  chainId: 4,
  tokens: tokens,
};
