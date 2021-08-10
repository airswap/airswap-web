import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import {
  balancesReducer,
  allowancesReducer,
} from "../features/balances/balancesSlice";
import metadataReducer from "../features/metadata/metadataSlice";
import { subscribeToSavedTokenChangesForLocalStoragePersisting } from "../features/metadata/metadataSubscriber";
import ordersReducer from "../features/orders/ordersSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";
import userSettingsReducer from "../features/userSettings/userSettingsSlice";
import walletReducer from "../features/wallet/walletSlice";

export const store = configureStore({
  reducer: {
    allowances: allowancesReducer,
    transactions: transactionsReducer,
    balances: balancesReducer,
    metadata: metadataReducer,
    orders: ordersReducer,
    wallet: walletReducer,
    userSettings: userSettingsReducer,
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
