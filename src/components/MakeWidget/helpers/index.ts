import { TFunction } from "i18next";

import { OrderScopeType } from "../../../types/orderTypes";
import { SelectOption } from "../../Dropdown/Dropdown";

export const getOrderTypeSelectOptions = (t: TFunction): SelectOption[] => {
  return [
    {
      value: OrderScopeType.public,
      label: t("orders.anyone"),
    },
    {
      value: OrderScopeType.private,
      label: t("orders.specificWallet"),
    },
  ];
};
