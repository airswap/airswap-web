import styled from "styled-components/macro";

import { InputTextStyle } from "../../../../style/mixins";
import IconButton from "../../../IconButton/IconButton";
import TextInput from "../../../TextInput/TextInput";
import { StyledInput } from "../../../TextInput/TextInput.styles";

export const Wrapper = styled.div`
  position: relative;
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.primaryLight};
`;

export const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 0.825rem;
  right: 0.5rem;
  color: ${({ theme }) => theme.colors.white};
`;

export const Input = styled(TextInput)`
  height: 100%;

  ${StyledInput} {
    ${InputTextStyle};

    ${({ hasError, theme }) =>
      hasError ? `border-color: ${theme.colors.red}` : ""};

    border-radius: 2px;
    padding-right: 3.5rem;
    padding-left: 1rem;
    height: 100%;
    font-size: 1rem;
    font-weight: 400;
  }
`;
