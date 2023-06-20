import styled from "styled-components/macro";

import { BorderlessButtonStyle } from "../../../../style/mixins";

export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin-top: 1rem;
`;

export const Link = styled.a`
  color: ${(props) => props.theme.colors.lightGrey};

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }

  ${BorderlessButtonStyle}
`;

export const IconContainer = styled.div`
  border-width: 0.5px;
  border-color: ${(props) => props.theme.colors.borderGrey};
  border-radius: 100%;
  padding: 0.5rem;
  margin-left: 1rem;
`;
