export enum AppRoutes {
  join = "join",
  make = "make",
  mySwaps = "my-swaps",
  swap = "swap",
  swapId = "swap-id",
}

export interface SwapRouteType {
  tokenFrom?: string;
  tokenTo?: string;
}

export enum SwapRoutes {
  tokenFrom = "tokenFrom",
  tokenTo = "tokenTo",
}
