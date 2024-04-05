export interface CancelEvent {
  name: "Cancel";
  hash: string;
  nonce: string;
  signerAddress: string;
  status?: number;
}
