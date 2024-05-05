import {
  GasPriceBeaconChaResource,
  GasPriceDefisaverResource,
} from "./GasPrice";

export const isGasPriceDefisaverResource = (
  resource: any
): resource is GasPriceDefisaverResource =>
  typeof resource === "object" &&
  resource !== null &&
  "fast" in resource &&
  "regular" in resource &&
  "cheap" in resource;

export const isGasPriceBeaconChaResource = (
  resource: any
): resource is GasPriceBeaconChaResource =>
  typeof resource === "object" &&
  resource !== null &&
  "code" in resource &&
  "data" in resource &&
  "rapid" in resource.data &&
  "fast" in resource.data &&
  "standard" in resource.data &&
  "slow" in resource.data &&
  "timestamp" in resource.data;
