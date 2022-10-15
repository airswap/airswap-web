import { Link } from "react-router-dom";

import styled from "styled-components/macro";

import Button from "../../../Button/Button";
import { ButtonStyle } from "../../../Button/Button.styles";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  justify-self: flex-end;
  margin-top: auto;
`;

export const SignButton = styled(Button)`
  ${ButtonStyle}
`;

export const StyledLink = styled(Link)`
  ${ButtonStyle}
`;
