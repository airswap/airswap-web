import { useMemo } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { getDefaultProvider } from "ethers";

import { getRpcUrl } from "../helpers/getRpcUrl";

// Hook for getting library from connected wallet or from rpc url, this way you can still use it in ethers.js methods

const useDefaultLibrary = (chainId: number): Web3Provider | undefined => {
  const { library } = useWeb3React();

  return useMemo(() => {
    if (library) {
      return library;
    }

    return getDefaultProvider(getRpcUrl(chainId));
  }, [library, chainId]);
};

export default useDefaultLibrary;
