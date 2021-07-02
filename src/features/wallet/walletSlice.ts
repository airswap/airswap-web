import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number | null;
}

const initialState: WalletState = {
  connected: false,
  address: null,
  chainId: null,
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
  },
});

export const selectWallet = (state: RootState) => state.wallet;

export const {
  setWalletConnected,
  setWalletDisconnected,
} = walletSlice.actions;

export default walletSlice.reducer;
