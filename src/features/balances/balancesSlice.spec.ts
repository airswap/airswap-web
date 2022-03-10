import { setWalletConnected } from "../wallet/walletSlice";
import {
  balancesReducer,
  allowancesSwapReducer,
  allowancesWrapperReducer,
  balancesActions,
  allowancesSwapActions,
  allowancesWrapperActions,
  BalancesState,
  initialState,
} from "./balancesSlice";

const reducers: [string, typeof balancesReducer, typeof balancesActions][] = [
  ["balances", balancesReducer, balancesActions],
  ["allowances.swap", allowancesSwapReducer, allowancesSwapActions],
  ["allowances.wrapper", allowancesWrapperReducer, allowancesWrapperActions],
];

describe("balances and allowances reducers", () => {
  test.each(reducers)(
    "%s should return initial state given an unknown action",
    (name, reducer) => {
      expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
    }
  );
  test.each(reducers)(
    "%s should reset to initial state after wallet connected",
    (name, reducer) => {
      const dirtyState: BalancesState = {
        inFlightFetchTokens: ["123", "456"],
        lastFetch: 12354,
        status: "fetching",
        values: {
          "0x1": "100",
          "0x2": "101",
        },
      };
      expect(
        reducer(
          dirtyState,
          setWalletConnected({
            address: "0x123",
            chainId: 1,
          })
        )
      ).toEqual(initialState);
    }
  );
  test.each(reducers)(
    "%s should set values correctly.",
    (name, reducer, actions) => {
      const initial: BalancesState = {
        ...initialState,
        values: {
          sometokenaddress: "12345",
        },
      };

      const action = actions.set({
        // note case change
        tokenAddress: "SOMETOKENADDRESS",
        amount: "4567",
      });

      expect(reducer(initial, action)).toEqual({
        ...initial,
        values: {
          sometokenaddress: "4567",
        },
      });
    }
  );
  test.each(reducers)(
    "%s should increment values correctly.",
    (name, reducer, actions) => {
      const cases: [string | null, string, string][] = [
        ["10", "10", "20"],
        [null, "10", "10"],
        ["9007199254740991", "9007199254740991", "18014398509481982"],
      ];

      cases.forEach(([initialAmount, incrementAmount, expectedAmount]) => {
        const initial: BalancesState = {
          ...initialState,
          values: {
            addr: initialAmount,
          },
        };
        const action = actions.incrementBy({
          tokenAddress: "ADDR",
          amount: incrementAmount,
        });
        const expected = {
          ...initial,
          values: {
            addr: expectedAmount,
          },
        };
        expect(reducer(initial, action)).toEqual(expected);
      });
    }
  );
  test.each(reducers)(
    "%s should decerement values correctly.",
    (name, reducer, actions) => {
      const cases: [string | null, string, string][] = [
        ["20", "10", "10"],
        [null, "10", "0"],
        ["0", "9007199254740991", "0"],
      ];

      cases.forEach(([initialAmount, incrementAmount, expectedAmount]) => {
        const initial: BalancesState = {
          ...initialState,
          values: {
            addr: initialAmount,
          },
        };
        const action = actions.decrementBy({
          tokenAddress: "ADDR",
          amount: incrementAmount,
        });
        const expected = {
          ...initial,
          values: {
            addr: expectedAmount,
          },
        };
        expect(reducer(initial, action)).toEqual(expected);
      });
    }
  );
});
