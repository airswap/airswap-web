import { TFunction } from "react-i18next";

export default function getExpiryUnitText(unit: String, t: TFunction): string {
  switch (unit) {
    case "minutes":
      return t("common.minutes");
    case "hours":
      return t("common.hours");
    case "days":
      return t("common.days");
    case "weeks":
      return t("common.weeks");
    default:
      return t("common.unknown");
  }
}
