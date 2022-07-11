import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
} from "date-fns";

const getDifferenceBetweenDatesInTimeUnits = (
  date1: Date,
  date2: Date
): {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
} => {
  const seconds = differenceInSeconds(date1, date2);
  const minutes = differenceInMinutes(date1, date2);
  const hours = differenceInHours(date1, date2);
  const days = differenceInDays(date1, date2);
  const weeks = differenceInWeeks(date1, date2);
  const months = differenceInMonths(date1, date2);
  const years = differenceInYears(date1, date2);

  return {
    seconds,
    minutes,
    hours,
    days,
    weeks,
    months,
    years,
  };
};

export default getDifferenceBetweenDatesInTimeUnits;
