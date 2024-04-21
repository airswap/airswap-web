import { Registry } from "@airswap/libraries";
import { OrderERC20, Pricing, ProtocolIds } from "@airswap/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";
import { providers } from "ethers";

import { RFQ_EXPIRY_BUFFER_MS } from "../../constants/configParams";
import { ExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricing";
import {
  getPricingQuoteAmount,
  isExtendedPricing,
} from "../../entities/ExtendedPricing/ExtendedPricingHelpers";
import {
  getExtendedPricingERC20,
  subscribeExtendedPricingERC20,
} from "../../entities/ExtendedPricing/ExtendedPricingService";
import { requestRfqOrders } from "../../entities/OrderERC20/OrderERC20Service";
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
    const [rfqServers, lastLookServers] = await Promise.all([
      Registry.getServers(
        provider,
        chainId,
        ProtocolIds.RequestForQuoteERC20,
        quoteToken,
        baseToken
      ),
      Registry.getServers(
        provider,
        chainId,
        ProtocolIds.LastLookERC20,
        quoteToken,
        baseToken
      ),
    ]);

    const timeout = 2000;
    const lastLookPromises = lastLookServers.map((server) =>
      Promise.race([
        subscribeExtendedPricingERC20(server, baseToken, quoteToken),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeout)
        ),
      ])
    );

    const rfqPromises = rfqServers.map((server) =>
      Promise.race([
        getExtendedPricingERC20(server, baseToken, quoteToken),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeout)
        ),
      ])
    );

    const pricingPromises = [...lastLookPromises, ...rfqPromises];

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

    const quoteAmounts = pricings.map((pricing) =>
      getPricingQuoteAmount(pricing, baseTokenAmount, protocolFee)
    );

    // If all pricings are errors, return the first error
    if (quoteAmounts.every((quoteAmount) => quoteAmount in PricingErrorType)) {
      return quoteAmounts.find(
        (quoteAmount) => quoteAmount in PricingErrorType
      ) as PricingErrorType;
    }

    // Because LastLook orders are on top of the array they take priority if quoteAmounts are equal
    const highestQuoteIndex = quoteAmounts
      .filter((quoteAmount) => typeof quoteAmount === "string")
      .reduce(
        (maxIndex, current, index, arr) =>
          new BigNumber(arr[maxIndex]).isLessThan(new BigNumber(current))
            ? index
            : maxIndex,
        0
      );

    return pricings[highestQuoteIndex];
  }
);

interface FetchBestOrderParams {
  provider: providers.BaseProvider;
  baseTokenAmount: string;
  baseTokenDecimals: number;
  chainId: number;
  pricing: Pricing;
  senderWallet: string;
}

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

export const fetchBestRfqOrder = createAsyncThunk<
  OrderERC20 | PricingErrorType,
  FetchBestOrderParams
>(
  "quotes/fetchBestRfqOrder",
  async ({
    provider,
    baseTokenAmount,
    baseTokenDecimals,
    chainId,
    pricing,
    senderWallet,
  }) => {
    const servers = await Registry.getServers(
      provider,
      chainId,
      ProtocolIds.RequestForQuoteERC20,
      pricing.quoteToken,
      pricing.baseToken
    );

    const orders = await requestRfqOrders(
      servers,
      pricing.quoteToken,
      pricing.baseToken,
      baseTokenAmount,
      baseTokenDecimals,
      senderWallet
    );

    return getBestOrder(orders);
  }
);
