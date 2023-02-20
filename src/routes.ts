export enum AppRoutes {
  make = "make",
  myOrders = "my-orders",
  availableOrders = "available-orders",
  order = "order",
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
