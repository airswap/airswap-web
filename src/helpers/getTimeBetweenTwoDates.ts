const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const MS_PER_WEEK = 604800000;
const MS_PER_MONTH = 2592000000;
const MS_PER_YEAR = 31536000000;

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
    return { timeUnit: TimeUnit.Minute, amount: 0 };
  }

  // convert to seconds
  const timeDiff = date1.getTime() - date2.getTime();

  // use increasing denominations based on how recent the comparison between dates are
  // e.g. x mins (< 1 hour), x hours (< 1 day), x days(< 1 month), x months(< 1 year), x years(> 1 year)
  if (timeDiff < MS_PER_HOUR) {
    // if time difference is less than 1 hour
    const minutes = Math.floor((timeDiff % MS_PER_HOUR) / MS_PER_MINUTE);
    return { timeUnit: TimeUnit.Minute, amount: minutes };
  }

  if (timeDiff < MS_PER_DAY) {
    // if time difference is less than 1 day
    const hours = Math.floor(timeDiff / MS_PER_HOUR);
    return { timeUnit: TimeUnit.Hour, amount: hours };
  }

  if (timeDiff < MS_PER_WEEK) {
    // if time difference is less than 1 week
    const days = Math.floor(timeDiff / MS_PER_DAY);
    return { timeUnit: TimeUnit.Day, amount: days };
  }

  if (timeDiff < MS_PER_MONTH) {
    // if time difference is less than 1 month
    const weeks = Math.floor(timeDiff / MS_PER_WEEK);
    return { timeUnit: TimeUnit.Week, amount: weeks };
  }

  if (timeDiff < MS_PER_YEAR) {
    // if time difference is less than 1 year
    const months = Math.floor(timeDiff / MS_PER_MONTH);
    return { timeUnit: TimeUnit.Month, amount: months };
  }

  const years = Math.floor(timeDiff / MS_PER_YEAR);
  return { timeUnit: TimeUnit.Year, amount: years };
}
