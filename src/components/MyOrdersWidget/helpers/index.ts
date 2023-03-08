import { FullOrderERC20, TokenInfo } from "@airswap/types";

import { BigNumber } from "bignumber.js";
import i18n from "i18next";

import { OrdersSortType } from "../../../features/myOrders/myOrdersSlice";
import findEthOrTokenByAddress from "../../../helpers/findEthOrTokenByAddress";
import { OrderStatus } from "../../../types/orderStatus";

export const getTokenAmountWithDecimals = (
  amount: string,
  decimals: number = 18
): BigNumber => {
  return new BigNumber(amount).div(10 ** decimals);
};

const sortTokensBySymbol = (
  a: string,
  b: string,
  tokens: TokenInfo[],
  chainId: number
) => {
  const token1 = findEthOrTokenByAddress(a, tokens, chainId);
  const token2 = findEthOrTokenByAddress(b, tokens, chainId);

  if (!token1! || !token2) {
    return 0;
  }

  return token1.symbol.toLocaleLowerCase() < token2.symbol.toLocaleLowerCase()
    ? -1
    : 1;
};

export const getSortedOrders = (
  orders: FullOrderERC20[],
  sortType: OrdersSortType,
  tokens: TokenInfo[],
  chainId: number,
  isReverse: boolean
) => {
  const array = [...orders];

  if (sortType === "senderToken") {
    array.sort((a, b) =>
      sortTokensBySymbol(a.senderToken, b.senderToken, tokens, chainId)
    );
  }

  if (sortType === "signerToken") {
    array.sort((a, b) =>
      sortTokensBySymbol(a.signerToken, b.signerToken, tokens, chainId)
    );
  }

  // TODO: sort on order canceled or not
  if (sortType === "active" || sortType === "expiry") {
    array.sort((a, b) => {
      return parseInt(b.expiry) - parseInt(a.expiry);
    });
  }

  if (isReverse) {
    array.reverse();
  }

  return array;
};

export const getOrderStatusTranslation = (status: OrderStatus): string => {
  if (status === OrderStatus.canceled) {
    return i18n.t("common.canceled");
  }

  if (status === OrderStatus.taken) {
    return i18n.t("common.taken");
  }

  if (status === OrderStatus.expired) {
    return i18n.t("common.expired");
  }

  return i18n.t("common.active");
};
