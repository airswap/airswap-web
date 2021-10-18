import { createContext, FC } from "react";

import { Server } from "@airswap/libraries";
// TODO: type defs for this.
// @ts-ignore
import lightDeploys from "@airswap/light/deploys.js";
import { Pricing, Levels } from "@airswap/types";
import { LightOrder } from "@airswap/types";
import { createLightOrder, createLightSignature } from "@airswap/utils";
import { useWeb3React } from "@web3-react/core";

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
            `RPC WebSocket error: [${server.locator}]: ${e.code} - ${e.message}`,
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
      delete connectedServers[locator];
    });
  };

  const sendOrderForConsideration = async (params: {
    locator: string;
    terms: TradeTerms;
  }) => {
    const { locator, terms } = params;

    if (terms.quoteAmount === null)
      throw new Error("No quote amount specified");
    const server = connectedServers[locator];

    const isSell = terms.side === "sell";

    const order = createLightOrder({
      expiry: Date.now() / 1000 + LAST_LOOK_ORDER_EXPIRY_SEC,
      nonce: Date.now().toString(),
      signerWallet: account,
      signerToken: terms.baseToken,
      senderToken: terms.quoteToken,
      signerFee: "7",
      signerAmount: isSell ? terms.baseAmount : terms.quoteAmount,
      senderAmount: !isSell ? terms.baseAmount : terms.quoteAmount,
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
