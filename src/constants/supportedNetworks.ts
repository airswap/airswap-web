import {
  ChainIds,
  chainNames,
  apiUrls,
  chainCurrencies,
  explorerUrls,
} from "@airswap/constants";

import { ChainParams } from "../types/chainParams";

export const SUPPORTED_NETWORKS: ChainIds[] = [ChainIds.LINEAGOERLI];

export const CHAIN_PARAMS: { [key: number]: ChainParams } = {
  [ChainIds.MAINNET]: {
    chainId: +`0x${ChainIds.MAINNET.toString(16)}`,
    chainName: "Ethereum",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/your-infura-key"],
    blockExplorerUrls: ["https://etherscan.io/"],
  },
  [ChainIds.AVALANCHE]: {
    chainId: +`0x${ChainIds.AVALANCHE.toString(16)}`,
    chainName: "Avalanche",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
  },
  [ChainIds.BSC]: {
    chainId: +`0x${ChainIds.BSC.toString(16)}`,
    chainName: "BNB Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
  },
  [ChainIds.POLYGON]: {
    chainId: +`0x${ChainIds.POLYGON.toString(16)}`,
    chainName: "Polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  [ChainIds.GOERLI]: {
    chainId: +`0x${ChainIds.GOERLI.toString(16)}`,
    chainName: "Goerli",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://goerli.infura.io/v3/your-infura-key"],
    blockExplorerUrls: ["https://goerli.etherscan.io/"],
  },
  [ChainIds.RSK]: {
    chainId: +`0x${ChainIds.RSK.toString(16)}`,
    chainName: "RSK",
    nativeCurrency: {
      name: "RBTC",
      symbol: "RBTC",
      decimals: 18,
    },
    rpcUrls: ["https://public-node.rsk.co"],
    blockExplorerUrls: ["https://explorer.rsk.co/"],
  },
  [ChainIds.RSKTESTNET]: {
    chainId: +`0x${ChainIds.RSKTESTNET.toString(16)}`,
    chainName: "RSK Testnet",
    nativeCurrency: {
      name: "tRBTC",
      symbol: "tRBTC",
      decimals: 18,
    },
    rpcUrls: ["https://public-node.testnet.rsk.co"],
    blockExplorerUrls: ["https://explorer.testnet.rsk.co/"],
  },
  [ChainIds.BSCTESTNET]: {
    chainId: +`0x${ChainIds.BSCTESTNET.toString(16)}`,
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
  },
  // [ChainIds.ARBITRUM]: {
  //   chainId: +`0x${ChainIds.ARBITRUM.toString(16)}`,
  //   chainName: "Arbitrum",
  //   nativeCurrency: {
  //     name: "ETH",
  //     symbol: "ETH",
  //     decimals: 18,
  //   },
  //   rpcUrls: ["https://arb1.arbitrum.io/rpc"],
  //   blockExplorerUrls: ["https://arbiscan.io/"],
  // },
  [ChainIds.LINEAGOERLI]: {
    chainId: +`0x${ChainIds.LINEAGOERLI.toString(16)}`,
    chainName: chainNames[ChainIds.LINEAGOERLI],
    nativeCurrency: {
      name: chainCurrencies[ChainIds.LINEAGOERLI],
      symbol: chainCurrencies[ChainIds.LINEAGOERLI],
      decimals: 18,
    },
    rpcUrls: [apiUrls[ChainIds.LINEAGOERLI]],
    blockExplorerUrls: [explorerUrls[ChainIds.LINEAGOERLI]],
  },
};
