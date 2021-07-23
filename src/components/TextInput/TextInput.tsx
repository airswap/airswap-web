import React, { FC, ReactElement } from 'react';
import { StyledFormLabel, StyledInput, StyledTextInput } from './TextInput.styles';

type HTMLInputProps = Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'as'>;

export type TextInputProps = {
  label: string;
  type?: string;
  hasError?: boolean;
  hideLabel?: boolean;
} & HTMLInputProps;

const TextInput: FC<TextInputProps> = ({
  label,
  type = "text",
  className,
  hasError,
  hideLabel,
  disabled,
  ...inputProps
}): ReactElement => {

  return (
    <StyledTextInput
      hasError={hasError}
      hideLabel={hideLabel}
      aria-label={label}
      disabled={disabled}
      className={className}
    >
      <StyledFormLabel>
        {label}
      </StyledFormLabel>
      <StyledInput
        {...inputProps}
        disabled={disabled}
        type={type}
      />
    </StyledTextInput>
  )
}

export default TextInput;
