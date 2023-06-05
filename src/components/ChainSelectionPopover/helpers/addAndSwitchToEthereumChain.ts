import addEthereumChain from "../../../helpers/addEthereumChain";
import switchToChain from "../../../helpers/switchToChain";

const addAndSwitchToEthereumChain = async (chainId: number) => {
  const chainNotAddedCode = 4902;

  await switchToChain(chainId).catch((error: any) => {
    if (error.code === chainNotAddedCode) {
      addEthereumChain(chainId);
    }
  });
};

export default addAndSwitchToEthereumChain;
