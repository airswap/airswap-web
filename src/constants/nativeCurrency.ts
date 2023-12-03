import { TokenInfo } from "@airswap/types";

import { ChainIds, chainCurrencies, ADDRESS_ZERO } from '@airswap/constants'

export const nativeCurrencyDecimals = 18

const nativeCurrency: Record<number, TokenInfo> = {}

const currencyIcons: Record<number, number> = {
  [ChainIds.MAINNET]: ChainIds.MAINNET,
  [ChainIds.GOERLI]: ChainIds.MAINNET,
  [ChainIds.RSK]: ChainIds.RSK,
  [ChainIds.RSKTESTNET]: ChainIds.RSK,
  [ChainIds.TELOS]: ChainIds.TELOS,
  [ChainIds.TELOSTESTNET]: ChainIds.TELOS,
  [ChainIds.BSC]: ChainIds.BSC,
  [ChainIds.BSCTESTNET]: ChainIds.BSC,
  [ChainIds.POLYGON]: ChainIds.POLYGON,
  [ChainIds.BASE]: ChainIds.MAINNET,
  [ChainIds.ARBITRUM]: ChainIds.MAINNET,
  [ChainIds.FUJI]: ChainIds.AVALANCHE,
  [ChainIds.AVALANCHE]: ChainIds.AVALANCHE,
  [ChainIds.LINEAGOERLI]: ChainIds.MAINNET,
  [ChainIds.LINEA]: ChainIds.MAINNET,
  [ChainIds.MUMBAI]: ChainIds.POLYGON,
  [ChainIds.BASEGOERLI]: ChainIds.MAINNET,
  [ChainIds.ARBITRUMGOERLI]: ChainIds.MAINNET,
  [ChainIds.SEPOLIA]: ChainIds.MAINNET,
}

for (let chainId in ChainIds) {
  nativeCurrency[chainId] = {
    chainId: Number(chainId),
    address: ADDRESS_ZERO,
    decimals: nativeCurrencyDecimals,
    name: chainCurrencies[chainId],
    symbol: chainCurrencies[chainId],
    logoURI: `images/networks/${currencyIcons[chainId]}.png`
  }
}

export const nativeCurrencySafeTransactionFee: Partial<Record<number, number>> =
  {
    1: 0.01,
    4: 0.001,
    5: 0.001,
  };

export default nativeCurrency;
