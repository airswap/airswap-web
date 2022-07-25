import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import useAutoFocus from "../../../../hooks/useAutoFocus";
import { Input } from "./AddressInput.styles";

export type HTMLInputProps = JSX.IntrinsicElements["input"];

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
}

const AddressInput: FC<AddressInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const inputRef = useAutoFocus();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      autoFocus
      hideLabel
      label={t("orders.counterPartyAddress")}
      inputRef={inputRef}
      maxLength={42}
      placeholder={t("orders.enterCounterPartyAddressOrENS")}
      value={value}
      onChange={handleChange}
    />
  );
};

export default AddressInput;
