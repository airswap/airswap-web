import { CollectionTokenInfo } from "@airswap/utils";

import i18n from "i18next";

import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenId,
  isCollectionTokenInfo,
  isTokenInfo,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { compareAddresses } from "../../../helpers/string";

export const getTokenIdsFromTokenInfo = (
  tokenInfo: AppTokenInfo,
  allTokenInfos: AppTokenInfo[]
): string[] => {
  if (isTokenInfo(tokenInfo)) {
    return [getTokenId(tokenInfo)];
  }

  const { address } = tokenInfo;

  const collectionTokenInfos = allTokenInfos
    .filter(isCollectionTokenInfo)
    .filter((t) => compareAddresses(t.address, address));

  const tokenIds = collectionTokenInfos.map((t) => getTokenId(t));

  return tokenIds;
};

export const getActionButtonText = (
  editMode: boolean,
  selectedNftCollection: CollectionTokenInfo | undefined
) => {
  if (selectedNftCollection) {
    return i18n.t("common.back");
  }

  return editMode ? i18n.t("common.done") : i18n.t("orders.editCustomTokens");
};
