import styled from "styled-components/macro";

import { ScrollContainer } from "../ModalOverlay/ModalOverlay.styles";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledScrollContainer = styled(ScrollContainer)`
  padding-block-start: 1rem;
  height: 14.5rem;
  overflow-y: ${(props) => (props.$overflow ? "scroll" : "hidden")};
`;

export const StyledErrorList = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.black};
`;
