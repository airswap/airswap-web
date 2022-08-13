import React, { FC, ReactElement, RefObject } from "react";

import {
  StyledFormLabel,
  StyledInput,
  StyledTextInput,
} from "./TextInput.styles";

type HTMLInputProps = Omit<React.HTMLProps<HTMLInputElement>, "ref" | "as">;

export type TextInputProps = {
  label: string;
  type?: string;
  hasError?: boolean;
  hideLabel?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
} & HTMLInputProps;

const TextInput: FC<TextInputProps> = ({
  label,
  type = "text",
  className,
  hasError,
  hideLabel,
  disabled,
  inputRef,
  ...inputProps
}): ReactElement => {
  return (
    <StyledTextInput
      hasError={hasError}
      hideLabel={hideLabel}
      disabled={disabled}
      className={className}
    >
      <StyledFormLabel>{label}</StyledFormLabel>
      <StyledInput
        {...inputProps}
        aria-label={label}
        disabled={disabled}
        ref={inputRef}
        type={type}
      />
    </StyledTextInput>
  );
};

export default TextInput;
