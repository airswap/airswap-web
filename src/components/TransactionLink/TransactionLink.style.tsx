import styled from "styled-components/macro";

import { BorderlessButtonStyle } from "../../style/mixins";

export const Link = styled.a`
  display: flex;
  align-items: center;
  padding: 0.25rem;
  color: ${(props) => props.theme.colors.lightGrey};

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }

  ${BorderlessButtonStyle}
`;

export const Label = styled.div`
  margin-right: 0.5rem;
`;
