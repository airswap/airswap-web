import { TokenInfo, ADDRESS_ZERO, ChainIds } from "@airswap/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { BigNumber } from "bignumber.js";
import { Contract, providers, BigNumber as EthersBigNumber } from "ethers";

import {
  GasPriceEndpoint,
  GasPriceEndpointType,
} from "../../entities/GasPrice/GasPrice";
import { getGasPriceApiCall } from "../../entities/GasPrice/GasPriceService";
import getWethAddress from "../../helpers/getWethAddress";
import uniswapFactoryAbi from "../../uniswap/abis/factory.json";
import uniswapPairAbi from "../../uniswap/abis/pair.json";
import uniswapDeploys from "../../uniswap/deployments";

export const gasUsedPerSwap = 185555;

const endpoints: Partial<Record<ChainIds, GasPriceEndpoint>> = {
  [ChainIds.MAINNET]: {
    type: GasPriceEndpointType.defisaver,
    url: "https://app.defisaver.com/api/gas-price/current",
  },
  [ChainIds.SEPOLIA]: {
    type: GasPriceEndpointType.beaconCha,
    url: "https://sepolia.beaconcha.in/api/v1/execution/gasnow",
  },
};

interface GetGasPriceResponse {
  gasPrice: string;
  swapTransactionCost: string;
}

export const getGasPrice = createAsyncThunk<
  GetGasPriceResponse,
  { chainId: ChainIds }
>("gasPrice/getGasPrice", async ({ chainId }) => {
  const endpoint = endpoints[chainId];

  if (!endpoint) {
    return {
      gasPrice: "0",
      swapTransactionCost: "0",
    };
  }

  const gasPrice = await getGasPriceApiCall(endpoint.url, endpoint.type);
  const swapTransactionCost = new BigNumber(gasPrice).multipliedBy(
    gasUsedPerSwap
  );

  console.log(swapTransactionCost.toString());

  return {
    gasPrice: gasPrice.toString(),
    swapTransactionCost: swapTransactionCost.toString(),
  };
});

const getPriceOfTokenInWethFromUniswap: (
  tokenInfo: TokenInfo,
  provider: providers.Provider,
  chainId: number
) => Promise<BigNumber> = async (tokenInfo, provider, chainId) => {
  const tokenAddress = tokenInfo.address;
  const wethAddress = getWethAddress(chainId);
  if (tokenAddress === wethAddress || tokenAddress === ADDRESS_ZERO)
    return new BigNumber(1);

  // Get factory so we can find the token <> weth pair pool.
  const FactoryContract = new Contract(
    uniswapDeploys.factory,
    uniswapFactoryAbi,
    provider
  );
  const pairAddress = await FactoryContract.getPair(tokenAddress, wethAddress);
  const pairContract = new Contract(pairAddress, uniswapPairAbi, provider);

  // Need to know which token (0 or 1) is WETH, plus how much of each token is
  // in the pool.
  const promises = [pairContract.token0(), pairContract.getReserves()];
  const result = await Promise.all(promises);
  const typedResult = result as [string, [EthersBigNumber, EthersBigNumber]];
  const [token0Address, [reserve0, reserve1]] = typedResult;

  let wethUnits: BigNumber, tokenUnits: BigNumber;

  if (token0Address.toLowerCase() === wethAddress) {
    wethUnits = new BigNumber(reserve0.toString()).dividedBy(10 ** 18);
    tokenUnits = new BigNumber(reserve1.toString()).dividedBy(
      10 ** tokenInfo.decimals
    );
  } else {
    tokenUnits = new BigNumber(reserve0.toString()).dividedBy(
      10 ** tokenInfo.decimals
    );
    wethUnits = new BigNumber(reserve1.toString()).dividedBy(10 ** 18);
  }

  // UniSwap has approximately equal value of each token in the pool.
  return wethUnits.dividedBy(tokenUnits);
};

export { getPriceOfTokenInWethFromUniswap };
