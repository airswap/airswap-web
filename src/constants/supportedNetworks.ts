import {
  ChainParams,
  NetworkChains,
  SupportedNetworks,
} from "../types/supportedNetworks";

export const SUPPORTED_NETWORKS: SupportedNetworks = {
  Ethereum: {
    icon: "images/ethereum-logo.png",
    chainId: 1,
  },
  Avalanche: {
    icon: "images/avalanche-logo.png",
    chainId: 43114,
  },
  "BNB Chain": {
    icon: "images/bnb-logo.png",
    chainId: 56,
  },
  Polygon: {
    icon: "images/matic-logo.png",
    chainId: 137,
  },
};

export const NETWORK_CHAINS: NetworkChains = {
  "1": "Ethereum",
  "43114": "Avalanche",
  "56": "BNB Chain",
  "137": "Polygon",
  "5": "Goerli",
};

export const CHAIN_PARAMS: { [key: string]: ChainParams } = {
  Avalanche: {
    chainId: "0xa86a",
    chainName: "Avalanche",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
  },
  "BNB Chain": {
    chainId: "0x38",
    chainName: "BNB Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
  },
  Polygon: {
    chainId: "0x89",
    chainName: "Polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
};
