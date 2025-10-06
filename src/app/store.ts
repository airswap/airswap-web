import {
  configureStore,
  ThunkDispatch,
  AnyAction,
  Store,
  combineReducers,
} from "@reduxjs/toolkit";

import {
  balancesReducer,
  allowancesReducer,
} from "../features/balances/balancesSlice";
import cancelLimitReducer from "../features/cancelLimit/cancelLimitSlice";
import delegateRulesReducer from "../features/delegateRules/delegateRulesSlice";
import gasCostReducer from "../features/gasCost/gasCostSlice";
import indexerReducer from "../features/indexer/indexerSlice";
import makeOrderReducer from "../features/makeOrder/makeOrderSlice";
import metadataReducer from "../features/metadata/metadataSlice";
import myOtcOrdersReducer from "../features/myOtcOrders/myOtcOrdersSlice";
import ordersReducer from "../features/orders/ordersSlice";
import quotesReducer from "../features/quotes/quotesSlice";
import registryReducer from "../features/registry/registrySlice";
import takeLimitReducer from "../features/takeLimit/takeLimitSlice";
import takeOtcReducer from "../features/takeOtc/takeOtcSlice";
import tradeTermsReducer from "../features/tradeTerms/tradeTermsSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";
import userSettingsReducer from "../features/userSettings/userSettingsSlice";
import web3Reducer from "../features/web3/web3Slice";

const reducers = {
  allowances: allowancesReducer,
  transactions: transactionsReducer,
  balances: balancesReducer,
  cancelLimit: cancelLimitReducer,
  delegateRules: delegateRulesReducer,
  metadata: metadataReducer,
  tradeTerms: tradeTermsReducer,
  indexer: indexerReducer,
  orders: ordersReducer,
  gasCost: gasCostReducer,
  registry: registryReducer,
  userSettings: userSettingsReducer,
  makeOrder: makeOrderReducer,
  myOtcOrders: myOtcOrdersReducer,
  takeOtc: takeOtcReducer,
  takeLimit: takeLimitReducer,
  web3: web3Reducer,
  quotes: quotesReducer,
};

const rootReducer = combineReducers(reducers);

// 1. Get the root state's type from reducers
export type RootState = ReturnType<typeof rootReducer>;

// 2. Create a type for thunk dispatch
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;

// 3. Create a type for store using RootState and Thunk enabled dispatch
export type AppStore = Omit<Store<RootState, AnyAction>, "dispatch"> & {
  dispatch: AppDispatch;
};

//4. create the store with your custom AppStore
export const store: AppStore = configureStore({
  reducer: rootReducer,
});
