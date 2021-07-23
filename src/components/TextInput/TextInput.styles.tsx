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
    width: 100%;
    color: ${(props) => props.theme.colors.white};
    opacity: ${(props) => props.disabled ? 0.5 : 1 };
    background: none;
  }

  ${StyledInput} {
    position: relative;
    border: 0;
    border-bottom: 1px solid ${(props) => props.hasError ? props.theme.colors.red : convertHexToRGBA(props.theme.colors.white, 0.1)};
    width: 100%;
    padding: 0;
    color: ${(props) => props.theme.colors.white};
    background: none;
        
    &:focus {
      outline: 0;
      border-bottom: 1px solid ${(props) => props.hasError ? props.theme.colors.red : props.theme.colors.white};
    }
    
    &:disabled {
      opacity: 0.5;
    }
  }
`;