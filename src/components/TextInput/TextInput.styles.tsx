import React from "react";

import styled from "styled-components/macro";

import { FormInput, FormLabel } from "../Typography/Typography";

type TextInputStyleProps = {
  hideLabel?: boolean;
  hasError?: boolean;
  disabled?: boolean;
};

type StyledInputProps = Pick<
  React.HTMLProps<HTMLInputElement>,
  "type" | "disabled" | "autoFocus"
>;

export const StyledFormLabel = styled(FormLabel)``;

export const StyledInput = styled(FormInput)<StyledInputProps>``;

export const StyledTextInput = styled.div<TextInputStyleProps>`
  ${StyledFormLabel} {
    display: ${(props) => (props.hideLabel ? "none" : "block")};
    width: 100%;
    background: none;
  }

  ${StyledInput} {
    position: relative;
    border: 0;
    width: 100%;
    padding: 0;
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
    background: none;

    &::placeholder {
      color: ${(props) => props.theme.colors.lightGrey};
    }

    &:focus {
      outline: 0;
    }
  }
`;
