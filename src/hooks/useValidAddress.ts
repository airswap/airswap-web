import { useEffect, useMemo, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { isAddress } from "ethers/lib/utils";

import { useAppSelector } from "../app/hooks";

const useValidAddress = (address: string): boolean => {
  const { provider: library } = useWeb3React<Web3Provider>();
  const { chainId } = useAppSelector((state) => state.web3);

  const [isValidAddress, setIsValidAddress] = useState(false);

  const resolveEnsAddress = async (library: Web3Provider, address: string) => {
    const value = await library.resolveName(address);

    return setIsValidAddress(!!value);
  };

  useEffect(() => {
    if (!address || !chainId || !library) {
      return;
    }

    if (address.indexOf(".eth") !== -1) {
      resolveEnsAddress(library, address);

      return;
    }

    setIsValidAddress(isAddress(address));
  }, [address, chainId, library]);

  return isValidAddress;
};

export default useValidAddress;
