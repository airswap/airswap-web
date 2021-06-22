import { RootState } from "../../app/store";
import ordersReducer, { OrdersState, selectBestOrder } from "./ordersSlice";

describe("orders reducer", () => {
  const initialState: OrdersState = {
    orders: [],
    status: "idle",
  };
  it("should handle initial state", () => {
    expect(ordersReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should select the best order", () => {
    const ignoredOrderProps = {
      expiry: "ignored",
      nonce: "ignored",
      r: "ignored",
      s: "ignored",
      v: "ignored",
      senderToken: "0xa",
      signerToken: "0xb",
      signerWallet: "0xyou",
      senderWallet: "0xme",
    };
    // @ts-ignore (don't need to populate entire rootstate)
    let state: RootState = {
      orders: {
        ...initialState,
        orders: [
          {
            ...ignoredOrderProps,
            senderAmount: "1",
            signerAmount: "5",
          },
          {
            ...ignoredOrderProps,
            senderAmount: "1",
            signerAmount: "7",
          },
          {
            ...ignoredOrderProps,
            senderAmount: "1",
            signerAmount: "3",
          },
        ],
      },
    };
    expect(selectBestOrder(state).signerAmount).toBe("7");

    // @ts-ignore (don't need to populate entire rootstate)
    state = {
      orders: {
        ...initialState,
        orders: [
          {
            ...ignoredOrderProps,
            senderAmount: "6",
            signerAmount: "7",
          },
          {
            ...ignoredOrderProps,
            senderAmount: "8",
            signerAmount: "7",
          },
          {
            ...ignoredOrderProps,
            senderAmount: "10",
            signerAmount: "7",
          },
        ],
      },
    };
    expect(selectBestOrder(state).senderAmount).toBe("6");
  });
});
