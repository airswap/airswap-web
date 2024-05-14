import { useEffect, useState } from "react";

import { ChainIds } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

const useEnsAddress = (address?: string): string | undefined => {
  const { provider: library } = useWeb3React<Web3Provider>();
  const [lookedUpAddress, setLookedUpAddress] = useState<string | null>(null);

  const lookupAddress = async (library: Web3Provider, value: string) => {
    // Note: lookupAddress only seems to work on mainnet.
    if (library.network?.chainId === ChainIds.MAINNET) {
      setLookedUpAddress(await library.lookupAddress(value));
    } else {
      setLookedUpAddress(value);
    }
  };

  useEffect(() => {
    if (!library || !address) {
      return;
    }

    lookupAddress(library, address);
  }, [library, address]);

  return lookedUpAddress || undefined;
};

export default useEnsAddress;
