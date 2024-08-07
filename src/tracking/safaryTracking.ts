export const safaryTracking = () => {
  if (window.safary) {
    window.safary.track({
      eventType: "swap",
      eventName: "swaps-main",
      parameters: {
        walletAddress: "0x9999999999999",
        fromAmount: 0.001,
        fromCurrency: "ETH",
        contractAddress: "0x000000000000",
      }
    });

    window.safary.track({
      eventType: "swap",
      eventName: "swaps-OTC",
      parameters: {
        fromAmount: 0.001,
        fromCurrency: "ETH",
        fromAmountUSD: 1.8,
        contractAddress: "0x000000000000",
        toAmount: 0.000045,
        toCurrency: "USDT",
        toAmountUSD: 1.73,
      }
    });
  } else {
    console.error("Safary SDK is not loaded");
  }
};
