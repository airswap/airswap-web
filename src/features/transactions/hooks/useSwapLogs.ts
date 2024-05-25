import { useEffect, useState } from "react";

import { SwapERC20, Wrapper } from "@airswap/libraries";
import { Contract } from "@ethersproject/contracts";
import { useAsync } from "@react-hookz/web/esm";
import { IAsyncState } from "@react-hookz/web/esm/useAsync/useAsync";
import { useWeb3React } from "@web3-react/core";

import { Event } from "ethers";

import getContractEvents from "../../../helpers/getContractEvents";

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
    if (!chainId || !account || !provider) return;

    if (account === accountState && chainId === chainIdState) return;

    const swapContract = SwapERC20.getContract(provider, chainId);
    const wrapperContract = Wrapper.getContract(provider, chainId);
    actions.execute(swapContract, wrapperContract, account);

    setAccountState(account);
    setChainIdState(chainId);
  }, [chainId, account, provider, actions]);

  return state;
};

export default useSwapLogs;
