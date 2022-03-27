import transformErrorCodeToError from "./transformErrorCodeToError";

describe("transformErrorCodeToError", () => {
  it("should return ErrorType when valid code is provided", () => {
    const result1 = transformErrorCodeToError(-32600);
    const result2 = transformErrorCodeToError(-32000);
    const result3 = transformErrorCodeToError(-32001);
    const result4 = transformErrorCodeToError(-32002);
    const result5 = transformErrorCodeToError(-32003);
    const result6 = transformErrorCodeToError(-32004);
    const result7 = transformErrorCodeToError(-32005);
    const result8 = transformErrorCodeToError(-32700);
    const result9 = transformErrorCodeToError(-32601);
    const result10 = transformErrorCodeToError(-32602);
    const result11 = transformErrorCodeToError(-32603);
    const result12 = transformErrorCodeToError(4001);
    const result13 = transformErrorCodeToError(4100);
    const result14 = transformErrorCodeToError(4200);
    const result15 = transformErrorCodeToError(4900);
    const result16 = transformErrorCodeToError(4901);

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
    const result1 = transformErrorCodeToError(0);
    const result2 = transformErrorCodeToError(20);

    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
  });
});
