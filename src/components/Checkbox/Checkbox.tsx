import React, { FC } from "react";

import {
  CheckContainer,
  CheckIcon,
  CheckLabel,
  Input,
  Label,
  LabelContainer,
  SubLabel,
} from "./Checkbox.styles";

export type HTMLInputProps = JSX.IntrinsicElements["input"];

interface CheckboxProps extends Omit<HTMLInputProps, "onChange"> {
  hideLabel?: boolean;
  label: string;
  subLabel?: string;
  onChange: (isChecked: boolean) => void;
  className?: string;
}

const Checkbox: FC<CheckboxProps> = ({
  checked,
  disabled,
  hideLabel,
  label,
  subLabel,
  onChange,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <CheckLabel
      aria-label={hideLabel ? label : undefined}
      isDisabled={disabled}
      className={className}
    >
      <Input
        checked={checked}
        disabled={disabled}
        type="checkbox"
        onChange={handleChange}
      />
      <CheckContainer>
        <CheckIcon name="check" iconSize={1} />
      </CheckContainer>
      <LabelContainer>
        <Label>{label}</Label>
        <SubLabel>{subLabel}</SubLabel>
      </LabelContainer>
    </CheckLabel>
  );
};

export default Checkbox;
