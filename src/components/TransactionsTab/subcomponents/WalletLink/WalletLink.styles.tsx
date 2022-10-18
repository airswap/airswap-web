import styled from "styled-components/macro";

import { BorderlessButtonStyle } from "../../../../style/mixins";

export const Link = styled.a`
  margin-left: 0.5rem;
  padding: 0.5rem;
  color: ${(props) => props.theme.colors.lightGrey};

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }

  ${BorderlessButtonStyle}
`;
