import getTimeBetweenTwoDates from "./getTimeBetweenTwoDates";

const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const MS_PER_MONTH = 2592000000;
const MS_PER_YEAR = 31536000000;

describe("Get Time Difference Between Two Dates", () => {
  it("should return undefined", () => {
    const futureDate = new Date("03/01/2080");
    const res = getTimeBetweenTwoDates(futureDate);
    expect(res).toBe("undefined");
  });

  it("should return 5 mins ago", () => {
    var fiveMinutesAgo = new Date(Date.now() - 5 * MS_PER_MINUTE);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("5 mins ago");
  });

  it("should return 59 mins ago", () => {
    var fiveMinutesAgo = new Date(Date.now() - 59 * MS_PER_MINUTE);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("59 mins ago");
  });

  it("should return 1 hour ago", () => {
    var fiveMinutesAgo = new Date(Date.now() - 1 * MS_PER_HOUR);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("1 hour ago");
  });

  it("should return 23 hours ago", () => {
    var fiveMinutesAgo = new Date(Date.now() - 23 * MS_PER_HOUR);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("23 hours ago");
  });

  it("should return 1 day ago", () => {
    var fiveMinutesAgo = new Date(Date.now() - 1 * MS_PER_DAY);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("1 day ago");
  });

  it("should return 2 days ago", () => {
    var fiveMinutesAgo = new Date(Date.now() - 2 * MS_PER_DAY);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("2 days ago");
  });

  it("should return 1 month ago", () => {
    var fiveMinutesAgo = new Date(Date.now() - 1 * MS_PER_MONTH);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("1 month ago");
  });

  it("should return 11 months ago", () => {
    var fiveMinutesAgo = new Date(Date.now() - 11 * MS_PER_MONTH);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("11 months ago");
  });

  it("should return 1 year ago", () => {
    var fiveMinutesAgo = new Date(Date.now() - 1 * MS_PER_YEAR);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("1 year ago");
  });

  it("should return 5 years ago", () => {
    var fiveMinutesAgo = new Date(Date.now() - 5 * MS_PER_YEAR);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("5 years ago");
  });
});
