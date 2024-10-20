import { Link } from "react-router-dom";

import styled from "styled-components/macro";

import Button from "../../../../Button/Button";
import { ButtonStyle } from "../../../../Button/Button.styles";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-block-start: 2.5rem;
`;

export const SignButton = styled(Button)`
  ${ButtonStyle}
`;

export const StyledLink = styled(Link)`
  ${ButtonStyle}
`;
