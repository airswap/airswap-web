type SupportedNetworks = {
  [key: string]: {
    icon: string;
    chainId: number;
  };
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
