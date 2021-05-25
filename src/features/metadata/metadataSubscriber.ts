import { store } from "../../app/store";
import { getActiveTokensLocalStorageKey } from "./metadataApi";

export const subscribeToSavedTokenChangesForLocalStoragePersisting = () => {
  const cache: {
    [chainId: number]: string[];
  } = {};
  store.subscribe(() => {
    const { wallet, metadata } = store.getState();
    if (!wallet.connected) return;
    const cached = cache[wallet.chainId!];
    if (metadata.tokens.active.length && cached !== metadata.tokens.active) {
      // active tokens have changed, persist to local storage.
      cache[wallet.chainId!] = metadata.tokens.active;
      localStorage.setItem(
        getActiveTokensLocalStorageKey(wallet.chainId!),
        metadata.tokens.active.join(",")
      );
    }
  });
};
