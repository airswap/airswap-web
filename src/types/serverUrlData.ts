type Pricing = {
  baseToken: string;
  quoteToken: string;
  minimum: string;
  bid: [[string, string]];
  ask: [[string, string]];
};

export type ServerUrlData = {
  wallet: string;
  chainId: number;
  pricing: Pricing[];
};
