import { Server } from "@airswap/libraries";
import {
  OrderERC20,
  Pricing,
  ProtocolIds,
  TokenInfo,
  UnsignedOrderERC20,
} from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";

import { BigNumber } from "bignumber.js";
import { providers } from "ethers";

import { AppDispatch } from "../../app/store";
import { ExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricing";
import {
  handlePricingErc20Event,
  isExtendedPricing,
} from "../../entities/ExtendedPricing/ExtendedPricingHelpers";
import { transformExtendedPricingToUnsignedOrder } from "../../entities/ExtendedPricing/ExtendedPricingTransformers";
import { getRegistryServers } from "../../entities/Server/ServerService";
import { PricingErrorType } from "../../errors/pricingError";
import { fetchBestPricing, fetchBestRfqOrder } from "./quotesApi";
import { reset, setBestOrder, setStreamedOrderAndPricing } from "./quotesSlice";

interface FetchBestPricingAndRfqOrder {
  isSubmitted: boolean;
  account?: string;
  baseToken?: TokenInfo;
  baseTokenAmount: string;
  chainId?: number;
  pricing?: ExtendedPricing;
  protocolFee: number;
  library?: Web3Provider;
  quoteToken?: TokenInfo;
}

export const fetchBestPricingAndRfqOrder =
  (props: FetchBestPricingAndRfqOrder) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const {
      isSubmitted,
      account,
      baseToken,
      baseTokenAmount,
      chainId,
      protocolFee,
      library,
      quoteToken,
    } = props;

    if (!chainId || !library || !baseToken || !quoteToken || !account) {
      return;
    }

    if (!isSubmitted) {
      dispatch(reset());

      return;
    }

    dispatch(
      fetchBestPricing({
        provider: library,
        baseToken: baseToken.address,
        baseTokenAmount,
        quoteToken: quoteToken.address,
        chainId: chainId,
        protocolFee,
      })
    );

    dispatch(
      fetchBestRfqOrder({
        provider: library,
        baseTokenAmount,
        baseToken,
        chainId,
        quoteToken,
        senderWallet: account,
      })
    );
  };

export const compareOrdersAndSetBestOrder =
  (
    token: TokenInfo,
    lastLookOrder?: UnsignedOrderERC20,
    rfqOrder?: OrderERC20,
    swapTransactionCost: string = "0"
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setBestOrder(undefined));

    const rfqQuote = rfqOrder
      ? formatUnits(rfqOrder.signerAmount, token.decimals)
      : undefined;
    const lastLookQuote = lastLookOrder
      ? formatUnits(lastLookOrder.senderAmount, token.decimals)
      : undefined;

    if (!rfqQuote && !lastLookQuote) {
      console.error("[compareOrdersAndSetBestOrder] No orders to compare");

      return;
    }

    if (!rfqOrder) {
      dispatch(
        setBestOrder({
          order: lastLookOrder!,
          type: ProtocolIds.LastLookERC20,
          quote: lastLookQuote!,
        })
      );

      return;
    }

    if (!lastLookOrder) {
      dispatch(
        setBestOrder({
          order: rfqOrder,
          type: ProtocolIds.RequestForQuoteERC20,
          quote: rfqQuote!,
        })
      );

      return;
    }

    // When comparing RFQ and LastLook we need to consider that no gas need to be paid for the LastLook transaction
    const lastLookSenderAmount = new BigNumber(lastLookQuote!);
    const justifiedRfqSignerAmount = new BigNumber(rfqQuote!).minus(
      swapTransactionCost
    );

    if (lastLookSenderAmount.gte(justifiedRfqSignerAmount)) {
      dispatch(
        setBestOrder({
          order: lastLookOrder,
          type: ProtocolIds.LastLookERC20,
          quote: lastLookQuote!,
        })
      );

      return;
    }

    dispatch(
      setBestOrder({
        order: rfqOrder,
        type: ProtocolIds.RequestForQuoteERC20,
        quote: rfqQuote!,
      })
    );
  };

interface SubscribePricingERC20 {
  provider: providers.BaseProvider;
  account: string;
  chainId: number;
  baseToken: TokenInfo;
  baseTokenAmount: string;
  quoteToken: TokenInfo;
  protocolFee: number;
  bestPricing: ExtendedPricing;
}

export const subscribePricingERC20 =
  (params: SubscribePricingERC20) =>
  async (dispatch: AppDispatch): Promise<Server | PricingErrorType> => {
    const {
      account,
      baseTokenAmount,
      provider,
      protocolFee,
      chainId,
      quoteToken,
      baseToken,
      bestPricing,
    } = params;

    const servers = await getRegistryServers(
      provider,
      chainId,
      ProtocolIds.LastLookERC20,
      quoteToken.address,
      baseToken.address
    );

    const server = servers.find(
      (server) => server.locator === bestPricing.locator
    );

    if (!server) {
      return PricingErrorType.noServersFound;
    }

    server.on("pricing-erc20", (e: Pricing[]) => {
      const newBestPricing = handlePricingErc20Event(
        e,
        bestPricing.locator,
        server.getSenderWallet(),
        baseToken.address,
        baseTokenAmount,
        quoteToken.address,
        protocolFee
      );

      if (!isExtendedPricing(newBestPricing)) {
        return;
      }

      const newLastLookOrder = transformExtendedPricingToUnsignedOrder({
        account,
        baseToken,
        baseAmount: baseTokenAmount,
        pricing: newBestPricing,
        protocolFee,
        quoteToken,
      });

      dispatch(
        setStreamedOrderAndPricing({
          lastLookOrder: newLastLookOrder,
          bestPricing: newBestPricing,
        })
      );
    });

    server.subscribePricingERC20([
      { baseToken: baseToken.address, quoteToken: quoteToken.address },
    ]);

    return server;
  };
