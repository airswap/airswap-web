import React from "react";

import styled from "styled-components";

import convertHexToRGBA from "../../helpers/transformHexToRgba";
import { FormInput, FormLabel } from "../Typography/Typography";

type TextInputStyleProps = {
  hideLabel?: boolean;
  hasError?: boolean;
  disabled?: boolean;
};

type StyledInputProps = Pick<
  React.HTMLProps<HTMLInputElement>,
  "type" | "disabled"
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
    border-bottom: 1px solid
      ${(props) =>
        props.hasError
          ? props.theme.colors.red
          : convertHexToRGBA(props.theme.colors.white, 0.1)};
    width: 100%;
    padding: 0;
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
    background: none;

    &:focus {
      outline: 0;
      border-bottom: 1px solid
        ${(props) =>
          props.hasError ? props.theme.colors.red : props.theme.colors.white};
    }
  }
`;
