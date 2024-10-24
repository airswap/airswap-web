import styled from "styled-components/macro";

import IconButton from "../../components/IconButton/IconButton";
import { StyledIcon } from "../../components/IconButton/IconButton.styles";
import { InputOrButtonBorderStyle } from "../../style/mixins";

const CloseButton = styled(IconButton)`
  ${InputOrButtonBorderStyle};

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.primary};

  ${StyledIcon} svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export default CloseButton;
