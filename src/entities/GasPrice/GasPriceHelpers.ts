import {
  GasPriceDefisaverResource,
  GasPriceEtherscanResource,
} from "./GasPrice";

export const isGasPriceDefisaverResource = (
  resource: any
): resource is GasPriceDefisaverResource =>
  typeof resource === "object" &&
  resource !== null &&
  "fast" in resource &&
  "regular" in resource &&
  "cheap" in resource;

export const isGasPriceEtherscanResource = (
  resource: any
): resource is GasPriceEtherscanResource =>
  typeof resource === "object" &&
  resource !== null &&
  "LastBlock" in resource &&
  "SafeGasPrice" in resource &&
  "ProposeGasPrice" in resource &&
  "FastGasPrice" in resource &&
  "UsdPrice" in resource;
