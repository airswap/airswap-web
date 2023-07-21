import ordersReducer, { TransactionsState } from "./transactionsSlice";

describe("orders reducer", () => {
  const initialState: TransactionsState = {
    all: [],
    filter: {},
  };
  it("should handle initial state", () => {
    expect(ordersReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });
});
