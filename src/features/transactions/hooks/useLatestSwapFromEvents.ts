import { useEffect, useState } from "react";

import { SwapERC20 } from "@airswap/libraries";
import { getFullSwapERC20 } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import { BigNumber, Event } from "ethers";

import { FullSwapERC20Event } from "../../../entities/FullSwapERC20Event/FullSwapERC20Event";
import { transformToFullSwapERC20Event } from "../../../entities/FullSwapERC20Event/FullSwapERC20EventTransformers";
import { compareAddresses } from "../../../helpers/string";

const useLatestSwapFromEvents = (
  chainId?: number,
  account?: string | null
): FullSwapERC20Event | undefined => {
  const { provider } = useWeb3React();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();
  const [latestSwapEvent, setLatestSwapEvent] = useState<FullSwapERC20Event>();

  useEffect(() => {
    if (!chainId || !account || !provider) return;

    if (account === accountState && chainId === chainIdState) return;

    const swapContract = SwapERC20.getContract(provider, chainId);
    const swapEvent = "SwapERC20";

    swapContract.protocolFeeWallet().then((feeReceiver: string) => {
      const handleSwapEvent = async (
        nonce: BigNumber,
        signerAddress: string,
        swapEvent: Event
      ) => {
        const receipt = await swapEvent.getTransactionReceipt();
        const swap = await getFullSwapERC20(
          nonce.toString(),
          signerAddress,
          feeReceiver,
          receipt.logs
        );

        if (
          !compareAddresses(swap.signerWallet, account) &&
          !compareAddresses(swap.senderWallet, account) &&
          // When the senderWallet is the wrapper contract, we can still use the receipt to lead the transaction back
          // to the original sender wallet
          !compareAddresses(receipt.from, account)
        ) {
          return;
        }

        setLatestSwapEvent(
          transformToFullSwapERC20Event(
            swap,
            swapEvent.transactionHash,
            signerAddress,
            swapEvent.blockNumber,
            receipt.status
          )
        );
      };

      swapContract.off(swapEvent, handleSwapEvent);
      swapContract.on(swapEvent, handleSwapEvent);

      return () => {
        swapContract.off(swapEvent, handleSwapEvent);
      };
    });

    setAccountState(account);
    setChainIdState(chainId);

    return () => {
      swapContract.off(swapEvent, () => {});
    };
  }, [chainId, account, provider]);

  return latestSwapEvent;
};

export default useLatestSwapFromEvents;
