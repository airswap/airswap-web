import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import ordersReducer from "../features/orders/ordersSlice";
import {
  balancesReducer,
  allowancesReducer,
} from "../features/balances/balancesSlice";

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    balances: balancesReducer,
    allowances: allowancesReducer,
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
