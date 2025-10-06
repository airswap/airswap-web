export interface DelegateRule {
  id: string;
  chainId: number;
  senderFilledAmount: string;
  senderWallet: string;
  senderToken: string;
  senderAmount: string;
  signerToken: string;
  signerAmount: string;
  expiry: number;
}

export interface DelegateSetRuleEvent extends DelegateRule {
  name: "SetRule";
  hash: string;
  status?: number;
}
export interface DelegateUnsetRuleEvent {
  name: "UnsetRule";
  id: string;
  senderWallet: string;
  senderToken: string;
  signerToken: string;
  chainId: number;
  hash: string;
  status?: number;
}

export interface DelegatedSwapEvent {
  name: "DelegatedSwapFor";
  chainId: number;
  hash: string;
  senderWallet: string;
  signerWallet: string;
  status?: number;
  nonce: string;
}
