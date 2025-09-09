import { useEffect, useState } from "react";

import { Delegate } from "@airswap/libraries";
import { useWeb3React } from "@web3-react/core";

import { Event } from "ethers";

import { DelegateUnsetRuleEvent } from "../../../entities/DelegateRule/DelegateRule";
import { getDelegateContract } from "../../../entities/DelegateRule/DelegateRuleHelpers";
import { transformToDelegateUnsetRuleEvent } from "../../../entities/DelegateRule/DelegateRuleTransformers";
import { compareAddresses } from "../../../helpers/string";
import useDebounce from "../../../hooks/useDebounce";
import useNetworkSupported from "../../../hooks/useNetworkSupported";

const useLatestUnsetRuleFromEvents = (
  chainId?: number,
  account?: string | null
): DelegateUnsetRuleEvent | undefined => {
  const { provider } = useWeb3React();
  const isNetworkSupported = useNetworkSupported();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();
  const [latestUnsetRule, setLatestUnsetRule] =
    useState<DelegateUnsetRuleEvent>();
  const [debouncedLatestUnsetRule, setDebouncedLatestUnsetRule] =
    useState<DelegateUnsetRuleEvent>();

  useDebounce(
    () => {
      setDebouncedLatestUnsetRule(latestUnsetRule);
    },
    1000,
    [latestUnsetRule]
  );

  useEffect(() => {
    if (!chainId || !account || !provider || !isNetworkSupported) return;

    if (account === accountState && chainId === chainIdState) return;

    const delegateContract = getDelegateContract(provider.getSigner(), chainId);

    // TODO: #1047, remove this once we have a contract for all chains
    if (!delegateContract) {
      return;
    }

    const eventName: DelegateUnsetRuleEvent["name"] = "UnsetRule";

    const handleEvent = async (
      senderWallet: string,
      senderToken: string,
      signerToken: string,
      event: Event
    ) => {
      if (!compareAddresses(senderWallet, account)) {
        return;
      }

      const receipt = await event.getTransactionReceipt();

      setLatestUnsetRule(
        transformToDelegateUnsetRuleEvent(
          senderWallet,
          senderToken,
          signerToken,
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

  return debouncedLatestUnsetRule;
};

export default useLatestUnsetRuleFromEvents;
