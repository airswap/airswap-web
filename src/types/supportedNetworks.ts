export type SupportedNetworks = {
  [key: string]: {
    icon: string;
    chainId: number;
  };
};

export type NetworkChains = {
  [key: string]: string;
};

export type ChainParams = {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: [string];
  blockExplorerUrls: [string];
};
