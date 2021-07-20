import { sortTokensBySymbol } from "./sort";

const activeTokens = [
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

describe("Sort Active Tokens", () => {
  it("should sorttokens by symbol", () => {
    const sortedTokens = sortTokensBySymbol(activeTokens);
    expect(sortedTokens[0].symbol).toBe("cLINK");
    expect(sortedTokens[1].symbol).toBe("cUSDC");
    expect(sortedTokens[2].symbol).toBe("WBTC");
    expect(sortedTokens[3].symbol).toBe("ZRX");
  });
});
