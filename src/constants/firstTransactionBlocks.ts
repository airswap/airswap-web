import { ChainIds } from "@airswap/constants";

interface V3ContractsDeploymentBlock {
  SwapERC20: Record<ChainIds, number>;
  Wrapper: Record<ChainIds, number>;
  Registry: Record<ChainIds, number>;
}

export const firstTransactionBlocks: V3ContractsDeploymentBlock = {
  SwapERC20: {
    [ChainIds.MAINNET]: 16776806,
    [ChainIds.GOERLI]: 8613798, //
    [ChainIds.RSK]: 5113768,
    [ChainIds.RSKTESTNET]: 3642941,
    [ChainIds.BSC]: 26260582,
    [ChainIds.BSCTESTNET]: 27862913,
    [ChainIds.POLYGON]: 40074273,
    [ChainIds.ARBITRUM]: 67890619,
    [ChainIds.FUJI]: 19641038,
    [ChainIds.AVALANCHE]: 27131744,
    [ChainIds.LINEAGOERLI]: 464512,
    [ChainIds.MUMBAI]: 32858133,
    [ChainIds.ARBITRUMGOERLI]: 10431281,
    [ChainIds.HARDHAT]: 0,
  },
  Wrapper: {
    [ChainIds.MAINNET]: 16776818,
    [ChainIds.GOERLI]: 8613803,
    [ChainIds.RSK]: 5113775,
    [ChainIds.RSKTESTNET]: 3642943,
    [ChainIds.BSC]: 26260601,
    [ChainIds.BSCTESTNET]: 27862925,
    [ChainIds.POLYGON]: 40074292,
    [ChainIds.ARBITRUM]: 67890744,
    [ChainIds.FUJI]: 19641085,
    [ChainIds.AVALANCHE]: 27131759,
    [ChainIds.LINEAGOERLI]: 705640,
    [ChainIds.MUMBAI]: 32858158,
    [ChainIds.ARBITRUMGOERLI]: 10431377,
    [ChainIds.HARDHAT]: 0,
  },
  Registry: {
    [ChainIds.MAINNET]: 12782029,
    [ChainIds.GOERLI]: 6537104,
    [ChainIds.RSK]: 5018400,
    [ChainIds.RSKTESTNET]: 3424107,
    [ChainIds.BSC]: 15963896,
    [ChainIds.BSCTESTNET]: 17263882,
    [ChainIds.POLYGON]: 26036024,
    [ChainIds.ARBITRUM]: 43864138,
    [ChainIds.FUJI]: 6864382,
    [ChainIds.AVALANCHE]: 11969746,
    [ChainIds.LINEAGOERLI]: 992371,
    [ChainIds.MUMBAI]: 25550814,
    [ChainIds.ARBITRUMGOERLI]: 2333984,
    [ChainIds.HARDHAT]: 0,
  },
};
