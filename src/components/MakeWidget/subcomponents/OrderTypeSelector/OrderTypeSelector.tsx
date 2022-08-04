import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  SelectLabel,
  SelectWrapper,
} from "../../../../styled-components/Select/Select";
import Dropdown, { SelectOption } from "../../../Dropdown/Dropdown";

export type OrderTypeSelectorProps = {
  options: SelectOption[];
  selectedOrderTypeOption: SelectOption;
  onChange: (option: SelectOption) => void;
  className?: string;
};

const OrderTypeSelector: FC<OrderTypeSelectorProps> = ({
  options,
  selectedOrderTypeOption,
  className,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <SelectWrapper className={className}>
      <SelectLabel>{t("common.for")}</SelectLabel>
      <Dropdown
        selectedOption={selectedOrderTypeOption}
        options={options}
        onChange={onChange}
      />
    </SelectWrapper>
  );
};

export default OrderTypeSelector;
