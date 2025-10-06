import {
  compressFullOrderERC20,
  compressFullOrder,
  decompressFullOrderERC20,
  FullOrder,
  FullOrderERC20,
  decompressFullOrder,
} from "@airswap/utils";

import { isFullOrder } from "../../entities/FullOrder/FullOrderHelpers";
import { isFullOrderERC20 } from "../../entities/OrderERC20/OrderERC20Helpers";

export const getUserOtcOrdersLocalStorageKey: (
  account: string,
  chainId: string | number,
  isErc20?: boolean
) => string = (account, chainId, isErc20) => {
  const type = isErc20 ? "erc20" : "full";
  return `airswap/userOtcOrders/${type}/${account.toLowerCase()}/${chainId}}`;
};

export const writeOtcUserOrdersToLocalStorage = (
  orders: (FullOrder | FullOrderERC20)[],
  address: string,
  chainId: string | number
): void => {
  const fullOrdersKey = getUserOtcOrdersLocalStorageKey(
    address.toLowerCase(),
    chainId
  );
  const erc20OrdersKey = getUserOtcOrdersLocalStorageKey(
    address.toLowerCase(),
    chainId,
    true
  );

  const fullOrders = orders.filter((order) =>
    isFullOrder(order)
  ) as FullOrder[];
  const erc20Orders = orders.filter((order) =>
    isFullOrderERC20(order)
  ) as FullOrderERC20[];

  localStorage.setItem(
    fullOrdersKey,
    JSON.stringify(fullOrders.map(compressFullOrder))
  );
  localStorage.setItem(
    erc20OrdersKey,
    JSON.stringify(erc20Orders.map(compressFullOrderERC20))
  );
};

export const getUserOrdersFromLocalStorage = (
  address: string,
  chainId: string | number
): (FullOrder | FullOrderERC20)[] => {
  const localStorageUserFullOrders = localStorage.getItem(
    getUserOtcOrdersLocalStorageKey(address, chainId)
  );
  const localStorageUserErc20Orders = localStorage.getItem(
    getUserOtcOrdersLocalStorageKey(address, chainId, true)
  );
  const userFullOrderStrings: string[] = localStorageUserFullOrders
    ? JSON.parse(localStorageUserFullOrders)
    : [];
  const userErc20OrderStrings: string[] = localStorageUserErc20Orders
    ? JSON.parse(localStorageUserErc20Orders)
    : [];

  const orders = [
    ...userFullOrderStrings.map(
      (order) => decompressFullOrder(order) as unknown as FullOrder
    ),
    ...userErc20OrderStrings.map(
      (order) => decompressFullOrderERC20(order) as unknown as FullOrderERC20
    ),
  ];

  return orders;
};
