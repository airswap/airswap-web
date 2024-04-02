import { useEffect, useState } from "react";

import { SwapERC20 } from "@airswap/libraries";
import { getFullSwapERC20 } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import { BigNumber, providers, Event } from "ethers";

import { ExtendedFullSwapERC20 } from "../../../entities/ExtendedFullSwapERC20/ExtendedFullSwapERC20";
import { transformToExtendedFullSwapERC20 } from "../../../entities/ExtendedFullSwapERC20/ExtendedFullSwapERC20Transformers";
import useDebounce from "../../../hooks/useDebounce";

const useLatestSwapFromEvents = (
  chainId?: number,
  account?: string | null
): ExtendedFullSwapERC20 | undefined => {
  const { library: provider } = useWeb3React<providers.Provider>();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();
  const [latestSwap, setLatestSwap] = useState<ExtendedFullSwapERC20>();
  const [debouncedLatestSwap, setDebouncedLatestSwap] =
    useState<ExtendedFullSwapERC20>();

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
            transformToExtendedFullSwapERC20(
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
