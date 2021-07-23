import styled from "styled-components";
import convertHexToRGBA from "../../helpers/transformHexToRgba";
import { FormInput, FormLabel } from "../Typography/Typography";

type TextInputStyleProps = {
  hideLabel?: boolean;
  hasError?: boolean;
}

export const StyledFormLabel = styled(FormLabel)``;

export const StyledInput = styled(FormInput)<{ type: React.HTMLProps<HTMLInputElement>["type"] }>``;

export const StyledTextInput = styled.div<TextInputStyleProps>`  
  ${StyledFormLabel} {
    display: ${(props) => props.hideLabel ? "none" : "block" };
    margin-bottom: 0.125rem;
    width: 100%;
    color: ${(props) => props.theme.colors.white};
  }

  ${StyledInput} {
    position: relative;
    border: 0;
    border-bottom: 1px solid ${(props) => props.hasError ? props.theme.colors.red : convertHexToRGBA(props.theme.colors.white, 0.1)};
    width: 100%;
    padding-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: ${(props) => props.theme.colors.white};
    background: none;
        
    &:focus {
      outline: 0;
      border-bottom: 1px solid ${(props) => props.hasError ? props.theme.colors.red : props.theme.colors.white};
    }
  }
`;