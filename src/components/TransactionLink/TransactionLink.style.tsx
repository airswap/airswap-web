import styled from "styled-components/macro";

import { BorderlessButtonStyle } from "../../style/mixins";
import Icon from "../Icon/Icon";

export const Link = styled.a`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.25rem;
  color: ${(props) => props.theme.colors.lightGrey};

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }

  ${BorderlessButtonStyle}
`;

export const Label = styled.div``;
export const StyledIcon = styled(Icon)`
  margin-bottom: -0.125rem;
`;
