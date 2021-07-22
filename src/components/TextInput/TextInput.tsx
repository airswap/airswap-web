import React, { FC, ReactElement } from 'react';
import { StyledTextInput } from './TextInput.styles';
import { FormLabel } from '../Typography/Typography';

type HTMLInputProps = JSX.IntrinsicElements['input'];

export type TextInputProps = {
  label: string;
  hasError?: boolean;
  hideLabel?: boolean;
} & HTMLInputProps;

const TextInput: FC<TextInputProps> = ({
  label,
  className,
  hasError,
  hideLabel,
  ...inputProps
}): ReactElement => {

  return (
    <StyledTextInput
      hasError={hasError}
      hideLabel={hideLabel}
      aria-label={label}
      className={className}
    >
      <FormLabel>{label}</FormLabel>
      <input
        {...inputProps}
        className="input"
        type="text"
      />
    </StyledTextInput>
  )
}

export default TextInput;
