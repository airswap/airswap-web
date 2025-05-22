import { FullOrder, FullOrderERC20, TokenKinds } from "@airswap/utils";

import BigNumber from "bignumber.js";
import { ethers } from "ethers";

import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import { DelegateRule } from "../../entities/DelegateRule/DelegateRule";
import { isDelegateRule } from "../../entities/DelegateRule/DelegateRuleHelpers";
import { isFullOrder } from "../../entities/FullOrder/FullOrderHelpers";
import { getFullOrderNonceUsed } from "../../entities/FullOrder/FullOrderService";
import { isFullOrderERC20 } from "../../entities/OrderERC20/OrderERC20Helpers";
import { getOrderErc20NonceUsed } from "../../entities/OrderERC20/OrderERC20Service";
import { compareAddresses } from "../../helpers/string";
import { AllowancesType } from "../../hooks/useAllowance";

const filterTokenByType = (
  order: FullOrder | FullOrderERC20 | DelegateRule,
  allowanceType?: AllowancesType
): boolean => {
  if (allowanceType === "swap" && isFullOrder(order)) {
    return true;
  }

  if (allowanceType === "swapERC20" && isFullOrderERC20(order)) {
    return true;
  }

  if (allowanceType === "delegate" && isDelegateRule(order)) {
    return true;
  }

  return false;
};

export const getOrderNonceUsed = async (
  order: FullOrder | FullOrderERC20 | DelegateRule,
  provider: ethers.providers.BaseProvider
): Promise<boolean> => {
  if (isFullOrder(order)) {
    return getFullOrderNonceUsed(order, provider);
  }

  if (isFullOrderERC20(order)) {
    return getOrderErc20NonceUsed(order, provider);
  }

  return order.senderFilledAmount === order.senderAmount;
};

export const getOrderSignerAmount = (
  order: FullOrder | FullOrderERC20 | DelegateRule
): string => {
  if (isFullOrder(order)) {
    return order.signer.kind === TokenKinds.ERC721 ? "1" : order.signer.amount;
  }

  return order.signerAmount;
};

const filterTokenOrder = async (
  order: FullOrder | FullOrderERC20 | DelegateRule,
  tokenAddress: string,
  allowanceType: AllowancesType,
  provider: ethers.providers.BaseProvider,
  chainId: number,
  tokenId?: string
): Promise<boolean> => {
  const now = Math.floor(new Date().getTime() / 1000);

  if (order.chainId !== chainId) {
    return false;
  }

  if (
    isFullOrder(order) &&
    order.signer.kind !== TokenKinds.ERC20 &&
    order.signer.id !== tokenId
  ) {
    return false;
  }

  if (!filterTokenByType(order, allowanceType)) {
    return false;
  }

  const token = isFullOrder(order) ? order.signer.token : order.signerToken;
  const expiry = +order.expiry;

  if (!compareAddresses(token, tokenAddress)) {
    return false;
  }

  if (expiry < now) {
    return false;
  }

  try {
    const nonceUsed = await getOrderNonceUsed(order, provider);
    return !nonceUsed;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getTotalTokenAllowanceFromOrders = async (
  orders: (FullOrder | FullOrderERC20 | DelegateRule)[],
  tokenAddress: string,
  allowanceType: AllowancesType,
  provider: ethers.providers.BaseProvider,
  chainId: number,
  tokenId?: string
): Promise<string> => {
  if (!tokenAddress) {
    return "0";
  }

  const filterResults = await Promise.all(
    orders.map(async (order) => ({
      order,
      shouldInclude: await filterTokenOrder(
        order,
        tokenAddress,
        allowanceType,
        provider,
        chainId,
        tokenId
      ),
    }))
  );

  const tokenOrders = filterResults
    .filter((result) => result.shouldInclude)
    .map((result) => result.order);

  return tokenOrders.reduce((acc, order) => {
    const signerAmount = getOrderSignerAmount(order);

    return new BigNumber(acc).plus(signerAmount).toString();
  }, "0");
};
