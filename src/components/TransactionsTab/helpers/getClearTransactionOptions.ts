import { ClearOrderType } from "../../../types/clearOrderType";
import { SelectOption } from "../../Dropdown/Dropdown";
import i18n from "i18next";

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
