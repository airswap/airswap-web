import { CHAIN_PARAMS } from "../../src/constants/supportedNetworks";

interface UseBlockExplorerUrlProps {
  chainId: number | undefined;
  address: string | undefined;
}

/**
 *
 * @returns block explorer link containing a token contract
 */
const useBlockExplorerUrl = ({
  chainId,
  address,
}: UseBlockExplorerUrlProps): string | null => {
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const chainData = CHAIN_PARAMS[chainId || 1];
  const blockExplorerUrl = chainData.blockExplorerUrls[0];
  if (address === zeroAddress) {
    return null;
  } else {
    return `${blockExplorerUrl}address/${address}`;
  }
};

export default useBlockExplorerUrl;
