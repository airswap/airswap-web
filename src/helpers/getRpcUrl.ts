import { rpcUrls } from "../constants/rpcUrls";

export const getRpcUrl = (chainId: number): string | undefined => {
  const rpcUrl = rpcUrls[chainId];

  if (!rpcUrl) {
    console.error(
      `No rpc url found for chainId ${chainId}, did you setup your .env correctly?`
    );

    return undefined;
  }

  return rpcUrl;
};
