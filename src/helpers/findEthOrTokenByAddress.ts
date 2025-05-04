import { ADDRESS_ZERO } from "@airswap/utils";

import nativeCurrency from "../constants/nativeCurrency";
import { AppTokenInfo } from "../entities/AppTokenInfo/AppTokenInfo";
import { isCollectionTokenInfo } from "../entities/AppTokenInfo/AppTokenInfoHelpers";
import { compareAddresses } from "./string";

export default function findEthOrTokenByAddress(
  tokenAddress: string,
  activeTokens: AppTokenInfo[],
  chainId: number,
  tokenId?: string
): AppTokenInfo | null {
  if (tokenAddress === ADDRESS_ZERO) {
    return nativeCurrency[chainId] as AppTokenInfo;
  }

  return activeTokens.find((token) => {
    if (isCollectionTokenInfo(token)) {
      return (
        compareAddresses(token.address, tokenAddress) && token.id === tokenId
      );
    }

    return compareAddresses(token.address, tokenAddress);
  }) as AppTokenInfo;
}
