import { Registry } from "@airswap/libraries";
import { ProtocolIds } from "@airswap/utils";

import { providers, Contract } from "ethers";

import { getUniqueSingleDimensionArray } from "../../helpers/array";

const getStakersForProtocol = async (
  registryContract: Contract,
  protocolId: ProtocolIds
): Promise<string[]> => {
  const [stakers]: [string[], string[]] =
    await registryContract.functions.getStakersForProtocol(protocolId);

  return stakers;
};

const getTokensForStaker = async (
  registryContract: Contract,
  staker: string
): Promise<string[]> => {
  const [tokens]: [string[], string[]] =
    await registryContract.functions.getTokensForStaker(staker);

  return tokens;
};

async function getStakerTokens(
  chainId: number,
  provider: providers.Provider
): Promise<Record<string, string[]>> {
  const registryContract = Registry.getContract(provider, chainId);

  const [rfqStakers, lastLookStakers] = await Promise.all([
    getStakersForProtocol(registryContract, ProtocolIds.RequestForQuoteERC20),
    getStakersForProtocol(registryContract, ProtocolIds.LastLookERC20),
  ]);

  const stakers = [...rfqStakers, ...lastLookStakers].filter(
    getUniqueSingleDimensionArray
  );

  const tokensForStakers = await Promise.all(
    stakers.map((staker) => getTokensForStaker(registryContract, staker))
  );

  return stakers.reduce((acc, staker, index) => {
    const stakerTokens = tokensForStakers[index].map((t) => t.toLowerCase());
    const address = staker.toLowerCase();

    return { ...acc, [address]: stakerTokens };
  }, {});
}

export { getStakerTokens };
