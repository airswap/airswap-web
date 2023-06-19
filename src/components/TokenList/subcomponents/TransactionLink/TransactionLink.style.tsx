import styled from "styled-components/macro";

import { BorderlessButtonStyle } from "../../../../style/mixins";

export const Link = styled.a`
  padding: 0.25rem;
  color: ${(props) => props.theme.colors.lightGrey};

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }

  ${BorderlessButtonStyle}
`;
