import { FullOrder } from "@airswap/typescript";
import { decompressFullOrder } from "@airswap/utils";

const useDecompressOrderFromURL = (compressedOrder: string): FullOrder => {
  const decompressedOrder = decompressFullOrder(compressedOrder);
  return decompressedOrder;
};

export default useDecompressOrderFromURL;
