import { Server } from "@airswap/libraries";

import { ExtendedPricing } from "./ExtendedPricing";
import { transformToExtendedPricing } from "./ExtendedPricingTransformers";

export const subscribeExtendedPricingERC20 = async (
  server: Server,
  baseToken: string,
  quoteToken: string
): Promise<ExtendedPricing[]> => {
  const pricings = await server.subscribePricingERC20([
    { baseToken, quoteToken },
  ]);

  server.unsubscribePricingERC20([{ baseToken, quoteToken }]);
  server.disconnect();

  return pricings.map((pricing) =>
    transformToExtendedPricing(
      pricing,
      server.getUrl(),
      server.getSenderWallet()
    )
  );
};

export const getExtendedPricingERC20 = async (
  server: Server,
  baseToken: string,
  quoteToken: string
): Promise<ExtendedPricing[]> => {
  const pricings = await server.getPricingERC20([{ baseToken, quoteToken }]);

  server.disconnect();

  return pricings.map((pricing) =>
    transformToExtendedPricing(
      pricing,
      server.getUrl(),
      server.getSenderWallet()
    )
  );
};
