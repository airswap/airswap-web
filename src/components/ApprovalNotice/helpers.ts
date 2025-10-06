import { FullOrder, FullOrderERC20, TokenKinds } from "@airswap/utils";

import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import { getTokenDecimals } from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { DelegateRule } from "../../entities/DelegateRule/DelegateRule";
import { isDelegateRule } from "../../entities/DelegateRule/DelegateRuleHelpers";
import { isFullOrder } from "../../entities/FullOrder/FullOrderHelpers";
import { getFullOrderNonceUsed } from "../../entities/FullOrder/FullOrderService";
import { isFullOrderERC20 } from "../../entities/OrderERC20/OrderERC20Helpers";
import { getOrderErc20NonceUsed } from "../../entities/OrderERC20/OrderERC20Service";
import { compareAddresses } from "../../helpers/string";
import toRoundedAtomicString from "../../helpers/toRoundedAtomicString";
import { AllowancesType } from "../../hooks/useAllowance";

export const getTotalNeededAllowance = (
  orderAmount: string,
  totalTokenAllowance: string,
  tokenInfo: AppTokenInfo | null
) => {
  const tokenDecimals = tokenInfo ? getTokenDecimals(tokenInfo) : 0;
  const tokenAmount =
    tokenInfo && orderAmount && tokenDecimals
      ? toRoundedAtomicString(orderAmount, tokenDecimals)
      : "0";
  const totalNeededAllowance = new BigNumber(totalTokenAllowance || "0")
    .plus(tokenAmount)
    .toString();

  return formatUnits(totalNeededAllowance, tokenDecimals);
};

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

export const getOrderMakerAmount = (
  order: FullOrder | FullOrderERC20 | DelegateRule
): string => {
  if (isFullOrder(order)) {
    return order.signer.kind === TokenKinds.ERC721 ? "1" : order.signer.amount;
  }

  if (isFullOrderERC20(order)) {
    return order.signerAmount;
  }

  return order.senderAmount;
};

export const getOrderMakerToken = (
  order: FullOrder | FullOrderERC20 | DelegateRule
): string => {
  if (isFullOrder(order)) {
    return order.signer.token;
  }

  if (isFullOrderERC20(order)) {
    return order.signerToken;
  }

  return order.senderToken;
};

const filterTokenOrder = async (
  order: FullOrder | FullOrderERC20 | DelegateRule,
  tokenAddress: string,
  allowanceType: AllowancesType,
  provider: ethers.providers.BaseProvider,
  chainId: number,
  tokenId?: string,
  takerTokenAddress?: string
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

  const token = getOrderMakerToken(order);
  const expiry = +order.expiry;

  if (!compareAddresses(token, tokenAddress)) {
    return false;
  }

  // If delegate rule, exclude orders that are for the same pair because they will be overwritten
  if (
    takerTokenAddress &&
    isDelegateRule(order) &&
    compareAddresses(order.signerToken, takerTokenAddress)
  ) {
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
  protocolFee: number,
  tokenId?: string,
  takerTokenAddress?: string
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
        tokenId,
        takerTokenAddress
      ),
    }))
  );

  const tokenOrders = filterResults
    .filter((result) => result.shouldInclude)
    .map((result) => result.order);

  return tokenOrders.reduce((acc, order) => {
    const signerAmount = getOrderMakerAmount(order);
    const signerAmountPlusFee = new BigNumber(signerAmount)
      .multipliedBy(1 + protocolFee / 10000)
      .toString();
    const shouldPayProtocolFee = isFullOrderERC20(order);

    return new BigNumber(acc)
      .plus(shouldPayProtocolFee ? signerAmountPlusFee : signerAmount)
      .toString();
  }, "0");
};
