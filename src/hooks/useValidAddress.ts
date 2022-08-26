import { useMemo } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { isAddress } from "ethers/lib/utils";

const useValidAddress = (address: string): boolean => {
  const { chainId } = useWeb3React<Web3Provider>();

  return useMemo(() => {
    if (!address || !chainId) {
      return false;
    }

    // Not validating other chains than ethereum right now. Can be added later.
    if (chainId >= 5) {
      return true;
    }

    if (address.indexOf(".eth") !== -1) {
      return true;
    }

    return isAddress(address);
  }, [address, chainId]);
};

export default useValidAddress;
