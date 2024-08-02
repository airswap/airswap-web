import { ChainIds } from "@airswap/utils";

import { useAppSelector } from "../app/hooks";
import { supportedNetworks } from "../constants/supportedNetworks";

const useNetworkSupported = () => {
  const { chainId } = useAppSelector((state) => state.web3);

  return supportedNetworks.includes(chainId as ChainIds);
};

export default useNetworkSupported;
