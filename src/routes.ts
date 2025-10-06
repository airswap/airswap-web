export enum AppRoutes {
  approvals = "approvals",
  makeOtcOrder = "make-otc-order",
  makeLimitOrder = "make-limit-order",
  myOtcOrders = "my-otc-orders",
  myLimitOrders = "my-limit-orders",
  otcOrder = "otc-order",
  limitOrder = "limit-order",
  swap = "swap",
}

// Routes that don't have a navigation bar
export const standAloneRoutes = [
  AppRoutes.approvals,
  AppRoutes.otcOrder,
  AppRoutes.limitOrder,
];

export interface SwapRouteType {
  tokenFrom?: string;
  tokenTo?: string;
}

export enum SwapRoutes {
  tokenFrom = "tokenFrom",
  tokenTo = "tokenTo",
}

export const routes = {
  approvals: () => `/${AppRoutes.approvals}`,
  makeOtcOrder: () => `/${AppRoutes.makeOtcOrder}`,
  makeLimitOrder: () => `/${AppRoutes.makeLimitOrder}`,
  myOtcOrders: () => `/${AppRoutes.myOtcOrders}`,
  myLimitOrders: () => `/${AppRoutes.myLimitOrders}`,
  otcOrder: (compressedOrder: string) =>
    `/${AppRoutes.otcOrder}/${compressedOrder}`,
  limitOrder: (
    senderWallet: string,
    senderToken: string,
    signerToken: string,
    chainId: number
  ) =>
    `/${AppRoutes.limitOrder}/${senderWallet}/${senderToken}/${signerToken}/${chainId}`,
  cancelOtcOrder: (compressedOrder: string) =>
    `/${AppRoutes.otcOrder}/${compressedOrder}/cancel`,
  swap: () => `/${AppRoutes.swap}`,
};
