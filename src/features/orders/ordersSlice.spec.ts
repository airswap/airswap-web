import ordersReducer, { OrdersState } from "./ordersSlice";

describe("orders reducer", () => {
  const initialState: OrdersState = {
    orders: [],
    status: "idle",
  };
  it("should handle initial state", () => {
    expect(ordersReducer(undefined, { type: "unknown" })).toEqual({
      order: null,
      tx: null,
      status: "idle",
    });
  });
});
