import nativeCurrency from "../constants/nativeCurrency";

const switchToChain = (chainId = 1): Promise<null> => {
  return window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [
      {
        chainId: `0x${nativeCurrency[chainId].chainId.toString(16)}`,
      },
    ],
  });
};

export default switchToChain;
