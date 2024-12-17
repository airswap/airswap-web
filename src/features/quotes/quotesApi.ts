import { Server } from "@airswap/libraries";
import { OrderERC20, ProtocolIds, TokenInfo } from "@airswap/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { providers } from "ethers";

import {
  RFQ_EXPIRY_BUFFER_MS,
  SERVER_PRICING_RESPONSE_TIME_MS,
} from "../../constants/configParams";
import { ExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricing";
import {
  getBestPricing,
  isExtendedPricing,
} from "../../entities/ExtendedPricing/ExtendedPricingHelpers";
import { getExtendedPricingERC20 } from "../../entities/ExtendedPricing/ExtendedPricingService";
import { requestRfqOrders } from "../../entities/OrderERC20/OrderERC20Service";
import { getRegistryServers } from "../../entities/Server/ServerService";
import { PricingErrorType } from "../../errors/pricingError";
import { isPromiseFulfilledResult } from "../../helpers/promise";
import { compareAddresses } from "../../helpers/string";
import { orderSortingFunction } from "../orders/ordersHelpers";

interface FetchBestPricingParams {
  provider: providers.BaseProvider;
  chainId: number;
  baseToken: string;
  baseTokenAmount: string;
  quoteToken: string;
  protocolFee: number;
}

export const fetchBestPricing = createAsyncThunk<
  ExtendedPricing | PricingErrorType,
  FetchBestPricingParams
>(
  "quotes/fetchBestPricing",
  async ({
    provider,
    chainId,
    baseToken,
    baseTokenAmount,
    quoteToken,
    protocolFee,
  }) => {
    const servers = await getRegistryServers(
      provider,
      chainId,
      ProtocolIds.LastLookERC20,
      quoteToken,
      baseToken
    );

    if (!servers.length) {
      return PricingErrorType.noServersFound;
    }

    const pricingPromises = servers.map((server) =>
      Promise.race([
        getExtendedPricingERC20(server, baseToken, quoteToken),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout")),
            SERVER_PRICING_RESPONSE_TIME_MS
          )
        ),
      ])
    );

    if (!pricingPromises.length) {
      return PricingErrorType.noPricingFound;
    }

    const responses = await Promise.allSettled(pricingPromises);

    const pricings = responses
      .filter((response): response is PromiseFulfilledResult<unknown> =>
        isPromiseFulfilledResult<unknown>(response)
      )
      .filter((response) => Array.isArray(response.value))
      .flatMap((response) => response.value)
      .filter(isExtendedPricing)
      .filter(
        (pricing) =>
          compareAddresses(pricing.baseToken, baseToken) &&
          compareAddresses(pricing.quoteToken, quoteToken)
      );

    if (!pricings.length) {
      return PricingErrorType.noPricingFound;
    }

    return getBestPricing(pricings, baseTokenAmount, protocolFee);
  }
);

const getBestOrder = (orders: OrderERC20[]): OrderERC20 | PricingErrorType => {
  if (!orders.length) {
    return PricingErrorType.noOrdersFound;
  }

  const sortedOrders = orders.sort(orderSortingFunction);
  const bestOrder = sortedOrders[0];
  const expiry = parseInt(bestOrder.expiry) * 1000;

  // Due to the sorting in orderSorting function, these orders will be at
  // the bottom of the list, so if the best one has a very short expiry
  // so do all the others. Return an empty order array as none are viable.
  if (expiry - Date.now() < RFQ_EXPIRY_BUFFER_MS) {
    return PricingErrorType.ordersExpired;
  }

  return bestOrder;
};

interface FetchBestOrderParams {
  baseTokenAmount: string;
  baseToken: TokenInfo;
  chainId: number;
  provider: providers.BaseProvider;
  quoteToken: TokenInfo;
  senderWallet: string;
}

export const fetchBestRfqOrder = createAsyncThunk<
  OrderERC20 | PricingErrorType,
  FetchBestOrderParams
>(
  "quotes/fetchBestRfqOrder",
  async ({
    baseTokenAmount,
    baseToken,
    chainId,
    provider,
    quoteToken,
    senderWallet,
  }) => {
    const servers = await getRegistryServers(
      provider,
      chainId,
      ProtocolIds.RequestForQuoteERC20,
      quoteToken.address,
      baseToken.address
    );

    if (!servers.length) {
      return PricingErrorType.noServersFound;
    }

    const orders = await requestRfqOrders(
      servers,
      quoteToken.address,
      baseToken.address,
      baseTokenAmount,
      baseToken.decimals,
      senderWallet
    );

    return getBestOrder(orders);
  }
);

export const getBestPricingServer = async (
  params: FetchBestPricingParams,
  locator: string
): Promise<Server | PricingErrorType> => {
  const { provider, chainId, quoteToken, baseToken } = params;

  const servers = await getRegistryServers(
    provider,
    chainId,
    ProtocolIds.LastLookERC20,
    quoteToken,
    baseToken
  );

  const server = servers.find((server) => server.getUrl() === locator);

  if (!server) {
    return PricingErrorType.noServersFound;
  }

  return server;
};
