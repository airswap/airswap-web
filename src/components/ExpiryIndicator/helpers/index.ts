import { TFunction } from "react-i18next";

import getTimeBetweenTwoDates, {
  TimeUnit,
} from "../../../helpers/getTimeBetweenTwoDates";

export const getExpiryTranslation = (
  expiry: Date,
  now: Date,
  t: TFunction<"translation">
): string => {
  const { amount, timeUnit } = getTimeBetweenTwoDates(expiry, now);

  return "";
};
