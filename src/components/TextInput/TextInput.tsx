import React, { FC, ReactElement } from 'react';
import { StyledTextInput } from './TextInput.styles';

type HTMLInputProps = JSX.IntrinsicElements['input'];

export type TextInputProps = {
  label: string;
  hideLabel?: boolean;
  hasError?: boolean;
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
      <div className="label">{label}</div>
      <input
        {...inputProps}
        className="input"
        type="text"
      />
    </StyledTextInput>
  )
}

export default TextInput;
