import { useEffect, useState } from "react";

import { ADDRESS_ZERO } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import { AppTokenInfo } from "../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenId,
  getTokenIdentifier,
  isCollectionTokenInfo,
} from "../entities/AppTokenInfo/AppTokenInfoHelpers";
import { selectAllowances } from "../features/balances/balancesSlice";
import { selectAllTokenInfo } from "../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";
import getWethAddress from "../helpers/getWethAddress";

/**
 * Hook to get the allowance of a token.
 * @param token - The token to get the allowance of.
 * @param amount - The amount of the token to get the allowance of.
 * @param options - The options to get the allowance of.
 * @param options.wrapNativeToken - Whether to wrap the native token.
 * @param options.spenderAddressType - The type of spender address to get the allowance of.
 * @returns An object with the allowance, whether it has sufficient allowance, and the readable allowance.
 */

export type AllowancesType = "swap" | "swapERC20" | "delegate";

const useAllowance = (
  token: AppTokenInfo | null,
  amount?: string,
  options?: {
    spenderAddressType?: AllowancesType;
    wrapNativeToken?: boolean;
  }
): {
  hasSufficientAllowance: boolean;
  allowance: string;
  readableAllowance: string;
} => {
  const spenderAddressType = options?.spenderAddressType || "swap";
  const wrapNativeToken = options?.wrapNativeToken || true;
  const { chainId } = useAppSelector((state) => state.web3);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const allowances = useAppSelector(selectAllowances);

  const [hasSufficientAllowance, setHasSufficientAllowance] = useState(false);
  const [allowance, setAllowance] = useState("0");
  const [readableAllowance, setReadableAllowance] = useState("0");

  const reset = () => {
    setHasSufficientAllowance(false);
    setAllowance("0");
    setReadableAllowance("0");
  };

  useEffect(() => {
    if (!token || !amount || !chainId) {
      reset();

      return;
    }

    // ETH can't have allowance because it's not a token. So we default to WETH when wrapNativeToken is true.

    if (token.address === ADDRESS_ZERO && !wrapNativeToken) {
      setHasSufficientAllowance(true);
      setAllowance("0");
      setReadableAllowance("0");

      return;
    }

    const justifiedAddress =
      token.address === ADDRESS_ZERO ? getWethAddress(chainId) : token.address;
    const justifiedToken = findEthOrTokenByAddress(
      justifiedAddress,
      allTokens,
      chainId,
      isCollectionTokenInfo(token) ? token.id : undefined
    );

    if (!justifiedToken) {
      reset();

      return;
    }

    const tokenAddress = getTokenId(justifiedToken);

    const { values } = allowances[spenderAddressType];
    const tokenAllowance = values[tokenAddress];

    if (!tokenAllowance) {
      // safer to return true here (has allowance) as validator will catch the
      // missing allowance, so the user won't swap, and they won't pay
      // unnecessary gas for an approval they may not need.

      setHasSufficientAllowance(true);
      setAllowance("0");
      setReadableAllowance("0");

      return;
    }

    const decimals = isCollectionTokenInfo(justifiedToken)
      ? 0
      : justifiedToken.decimals;
    const newReadableTokenAllowance = new BigNumber(tokenAllowance)
      .div(10 ** decimals)
      .toString();

    const newHasSufficientAllowance = new BigNumber(tokenAllowance)
      .div(10 ** decimals)
      .gte(amount);

    setHasSufficientAllowance(newHasSufficientAllowance);
    setAllowance(tokenAllowance);
    setReadableAllowance(newReadableTokenAllowance);
  }, [allowances, amount, token, allTokens, chainId]);

  return {
    hasSufficientAllowance,
    allowance,
    readableAllowance,
  };
};

export default useAllowance;
