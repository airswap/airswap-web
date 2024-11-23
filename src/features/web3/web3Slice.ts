import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { ConnectionType } from "../../web3-connectors/connections";
import { walletDisconnected } from "./web3Actions";
import {
  clearLastProviderFromLocalStorage,
  saveLastProviderToLocalStorage,
} from "./web3Api";

export interface Web3State {
  isActive: boolean;
  isDisconnected: boolean;
  isInitialized: boolean;
  isUnsupportedChain: boolean;
  account?: string;
  chainId?: number;
  libraries: Record<number, boolean>;
  walletName?: string;
  connectionType?: ConnectionType;
  error?: Error;
}

const initialState: Web3State = {
  isActive: false,
  isDisconnected: false,
  isInitialized: false,
  isUnsupportedChain: false,
  libraries: {},
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
      isDisconnected: !action.payload,
    }),
    setLibraries: (state, action: PayloadAction<Record<number, boolean>>) => ({
      ...state,
      libraries: action.payload,
    }),
    setShowConnectModal: (state, action: PayloadAction<boolean>) => ({
      ...state,
      showConnectModal: action.payload,
    }),
    setError: (state, action: PayloadAction<Error | undefined>) => ({
      ...state,
      error: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(walletDisconnected, () => {
      return {
        ...initialState,
        isDisconnected: true,
        isInitialized: false,
      };
    });
  },
});

export const selectChainId = (state: RootState) => state.web3.chainId;

export const {
  setConnectionType,
  setError,
  setIsInitialized,
  setLibraries,
  setWeb3Data,
} = web3Slice.actions;

export default web3Slice.reducer;
