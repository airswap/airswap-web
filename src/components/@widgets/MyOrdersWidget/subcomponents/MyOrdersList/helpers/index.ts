import { OrdersSortType } from "../../../../../../types/ordersSortType";
import { MyOrder } from "../../../../MyOrdersWidget/entities/MyOrder";

export const getSortedOrders = (
  orders: MyOrder[],
  sortType: OrdersSortType,
  isReverse: boolean
) => {
  const array = [...orders];

  if (sortType === "senderToken") {
    array.sort((a, b) =>
      (a.senderToken?.name?.toLocaleLowerCase() || "") <
      (b.senderToken?.name?.toLocaleLowerCase() || "")
        ? -1
        : 1
    );
  }

  if (sortType === "signerToken") {
    array.sort((a, b) =>
      (a.signerToken?.name?.toLocaleLowerCase() || "") <
      (b.signerToken?.name?.toLocaleLowerCase() || "")
        ? -1
        : 1
    );
  }

  // TODO: sort on order canceled or not
  if (sortType === "active" || sortType === "expiry") {
    array.sort((a, b) => {
      return b.expiry.getTime() - a.expiry.getTime();
    });
  }

  if (sortType === "for") {
    array.sort((a, b) => {
      return a.for.localeCompare(b.for);
    });
  }

  if (isReverse) {
    array.reverse();
  }

  return array;
};
