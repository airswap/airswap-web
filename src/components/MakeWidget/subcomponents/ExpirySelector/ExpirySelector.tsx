import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Dropdown, SelectOption } from "../../../Dropdown/Dropdown";
import { Wrapper, Title, Input } from "./ExpirySelector.styles";
import getExpirySelectOptions from "./helpers/getExpirySelectOptions";

const floatRegExp = new RegExp("^([0-9])*$");

export type ExpirySelectorProps = {
  onChange: (expiryDate: number) => void;
};

export const ExpirySelector: React.FC<ExpirySelectorProps> = ({ onChange }) => {
  const { t } = useTranslation();

  const translatedOptions = useMemo(() => {
    return getExpirySelectOptions(t);
  }, [t]);

  const [unit, setUnit] = useState(translatedOptions[0]);
  const [amount, setAmount] = useState("1");

  useEffect(() => {
    const msToExpiry = (parseInt(amount, 0) || 0) * parseInt(unit.value, 0);
    onChange(new Date().getTime() + msToExpiry);
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
    <Wrapper>
      <Title>{t("common.expiresIn")}</Title>
      <Input maxLength={3} value={amount} onChange={handleAmountChange} />
      <Dropdown
        value={unit}
        options={translatedOptions}
        onChange={handleUnitChange}
      />
    </Wrapper>
  );
};
