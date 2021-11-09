import styled from "styled-components/macro";

import IconButton from "../../components/IconButton/IconButton";
import { InputOrButtonBorderStyle } from "../../style/mixins";

const CloseButton = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background: ${(props) => props.theme.colors.black};

  ${InputOrButtonBorderStyle};
`;

export default CloseButton;
