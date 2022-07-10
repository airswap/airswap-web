import getTimeBetweenTwoDates, {
  TimeUnit,
} from "../../../helpers/getTimeBetweenTwoDates";

export default function getTimeAgoBetweenTwoDates(date: Date, t: any): string {
  const currentDate = new Date();

  const { timeUnit, amount: count } = getTimeBetweenTwoDates(currentDate, date);

  if (count === 0) {
    return t("common.undefined");
  }

  if (timeUnit === TimeUnit.Minute) {
    return count > 1
      ? t("wallet.minuteAgo_other", { count })
      : t("wallet.minuteAgo_one", { count });
  }

  if (timeUnit === TimeUnit.Hour) {
    return count > 1
      ? t("wallet.hourAgo_other", { count })
      : t("wallet.hourAgo_one", { count });
  }

  if (timeUnit === TimeUnit.Day) {
    return count > 1
      ? t("wallet.dayAgo_other", { count })
      : t("wallet.dayAgo_one", { count });
  }

  if (timeUnit === TimeUnit.Week) {
    return count > 1
      ? t("wallet.weekAgo_other", { count })
      : t("wallet.weekAgo_one", { count });
  }

  if (timeUnit === TimeUnit.Month) {
    return count > 1
      ? t("wallet.monthAgo_other", { count })
      : t("wallet.monthAgo_one", { count });
  }

  return count > 1
    ? t("wallet.yearAgo_other", { count })
    : t("wallet.yearAgo_one", { count });
}
