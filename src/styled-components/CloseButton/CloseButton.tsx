import styled from "styled-components/macro";

import IconButton from "../../components/IconButton/IconButton";
import convertHexToRGBA from "../../helpers/transformHexToRgba";

const CloseButton = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};

  &:hover {
    border-color: ${(props) => convertHexToRGBA(props.theme.colors.white, 0.5)};
  }
`;

export default CloseButton;
