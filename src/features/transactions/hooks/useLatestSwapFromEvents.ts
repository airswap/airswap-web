import { useEffect, useState } from "react";

import { SwapERC20 } from "@airswap/libraries";
import { getFullSwapERC20 } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import { BigNumber, Event } from "ethers";

import { FullSwapERC20Event } from "../../../entities/FullSwapERC20Event/FullSwapERC20Event";
import { transformToFullSwapERC20Event } from "../../../entities/FullSwapERC20Event/FullSwapERC20EventTransformers";
import { compareAddresses } from "../../../helpers/string";
import { getSwapErc20Contract } from "../../../helpers/swapErc20";
import useNetworkSupported from "../../../hooks/useNetworkSupported";

const useLatestSwapFromEvents = (
  chainId?: number,
  account?: string | null
): FullSwapERC20Event | undefined => {
  const { provider } = useWeb3React();
  const isNetworkSupported = useNetworkSupported();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();
  const [latestSwapEvent, setLatestSwapEvent] = useState<FullSwapERC20Event>();

  useEffect(() => {
    if (!chainId || !account || !provider || !isNetworkSupported) return;

    if (account === accountState && chainId === chainIdState) return;

    const swapContract = getSwapErc20Contract(provider, chainId);
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
  }, [chainId, account, provider, isNetworkSupported]);

  return latestSwapEvent;
};

export default useLatestSwapFromEvents;
