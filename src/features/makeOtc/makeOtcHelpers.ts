import {compressFullOrder, decompressFullOrder} from "@airswap/utils";
import {FullOrder} from "@airswap/typescript";

export const getUserOtcOrdersLocalStorageKey: (
  account: string,
  chainId: string | number,
) => string = (account, chainId) =>
  `airswap/userOtcOrders/${account}/${chainId}`;

export const writeUserOrdersToLocalStorage = (orders: FullOrder[], address: string, chainId: string | number): void => {
  const key = getUserOtcOrdersLocalStorageKey(address, chainId);
  console.log(JSON.stringify(orders.map(order => compressFullOrder(order))));
  localStorage.setItem(key, JSON.stringify(orders.map(order => compressFullOrder(order))));
}

export const getUserOrdersFromLocalStorage = (address: string, chainId: string | number): FullOrder[] => {
  const localStorageUserOrders = localStorage.getItem(getUserOtcOrdersLocalStorageKey(address, chainId));
  const userOrderStrings: string[] = localStorageUserOrders ? JSON.parse(localStorageUserOrders) : [];

  return userOrderStrings.map(order => decompressFullOrder(order));
}
