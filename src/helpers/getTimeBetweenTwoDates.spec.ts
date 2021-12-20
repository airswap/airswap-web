import { useTranslation } from "react-i18next";

import getTimeBetweenTwoDates from "./getTimeBetweenTwoDates";

const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const MS_PER_MONTH = 2592000000;
const MS_PER_YEAR = 31536000000;

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, option: any) => `${option && option.count} ${key}`,
  }),
}));

describe("Get Time Difference Between Two Dates", () => {
  it("should return undefined", () => {
    const futureDate = new Date("03/01/2080");
    const { t } = useTranslation();
    const res = getTimeBetweenTwoDates(futureDate, t);
    expect(res).toBe("undefined common.undefined");
  });

  it("should return 5 mins", () => {
    var xMinutesAgo = new Date(Date.now() - 5 * MS_PER_MINUTE);
    const { t } = useTranslation();

    const res = getTimeBetweenTwoDates(xMinutesAgo, t);
    expect(res).toBe("5 wallet.minuteAgo_other");
  });

  it("should return 59 mins", () => {
    var xMinutesAgo = new Date(Date.now() - 59 * MS_PER_MINUTE);
    const { t } = useTranslation();

    const res = getTimeBetweenTwoDates(xMinutesAgo, t);
    expect(res).toBe("59 wallet.minuteAgo_other");
  });

  it("should return 1 hour", () => {
    var xHoursAgo = new Date(Date.now() - 1 * MS_PER_HOUR);
    const { t } = useTranslation();

    const res = getTimeBetweenTwoDates(xHoursAgo, t);
    expect(res).toBe("1 wallet.hourAgo_one");
  });

  it("should return 23 hours", () => {
    var xHoursAgo = new Date(Date.now() - 23 * MS_PER_HOUR);
    const { t } = useTranslation();

    const res = getTimeBetweenTwoDates(xHoursAgo, t);
    expect(res).toBe("23 wallet.hourAgo_other");
  });

  it("should return 1 day", () => {
    var xDaysAgo = new Date(Date.now() - 1 * MS_PER_DAY);
    const { t } = useTranslation();

    const res = getTimeBetweenTwoDates(xDaysAgo, t);
    expect(res).toBe("1 wallet.dayAgo_one");
  });

  it("should return 2 days", () => {
    var xDaysAgo = new Date(Date.now() - 2 * MS_PER_DAY);
    const { t } = useTranslation();

    const res = getTimeBetweenTwoDates(xDaysAgo, t);
    expect(res).toBe("2 wallet.dayAgo_other");
  });

  it("should return 1 month", () => {
    var xMonthsAgo = new Date(Date.now() - 1 * MS_PER_MONTH);
    const { t } = useTranslation();

    const res = getTimeBetweenTwoDates(xMonthsAgo, t);
    expect(res).toBe("1 wallet.monthAgo_one");
  });

  it("should return 11 months", () => {
    var xMonthsAgo = new Date(Date.now() - 11 * MS_PER_MONTH);
    const { t } = useTranslation();

    const res = getTimeBetweenTwoDates(xMonthsAgo, t);
    expect(res).toBe("11 wallet.monthAgo_other");
  });

  it("should return 1 year", () => {
    var xYearsAgo = new Date(Date.now() - 1 * MS_PER_YEAR);
    const { t } = useTranslation();

    const res = getTimeBetweenTwoDates(xYearsAgo, t);
    expect(res).toBe("1 wallet.yearAgo_one");
  });

  it("should return 5 years", () => {
    var xYearsAgo = new Date(Date.now() - 5 * MS_PER_YEAR);
    const { t } = useTranslation();

    const res = getTimeBetweenTwoDates(xYearsAgo, t);
    expect(res).toBe("5 wallet.yearAgo_other");
  });
});
