type SupportedNetworks = {
  [key: string]: {
    icon: string;
    chainId: number;
  };
};

type NetworkChains = {
  [key: string]: string;
};
/**
 * @remarks dictionary contains supported networks and icons
 */
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
