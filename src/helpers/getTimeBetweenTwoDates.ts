const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const MS_PER_MONTH = 2592000000;
const MS_PER_YEAR = 31536000000;

export default function getTimeBetweenTwoDates(date: Date, t: any): string {
  const currentDate = new Date();

  // if date is past the current date;
  if (currentDate < date) return t("common.undefined");

  // convert to seconds
  const timeDiff = currentDate.getTime() - date.getTime();

  // use increasing denominations based on how recent the comparison between dates are
  // e.g. x mins (< 1 hour), x hours (< 1 day), x days(< 1 month), x months(< 1 year), x years(> 1 year)
  if (timeDiff < MS_PER_HOUR) {
    // if time difference is less than 1 hour
    const minutes = Math.floor((timeDiff % MS_PER_HOUR) / MS_PER_MINUTE);
    return minutes > 1
      ? t("wallet.minuteAgo_other", { count: minutes })
      : t("wallet.minuteAgo_one", { count: minutes });
  } else if (timeDiff < MS_PER_DAY) {
    // if time difference is less than 1 day
    const hours = Math.floor(timeDiff / MS_PER_HOUR);
    return hours > 1
      ? t("wallet.hourAgo_other", { count: hours })
      : t("wallet.hourAgo_one", { count: hours });
  } else if (timeDiff < MS_PER_MONTH) {
    // if time difference is less than 1 month
    const days = Math.floor(timeDiff / MS_PER_DAY);
    return days > 1
      ? t("wallet.dayAgo_other", { count: days })
      : t("wallet.dayAgo_one", { count: days });
  } else if (timeDiff < MS_PER_YEAR) {
    // if time difference is less than 1 year
    const months = Math.floor(timeDiff / MS_PER_MONTH);
    return months > 1
      ? t("wallet.monthAgo_other", { count: months })
      : t("wallet.monthAgo_one", { count: months });
  } else {
    const years = Math.floor(timeDiff / MS_PER_YEAR);
    return years > 1
      ? t("wallet.yearAgo_other", { count: years })
      : t("wallet.yearAgo_one", { count: years });
  }
}
