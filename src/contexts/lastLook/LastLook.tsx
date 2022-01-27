import { createContext, FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Server } from "@airswap/libraries";
// TODO: type defs for this.
// @ts-ignore
import lightDeploys from "@airswap/light/deploys.js";
import { LightOrder, Pricing } from "@airswap/types";
import { createOrder, createClaimSignature } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import BigNumber from "bignumber.js";

import { useAppDispatch } from "../../app/hooks";
import { notifyError } from "../../components/Toasts/ToastController";
import { LAST_LOOK_ORDER_EXPIRY_SEC } from "../../constants/configParams";
import { updatePricing } from "../../features/pricing/pricingSlice";
import { TradeTerms } from "../../features/tradeTerms/tradeTermsSlice";
import {
  SubmittedTransactionWithOrder,
  submitTransactionWithExpiry,
} from "../../features/transactions/transactionsSlice";

type Pair = {
  baseToken: string;
  quoteToken: string;
};

export const LastLookContext = createContext<{
  subscribeAllServers: (servers: Server[], pair: Pair) => Promise<Pricing>[];
  unsubscribeAllServers: () => void;
  sendOrderForConsideration: (params: {
    locator: string;
    order: LightOrder;
  }) => Promise<boolean>;
  getSignedOrder: (params: {
    locator: string;
    terms: TradeTerms;
  }) => Promise<{ order: LightOrder; senderWallet: string }>;
}>({
  subscribeAllServers(servers: Server[], pair: Pair): Promise<Pricing | any>[] {
    return [];
  },
  unsubscribeAllServers: () => {},
  sendOrderForConsideration: async () => {
    return false;
  },
  getSignedOrder: async (params: {
    locator: string;
    terms: TradeTerms;
  }): Promise<LightOrder | any> => {
    return {};
  },
});

const connectedServers: Record<string, Server> = {};
const LastLookProvider: FC = ({ children }) => {
  const { account, library, chainId } = useWeb3React();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const subscribeAllServers = useCallback(
    (servers: Server[], pair: Pair) => {
      return servers.map(async (s) => {
        return new Promise<Pricing>(async (resolve) => {
          let server = s;
          if (connectedServers[s.locator]) server = connectedServers[s.locator];
          connectedServers[server.locator] = server;

          const handlePricing = (pricing: Pricing[]) => {
            const pairPricing = pricing.find(
              (p) =>
                p &&
                p.baseToken === pair.baseToken &&
                p.quoteToken === pair.quoteToken
            );
            if (pairPricing) {
              resolve(pairPricing);
              dispatch(
                updatePricing({
                  locator: server.locator,
                  pricing: pairPricing,
                })
              );
            } else {
              console.warn(
                `Didn't receive pricing for pair in update from ${server.locator}`
              );
            }
          };

          server.on("pricing", handlePricing.bind(null));
          server.on("error", (e) => {
            console.error(
              `RPC WebSocket error: [${server.locator}]: ${e.code} - ${e.message}`,
              e
            );
          });
          const pricing = await server.subscribe([pair]);
          handlePricing(pricing);
        });
      });
    },
    [dispatch]
  );

  const unsubscribeAllServers = useCallback(() => {
    Object.keys(connectedServers).forEach((locator) => {
      const server = connectedServers[locator];
      server.removeAllListeners();
      server.disconnect();
      delete connectedServers[locator];
    });
  }, []);

  const getSignedOrder = useCallback(
    async (params: {
      locator: string;
      terms: TradeTerms;
    }): Promise<{ order: LightOrder; senderWallet: string }> => {
      const { locator, terms } = params;
      const server = connectedServers[locator];

      const isSell = terms.side === "sell";

      if (terms.quoteAmount === null)
        throw new Error("No quote amount specified");
      const baseAmountAtomic = new BigNumber(terms.baseAmount)
        .multipliedBy(10 ** terms.baseToken.decimals)
        // Note that we remove the signer fee from the amount that we send.
        // This was already done to determine quoteAmount.
        .dividedBy(terms.side === "sell" ? 1.0007 : 1)
        .integerValue(BigNumber.ROUND_CEIL)
        .toString();
      const quoteAmountAtomic = new BigNumber(terms.quoteAmount!)
        .multipliedBy(10 ** terms.quoteToken.decimals)
        .integerValue(BigNumber.ROUND_FLOOR)
        .toString();

      const unsignedOrder = createOrder({
        expiry: Math.floor(Date.now() / 1000 + LAST_LOOK_ORDER_EXPIRY_SEC),
        nonce: Date.now().toString(),
        senderWallet: server.getSenderWallet(),
        signerWallet: account,
        signerToken: terms.baseToken.address,
        senderToken: terms.quoteToken.address,
        signerFee: "7",
        signerAmount: isSell ? baseAmountAtomic : quoteAmountAtomic,
        senderAmount: !isSell ? baseAmountAtomic : quoteAmountAtomic,
      });
      const signature = await createClaimSignature(
        unsignedOrder,
        library.getSigner(),
        lightDeploys[chainId],
        chainId!
      );

      const order: LightOrder = {
        expiry: unsignedOrder.expiry,
        nonce: unsignedOrder.nonce,
        senderToken: unsignedOrder.senderToken,
        senderAmount: unsignedOrder.senderAmount,
        signerWallet: unsignedOrder.signerWallet,
        signerToken: unsignedOrder.signerToken,
        signerAmount: unsignedOrder.signerAmount,
        ...signature,
      };

      const transaction: SubmittedTransactionWithOrder = {
        type: "Order",
        order: order,
        nonce: order.nonce,
        status: "processing",
        protocol: "last-look",
        expiry: unsignedOrder.expiry,
        timestamp: Date.now(),
      };
      dispatch(
        submitTransactionWithExpiry({
          transaction,
          signerWallet: unsignedOrder.signerWallet,
          onExpired: () => {
            notifyError({
              heading: t("orders.swapExpired"),
              cta: t("orders.swapExpiredCallToAction"),
            });
          },
        })
      );

      return {
        order,
        senderWallet: unsignedOrder.senderWallet,
      };
    },
    [account, chainId, dispatch, library, t]
  );

  const sendOrderForConsideration = useCallback(
    async (params: { locator: string; order: LightOrder }) => {
      const { locator, order } = params;
      const server = connectedServers[locator];
      try {
        return server.consider(order);
      } catch (e) {
        console.error("Server unable to consider order: ", e);
        throw e;
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      subscribeAllServers,
      unsubscribeAllServers,
      sendOrderForConsideration,
      getSignedOrder,
    }),
    [
      getSignedOrder,
      subscribeAllServers,
      unsubscribeAllServers,
      sendOrderForConsideration,
    ]
  );

  return (
    <LastLookContext.Provider value={value}>
      {children}
    </LastLookContext.Provider>
  );
};

export default LastLookProvider;
