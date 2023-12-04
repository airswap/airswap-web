import { ChainIds, chainCurrencies, currencyIcons, ADDRESS_ZERO } from "@airswap/constants";
import { TokenInfo } from "@airswap/types";

export const nativeCurrencyDecimals = 18;

const nativeCurrency: Record<number, TokenInfo> = {};

for (let chainId in ChainIds) {
  nativeCurrency[chainId] = {
    chainId: Number(chainId),
    address: ADDRESS_ZERO,
    decimals: nativeCurrencyDecimals,
    name: chainCurrencies[chainId],
    symbol: chainCurrencies[chainId],
    logoURI: `images/networks/${currencyIcons[chainId]}.png`,
  };
}

export const nativeCurrencySafeTransactionFee: Partial<Record<number, number>> =
  {
    1: 0.01,
    4: 0.001,
    5: 0.001,
  };

export default nativeCurrency;
