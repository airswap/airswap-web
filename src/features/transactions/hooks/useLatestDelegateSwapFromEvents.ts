import { useEffect, useState } from "react";

import { Delegate } from "@airswap/libraries";
import { useWeb3React } from "@web3-react/core";

import BigNumber from "bignumber.js";
import { Event } from "ethers";

import { DelegatedSwapEvent } from "../../../entities/DelegateRule/DelegateRule";
import { getDelegateContract } from "../../../entities/DelegateRule/DelegateRuleHelpers";
import { transformToDelegatedSwapEvent } from "../../../entities/DelegateRule/DelegateRuleTransformers";
import { compareAddresses } from "../../../helpers/string";
import useDebounce from "../../../hooks/useDebounce";
import useNetworkSupported from "../../../hooks/useNetworkSupported";

const useLatestDelegatedSwapFromEvents = (
  chainId?: number,
  account?: string | null
): DelegatedSwapEvent | undefined => {
  const { provider } = useWeb3React();
  const isNetworkSupported = useNetworkSupported();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();
  const [latestDelegatedSwap, setLatestDelegatedSwap] =
    useState<DelegatedSwapEvent>();
  const [debouncedLatestDelegatedSwap, setDebouncedLatestDelegatedSwap] =
    useState<DelegatedSwapEvent>();

  useDebounce(
    () => {
      setDebouncedLatestDelegatedSwap(latestDelegatedSwap);
    },
    1000,
    [latestDelegatedSwap]
  );

  useEffect(() => {
    if (!chainId || !account || !provider || !isNetworkSupported) return;

    if (account === accountState && chainId === chainIdState) return;

    const delegateContract = getDelegateContract(provider.getSigner(), chainId);

    // TODO: #1047, remove this once we have a contract for all chains
    if (!delegateContract) {
      return;
    }

    const eventName: DelegatedSwapEvent["name"] = "DelegatedSwapFor";

    const handleEvent = async (
      senderWallet: string,
      signerWallet: string,
      nonce: BigNumber,
      event: Event
    ) => {
      if (!compareAddresses(signerWallet, account)) {
        return;
      }

      const receipt = await event.getTransactionReceipt();

      setLatestDelegatedSwap(
        transformToDelegatedSwapEvent(
          senderWallet,
          signerWallet,
          nonce.toString(),
          chainId,
          event.transactionHash,
          receipt.status
        )
      );
    };

    delegateContract.on(eventName, handleEvent);

    setAccountState(account);
    setChainIdState(chainId);

    return () => {
      delegateContract.off(eventName, handleEvent);
    };
  }, [chainId, account, provider, isNetworkSupported]);

  return debouncedLatestDelegatedSwap;
};

export default useLatestDelegatedSwapFromEvents;
