import { ChainIds } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

import {
  isGasPriceDefisaverResource,
  isGasPriceEtherscanResource,
} from "./GasPriceHelpers";

const safeFallbackGasPrice = new BigNumber(0.004).dividedBy(10 ** 10);

export const geDefisaverGasPriceApiCall = async (): Promise<BigNumber> => {
  try {
    const url = "https://app.defisaver.com/api/gas-price/current";
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !isGasPriceDefisaverResource(data)) {
      console.error("[getMainnetGasPrice] Error in response", response);

      return safeFallbackGasPrice;
    }

    return new BigNumber(data.fast).dividedBy(10 ** 10);
  } catch (e: any) {
    console.error(
      "[geDefisaverGasPriceApiCall] Error getting gas price from ethgas.watch API: ",
      e.message
    );

    return safeFallbackGasPrice;
  }
};

export const getEtherscanGasPriceApiCall = async (
  _chainId: number
): Promise<BigNumber> => {
  try {
    // Etherscan does not have Sepolia available, using BNB Chain as alternative.
    const chainId = _chainId === ChainIds.SEPOLIA ? 56 : _chainId;
    const url = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=gastracker&action=gasoracle&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const result = data.result;

    if (!response.ok || !isGasPriceEtherscanResource(result)) {
      console.error(
        "[getEtherscanGasPriceApiCall] Error in response",
        response
      );

      return safeFallbackGasPrice;
    }

    return new BigNumber(result.FastGasPrice).dividedBy(10 ** 10);
  } catch (e: any) {
    console.error(
      "[getEtherscanGasPriceApiCall] Error getting gas price from ethgas.watch API: ",
      e.message
    );

    return safeFallbackGasPrice;
  }
};
