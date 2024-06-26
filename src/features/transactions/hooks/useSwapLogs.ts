import { useEffect, useState } from "react";

import { SwapERC20, Wrapper } from "@airswap/libraries";
import { Contract } from "@ethersproject/contracts";
import { useAsync } from "@react-hookz/web/esm";
import { IAsyncState } from "@react-hookz/web/esm/useAsync/useAsync";
import { useWeb3React } from "@web3-react/core";

import { Event } from "ethers";

import getContractEvents from "../../../helpers/getContractEvents";
import { getSwapErc20Contract } from "../../../helpers/swapErc20";
import useNetworkSupported from "../../../hooks/useNetworkSupported";

interface SwapLogs {
  swapLogs: Event[];
  wrappedSwapLogs: Event[];
  chainId: number;
  account: string;
}

const useSwapLogs = (
  chainId?: number,
  account?: string | null
): IAsyncState<SwapLogs | null> => {
  const { provider } = useWeb3React();
  const isNetworkSupported = useNetworkSupported();

  const [accountState, setAccountState] = useState<string>();
  const [chainIdState, setChainIdState] = useState<number>();

  const [state, actions] = useAsync(
    async (
      swapContract: Contract,
      wrapperContract: Contract,
      account: string
    ) => {
      const signerSwapFilter = swapContract.filters.SwapERC20(null);
      const wrapperSwapFilter = wrapperContract.filters.WrappedSwapFor(null);

      const firstTxBlockSwapContract =
        chainId && SwapERC20.deployedBlocks[chainId];
      const firstTxBlockWrapperContract =
        chainId && Wrapper.deployedBlocks[chainId];
      const currentBlock = await provider?.getBlockNumber();

      if (
        !firstTxBlockSwapContract ||
        !firstTxBlockWrapperContract ||
        !currentBlock
      ) {
        throw new Error("Could not get block numbers");
      }

      const swapLogs = await getContractEvents(
        swapContract,
        signerSwapFilter,
        firstTxBlockSwapContract,
        currentBlock
      );
      const wrappedSwapLogs = await getContractEvents(
        wrapperContract,
        wrapperSwapFilter,
        firstTxBlockWrapperContract,
        currentBlock
      );

      return {
        swapLogs,
        wrappedSwapLogs,
        chainId,
        account,
      };
    },
    null
  );

  useEffect(() => {
    if (!chainId || !account || !provider || !isNetworkSupported) return;

    if (account === accountState && chainId === chainIdState) return;

    const swapContract = getSwapErc20Contract(provider, chainId);
    const wrapperContract = Wrapper.getContract(provider, chainId);
    actions.execute(swapContract, wrapperContract, account);

    setAccountState(account);
    setChainIdState(chainId);
  }, [chainId, account, provider, actions, isNetworkSupported]);

  return state;
};

export default useSwapLogs;
