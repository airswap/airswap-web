import stringToSignificantDecimals from "./stringToSignificantDecimals";

describe("stringToSignificantDecimals", () => {
  it("Should not affect strings without decimal places", () => {
    expect(stringToSignificantDecimals("1234")).toBe("1234");
  });

  it("Should not affect strings with fewer decimal places than requested", () => {
    expect(stringToSignificantDecimals("1234.56", 4)).toBe("1234.56");
  });

  it("Should trim strings that are too long", () => {
    expect(stringToSignificantDecimals("1234.56789", 4)).toBe("1234.5678");
  });

  it("Should (only) ignore insignificant decimal places", () => {
    expect(stringToSignificantDecimals("0.0005607891", 4)).toBe("0.0005607");
  });

  it("Should only ignore decimal leading zeroes if number is less than 0", () => {
    expect(stringToSignificantDecimals("1234.000056789", 5)).toBe("1234.00005");
    expect(stringToSignificantDecimals("1234.000056789", 4)).toBe("1234");
  });

  it("Should (only) ignore insignificant decimal places", () => {
    expect(stringToSignificantDecimals("100000000000.0000000000001", 10)).toBe(
      "> 999999999.9"
    );
  });
});
