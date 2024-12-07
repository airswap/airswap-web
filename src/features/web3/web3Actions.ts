import { createAction } from "@reduxjs/toolkit";

export const walletDisconnected = createAction("web3/walletDisconnected");

export const walletChanged = createAction("web3/walletChanged");

export const chainIdChanged = createAction("web3/chainIdChanged");
