import { findTokenByAddress } from "@airswap/metadata";
import { FullOrder, TokenInfo } from "@airswap/typescript";
import { decompressFullOrder } from "@airswap/utils";

import { useAppSelector } from "../app/hooks";
import TokenList from "../components/TokenList/TokenList";
import {
  getActiveTokensFromLocalStorage,
  getAllTokens,
} from "../features/metadata/metadataApi";
import {
  selectActiveTokens,
  selectAllTokenInfo,
} from "../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";

const useDecompressOrderFromURL = (compressedOrder: string): FullOrder => {
  const decompressedOrder = decompressFullOrder(compressedOrder);
  return decompressedOrder;
};

export default useDecompressOrderFromURL;
