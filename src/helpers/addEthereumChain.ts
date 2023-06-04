import { CHAIN_PARAMS } from "../constants/supportedNetworks";

const addEthereumChain = (chainId: number): Promise<any> => {
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

export default addEthereumChain;
