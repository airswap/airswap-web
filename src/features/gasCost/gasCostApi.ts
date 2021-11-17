import { wethAddresses } from "@airswap/constants";
import { TokenInfo } from "@airswap/types";

import { BigNumber } from "bignumber.js";
import { Contract, providers, BigNumber as EthersBigNumber } from "ethers";

import uniswapFactoryAbi from "../../uniswap/abis/factory.json";
import uniswapPairAbi from "../../uniswap/abis/pair.json";
import uniswapDeploys from "../../uniswap/deployments";

const apiKey = process.env.REACT_APP_DEFIPULSE_API_KEY;
const apiUrl = "https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json";

export const gasUsedPerSwap = 185555;

type GasApiResponse = {
  fast: number;
  fastest: number;
  safeLow: number;
  average: number;
  block_time: number;
  blockNum: number;
  speed: number;
  safeLowWait: number;
  avgWait: number;
  fastWait: number;
  fastestWait: number;
  gasPriceRange: Record<number, number>;
};

const getFastGasPrice: () => Promise<BigNumber | null> = async () => {
  const urlWithKey = `${apiUrl}?api-key=${apiKey}`;
  try {
    const response = await fetch(urlWithKey);
    const data: GasApiResponse = await response.json();
    // Note that the value returned is in 10ths of a gwei, hence divide by 10^10
    return new BigNumber(data.fastest).dividedBy(10 ** 10);
  } catch (e) {
    console.error("Error getting gas price from API: ", e);
    return null;
  }
};

const getPriceOfTokenInWethFromUniswap: (
  tokenInfo: TokenInfo,
  provider: providers.Provider,
  chainId: number
) => Promise<BigNumber> = async (tokenInfo, provider, chainId) => {
  const tokenAddress = tokenInfo.address;
  const wethAddress = wethAddresses[String(chainId)];
  if (tokenAddress === wethAddress) return new BigNumber(1);

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
