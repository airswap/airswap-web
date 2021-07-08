import SwapWidget from "../../components/SwapWidget/SwapWidget";

export interface TokenSelectionState {
  status: "senderToken" | "signerToken";
}

export function Orders() {
  return <SwapWidget />;
}
