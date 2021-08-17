const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const MS_PER_MONTH = 2592000000;
const MS_PER_YEAR = 31536000000;

export default function getTimeBetweenTwoDates(date: Date): string {
  const currentDate = new Date();

  // if date is past the current date;
  if (currentDate < date) return "undefined";

  // convert to seconds
  const timeDiff = currentDate.getTime() - date.getTime();

  // use increasing denominations based on how recent the comparison between dates are
  // e.g. x mins (< 1 hour), x hours (< 1 day), x days(< 1 month), x months(< 1 year), x years(> 1 year)
  if (timeDiff < MS_PER_HOUR) {
    // if time difference is less than 1 hour
    const minutes = Math.floor((timeDiff % MS_PER_HOUR) / MS_PER_MINUTE);
    return `${minutes} min${minutes > 1 ? "s" : ""}`;
  } else if (timeDiff < MS_PER_DAY) {
    // if time difference is less than 1 day
    const hours = Math.floor(timeDiff / MS_PER_HOUR);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (timeDiff < MS_PER_MONTH) {
    // if time difference is less than 1 month
    const days = Math.floor(timeDiff / MS_PER_DAY);
    return `${days} day${days > 1 ? "s" : ""}`;
  } else if (timeDiff < MS_PER_YEAR) {
    // if time difference is less than 1 year
    const months = Math.floor(timeDiff / MS_PER_MONTH);
    return `${months} month${months > 1 ? "s" : ""}`;
  } else {
    const years = Math.floor(timeDiff / MS_PER_YEAR);
    return `${years} year${years > 1 ? "s" : ""}`;
  }
}
