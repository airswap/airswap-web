import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  SelectLabel,
  SelectWrapper,
} from "../../../../../styled-components/Select/Select";
import { SelectOption } from "../../../../Dropdown/Dropdown";
import { StyledDropdown, StyledSelectLabel } from "./OrderTypeSelector.styles";

export type OrderTypeSelectorProps = {
  isDisabled?: boolean;
  options: SelectOption[];
  selectedOrderTypeOption: SelectOption;
  onChange: (option: SelectOption) => void;
  className?: string;
};

const OrderTypeSelector: FC<OrderTypeSelectorProps> = ({
  isDisabled,
  options,
  selectedOrderTypeOption,
  className,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <SelectWrapper className={className} isDisabled={isDisabled}>
      <StyledSelectLabel>{t("common.for")}</StyledSelectLabel>
      <StyledDropdown
        isDisabled={isDisabled}
        selectedOption={selectedOrderTypeOption}
        options={options}
        onChange={onChange}
      />
    </SelectWrapper>
  );
};

export default OrderTypeSelector;
