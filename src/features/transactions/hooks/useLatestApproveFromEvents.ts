import { useEffect, useState } from "react";

import { SwapERC20 } from "@airswap/libraries";
import { useWeb3React } from "@web3-react/core";

import erc20Abi from "erc-20-abi";
import { BigNumber, providers, Event, EventFilter, ethers } from "ethers";
import { hexZeroPad, id } from "ethers/lib/utils";

import { useAppSelector } from "../../../app/hooks";
import { ApproveEvent } from "../../../entities/ApproveEvent/ApproveEvent";
import { transformToApproveEvent } from "../../../entities/ApproveEvent/ApproveEventTransformers";
import { compareAddresses } from "../../../helpers/string";
import { selectActiveTokens } from "../../metadata/metadataSlice";

const erc20Interface = new ethers.utils.Interface(erc20Abi);

const useLatestApproveFromEvents = (
  chainId?: number,
  account?: string | null
): ApproveEvent | undefined => {
  const { library: provider } = useWeb3React<providers.Provider>();
  const tokens = useAppSelector(selectActiveTokens);

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();
  const [latestApprove, setLatestApprove] = useState<ApproveEvent>();

  useEffect(() => {
    let shouldCleanup = true;

    if (!chainId || !account || !provider || !tokens.length) {
      shouldCleanup = false;

      return;
    }

    if (account === accountState && chainId === chainIdState) {
      shouldCleanup = false;

      return;
    }

    const filter: EventFilter = {
      topics: [
        [id("Approval(address,address,uint256)")],
        hexZeroPad(account, 32),
      ],
    };

    const handleEvent = async (event: Event) => {
      const receipt = await provider.getTransactionReceipt(
        event.transactionHash
      );
      const tokenAddress = event.address;
      const parsedEvent = erc20Interface.parseLog(event);
      const spenderAddress = parsedEvent.args[1];
      const isApproval = parsedEvent.name === "Approval";
      const amount: BigNumber = parsedEvent.args[2];

      if (!isApproval) return;

      if (
        tokens.every((token) => !compareAddresses(token.address, tokenAddress))
      )
        return;

      if (
        !compareAddresses(spenderAddress, SwapERC20.getAddress(chainId) || "")
      )
        return;

      setLatestApprove(
        transformToApproveEvent(
          amount.toString(),
          receipt.transactionHash,
          spenderAddress,
          tokenAddress,
          receipt.status
        )
      );
    };

    setAccountState(account);
    setChainIdState(chainId);

    provider.on(filter, handleEvent);

    return () => {
      if (!shouldCleanup) return;

      provider.off(filter, handleEvent);
    };
  }, [chainId, account, provider, tokens.length]);

  return latestApprove;
};

export default useLatestApproveFromEvents;
