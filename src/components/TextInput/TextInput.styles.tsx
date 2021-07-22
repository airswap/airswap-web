import styled from 'styled-components';
import convertHexToRGBA from '../../helpers/transformHexToRgba';

type TextInputStyleProps = {
  hideLabel?: boolean;
  hasError?: boolean;
}

export const StyledTextInput = styled.label<TextInputStyleProps>`  
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
    border: 0;
    border-bottom: 1px solid ${(props) => props.hasError ? props.theme.colors.red : convertHexToRGBA(props.theme.colors.white, 0.1)};
    width: 100%;
    padding: 0 0 0.5rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    background: none;
    
    color: ${(props) => props.theme.colors.white};
        
    &:focus {
      outline: 0;
      border-bottom: 1px solid ${(props) => props.hasError ? props.theme.colors.red : props.theme.colors.white};
    }
  }
`;