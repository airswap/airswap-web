import { Alchemy } from "alchemy-sdk";

declare module "@airswap/balances/deploys";

declare global {
  interface Window {
    ethereum: any;
    alchemy: Alchemy;
  }

  const alchemy: typeof alchemy;
}
