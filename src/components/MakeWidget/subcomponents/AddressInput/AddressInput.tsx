import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import useAutoFocus from "../../../../hooks/useAutoFocus";
import { Input, Wrapper, StyledIconButton } from "./AddressInput.styles";

export type HTMLInputProps = JSX.IntrinsicElements["input"];

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onInfoButtonClick: () => void;
  className?: string;
}

const AddressInput: FC<AddressInputProps> = ({
  value,
  onChange,
  onInfoButtonClick,
  className,
}) => {
  const { t } = useTranslation();
  const inputRef = useAutoFocus();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Wrapper className={className}>
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
      <StyledIconButton
        icon="information-circle-outline"
        onClick={onInfoButtonClick}
      />
    </Wrapper>
  );
};

export default AddressInput;
