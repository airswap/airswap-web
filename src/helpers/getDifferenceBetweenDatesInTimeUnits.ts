import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInWeeks,
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
} => {
  const seconds = differenceInSeconds(date1, date2);
  const minutes = differenceInMinutes(date1, date2);
  const hours = differenceInHours(date1, date2);
  const days = differenceInDays(date1, date2);
  const weeks = differenceInWeeks(date1, date2);

  return {
    seconds,
    minutes,
    hours,
    days,
    weeks,
  };
};

export default getDifferenceBetweenDatesInTimeUnits;
