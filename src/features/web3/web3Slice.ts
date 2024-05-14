import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ConnectionType } from "../../web3-connectors/connections";
import {
  clearLastProviderFromLocalStorage,
  saveLastProviderToLocalStorage,
} from "./web3Api";

export interface Web3State {
  isActive: boolean;
  isInitialized: boolean;
  showConnectModal: boolean;
  userHasClosedConnectModal: boolean;
  account?: string;
  chainId?: number;
  libraries: Record<number, boolean>;
  walletName?: string;
  connectionType?: ConnectionType;
  error?: Error;
}

const initialState: Web3State = {
  isActive: false,
  isInitialized: false,
  libraries: {},
  showConnectModal: false,
  userHasClosedConnectModal: false,
};

export const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    setWeb3Data: (
      state,
      action: PayloadAction<Pick<Web3State, "isActive" | "account" | "chainId">>
    ) => ({
      ...state,
      ...action.payload,
    }),
    setConnectionType: (
      state,
      action: PayloadAction<ConnectionType | undefined>
    ) => {
      if (action.payload) {
        saveLastProviderToLocalStorage(action.payload);
      } else {
        clearLastProviderFromLocalStorage();
      }

      return {
        ...state,
        connectionType: action.payload,
      };
    },
    setIsInitialized: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isInitialized: action.payload,
    }),
    setLibraries: (state, action: PayloadAction<Record<number, boolean>>) => ({
      ...state,
      libraries: action.payload,
    }),
    setShowConnectModal: (state, action: PayloadAction<boolean>) => ({
      ...state,
      showConnectModal: action.payload,
    }),
    setUserHasClosedConnectModal: (state, action: PayloadAction<boolean>) => ({
      ...state,
      userHasClosedConnectModal: action.payload,
    }),
    setError: (state, action: PayloadAction<Error | undefined>) => ({
      ...state,
      error: action.payload,
    }),
  },
});

export const {
  setConnectionType,
  setError,
  setIsInitialized,
  setLibraries,
  setShowConnectModal,
  setUserHasClosedConnectModal,
  setWeb3Data,
} = web3Slice.actions;

export default web3Slice.reducer;
