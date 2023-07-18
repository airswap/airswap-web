import { TokenInfo } from "@airswap/types";

export const nativeCurrencyAddress =
  "0x0000000000000000000000000000000000000000";

const nativeCurrency: Record<number, TokenInfo> = {
  1: {
    chainId: 1,
    address: nativeCurrencyAddress,
    name: "Ether",
    decimals: 18,
    symbol: "ETH",
    logoURI: "images/ethereum-logo.png",
  },
  5: {
    chainId: 5,
    address: nativeCurrencyAddress,
    name: "Ether",
    decimals: 18,
    symbol: "ETH",
    logoURI: "images/ethereum-logo.png",
  },
  30: {
    chainId: 30,
    address: nativeCurrencyAddress,
    name: "RBTC",
    decimals: 18,
    symbol: "RBTC",
    logoURI: "images/rbtc-logo.png",
  },
  31: {
    chainId: 31,
    address: nativeCurrencyAddress,
    name: "tRBTC",
    decimals: 18,
    symbol: "tRBTC",
    logoURI: "images/rbtc-logo.png",
  },
  56: {
    chainId: 56,
    address: nativeCurrencyAddress,
    name: "BNB",
    decimals: 18,
    symbol: "BNB",
    logoURI: "images/bnb-logo.png",
  },
  97: {
    chainId: 97,
    address: nativeCurrencyAddress,
    name: "BNB",
    decimals: 18,
    symbol: "BNB",
    logoURI: "images/bnb-logo.png",
  },
  137: {
    chainId: 137,
    address: nativeCurrencyAddress,
    name: "MATIC",
    decimals: 18,
    symbol: "MATIC",
    logoURI: "images/matic-logo.png",
  },
  43113: {
    chainId: 43113,
    address: nativeCurrencyAddress,
    name: "AVAX",
    decimals: 18,
    symbol: "AVAX",
    logoURI: "images/avalanche-logo.png",
  },
  43114: {
    chainId: 43114,
    address: nativeCurrencyAddress,
    name: "AVAX",
    decimals: 18,
    symbol: "AVAX",
    logoURI: "images/avalanche-logo.png",
  },
  59140: {
    chainId: 59140,
    address: nativeCurrencyAddress,
    name: "ETH",
    decimals: 18,
    symbol: "ETH",
    logoURI: "images/linea-logo.png",
  },
  59144: {
    chainId: 59144,
    address: nativeCurrencyAddress,
    name: "ETH",
    decimals: 18,
    symbol: "ETH",
    logoURI: "images/linea-logo.png",
  },
  80001: {
    chainId: 80001,
    address: nativeCurrencyAddress,
    name: "MATIC",
    decimals: 18,
    symbol: "MATIC",
    logoURI: "images/matic-logo.png",
  },
};

export const nativeCurrencySafeTransactionFee: Partial<Record<number, number>> =
  {
    1: 0.01,
    4: 0.001,
    5: 0.001,
  };

export default nativeCurrency;
