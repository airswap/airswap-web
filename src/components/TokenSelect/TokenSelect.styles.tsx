import styled from 'styled-components';
import IconButton from '../IconButton/IconButton';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import TextInput from '../TextInput/TextInput';

type StyledTokenSelectProps = {
  hasToken: boolean;
}

export const TokenSelectorLoader = styled(LoadingSpinner)`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.25rem;
`;

export const TokenSelectorButton = styled(IconButton)``;

export const StyledTextInput = styled(TextInput)``;

export const StyledTokenSelect = styled.div<StyledTokenSelectProps>`
  position: relative;
  width: 100%;
  
  & + & {
    margin-top: 1.5rem;
  }
  
  ${TokenSelectorButton} {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 2.5rem;
    padding: 0.25rem;
    color: ${(props) => props.hasToken ? props.theme.colors.white : props.theme.colors.lightGrey};
    
    &:hover {
      color: ${(props) => props.theme.colors.white};
    }

    svg {
      margin-left: 1rem;
      color: ${(props) => props.theme.colors.primary};
    }
  }

  ${StyledTextInput} {

    label {
      margin-bottom: 0.125rem;
    }

    input {
      padding-bottom: 0.5rem;
    }
  }
`;
