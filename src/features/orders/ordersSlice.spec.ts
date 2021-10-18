import { RootState } from "../../app/store";
import ordersReducer, { OrdersState, selectBestOrder } from "./ordersSlice";

describe("orders reducer", () => {
  const initialState: OrdersState = {
    orders: [],
    status: "idle",
    reRequestTimerId: null,
  };
  it("should handle initial state", () => {
    expect(ordersReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  const ignoredOrderProps = {
    nonce: "ignored",
    r: "ignored",
    s: "ignored",
    v: "ignored",
    senderToken: "0xa",
    signerToken: "0xb",
    signerWallet: "0xyou",
    senderWallet: "0xme",
  };

  it("should select the best signer side order", () => {
    // @ts-ignore (don't need to populate entire rootstate)
    const state: RootState = {
      orders: {
        ...initialState,
        orders: [
          {
            ...ignoredOrderProps,
            senderAmount: "1",
            signerAmount: "5",
            expiry: "1",
          },
          {
            ...ignoredOrderProps,
            senderAmount: "1",
            signerAmount: "7",
            expiry: "2",
          },
          {
            ...ignoredOrderProps,
            senderAmount: "1",
            signerAmount: "3",
            expiry: "3",
          },
        ],
      },
    };
    expect(selectBestOrder(state).signerAmount).toBe("7");
  });

  it("should select the best sender side order", () => {
    // @ts-ignore (don't need to populate entire rootstate)
    const state: RootState = {
      orders: {
        ...initialState,
        orders: [
          {
            ...ignoredOrderProps,
            senderAmount: "6",
            signerAmount: "7",
            expiry: "1",
          },
          {
            ...ignoredOrderProps,
            senderAmount: "8",
            signerAmount: "7",
            expiry: "2",
          },
          {
            ...ignoredOrderProps,
            senderAmount: "10",
            signerAmount: "7",
            expiry: "3",
          },
        ],
      },
    };
    expect(selectBestOrder(state).senderAmount).toBe("6");
  });

  it("should select orders based on longest expiry if token amounts are equal", () => {
    // @ts-ignore (don't need to populate entire rootstate)
    const state: RootState = {
      orders: {
        ...initialState,
        orders: [
          {
            ...ignoredOrderProps,
            senderAmount: "7",
            signerAmount: "7",
            expiry: "1",
          },
          {
            ...ignoredOrderProps,
            senderAmount: "7",
            signerAmount: "7",
            expiry: "3",
          },
          {
            ...ignoredOrderProps,
            senderAmount: "7",
            signerAmount: "7",
            expiry: "2",
          },
        ],
      },
    };
    expect(selectBestOrder(state).expiry).toBe("3");
  });
});
