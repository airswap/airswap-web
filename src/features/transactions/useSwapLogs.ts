import { useEffect } from "react";

import { Wrapper } from "@airswap/libraries";
import * as SwapContract from "@airswap/swap/build/contracts/Swap.sol/Swap.json";
//@ts-ignore
import * as swapDeploys from "@airswap/swap/deploys.js";
import * as WrapperContract from "@airswap/wrapper/build/contracts/Wrapper.sol/Wrapper.json";
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
      const signerSwapFilter = swapContract.filters.Swap(
        null, // nonce
        null, // timestamp,
        account, // signerWallet
        null, // signerToken
        null, // signerAmount,
        null, // protocol fee
        null, // senderWallet
        null, // senderToken
        null // senderAmount
      );

      const senderSwapFilter = swapContract.filters.Swap(
        null, // nonce
        null, // timestamp,
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

      const [lastLookSwapLogs, rfqSwapLogs, wrappedSwapLogs] =
        await Promise.all([
          swapContract.queryFilter(signerSwapFilter),
          swapContract.queryFilter(senderSwapFilter),
          wrapperContract.queryFilter(wrapperSwapFilter),
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

    const swapContract = new Contract(
      swapDeploys[chainId],
      SwapContract.abi,
      provider
    );

    const wrapperContract = new Contract(
      Wrapper.getAddress(chainId),
      WrapperContract.abi,
      provider
    );
    actions.execute(swapContract, wrapperContract, account);
  }, [chainId, account, provider, actions]);

  return state;
};

export default useSwapLogs;
