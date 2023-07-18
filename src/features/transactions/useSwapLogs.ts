import { useEffect } from "react";

import { SwapERC20, Wrapper } from "@airswap/libraries";
import { Contract } from "@ethersproject/contracts";
import { useAsync } from "@react-hookz/web/esm";
import { useWeb3React } from "@web3-react/core";

import { providers } from "ethers";

const useSwapLogs = () => {
  const [state, actions] = useAsync(
    async (
      swapContract: Contract,
      wrapperContract: Contract,
      account: string
    ) => {
      const signerSwapFilter = swapContract.filters.SwapERC20(
        null, // nonce
        account, // signerWallet
        null, // signerToken
        null, // signerAmount,
        null, // protocol fee
        null, // senderWallet
        null, // senderToken
        null // senderAmount
      );

      const senderSwapFilter = swapContract.filters.SwapERC20(
        null, // nonce
        null, // signerWallet
        null, // signerToken
        null, // signerAmount,cd
        null, // protocol fee
        account, // senderWallet
        null, // senderToken
        null // senderAmount
      );

      const wrapperSwapFilter = wrapperContract.filters.WrappedSwapFor(
        account // senderWallet
      );

      const firstTxBlockSwapContract =
        chainId && SwapERC20.blockNumbers[chainId as keyof typeof SwapERC20.blockNumbers];
      const firstTxBlockWrapperContract =
        chainId && Wrapper.blockNumbers[chainId as keyof typeof Wrapper.blockNumbers];
      const currentBlock = await provider?.getBlockNumber();


      const [lastLookSwapLogs, rfqSwapLogs, wrappedSwapLogs] =
        await Promise.all([
          swapContract.queryFilter(
            signerSwapFilter,
            firstTxBlockSwapContract,
            currentBlock
          ),
          swapContract.queryFilter(
            senderSwapFilter,
            firstTxBlockSwapContract,
            currentBlock
          ),
          wrapperContract.queryFilter(
            wrapperSwapFilter,
            firstTxBlockWrapperContract,
            currentBlock
          ),
        ]);

      return {
        lastLookSwapLogs,
        rfqSwapLogs,
        wrappedSwapLogs,
        chainId,
        account,
      };
    },
    null
  );

  const {
    chainId,
    account,
    library: provider,
  } = useWeb3React<providers.Provider>();

  useEffect(() => {
    if (!chainId || !account || !provider) return;

    const swapContract = SwapERC20.getContract(provider, chainId);
    const wrapperContract = Wrapper.getContract(provider, chainId);
    actions.execute(swapContract, wrapperContract, account);
  }, [chainId, account, provider, actions]);

  return state;
};

export default useSwapLogs;
