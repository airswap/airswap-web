
import { getHumanReadableNumber } from "./getHumanReadableNumber";

describe("getHumanReadableNumber" , () => {
    it("10000 should be 10k", () =>{
        expect(getHumanReadableNumber("10000")).toBe("10k");
    });
    it("10000.000001 should be 10k", () =>{
        expect(getHumanReadableNumber("10000.0001")).toBe("10k");
    });
    it("12345 should be 12.3k", () =>{
        expect(getHumanReadableNumber("12345")).toBe("12.3k");
    });
    it("1000000 should be 1M", () =>{
        expect(getHumanReadableNumber("1000000")).toBe("1M");
    });
    it("9876543 should be 9.8M", () =>{
        expect(getHumanReadableNumber("9876543")).toBe("9.8M");
    });
    it("0.001234 should be cut off to .0012", () =>{
        expect(getHumanReadableNumber("0.001234")).toBe("0.0012");
    });
    it("0.0000987654 should be cut off to 0.000098", () =>{
        expect(getHumanReadableNumber("0.0000987654")).toBe("0.000098");
    });
    it("10000000 should be 10M", () =>{
        expect(getHumanReadableNumber("10000000")).toBe("10M");
    });
    it("12340000 should be 12.3M", () =>{
        expect(getHumanReadableNumber("12340000")).toBe("12.3M");
    });
    it("123450000 should be 123.4M", () =>{
        expect(getHumanReadableNumber("123450000")).toBe("123.4M");
    });
    it("1234560000 should be 1234.5M", () =>{
        expect(getHumanReadableNumber("1234560000")).toBe("1234.5M");
    });
    it("0.00012 should be unaffected", () =>{
        expect(getHumanReadableNumber("0.00012")).toBe("0.00012");
    });
    it("0.12 should be unaffected", () =>{
        expect(getHumanReadableNumber("0.12")).toBe("0.12");
    });
    it("123.4 should be unaffected", () =>{
        expect(getHumanReadableNumber("123.4")).toBe("123.4");
    });
    it("1234.5 should be 1.2k", () =>{
        expect(getHumanReadableNumber("1234.5")).toBe("1.2k");
    });
});
