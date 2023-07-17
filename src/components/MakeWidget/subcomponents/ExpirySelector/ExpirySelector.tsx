import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  SelectLabel,
  SelectWrapper,
} from "../../../../styled-components/Select/Select";
import { SelectOption } from "../../../Dropdown/Dropdown";
import { Input, StyledDropdown } from "./ExpirySelector.styles";
import getExpirySelectOptions from "./helpers/getExpirySelectOptions";

const floatRegExp = new RegExp("^([0-9])*$");

export type ExpirySelectorProps = {
  onChange: (msToExpiry: number) => void;
  className?: string;
};

export const ExpirySelector: React.FC<ExpirySelectorProps> = ({
  onChange,
  className,
}) => {
  const { t } = useTranslation();

  const translatedOptions = useMemo(() => {
    return getExpirySelectOptions(t);
  }, [t]);

  const [unit, setUnit] = useState(translatedOptions[1]);
  const [amount, setAmount] = useState("1");

  useEffect(() => {
    const msToExpiry = (parseInt(amount, 0) || 0) * parseInt(unit.value, 0);
    onChange(msToExpiry);
  }, [unit, amount, onChange]);

  function handleUnitChange(option: SelectOption) {
    setUnit(option);
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (value === "" || floatRegExp.test(value)) {
      setAmount(value.replace(/^0+/, "0"));
    }
  }

  return (
    <SelectWrapper className={className}>
      <SelectLabel>{t("common.expiresIn")}</SelectLabel>
      <Input maxLength={3} value={amount} onChange={handleAmountChange} />
      <StyledDropdown
        selectedOption={unit}
        options={translatedOptions}
        onChange={handleUnitChange}
      />
    </SelectWrapper>
  );
};
