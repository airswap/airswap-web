import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import ordersReducer from "../features/orders/ordersSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";
import {
  balancesReducer,
  allowancesReducer,
} from "../features/balances/balancesSlice";

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    balances: balancesReducer,
    allowances: allowancesReducer,
    transactions: transactionsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
