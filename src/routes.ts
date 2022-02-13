export enum AppRoutes {
  join = "join",
  whitepaper = "whitepaper",
  swap = "swap",
}

export interface SwapRouteType {
  tokenFrom?: string;
  tokenTo?: string;
}

export enum SwapRoutes {
  tokenFrom = "tokenFrom",
  tokenTo = "tokenTo",
}
