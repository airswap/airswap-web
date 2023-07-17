import getDifferenceBetweenDatesInTimeUnits from "./getDifferenceBetweenDatesInTimeUnits";

export enum TimeUnit {
  Minute = "minute",
  Hour = "hour",
  Day = "day",
  Week = "week",
  Month = "month",
  Year = "year",
}

export default function getTimeBetweenTwoDates(
  date1: Date,
  date2: Date
): { timeUnit: TimeUnit; amount: number } {
  // if date is past the current date;
  if (date1 < date2) {
    return { timeUnit: TimeUnit.Minute, amount: -1 };
  }

  const { minutes, hours, days, months, years } =
    getDifferenceBetweenDatesInTimeUnits(date1, date2);

  if (years) {
    return { timeUnit: TimeUnit.Year, amount: years };
  }

  if (months) {
    return { timeUnit: TimeUnit.Month, amount: months };
  }

  if (days) {
    return { timeUnit: TimeUnit.Day, amount: days };
  }

  if (hours) {
    return { timeUnit: TimeUnit.Hour, amount: hours };
  }

  return { timeUnit: TimeUnit.Minute, amount: minutes };
}
