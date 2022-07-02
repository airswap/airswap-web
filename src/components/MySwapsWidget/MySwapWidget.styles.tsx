import { Link } from "react-router-dom";

import styled from "styled-components/macro";

import { ButtonStyle } from "../Button/Button.styles";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const StyledLink = styled(Link)`
  ${ButtonStyle};

  margin-top: auto;
  justify-self: flex-end;
`;
