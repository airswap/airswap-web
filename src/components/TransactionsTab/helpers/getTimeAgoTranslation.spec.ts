import getTimeTranslation from "./getTimeAgoTranslation";
import { addMonths, addSeconds, addYears } from "date-fns";
import { useTranslation } from "react-i18next";

const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, option: any) => `${option && option.count} ${key}`,
  }),
}));

describe("Get Time Difference Between Two Dates", () => {
  it("should return undefined", () => {
    const futureDate = new Date("03/01/2080");
    const { t } = useTranslation();
    const res = getTimeTranslation(futureDate, t);
    expect(res).toBe("undefined common.undefined");
  });

  it("should return now if less than one minute", () => {
    const xMinutesAgo = new Date(Date.now() - 0.1 * MS_PER_MINUTE);
    const { t } = useTranslation();

    const res = getTimeTranslation(xMinutesAgo, t);
    expect(res).toBe("undefined wallet.justNow");
  });

  it("should return 5 mins", () => {
    const xMinutesAgo = new Date(Date.now() - 5 * MS_PER_MINUTE);
    const { t } = useTranslation();

    const res = getTimeTranslation(xMinutesAgo, t);
    expect(res).toBe("5 wallet.minuteAgo_other");
  });

  it("should return 59 mins", () => {
    const xMinutesAgo = new Date(Date.now() - 59 * MS_PER_MINUTE);
    const { t } = useTranslation();

    const res = getTimeTranslation(xMinutesAgo, t);
    expect(res).toBe("59 wallet.minuteAgo_other");
  });

  it("should return 1 hour", () => {
    const xHoursAgo = new Date(Date.now() - 1 * MS_PER_HOUR);
    const { t } = useTranslation();

    const res = getTimeTranslation(xHoursAgo, t);
    expect(res).toBe("1 wallet.hourAgo_one");
  });

  it("should return 23 hours", () => {
    const xHoursAgo = new Date(Date.now() - 23 * MS_PER_HOUR);
    const { t } = useTranslation();

    const res = getTimeTranslation(xHoursAgo, t);
    expect(res).toBe("23 wallet.hourAgo_other");
  });

  it("should return 1 month", () => {
    const xMonthsAgo = addMonths(Date.now(), -1);
    const { t } = useTranslation();

    const res = getTimeTranslation(xMonthsAgo, t);
    expect(res).toBe("1 wallet.monthAgo_one");
  });

  it("should return 11 months", () => {
    const xMonthsAgo = addMonths(addSeconds(Date.now(), -1), -11);
    const { t } = useTranslation();

    const res = getTimeTranslation(xMonthsAgo, t);
    expect(res).toBe("11 wallet.monthAgo_other");
  });

  it("should return 5 years", () => {
    const xYearsAgo = addYears(addSeconds(Date.now(), -1), -5);
    const { t } = useTranslation();

    const res = getTimeTranslation(xYearsAgo, t);
    expect(res).toBe("5 wallet.yearAgo_other");
  });
});
