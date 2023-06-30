import { ADDRESS_ZERO } from "@airswap/constants";
import { WETH } from "@airswap/libraries";
import { TokenInfo } from "@airswap/types";

import { BigNumber } from "bignumber.js";
import { Contract, providers, BigNumber as EthersBigNumber } from "ethers";

import getWethAddress from "../../helpers/getWethAddress";
import uniswapFactoryAbi from "../../uniswap/abis/factory.json";
import uniswapPairAbi from "../../uniswap/abis/pair.json";
import uniswapDeploys from "../../uniswap/deployments";

export const gasUsedPerSwap = 185555;

type EthGasWatchApiResponse = {
  fast: number;
};

const getFastGasPrice: () => Promise<BigNumber | null> = async () => {
  const url = "https://ethgasstation.info/api/ethgasAPI.json";
  try {
    const response = await fetch(url);
    const data: EthGasWatchApiResponse = await response.json();
    return new BigNumber(data.fast).dividedBy(10 ** 10);
  } catch (e: any) {
    console.error("Error getting gas price from ethgas.watch API: ", e.message);
    return null;
  }
};

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

export { getFastGasPrice, getPriceOfTokenInWethFromUniswap };
