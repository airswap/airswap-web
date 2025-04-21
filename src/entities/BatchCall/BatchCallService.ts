import { BatchCall } from "@airswap/libraries";

import { ethers } from "ethers";

import { getTokenIdentifier } from "../AppTokenInfo/AppTokenInfoHelpers";

export const getOwnedNftsOfWallet = async (
  walletAddress: string,
  tokenAddress: string,
  tokenIds: string[],
  provider: ethers.providers.Web3Provider
): Promise<Record<string, number>> => {
  try {
    const contract = BatchCall.getContract(provider, provider.network.chainId);
    const tokenAddresses = tokenIds.map(() => tokenAddress);

    const erc721: string[] = await contract.walletBalancesERC721(
      walletAddress,
      tokenAddresses,
      tokenIds
    );
    const erc1155: string[] = await contract.walletBalancesERC1155(
      walletAddress,
      tokenAddresses,
      tokenIds
    );

    const ownedNfts = tokenIds.reduce((acc, tokenId, index) => {
      const amount = Number(erc721[index]) || Number(erc1155[index]) || 0;

      const tokenIdentifier = getTokenIdentifier(tokenAddress, tokenId);

      return { ...acc, [tokenIdentifier]: amount };
    }, {});

    return ownedNfts;
  } catch (error) {
    console.error(error);

    return {};
  }
};
