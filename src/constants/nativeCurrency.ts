import {
  ChainIds,
  chainCurrencies,
  currencyIcons,
  ADDRESS_ZERO,
  TokenInfo,
} from "@airswap/utils";

export const nativeCurrencyDecimals = 18;

const nativeCurrency: Record<number, TokenInfo> = {};

for (const chainId in ChainIds) {
  nativeCurrency[chainId] = {
    chainId: Number(chainId),
    address: ADDRESS_ZERO,
    decimals: nativeCurrencyDecimals,
    name: chainCurrencies[chainId],
    symbol: chainCurrencies[chainId],
    logoURI: `images/networks/${currencyIcons[chainId]}.png`,
  };
}

export default nativeCurrency;
