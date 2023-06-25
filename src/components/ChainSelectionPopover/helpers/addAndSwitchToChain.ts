import addChain from "../../../helpers/addChain";
import switchToChain from "../../../helpers/switchToChain";

const addAndSwitchToChain = async (chainId: number) => {
  const chainNotAddedCode = 4902;

  await switchToChain(chainId).catch((error: any) => {
    if (error.code === chainNotAddedCode) {
      addChain(chainId);
    }
  });
};

export default addAndSwitchToChain;
