import { useParams } from "react-router-dom";

import { FullOrder } from "@airswap/typescript";
import { decompressFullOrder } from "@airswap/utils";

const useDecompressOrderFromURL = (): FullOrder => {
  const { compressedOrder } = useParams();
  const decompressedOrder = decompressFullOrder(compressedOrder);
  return decompressedOrder;
};

export default useDecompressOrderFromURL;
