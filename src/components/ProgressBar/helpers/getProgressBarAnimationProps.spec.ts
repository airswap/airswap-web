import getProgressBarAnimationProps from "./getProgressBarAnimationProps";

describe("getProgressBarAnimationProps", () => {
  it("should return duration and progress", () => {
    const result1 = getProgressBarAnimationProps(
      new Date(1651259192230), // Fri Apr 29 2022 21:06:32 GMT+0200
      new Date(1651259309000), // Fri Apr 29 2022 21:08:29 GMT+0200
      new Date(1651259250615) // Fri Apr 29 2022 21:07:30 GMT+0200
    );
    const result2 = getProgressBarAnimationProps(
      new Date(1651259192230), // Fri Apr 29 2022 21:06:32 GMT+0200
      new Date(1651259309000), // Fri Apr 29 2022 21:08:29 GMT+0200
      new Date(1651269309000) // Fri Apr 29 2022 21:08:29 GMT+0200
    );
    const result3 = getProgressBarAnimationProps(
      new Date(1651259192230), // Fri Apr 29 2022 21:06:32 GMT+0200
      new Date(1651259309000), // Fri Apr 29 2022 21:08:29 GMT+0200
      new Date(1651259092230) // Fri Apr 29 2022 21:04:52 GMT+0200
    );
    const result4 = getProgressBarAnimationProps(
      new Date(1651258000230), // Fri Apr 29 2022 20:46:40 GMT+0200
      new Date(1651259309000), // Fri Apr 29 2022 21:08:29 GMT+0200
      new Date(1651258000230) // Fri Apr 29 2022 20:46:49 GMT+0200
    );
    const result5 = getProgressBarAnimationProps(
      new Date(1651258000230), // Fri Apr 29 2022 20:46:40 GMT+0200
      new Date(1651259309000), // Fri Apr 29 2022 21:08:29 GMT+0200
      new Date(1651259209000) // Fri Apr 29 2022 21:06:49 GMT+0200
    );
    const result6 = getProgressBarAnimationProps(
      new Date(1651258000230), // Fri Apr 29 2022 20:46:40 GMT+0200
      new Date(1651259309000), // Fri Apr 29 2022 21:08:29 GMT+0200
      new Date(1651259300000) // Fri Apr 29 2022 21:08:20 GMT+0200
    );

    expect(result1.duration).toBe(58);
    expect(result1.initialProgress).toBe(0.5);
    expect(result2.duration).toBe(0);
    expect(result2.initialProgress).toBe(1);
    expect(result3.duration).toBe(117);
    expect(result3.initialProgress).toBe(0);
    expect(result4.duration).toBe(300);
    expect(result4.initialProgress).toBe(0);
    expect(result5.duration).toBe(100);
    expect(result5.initialProgress).toBe(0.67);
    expect(result6.duration).toBe(9);
    expect(result6.initialProgress).toBe(0.97);
  });
});
