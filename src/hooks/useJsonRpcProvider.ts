import { useMemo } from "react";

import {
  BaseProvider,
  Web3Provider,
  JsonRpcProvider,
} from "@ethersproject/providers";

import { getRpcUrl } from "../helpers/getRpcUrl";

const useJsonRpcProvider = (
  chainId: number
): Web3Provider | BaseProvider | undefined => {
  return useMemo(() => {
    return new JsonRpcProvider(getRpcUrl(chainId));
  }, [chainId]);
};

export default useJsonRpcProvider;
