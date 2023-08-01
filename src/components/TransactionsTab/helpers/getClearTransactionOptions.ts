import i18n from "i18next";

import { ClearOrderType } from "../../../types/clearOrderType";
import { SelectOption } from "../../Dropdown/Dropdown";

export default function getClearTransactionOptions(): SelectOption[] {
  return [
    {
      label: i18n.t("common.all"),
      value: ClearOrderType.all,
    },
    {
      label: i18n.t("common.failed"),
      value: ClearOrderType.failed,
    },
  ];
}
