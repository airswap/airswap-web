import { useEffect, useState } from "react";

import { ADDRESS_ZERO, FullOrder, FullOrderERC20 } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../../../app/hooks";
import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenId,
  splitTokenIdentifier,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { DelegateRule } from "../../../entities/DelegateRule/DelegateRule";
import { selectProtocolFee } from "../../../features/metadata/metadataSlice";
import { selectMyOtcOrdersReducer } from "../../../features/myOtcOrders/myOtcOrdersSlice";
import { AllowancesType } from "../../../hooks/useAllowance";
import useNativeWrappedToken from "../../../hooks/useNativeWrappedToken";
import { getTotalTokenAllowanceFromOrders } from "../helpers";

export const useTotalTokenAllowanceFromOrders = (
  spenderAddressType: AllowancesType,
  tokenInfo: AppTokenInfo | null,
  takerTokenInfo?: AppTokenInfo | null,
  chainId?: number
): [string | undefined, boolean] => {
  const { provider } = useWeb3React();
  const { userOrders } = useAppSelector(selectMyOtcOrdersReducer);
  const { delegateRules } = useAppSelector((state) => state.delegateRules);
  const protocolFee = useAppSelector(selectProtocolFee);
  const wrappedNativeToken = useNativeWrappedToken(chainId);

  const [isLoading, setIsLoading] = useState(false);
  const [totalTokenAllowance, setTotalTokenAllowance] = useState<string>();

  const orders = (
    spenderAddressType === "delegate" ? delegateRules : userOrders
  ) as (FullOrder | FullOrderERC20 | DelegateRule)[];

  useEffect(() => {
    const fetchTotalTokenAllowance = async () => {
      if (!tokenInfo || !provider || !wrappedNativeToken || !chainId) {
        return;
      }

      const justifiedTokenAddress =
        tokenInfo.address === ADDRESS_ZERO
          ? wrappedNativeToken.address
          : tokenInfo.address;
      const justifiedTakerTokenAddress =
        takerTokenInfo?.address === ADDRESS_ZERO
          ? wrappedNativeToken.address
          : takerTokenInfo?.address;
      const tokenId = splitTokenIdentifier(getTokenId(tokenInfo)).id;

      setIsLoading(true);

      try {
        const newTotalTokenAllowance = await getTotalTokenAllowanceFromOrders(
          orders,
          justifiedTokenAddress,
          spenderAddressType,
          provider,
          chainId,
          protocolFee,
          tokenId,
          justifiedTakerTokenAddress
        );
        setTotalTokenAllowance(newTotalTokenAllowance);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalTokenAllowance();
  }, [orders, tokenInfo, spenderAddressType, chainId]);

  return [totalTokenAllowance, isLoading];
};
