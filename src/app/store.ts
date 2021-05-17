import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import ordersReducer from "../features/orders/ordersSlice";
import balancesReducer from "../features/balances/balancesSlice";

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    balances: balancesReducer,
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
