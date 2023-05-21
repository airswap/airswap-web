import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { OrderScopeType } from "../../../types/orderTypes";
import { SelectOption } from "../../Dropdown/Dropdown";

const useOrderTypeSelectOptions = (): SelectOption[] => {
  const { t } = useTranslation();

  return useMemo(() => {
    return [
      {
        value: OrderScopeType.public,
        label: t("orders.anyone"),
      },
      {
        value: OrderScopeType.private,
        label: t("orders.specificTaker"),
      },
    ];
  }, [t]);
};

export default useOrderTypeSelectOptions;
