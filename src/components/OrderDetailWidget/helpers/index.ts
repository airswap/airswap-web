import { OrderStatus } from "../../../types/orderStatus";

export const getOrderStatus = (
  status: "idle" | "not-found" | "open" | "taken" | "canceled"
) => {
  switch (status) {
    case "taken":
      return OrderStatus.taken;
    case "canceled":
      return OrderStatus.canceled;
    default:
      return OrderStatus.open;
  }
};
