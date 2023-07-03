import { TFunction } from "i18next";
import { SelectOption } from "../../Dropdown/Dropdown";

export default function getClearTransactionOptions(t: TFunction): SelectOption[] {
  return [
    {
      label: t("common.all"),
      value: t("common.all"),
    },
    {
      label: t("common.failed"),
      value: t("common.failed"),
    },
    // {
    //   label: t("common.approvals"),
    //   value: t("common.approvals"),
    // },
    // {
    //   label: t("common.swaps"),
    //   value: t("common.swaps"),
    // },
  ];
}
