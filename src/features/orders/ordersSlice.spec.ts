import ordersReducer, { OrdersState } from "./ordersSlice";

describe("orders reducer", () => {
  const initialState: OrdersState = {
    value: null,
    status: "idle",
  };
  it("should handle initial state", () => {
    expect(ordersReducer(undefined, { type: "unknown" })).toEqual({
      value: 0,
      status: "idle",
    });
  });
});
