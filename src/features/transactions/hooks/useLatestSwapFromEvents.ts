import { useEffect, useState } from "react";

import { Swap } from "@airswap/libraries";
import { FullSwapERC20 } from "@airswap/utils/build/src/swap-erc20";
import { useWeb3React } from "@web3-react/core";

import { BigNumber, Event } from "ethers";

import { FullSwapERC20Event } from "../../../entities/FullSwapERC20Event/FullSwapERC20Event";
import { transformToFullSwapERC20Event } from "../../../entities/FullSwapERC20Event/FullSwapERC20EventTransformers";
import { compareAddresses } from "../../../helpers/string";
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

    const swapContract = Swap.getContract(provider, chainId);
    const swapEvent = "Swap";

    swapContract.protocolFeeWallet().then(() => {
      const handleSwapEvent = async (
        nonce: BigNumber,
        signerWallet: string,
        signerAmount: BigNumber,
        signerId: BigNumber,
        signerToken: string,
        senderWallet: string,
        senderAmount: BigNumber,
        senderId: BigNumber,
        senderToken: string,
        affiliateWallet: string,
        affiliateAmount: BigNumber,
        swapEvent: Event
      ) => {
        const receipt = await swapEvent.getTransactionReceipt();

        if (
          !compareAddresses(signerWallet, account) &&
          !compareAddresses(senderWallet, account)
        ) {
          return;
        }

        // TODO: This needs to be swapped to FullOrder, convert to ERC20 for now
        const swap: FullSwapERC20 = {
          signerToken: signerToken,
          signerAmount: signerAmount.toString(),
          senderWallet: senderWallet,
          senderToken: senderToken,
          senderAmount: senderAmount.toString(),
          feeAmount: affiliateAmount.toString(),
          nonce: nonce.toString(),
          signerWallet: signerWallet,
        };

        setLatestSwapEvent(
          transformToFullSwapERC20Event(
            swap,
            swapEvent.transactionHash,
            signerWallet,
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
