import React, { useState, useEffect } from "react";

import { Dropdown, SelectOption } from "../../../Dropdown/Dropdown";
import { Wrapper, Title, Input } from "./ExpirySelector.styles";

const MS_PER_MINUTE = 60000;

const options = [
  {
    label: "minutes",
    value: `${MS_PER_MINUTE}`,
  },
  {
    label: "hours",
    value: `${60 * MS_PER_MINUTE}`,
  },
  {
    label: "days",
    value: `${24 * 60 * MS_PER_MINUTE}`,
  },
  {
    label: "weeks",
    value: `${7 * 24 * 60 * MS_PER_MINUTE}`,
  },
];

const floatRegExp = new RegExp("^([0-9])*$");

export type ExpirySelectorProps = {
  updateExpiry: (msToExpiry: number) => void;
};

export const ExpirySelector: React.FC<ExpirySelectorProps> = ({
  updateExpiry,
}) => {
  const [unit, setUnit] = useState(options[0]);
  const [amount, setAmount] = useState("1");

  useEffect(() => {
    updateExpiry((parseInt(amount) || 1) * parseInt(unit.value));
  }, [unit, amount]);

  function handleUnitChange(option: SelectOption) {
    setUnit(option);
  }

  function handleAmountChange(value: string) {
    if (value === "" || floatRegExp.test(value)) {
      value = value.replace(/^0+/, "0");
      setAmount(value);
    }
  }

  return (
    <Wrapper>
      <Title>EXPIRES IN</Title>
      <Input
        maxLength={3}
        value={amount}
        onChange={(e) => handleAmountChange(e.target.value)}
      ></Input>
      <Dropdown
        value={unit}
        options={options}
        onChange={handleUnitChange}
      ></Dropdown>
    </Wrapper>
  );
};
