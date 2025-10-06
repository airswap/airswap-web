import styled from "styled-components/macro";

import { OverlayActionButton } from "../../../../ModalOverlay/ModalOverlay.styles";
import TextInput from "../../../../TextInput/TextInput";
import { StyledInput as StyledTextInput } from "../../../../TextInput/TextInput.styles";

export const Container = styled.div`
  padding-bottom: 2rem;
`;

export const StyledButton = styled(OverlayActionButton)`
  width: 50%;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.25rem;
`;

export const StyledInput = styled(TextInput)`
  display: flex;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 0.5rem;
  margin-block-start: 2rem;
  height: 3.5rem;
  padding-inline: 1.25rem;

  ${StyledTextInput} {
    font-size: 1.25rem;
  }
`;
