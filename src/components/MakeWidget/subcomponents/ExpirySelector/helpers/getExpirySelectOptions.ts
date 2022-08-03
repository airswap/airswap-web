import { TFunction } from "react-i18next";

import { SelectOption } from "../../../../Dropdown/Dropdown";

const MS_PER_MINUTE = 60000;

export default function getExpirySelectOptions(t: TFunction): SelectOption[] {
  return [
    {
      label: t("common.minutes"),
      value: `${MS_PER_MINUTE}`,
    },
    {
      label: t("common.hours"),
      value: `${60 * MS_PER_MINUTE}`,
    },
    {
      label: t("common.days"),
      value: `${24 * 60 * MS_PER_MINUTE}`,
    },
    {
      label: t("common.weeks"),
      value: `${7 * 24 * 60 * MS_PER_MINUTE}`,
    },
  ];
}
