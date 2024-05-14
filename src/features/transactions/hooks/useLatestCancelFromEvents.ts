import { useEffect, useState } from "react";

import { SwapERC20 } from "@airswap/libraries";
import { useWeb3React } from "@web3-react/core";

import { BigNumber, providers, Event } from "ethers";

import { CancelEvent } from "../../../entities/CancelEvent/CancelEvent";
import { transformToCancelEvent } from "../../../entities/CancelEvent/CancelEventTransformers";
import { FullSwapERC20Event } from "../../../entities/FullSwapERC20Event/FullSwapERC20Event";
import { compareAddresses } from "../../../helpers/string";

const useLatestCancelFromEvents = (
  chainId?: number,
  account?: string | null
): CancelEvent | undefined => {
  const { provider } = useWeb3React();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();
  const [latestCancelEvent, setLatestCancelEvent] = useState<CancelEvent>();

  useEffect(() => {
    if (!chainId || !account || !provider) return;

    if (account === accountState && chainId === chainIdState) return;

    const swapContract = SwapERC20.getContract(provider, chainId);
    const cancelEvent = "Cancel";

    swapContract.protocolFeeWallet().then(() => {
      const handleCancelEvent = async (
        nonce: BigNumber,
        signerAddress: string,
        swapEvent: Event
      ) => {
        const receipt = await swapEvent.getTransactionReceipt();

        if (!compareAddresses(signerAddress, account)) {
          return;
        }

        setLatestCancelEvent(
          transformToCancelEvent(
            receipt.transactionHash,
            nonce.toString(),
            signerAddress,
            receipt.status
          )
        );
      };

      swapContract.off(cancelEvent, handleCancelEvent);
      swapContract.on(cancelEvent, handleCancelEvent);

      return () => {
        swapContract.off(cancelEvent, handleCancelEvent);
      };
    });

    setAccountState(account);
    setChainIdState(chainId);

    return () => {
      swapContract.off(cancelEvent, () => {});
    };
  }, [chainId, account, provider]);

  return latestCancelEvent;
};

export default useLatestCancelFromEvents;
