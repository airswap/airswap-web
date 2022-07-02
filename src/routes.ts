export enum AppRoutes {
  join = "join",
  whitepaper = "whitepaper",
  swap = "swap",
  make = "make",
  mySwaps = "my-swaps",
}

export interface SwapRouteType {
  tokenFrom?: string;
  tokenTo?: string;
}

export enum SwapRoutes {
  tokenFrom = "tokenFrom",
  tokenTo = "tokenTo",
}
