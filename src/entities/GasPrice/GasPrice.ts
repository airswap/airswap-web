// https://app.defisaver.com/api/gas-price/current
export interface GasPriceDefisaverResource {
  fast: number;
  regular: number;
  cheap: number;
}

// https://sepolia.beaconcha.in/api/v1/execution/gasnow
export interface GasPriceBeaconChaResource {
  code: number;
  data: {
    rapid: number;
    fast: number;
    standard: number;
    slow: number;
    timestamp: number;
    price: number;
    priceUSD: number;
  };
}

export enum GasPriceEndpointType {
  beaconCha = "beaconCha",
  defisaver = "defisaver",
}

export interface GasPriceEndpoint {
  type: GasPriceEndpointType;
  url: string;
}
