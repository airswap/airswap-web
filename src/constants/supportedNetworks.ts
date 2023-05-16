type Networks = "Ethereum" | "Avalanche" | "BNB Chain" | "Polygon";

/**
 * @remarks dictionary contains supported networks and icons
 */
export const SUPPORTED_NETWORKS: { [Key in Networks]: string } = {
  Ethereum: "public/images/ethereum-logo.png",
  Avalanche: "public/images/avalanche-logo.png",
  "BNB Chain": "public/images/bnb-logo.png",
  Polygon: "public/images/matic-logo.png",
};
