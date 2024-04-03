import { useEffect, useState } from "react";

import { SwapERC20 } from "@airswap/libraries";
import { getFullSwapERC20 } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import { BigNumber, providers, Event } from "ethers";

import { FullSwapERC20Event } from "../../../entities/ExtendedFullSwapERC20/FullSwapERC20Event";
import { transformToFullSwapERC20Event } from "../../../entities/ExtendedFullSwapERC20/FullSwapERC20EventTransformers";
import useDebounce from "../../../hooks/useDebounce";

const useLatestSwapFromEvents = (
  chainId?: number,
  account?: string | null
): FullSwapERC20Event | undefined => {
  const { library: provider } = useWeb3React<providers.Provider>();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();
  const [latestSwap, setLatestSwap] = useState<FullSwapERC20Event>();
  const [debouncedLatestSwap, setDebouncedLatestSwap] =
    useState<FullSwapERC20Event>();

  useDebounce(
    () => {
      setDebouncedLatestSwap(latestSwap);
    },
    1000,
    [latestSwap]
  );

  useEffect(() => {
    if (!chainId || !account || !provider) return;

    if (account === accountState && chainId === chainIdState) return;

    const swapContract = SwapERC20.getContract(provider, chainId);
    const swapEvent = "SwapERC20";

    swapContract.protocolFeeWallet().then((feeReceiver: string) => {
      const handleSwapEvent = async (
        nonce: BigNumber,
        signerWallet: string,
        swapEvent: Event
      ) => {
        const receipt = await swapEvent.getTransactionReceipt();
        const swap = await getFullSwapERC20(
          nonce.toString(),
          signerWallet,
          feeReceiver,
          receipt.logs
        );

        if (
          swap.signerWallet.toLowerCase() === account.toLowerCase() ||
          swap.senderWallet.toLowerCase() === account.toLowerCase()
        ) {
          setLatestSwap(
            transformToFullSwapERC20Event(
              swap,
              swapEvent.transactionHash,
              signerWallet,
              swapEvent.blockNumber,
              receipt.status
            )
          );
        }
      };

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

  return debouncedLatestSwap;
};

export default useLatestSwapFromEvents;
