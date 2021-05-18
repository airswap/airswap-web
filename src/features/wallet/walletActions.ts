import { createAction } from "@reduxjs/toolkit";

const walletConnected = createAction<{
  account: string;
  chainId: number;
}>("wallet/accountConnected");

export { walletConnected };
