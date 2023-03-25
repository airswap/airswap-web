import { FullOrderERC20, OrderERC20 } from "@airswap/types";

import { AvailableOrdersSortType } from "../AvailableOrdersWidget";

export const getSortedIndexerOrders = (
  orders: Array<FullOrderERC20 | OrderERC20>,
  sortType: AvailableOrdersSortType,
  isReverse: boolean
) => {
  if (sortType !== "rate") {
    const sortedOrders = [...orders].sort((a, b) =>
      BigInt(a[sortType]) > BigInt(b[sortType]) ? 0 : -1
    );
    return isReverse ? sortedOrders.reverse() : sortedOrders;
  } else {
    const sortedOrders = [...orders].sort((a, b) =>
      BigInt(a.senderAmount) / BigInt(a.signerAmount) >
      BigInt(b.senderAmount) / BigInt(b.signerAmount)
        ? 0
        : -1
    );
    return isReverse ? sortedOrders.reverse() : sortedOrders;
  }
};
