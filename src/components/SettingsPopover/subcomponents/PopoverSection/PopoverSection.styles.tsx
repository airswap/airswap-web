import styled from "styled-components";

import { StyledTitle } from "../../../Overlay/Overlay.styles";

const Container = styled.div`
  color: ${(props) => props.theme.colors.lightGrey};
  display: grid;
  grid-template-rows: 1.75rem;
  overflow: hidden;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled(StyledTitle)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  &:after {
    margin: 0 0 0 1rem;
    background: ${(props) => props.theme.colors.borderGrey};
    height: 1px;
    flex: 1;
    content: "";
  }

  &:before {
    background: none;
  }
`;

const Line = styled.span`
  background: transparent;
`;

export { Container, TitleContainer, Line, Title };
