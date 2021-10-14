import { createContext, FC } from "react";

import { Server } from "@airswap/libraries";
// TODO: type defs for this.
// @ts-ignore
import lightDeploys from "@airswap/light/deploys.js";
import { Pricing, Levels } from "@airswap/types";
import { LightOrder } from "@airswap/types";
import {
  createLightOrder,
  createLightSignature,
  calculateCostFromLevels,
} from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

import BigNumber from "bignumber.js";

import { useAppDispatch } from "../../app/hooks";
import { LAST_LOOK_ORDER_EXPIRY_SEC } from "../../constants/configParams";
import { updatePricing } from "../../features/pricing/pricingSlice";
import { TradeTerms } from "../../features/tradeTerms/tradeTermsSlice";

type Pair = {
  baseToken: string;
  quoteToken: string;
};

export const LastLookContext = createContext<{
  subscribeAllServers: (servers: Server[], pair: Pair) => void;
  unsubscribeAllServers: () => void;
  sendOrderForConsideration: (params: {
    locator: string;
    terms: TradeTerms;
    pricing: Levels;
  }) => Promise<boolean>;
}>({
  subscribeAllServers: () => {},
  unsubscribeAllServers: () => {},
  sendOrderForConsideration: async () => {
    return false;
  },
});

const LastLookProvider: FC<{}> = ({ children }) => {
  const connectedServers: Record<string, Server> = {};
  const { account, library, chainId } = useWeb3React();

  const dispatch = useAppDispatch();

  // TODO: check if these need to be memoized.

  const subscribeAllServers = (servers: Server[], pair: Pair) => {
    const pricePromises = servers.map(async (s) => {
      const receivedPricePromise = new Promise<Pricing>(async (resolve) => {
        let server = s;
        if (connectedServers[s.locator]) server = connectedServers[s.locator];
        connectedServers[server.locator] = server;

        const handlePricing = (pricing: Pricing[]) => {
          const pairPricing = pricing.find(
            (p) =>
              p.baseToken === pair.baseToken && p.quoteToken === pair.quoteToken
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
            `RPC WebSocket error [${server.locator}]: ${e.code} - ${e.message}`,
            e
          );
        });
        const pricing = await server.subscribe([pair]);
        handlePricing(pricing);
      });

      return receivedPricePromise;
    });
    return pricePromises;
  };

  const unsubscribeAllServers = () => {
    Object.keys(connectedServers).forEach((locator) => {
      const server = connectedServers[locator];
      server.removeAllListeners();
      server.disconnect();
    });
  };

  const sendOrderForConsideration = async (params: {
    locator: string;
    terms: TradeTerms;
    pricing: Levels;
  }) => {
    const { locator, terms, pricing } = params;
    const server = connectedServers[locator];

    // baseAmount always known.
    // For a sell, baseAmount is signerAmount.
    // For a buy, baseAmount is senderAmount.

    // Amount specified = senderAmount + senderAmount * (signerFee / 1000)
    const signerFee = 7;
    let signerAmount: string, senderAmount: string;
    if (terms.side === "sell") {
      signerAmount = new BigNumber(terms.baseTokenAmount)
        .multipliedBy(new BigNumber(signerFee).dividedBy(1000))
        .integerValue(BigNumber.ROUND_CEIL)
        .toString();
      senderAmount = calculateCostFromLevels(signerAmount.toString(), pricing);
    } else {
      // TODO: buy.
      signerAmount = "0";
      senderAmount = "0";
    }

    const order = createLightOrder({
      expiry: Date.now() / 1000 + LAST_LOOK_ORDER_EXPIRY_SEC,
      nonce: Date.now().toString(),
      signerWallet: account,
      signerToken: terms.baseToken,
      senderToken: terms.quoteToken,
      signerFee: signerFee.toString(), // TODO: fee
      signerAmount: signerAmount, // TODO: signerAmount
      senderAmount: senderAmount, // TODO: senderAmount
    });

    // TODO: deal with rejection here (cancel signature request)
    const signature = await createLightSignature(
      order,
      library,
      lightDeploys[chainId],
      chainId!
    );

    const signedOrder: LightOrder = {
      ...order,
      ...signature,
    };

    return server.consider(signedOrder);
  };

  return (
    <LastLookContext.Provider
      value={{
        subscribeAllServers,
        unsubscribeAllServers,
        sendOrderForConsideration,
      }}
    >
      {children}
    </LastLookContext.Provider>
  );
};

export default LastLookProvider;
