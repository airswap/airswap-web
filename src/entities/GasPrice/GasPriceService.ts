import { BigNumber } from "bignumber.js";

import { GasPriceEndpoint, GasPriceEndpointType } from "./GasPrice";
import {
  isGasPriceBeaconChaResource,
  isGasPriceDefisaverResource,
} from "./GasPriceHelpers";

export const geDefisaverGasPriceApiCall = async (
  url: string
): Promise<BigNumber> => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !isGasPriceDefisaverResource(data)) {
      console.error("[getMainnetGasPrice] Error in response", response);

      return new BigNumber(0);
    }

    return new BigNumber(data.fast).dividedBy(10 ** 10);
  } catch (e: any) {
    console.error(
      "[getMainnetGasPrice] Error getting gas price from ethgas.watch API: ",
      e.message
    );

    return new BigNumber(0);
  }
};

export const getBeaconchaGasPriceApiCall = async (
  url: string
): Promise<BigNumber> => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !isGasPriceBeaconChaResource(data)) {
      console.error("[getBeaconchaGasPrice] Error in response", response);

      return new BigNumber(0);
    }

    return new BigNumber(data.data.fast).dividedBy(10 ** 18);
  } catch (e: any) {
    console.error(
      "[getBeaconchaGasPrice] Error getting gas price from ethgas.watch API: ",
      e.message
    );

    return new BigNumber(0);
  }
};

export const getGasPriceApiCall = async (
  url: string,
  type: GasPriceEndpointType
): Promise<BigNumber> => {
  if (type === GasPriceEndpointType.defisaver) {
    return geDefisaverGasPriceApiCall(url);
  }

  return getBeaconchaGasPriceApiCall(url);
};
