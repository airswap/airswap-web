import { TokenInfo } from "@airswap/types";

import findTokenFromAndTokenToAddress from "./findTokenFromAndTokenToAddress";

describe("findTokenFromAndTokenToAddress", () => {
  let tokens: TokenInfo[];

  beforeEach(() => {
    tokens = [
      {
        chainId: 1,
        address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
        name: "0x Protocol Token",
        symbol: "ZRX",
        decimals: 18,
      },
      {
        chainId: 1,
        address: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
        name: "Compound USD Coin",
        symbol: "cUSDC",
        decimals: 8,
      },
      {
        chainId: 1,
        address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
        name: "Wrapped BTC",
        symbol: "WBTC",
        decimals: 8,
      },
      {
        chainId: 1,
        address: "0xface851a4921ce59e912d19329929ce6da6eb0c7",
        name: "Compound ChainLink",
        symbol: "cLINK",
        decimals: 8,
      },
    ];
  });

  it("should return addresses", () => {
    const result1 = findTokenFromAndTokenToAddress(
      tokens,
      "ZRX",
      "WBTC",
      "0xface851a4921ce59e912d19329929ce6da6eb0c7",
      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
    );
    const result2 = findTokenFromAndTokenToAddress(
      tokens,
      "ZRX",
      "WBTC",
      "0xface851a4921ce59e912d19329929ce6da6eb0c7",
      "0x2260fac5e5542a773aa44fbcfedf7c"
    );
    const result3 = findTokenFromAndTokenToAddress(
      tokens,
      "ZRX",
      "WBTC",
      "0xface851a4921ce59e912d19329929ce",
      "0xe41d2489571d322189246dafa5ebde1f4699f498"
    );
    const result4 = findTokenFromAndTokenToAddress(tokens, "ZRX", "WBTC");
    const result5 = findTokenFromAndTokenToAddress(tokens, "ZRX", "XXX");

    expect(result1.fromAddress).toBe(
      "0xface851a4921ce59e912d19329929ce6da6eb0c7"
    );
    expect(result1.toAddress).toBe(
      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
    );
    expect(result2.fromAddress).toBe(
      "0xface851a4921ce59e912d19329929ce6da6eb0c7"
    );
    expect(result2.toAddress).toBe(
      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
    );
    expect(result3.fromAddress).toBe(
      "0xe41d2489571d322189246dafa5ebde1f4699f498"
    );
    expect(result3.toAddress).toBe(
      "0xe41d2489571d322189246dafa5ebde1f4699f498"
    );
    expect(result4.fromAddress).toBe(
      "0xe41d2489571d322189246dafa5ebde1f4699f498"
    );
    expect(result4.toAddress).toBe(
      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
    );
    expect(result5.fromAddress).toBe(
      "0xe41d2489571d322189246dafa5ebde1f4699f498"
    );
    expect(result5.toAddress).toBe(undefined);
  });
});
