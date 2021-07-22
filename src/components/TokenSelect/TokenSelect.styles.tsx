import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';

type StyledTokenSelectProps = {
  hasToken: boolean;
}

export const StyledTokenSelect = styled.div<{ theme: ThemeProps } & StyledTokenSelectProps>`
  position: relative;
  width: 100%;
  
  & + & {
    margin-top: 1.5rem;
  }
  
  .token-selector {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
  }
  
  .token-selector-button {
    padding: 0.25rem;
    color: ${(props) => props.hasToken ? props.theme.colors.white : props.theme.colors.lightGrey};
  }

  .token-selector-button-icon {
    margin-left: 1rem;
    width: 0.675rem;
    color: ${(props) => props.theme.colors.primary};
  }
`;
