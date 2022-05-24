import getProgressBarAnimationProps from "./getProgressBarAnimationProps";

describe("getProgressBarAnimationProps", () => {
  it("should return duration and progress", () => {
    const result1 = getProgressBarAnimationProps(
      new Date(1651259192230),
      new Date(1651259309000),
      new Date(1651259250615)
    );
    const result2 = getProgressBarAnimationProps(
      new Date(1651259192230),
      new Date(1651259309000),
      new Date(1651269309000)
    );
    const result3 = getProgressBarAnimationProps(
      new Date(1651259192230),
      new Date(1651259309000),
      new Date(1651259092230)
    );
    const result4 = getProgressBarAnimationProps(
      new Date(1651259192230),
      new Date(1651259309000),
      new Date(1651259192230)
    );

    expect(result1.duration).toBe(58.385);
    expect(result1.initialProgress).toBe(0.5);
    expect(result2.duration).toBe(0);
    expect(result2.initialProgress).toBe(1);
    expect(result3.duration).toBe(116.77);
    expect(result3.initialProgress).toBe(0);
    expect(result4.duration).toBe(116.77);
    expect(result4.initialProgress).toBe(0);
  });
});
