import { WETH } from "@airswap/libraries";

const getWethAddress = (chainId: number): string => {
  return WETH.getAddress(chainId).toLowerCase();
};

export default getWethAddress;
