import {
  BlockLimitError,
  BlockLimitErrorVariant,
  getBlockLimitFromError,
} from "./getContractEvents";

describe("getBlockLimitFromError", () => {
  it("should return limit number from error", () => {
    const error: BlockLimitError = {
      code: -32005,
      message:
        "query returned more than 10000 results. Try with this block range [0x12720E0, 0x12BA2B9].",
      data: {
        from: "0x0",
        limit: 10000,
        to: "0x1",
      },
    };

    const error2: BlockLimitErrorVariant = {
      code: 0,
      data: {
        message:
          "query returned more than 1000 results. Try with this block range [0x12720E0, 0x12BA2B9].",
      },
    };

    const result1 = getBlockLimitFromError(error);
    const result2 = getBlockLimitFromError(error2);

    expect(result1).toBe(10000);
    expect(result2).toBe(1000);
  });

  it("should return undefined if no limit number in error", () => {
    const error = {
      argument: "random argument",
      value: "unknown",
      code: "INVALID_ARGUMENT",
    };

    const result = getBlockLimitFromError(error as unknown as BlockLimitError);

    expect(result).toBe(undefined);
  });
});
