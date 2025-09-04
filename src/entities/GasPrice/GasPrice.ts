// https://app.defisaver.com/api/gas-price/current
export interface GasPriceDefisaverResource {
  fast: number;
  regular: number;
  cheap: number;
}

export interface GasPriceEtherscanResource {
  LastBlock: string;
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
  UsdPrice: string;
}
