import styled from "styled-components/macro";

import IconButton from "../../components/IconButton/IconButton";
import { InputOrButtonBorderStyleType2 } from "../../style/mixins";

const CloseButton = styled(IconButton)`
  ${InputOrButtonBorderStyleType2};

  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  background: ${(props) => props.theme.colors.black};
`;

export default CloseButton;
