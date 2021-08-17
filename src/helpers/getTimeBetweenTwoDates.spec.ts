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

  it("should return 5 mins", () => {
    var fiveMinutesAgo = new Date(Date.now() - 5 * MS_PER_MINUTE);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("5 mins");
  });

  it("should return 59 mins", () => {
    var fiveMinutesAgo = new Date(Date.now() - 59 * MS_PER_MINUTE);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("59 mins");
  });

  it("should return 1 hour", () => {
    var fiveMinutesAgo = new Date(Date.now() - 1 * MS_PER_HOUR);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("1 hour");
  });

  it("should return 23 hours", () => {
    var fiveMinutesAgo = new Date(Date.now() - 23 * MS_PER_HOUR);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("23 hours");
  });

  it("should return 1 day", () => {
    var fiveMinutesAgo = new Date(Date.now() - 1 * MS_PER_DAY);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("1 day");
  });

  it("should return 2 days", () => {
    var fiveMinutesAgo = new Date(Date.now() - 2 * MS_PER_DAY);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("2 days");
  });

  it("should return 1 month", () => {
    var fiveMinutesAgo = new Date(Date.now() - 1 * MS_PER_MONTH);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("1 month");
  });

  it("should return 11 months", () => {
    var fiveMinutesAgo = new Date(Date.now() - 11 * MS_PER_MONTH);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("11 months");
  });

  it("should return 1 year", () => {
    var fiveMinutesAgo = new Date(Date.now() - 1 * MS_PER_YEAR);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("1 year");
  });

  it("should return 5 years", () => {
    var fiveMinutesAgo = new Date(Date.now() - 5 * MS_PER_YEAR);

    const res = getTimeBetweenTwoDates(fiveMinutesAgo);
    expect(res).toBe("5 years");
  });
});
