import { Registry } from "@airswap/libraries";
import { Pricing, ProtocolIds } from "@airswap/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";
import { providers } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import {
  getPricingQuoteAmount,
  isExtendedPricing,
} from "../../entities/ExtendedPricing/ExtendedPricingHelpers";
import {
  getExtendedPricingERC20,
  subscribeExtendedPricingERC20,
} from "../../entities/ExtendedPricing/ExtendedPricingService";
import { PricingErrorType } from "../../errors/pricingError";
import { isPromiseFulfilledResult } from "../../helpers/promise";
import { compareAddresses } from "../../helpers/string";

interface FetchQuotesParams {
  provider: providers.BaseProvider;
  chainId: number;
  baseToken: string;
  baseTokenAmount: string;
  quoteToken: string;
  protocolFee: number;
}

export const fetchQuotes = createAsyncThunk<
  Pricing | PricingErrorType,
  FetchQuotesParams,
  { dispatch: AppDispatch; state: RootState }
>(
  "quotes/fetchQuotes",
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
      .filter((response): response is PromiseFulfilledResult<unknown[]> =>
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

    console.log(pricings);

    const quoteAmounts = pricings.map((pricing) =>
      getPricingQuoteAmount(pricing, baseTokenAmount, protocolFee)
    );

    console.log(quoteAmounts);

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
