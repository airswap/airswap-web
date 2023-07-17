import { getHumanReadableNumber } from "./getHumanReadableNumber";

describe("getHumanReadableNumber", () => {
  it("10000 should be 10k", () => {
    expect(getHumanReadableNumber("10000")).toBe("10k");
  });
  it("10000.000001 should be 10k", () => {
    expect(getHumanReadableNumber("10000.0001")).toBe("10k");
  });
  it("12345 should be 12.34k", () => {
    expect(getHumanReadableNumber("12345")).toBe("12.34k");
  });
  it("12345.6 should be 12.34k", () => {
    expect(getHumanReadableNumber("12345.6")).toBe("12.34k");
  });
  it("1000000 should be 1M", () => {
    expect(getHumanReadableNumber("1000000")).toBe("1M");
  });
  it("9876543 should be 9.87M", () => {
    expect(getHumanReadableNumber("9876543")).toBe("9.87M");
  });
  it("0.001234 should be cut off to .0012", () => {
    expect(getHumanReadableNumber("0.001234")).toBe("0.0012");
  });
  it("0.0000987654 should be cut off to 0.000098", () => {
    expect(getHumanReadableNumber("0.0000987654")).toBe("0.000098");
  });
  it("10000000 should be 10M", () => {
    expect(getHumanReadableNumber("10000000")).toBe("10M");
  });
  it("12340000 should be 12.34M", () => {
    expect(getHumanReadableNumber("12340000")).toBe("12.34M");
  });
  it("123450000 should be 123.4M", () => {
    expect(getHumanReadableNumber("123450000")).toBe("123.4M");
  });
  it("1234560000 should be 1.23B", () => {
    expect(getHumanReadableNumber("1234560000")).toBe("1.23B");
  });
  it("12345600000 should be 12.34B", () => {
    expect(getHumanReadableNumber("12345600000")).toBe("12.34B");
  });
  it("123456000000 should be 123.4B", () => {
    expect(getHumanReadableNumber("123456000000")).toBe("123.4B");
  });
  it("1234560000000 should be 1234B", () => {
    expect(getHumanReadableNumber("1234560000000")).toBe("1234B");
  });
  it("12345600000000 should be 12340B", () => {
    expect(getHumanReadableNumber("12345600000000")).toBe("12340B");
  });
  it("123456000000000 should be 123400B", () => {
    expect(getHumanReadableNumber("123456000000000")).toBe("123400B");
  });
  it("1234560000000000 should be 1234000B", () => {
    expect(getHumanReadableNumber("1234560000000000")).toBe("1234000B");
  });
  it("0.00012 should be unaffected", () => {
    expect(getHumanReadableNumber("0.00012")).toBe("0.00012");
  });
  it("0.12 should be unaffected", () => {
    expect(getHumanReadableNumber("0.12")).toBe("0.12");
  });
  it("123.4 should be unaffected", () => {
    expect(getHumanReadableNumber("123.4")).toBe("123.4");
  });
  it("1234.5 should be 1.23k", () => {
    expect(getHumanReadableNumber("1234.5")).toBe("1.23k");
  });
  it("123.45 should be 123.4", () => {
    expect(getHumanReadableNumber("123.45")).toBe("123.4");
  });
  it("1.234 should be 1.23", () => {
    expect(getHumanReadableNumber("1.234")).toBe("1.23");
  });
});
