import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  providerName: string | null;
}

const initialState: WalletState = {
  connected: false,
  address: null,
  chainId: null,
  providerName: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletConnected: (
      state,
      action: PayloadAction<{ address: string; chainId: number }>
    ) => {
      state.connected = true;
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
    },
    setWalletDisconnected: () => initialState,
    setActiveProvider: (state, action: PayloadAction<string>) => {
      state.providerName = action.payload;
    },
  },
});

export const selectWallet = (state: RootState) => state.wallet;

export const { setWalletConnected, setWalletDisconnected, setActiveProvider } =
  walletSlice.actions;

export default walletSlice.reducer;
