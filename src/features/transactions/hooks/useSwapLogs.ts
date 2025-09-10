import { useEffect, useState } from "react";

import { Delegate, Swap, SwapERC20, Wrapper } from "@airswap/libraries";
import { Contract } from "@ethersproject/contracts";
import { useAsync } from "@react-hookz/web/esm";
import { IAsyncState } from "@react-hookz/web/esm/useAsync/useAsync";
import { useWeb3React } from "@web3-react/core";

import { Event } from "ethers";

import { getDelegateContract } from "../../../entities/DelegateRule/DelegateRuleHelpers";
import getContractEvents from "../../../helpers/getContractEvents";
import useNetworkSupported from "../../../hooks/useNetworkSupported";

interface SwapLogs {
  swapLogs: Event[];
  swapErc20Logs: Event[];
  wrappedSwapLogs: Event[];
  delegatedSwapLogs: Event[];
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
      swapErc20Contract: Contract,
      wrapperContract: Contract,
      delegatedSwapContract: Contract,
      account: string
    ) => {
      const swapFilter = swapContract.filters.Swap(null);
      const erc20SwapFilter = swapErc20Contract.filters.SwapERC20(null);
      const wrapperSwapFilter = wrapperContract.filters.WrappedSwapFor(null);
      const delegatedSwapFilter =
        delegatedSwapContract.filters.DelegatedSwapFor(null);

      const firstTxBlockSwapErc20Contract =
        chainId && SwapERC20.deployedBlocks[chainId];
      const firstTxBlockSwapContract =
        // TODO: Swap.deployedBlocks is empty right now, replace later
        (chainId && Swap.deployedBlocks[chainId]) ||
        firstTxBlockSwapErc20Contract;
      const firstTxBlockWrapperContract =
        chainId && Wrapper.deployedBlocks[chainId];
      const firstTxBlockDelegatedSwapContract =
        chainId && SwapERC20.deployedBlocks[chainId];
      const currentBlock = await provider?.getBlockNumber();

      if (
        !firstTxBlockSwapContract ||
        !firstTxBlockSwapErc20Contract ||
        !firstTxBlockWrapperContract ||
        !firstTxBlockDelegatedSwapContract ||
        !currentBlock
      ) {
        throw new Error("Could not get block numbers");
      }

      const swapLogs = await getContractEvents(
        swapContract,
        swapFilter,
        firstTxBlockSwapContract,
        currentBlock
      );

      const swapErc20Logs = await getContractEvents(
        swapErc20Contract,
        erc20SwapFilter,
        firstTxBlockSwapErc20Contract,
        currentBlock
      );
      const wrappedSwapLogs = await getContractEvents(
        wrapperContract,
        wrapperSwapFilter,
        firstTxBlockWrapperContract,
        currentBlock
      );

      const delegatedSwapLogs = await getContractEvents(
        delegatedSwapContract,
        delegatedSwapFilter,
        firstTxBlockDelegatedSwapContract,
        currentBlock
      );

      return {
        swapLogs,
        swapErc20Logs,
        wrappedSwapLogs,
        delegatedSwapLogs,
        chainId,
        account,
      };
    },
    null
  );

  useEffect(() => {
    if (!chainId || !account || !provider || !isNetworkSupported) return;

    if (account === accountState && chainId === chainIdState) return;

    const swapContract = Swap.getContract(provider, chainId);
    const swapErc20Contract = SwapERC20.getContract(provider, chainId);
    const wrapperContract = Wrapper.getContract(provider, chainId);
    const delegatedSwapContract = getDelegateContract(provider, chainId);

    // TODO: #1047, remove this once we have a contract for all chains
    if (
      !swapContract ||
      !swapErc20Contract ||
      !wrapperContract ||
      !delegatedSwapContract
    ) {
      return;
    }

    actions.execute(
      swapContract,
      swapErc20Contract,
      wrapperContract,
      delegatedSwapContract,
      account
    );

    setAccountState(account);
    setChainIdState(chainId);
  }, [chainId, account, provider, actions, isNetworkSupported]);

  return state;
};

export default useSwapLogs;
