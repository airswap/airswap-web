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

export const LinkTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 1rem;
`;

export const LinkText = styled.span`
  margin-right: 1rem;
`;

export const IconBorder = styled.div`
  border-width: 0.5px;
  border-color: ${(props) => props.theme.colors.borderGrey};
  border-radius: 100%;
  padding: 0.5rem;
`;
