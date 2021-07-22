import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';
import convertHexToRGBA from '../../helpers/transformHexToRgba';

type TextInputStyleProps = {
  hideLabel?: boolean;
  hasError?: boolean;
}

export const StyledTextInput = styled.label<{ theme: ThemeProps } & TextInputStyleProps>`
  .label {
    display: ${(props) => props.hideLabel ? 'none' : 'block' };
    margin-bottom: 0.125rem;
    width: 100%;
    font-size: ${(props) => props.theme.typography.formLabel.fontSize};
    font-weight: ${(props) => props.theme.typography.formLabel.fontWeight};
    line-height: ${(props) => props.theme.typography.formLabel.lineHeight};
    color: ${(props) => props.theme.colors.white};
  }
  
  .input {
    position: relative;
    border-bottom: 1px solid ${(props) => props.hasError ? props.theme.colors.red : convertHexToRGBA(props.theme.colors.white, 0.1)};
    width: 100%;
    padding: 0 0 0.5rem;
    font-size: ${(props) => props.theme.typography.formInput.fontSize};
    font-weight: ${(props) => props.theme.typography.formInput.fontWeight};
    line-height: ${(props) => props.theme.typography.formInput.lineHeight};
    
    background: none;
        
    &:focus {
      outline: 0;
      border-bottom: 1px solid ${(props) => props.hasError ? props.theme.colors.red : props.theme.colors.white};
    }
  }
`;