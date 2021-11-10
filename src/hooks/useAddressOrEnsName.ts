import { useState, useLayoutEffect } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import truncateEthAddress from "truncate-eth-address";

// This is an in-memory cache that will be lost when we refresh the page, as
// ENS records may change, but we probably only need to check once between
// refreshes. Format: { [chainId]: { [address]: name | null }}
const ensCachedResponses: Record<number, Record<string, string | null>> = {};

const useAddressOrEnsName = (
  address: string | null,
  truncate: boolean = true
) => {
  const { library, chainId } = useWeb3React<Web3Provider>();

  const fallback = truncate
    ? address
      ? truncateEthAddress(address)
      : null
    : address;
  const [result, setResult] = useState<string | null>(fallback);

  useLayoutEffect(() => {
    if (!address || !chainId || !library) {
      setResult(fallback);
      return;
    }

    const cached = ensCachedResponses[chainId]?.[address];
    if (cached !== undefined) {
      setResult(cached || fallback);
    } else {
      library
        .lookupAddress(address)
        .then((name) => {
          ensCachedResponses[chainId] = {
            ...ensCachedResponses[chainId],
            [address]: name,
          };
          setResult(name || fallback);
        })
        .catch(() => {
          setResult(fallback);
        });
    }
  }, [library, address, chainId, fallback]);

  return result;
};

export default useAddressOrEnsName;
