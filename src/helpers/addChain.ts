import { apiUrls, explorerUrls } from "@airswap/constants"

// https://eips.ethereum.org/EIPS/eip-3085

const addChain = (chainId: number): Promise<null> => {
  return window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: `0x${chainId.toString(16)}`,
        rpcUrls: [apiUrls[chainId]],
        chainName: [explorerUrls[chainId]],
      },
    ],
  });
};

export default addChain;
