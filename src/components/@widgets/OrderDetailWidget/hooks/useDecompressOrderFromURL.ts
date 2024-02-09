import { useParams } from "react-router-dom";

import { decompressFullOrderERC20, FullOrderERC20 } from "@airswap/utils";

const useDecompressOrderFromURL = (): FullOrderERC20 => {
  const { compressedOrder } = useParams<{ compressedOrder: string }>();
  const decompressedOrder = decompressFullOrderERC20(compressedOrder);
  return decompressedOrder;
};

export default useDecompressOrderFromURL;
