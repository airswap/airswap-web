import { filterTokens } from "./filter";

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

describe("Filter Tokens", () => {
  it("should filter tokens by words (0x)", () => {
    const filteredTokens = filterTokens(activeTokens, "0x");
    expect(filteredTokens.length).toBe(1);
    expect(filteredTokens[0].symbol).toBe("ZRX");
  });

  it("should filter tokens by token address (0x2260fac5e5542a773aa44fbcfedf7c193bc2c599)", () => {
    const filteredTokens = filterTokens(
      activeTokens,
      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
    );
    expect(filteredTokens.length).toBe(1);
    expect(filteredTokens[0].symbol).toBe("WBTC");
  });

  it("should not filter if search is nothing", () => {
    const filteredTokens = filterTokens(activeTokens, "");
    expect(filteredTokens.length).toBe(4);
    expect(filteredTokens[0].symbol).toBe("ZRX");
    expect(filteredTokens[1].symbol).toBe("cUSDC");
    expect(filteredTokens[2].symbol).toBe("WBTC");
    expect(filteredTokens[3].symbol).toBe("cLINK");
  });

  it("should filter with one character", () => {
    const filteredTokens = filterTokens(activeTokens, "b");
    expect(filteredTokens.length).toBe(1);
    expect(filteredTokens[0].symbol).toBe("WBTC");
  });

  it("should match characters in the middle of the symbol", () => {
    const filteredTokens = filterTokens(activeTokens, "cL");
    expect(filteredTokens.length).toBe(1);
    expect(filteredTokens[0].symbol).toBe("cLINK");
  });
});
