import transformMetaMaskErrorToError from "./transformMetaMaskErrorToError";

describe("transformMetaMaskErrorToError", () => {
  it("should return ErrorType when valid code is provided", () => {
    const result1 = transformMetaMaskErrorToError("-32600");
    const result2 = transformMetaMaskErrorToError("-32000");
    const result3 = transformMetaMaskErrorToError("-32001");
    const result4 = transformMetaMaskErrorToError("-32002");
    const result5 = transformMetaMaskErrorToError("-32003");
    const result6 = transformMetaMaskErrorToError("-32004");
    const result7 = transformMetaMaskErrorToError("-32005");
    const result8 = transformMetaMaskErrorToError("-32700");
    const result9 = transformMetaMaskErrorToError("-32601");
    const result10 = transformMetaMaskErrorToError("-32602");
    const result11 = transformMetaMaskErrorToError("-32603");
    const result12 = transformMetaMaskErrorToError("4001");
    const result13 = transformMetaMaskErrorToError("4100");
    const result14 = transformMetaMaskErrorToError("4200");
    const result15 = transformMetaMaskErrorToError("4900");
    const result16 = transformMetaMaskErrorToError("4901");

    expect(result1).toBe("invalidRequest");
    expect(result2).toBe("invalidInput");
    expect(result3).toBe("resourceNotFound");
    expect(result4).toBe("resourceUnavailable");
    expect(result5).toBe("transactionRejected");
    expect(result6).toBe("methodNotSupported");
    expect(result7).toBe("limitExceeded");
    expect(result8).toBe("parse");
    expect(result9).toBe("methodNotFound");
    expect(result10).toBe("invalidParams");
    expect(result11).toBe("internal");
    expect(result12).toBe("userRejectedRequest");
    expect(result13).toBe("unauthorized");
    expect(result14).toBe("unsupportedMethod");
    expect(result15).toBe("disconnected");
    expect(result16).toBe("chainDisconnected");
  });

  it("should return undefined when invalid code is provided", () => {
    const result1 = transformMetaMaskErrorToError("0");
    const result2 = transformMetaMaskErrorToError("20");

    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
  });
});
