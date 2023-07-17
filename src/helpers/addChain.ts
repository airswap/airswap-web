import { CHAIN_PARAMS } from "../constants/supportedNetworks";

// https://eips.ethereum.org/EIPS/eip-3085

const addChain = (chainId: number): Promise<null> => {
  return window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: `0x${CHAIN_PARAMS[chainId].chainId.toString(16)}`,
        rpcUrls: CHAIN_PARAMS[chainId].rpcUrls,
        chainName: CHAIN_PARAMS[chainId].chainName,
      },
    ],
  });
};

export default addChain;
