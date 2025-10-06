import { useEffect, useState } from "react";

import { Delegate } from "@airswap/libraries";
import { useWeb3React } from "@web3-react/core";

import { BigNumber, Event } from "ethers";

import { DelegateSetRuleEvent } from "../../../entities/DelegateRule/DelegateRule";
import { getDelegateContract } from "../../../entities/DelegateRule/DelegateRuleHelpers";
import { transformToDelegateSetRuleEvent } from "../../../entities/DelegateRule/DelegateRuleTransformers";
import { compareAddresses } from "../../../helpers/string";
import useDebounce from "../../../hooks/useDebounce";
import useNetworkSupported from "../../../hooks/useNetworkSupported";

const useLatestSetRuleFromEvents = (
  chainId?: number,
  account?: string | null
): DelegateSetRuleEvent | undefined => {
  const { provider } = useWeb3React();
  const isNetworkSupported = useNetworkSupported();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();
  const [latestSetRule, setLatestSetRule] = useState<DelegateSetRuleEvent>();
  const [debouncedLatestSetRule, setDebouncedLatestSetRule] =
    useState<DelegateSetRuleEvent>();

  useDebounce(
    () => {
      setDebouncedLatestSetRule(latestSetRule);
    },
    1000,
    [latestSetRule]
  );

  useEffect(() => {
    if (!chainId || !account || !provider || !isNetworkSupported) return;

    if (account === accountState && chainId === chainIdState) return;

    const delegateContract = getDelegateContract(provider.getSigner(), chainId);

    // TODO: #1047, remove this once we have a contract for all chains
    if (!delegateContract) {
      return;
    }

    const eventName: DelegateSetRuleEvent["name"] = "SetRule";

    const handleEvent = async (
      senderWallet: string,
      senderToken: string,
      senderAmount: BigNumber,
      signerToken: string,
      signerAmount: BigNumber,
      expiry: BigNumber,
      event: Event
    ) => {
      if (!compareAddresses(senderWallet, account)) {
        return;
      }

      const receipt = await event.getTransactionReceipt();

      setLatestSetRule(
        transformToDelegateSetRuleEvent(
          senderWallet,
          senderToken,
          senderAmount.toString(),
          signerToken,
          signerAmount.toString(),
          chainId,
          expiry.toNumber(),
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

  return debouncedLatestSetRule;
};

export default useLatestSetRuleFromEvents;
