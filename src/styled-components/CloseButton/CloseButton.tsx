import styled from "styled-components/macro";

import IconButton from "../../components/IconButton/IconButton";

const CloseButton = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background: ${(props) => props.theme.colors.black};
`;

export default CloseButton;
