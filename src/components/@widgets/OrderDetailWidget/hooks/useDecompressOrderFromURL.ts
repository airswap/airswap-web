import { FullOrderERC20 } from "@airswap/types";
import { decompressFullOrderERC20 } from "@airswap/utils";
import { useParams } from "react-router-dom";

const useDecompressOrderFromURL = (): FullOrderERC20 => {
  const { compressedOrder } = useParams<{ compressedOrder: string }>();
  const decompressedOrder = decompressFullOrderERC20(compressedOrder);
  return decompressedOrder;
};

export default useDecompressOrderFromURL;
