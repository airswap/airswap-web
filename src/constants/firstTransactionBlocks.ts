import { ChainIds } from "@airswap/constants";

interface V3ContractsDeploymentBlock {
  SwapERC20: Record<ChainIds, number>;
  Wrapper: Record<ChainIds, number>;
  Registry: Record<ChainIds, number>;
}

export const firstTransactionBlocks: V3ContractsDeploymentBlock = {
  SwapERC20: {
    [ChainIds.MAINNET]: 16776806,
    // etc..
    5: 8613798, // Goerli testnet
    30: 5113768, // RSK mainnet
    31: 3642941, // RSK testnet
    56: 26260582, // BSC mainnet
    97: 27862913, // BSC testnet
    137: 40074273, // Polygon mainnet
    42161: 67890619, // Arbitrum One mainnet
    43113: 19641038, // Avalanche Fuji testnet
    43114: 27131744, // Avalanche mainnet C-Chain
    59140: 464512, // Linea-goerli
    80001: 32858133, // Polygon Mumbai testnet
    421613: 10431281, // Arbitrum goerli testnet
    31337: 0 // Hardhat
  },
  Wrapper: {
    1: 16776818,
    5: 8613803,
    30: 5113775,
    31: 3642943,
    56: 26260601,
    97: 27862925,
    137: 40074292,
    42161: 67890744,
    43113: 19641085,
    43114: 27131759,
    59140: 705640,
    80001: 32858158,
    421613: 10431377,
    31337: 0
  },
  Registry: {
    1: 12782029,
    5: 6537104,
    30: 5018400,
    31: 3424107,
    56: 15963896,
    97: 17263882,
    137: 26036024,
    42161: 43864138,
    43113: 6864382,
    43114: 11969746,
    59140: 992371,
    80001: 25550814,
    421613: 2333984,
    31337: 0
  },
};
