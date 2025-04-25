import { Swap } from "@airswap/libraries";
import { FullOrder, parseCheckResult } from "@airswap/utils";

import { ContractTransaction, ethers } from "ethers";

import { AppError } from "../../errors/appError";
import { SwapError } from "../../errors/swapError";
import { transformSwapErrorToAppError } from "../../errors/swapError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";

export const isFullOrder = (value: any): value is FullOrder =>
  typeof value === "object" &&
  value !== null &&
  "signer" in value &&
  "sender" in value &&
  "affiliateWallet" in value &&
  "affiliateAmount" in value &&
  "v" in value &&
  "r" in value &&
  "s" in value;

export async function checkFullOrder(
  order: FullOrder,
  senderWallet: string,
  provider: ethers.providers.Web3Provider
): Promise<AppError[]> {
  const { chainId } = provider.network;

  const [count, checkErrors] = await Swap.getContract(
    provider.getSigner(),
    chainId
  ).check(senderWallet, order);
  const errors =
    count && checkErrors
      ? (parseCheckResult([checkErrors]) as SwapError[])
      : [];

  if (errors.length) {
    console.error(errors);
  }

  return errors.map((error) => transformSwapErrorToAppError(error));
}

export async function takeFullOrder(
  order: FullOrder,
  senderWallet: string,
  provider: ethers.providers.Web3Provider
): Promise<ContractTransaction | AppError> {
  try {
    const { chainId } = provider.network;
    const result = await Swap.getContract(provider.getSigner(), chainId).swap(
      senderWallet,
      "0",
      order
    );

    return result;
  } catch (error: any) {
    console.error(error);
    return transformUnknownErrorToAppError(error);
  }
}
