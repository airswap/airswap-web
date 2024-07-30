import styled from "styled-components/macro";

import IconButton from "../../components/IconButton/IconButton";
import { StyledIcon } from "../../components/IconButton/IconButton.styles";
import { InputOrButtonBorderStyleType2 } from "../../style/mixins";

const CloseButton = styled(IconButton)`
  ${InputOrButtonBorderStyleType2};

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  width: 2rem;
  height: 2rem;
  padding: 0;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};

  ${StyledIcon} svg {
    width: 1.375rem;
    height: 1.375rem;
  }
`;

export default CloseButton;
