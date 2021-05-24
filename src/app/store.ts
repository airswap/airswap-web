import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import ordersReducer from "../features/orders/ordersSlice";
import walletReducer from "../features/wallet/walletSlice";
import metadataReducer from "../features/metadata/metadataSlice";
import {
  balancesReducer,
  allowancesReducer,
} from "../features/balances/balancesSlice";
import { subscribeToSavedTokenChangesForLocalStoragePersisting } from "../features/metadata/metadataSubscriber";

export const store = configureStore({
  reducer: {
    allowances: allowancesReducer,
    balances: balancesReducer,
    metadata: metadataReducer,
    orders: ordersReducer,
    wallet: walletReducer,
  },
});

subscribeToSavedTokenChangesForLocalStoragePersisting();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
