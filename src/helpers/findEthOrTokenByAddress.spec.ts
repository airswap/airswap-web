import nativeCurrency, {
  nativeCurrencyAddress,
} from "../constants/nativeCurrency";
import findEthOrTokenByAddress from "./findEthOrTokenByAddress";

const WETH = {
  chainId: 1,
  address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  name: "Wrapped Ethereum",
  decimals: 18,
  symbol: "WETH",
};

const DAI = {
  chainId: 1,
  address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a3",
  name: "Dai Stablecoin",
  decimals: 18,
  symbol: "DAI",
};

const USDC = {
  chainId: 1,
  address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a4",
  name: "USD Coin",
  decimals: 18,
  symbol: "USDC",
};

const allTokens = [WETH, DAI, USDC];

describe("findEthOrTokenByAddress", () => {
  it("should return ETH TokenInfo", () => {
    const chainId = 4;
    const tokenInfo = findEthOrTokenByAddress(
      nativeCurrencyAddress,
      allTokens,
      chainId
    );
    expect(tokenInfo).toBe(nativeCurrency[chainId]);
  });

  it("should return WETH TokenInfo", () => {
    const chainId = 4;
    const tokenInfo = findEthOrTokenByAddress(
      "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      allTokens,
      chainId
    );
    expect(tokenInfo).toBe(WETH);
  });
});
