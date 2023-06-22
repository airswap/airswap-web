import { formatDuration, compareAsc } from "date-fns";
import i18 from "i18next";

import getDifferenceBetweenDatesInTimeUnits from "./getDifferenceBetweenDatesInTimeUnits";

type formatDistanceLocaleKey = "xMinutes" | "xHours" | "xDays" | "xWeeks";

// Get expiry time in short formats, ie:
// 20MIN
// 1H 59MIN
// 23H
// 4D 23H
// 3W 6D

export const getExpiryTranslation = (
  expiry: Date,
  now: Date
): string | undefined => {
  if (compareAsc(now, expiry) === -1) {
    return undefined;
  }

  const { minutes, hours, days, weeks } = getDifferenceBetweenDatesInTimeUnits(
    now,
    expiry
  );

  const formatDistanceLocale: Record<formatDistanceLocaleKey, string> = {
    xMinutes: `{{count}} ${i18.t("common.minutesShort")}`,
    xHours: `{{count}}${i18.t("common.hoursShort")}`,
    xDays: `{{count}}${i18.t("common.daysShort")}`,
    xWeeks: `{{count}}${i18.t("common.weeksShort")}`,
  };
  const locale: Locale = {
    formatDistance: (token: formatDistanceLocaleKey, count: number): string => {
      return formatDistanceLocale[token].replace("{{count}}", count.toString());
    },
  };

  const format: string[] = [
    ...(weeks ? ["weeks"] : []),
    ...(days ? ["days"] : []),
    ...(hours ? ["hours"] : []),
    ...(minutes ? ["minutes"] : []),
    // We only need max two time units
  ].slice(0, 2);

  if (format.length) {
    const daysRemainder = days - weeks * 7;
    const hoursRemainder = hours - days * 24;
    const minutesRemainder = minutes - hours * 60;
    return formatDuration(
      {
        weeks,
        days: daysRemainder,
        hours: hoursRemainder,
        minutes: minutesRemainder,
      },
      { format, locale }
    );
  }

  // If all is 0 then it probably means less than one minute is left.
  return formatDuration({ minutes: 1 }, { locale });
};
