import { apiUrls, chainNames, explorerUrls } from "@airswap/utils";

import nativeCurrency from "../constants/nativeCurrency";

// https://eips.ethereum.org/EIPS/eip-3085

const addChain = (chainId: number): Promise<null> => {
  return window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: `0x${chainId.toString(16)}`,
        rpcUrls: [apiUrls[chainId]],
        blockExplorerUrls: [explorerUrls[chainId]],
        chainName: chainNames[chainId],
        nativeCurrency: nativeCurrency[chainId],
      },
    ],
  });
};

export default addChain;
