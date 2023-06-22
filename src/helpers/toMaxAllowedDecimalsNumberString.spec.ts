import toMaxAllowedDecimalsNumberString from "./toMaxAllowedDecimalsNumberString";

describe("toMaxAllowedDecimalsNumberString", () => {
  it("should round number string with too many decimals", () => {
    const result1 = toMaxAllowedDecimalsNumberString("0.0004", 3);
    const result2 = toMaxAllowedDecimalsNumberString("0.000999", 4);
    const result3 = toMaxAllowedDecimalsNumberString(".0003", 3);

    expect(result1).toBe("0.001");
    expect(result2).toBe("0.0009");
    expect(result3).toBe(".001");
  });

  it("should not round number string when it has less decimals than the max allowed", () => {
    const result1 = toMaxAllowedDecimalsNumberString("0.0004", 6);
    const result2 = toMaxAllowedDecimalsNumberString(".00004", 6);

    expect(result1).toBe("0.0004");
    expect(result2).toBe(".00004");
  });

  it("should not try to round numbers bigger than 1", () => {
    const result1 = toMaxAllowedDecimalsNumberString("1.343434344334", 6);
    const result2 = toMaxAllowedDecimalsNumberString(
      "999999999999999999.9999999999999",
      6
    );

    expect(result1).toBe("1.343434344334");
    expect(result2).toBe("999999999999999999.9999999999999");
  });
});
