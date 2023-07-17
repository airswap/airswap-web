import styled from "styled-components/macro";

import breakPoints from "../../../../style/breakpoints";
import { BorderlessButtonStyle } from "../../../../style/mixins";
import Icon from "../../../Icon/Icon";

export const Link = styled.a`
  ${BorderlessButtonStyle};

  display: inline-flex;
  align-items: center;
  padding: 0.25rem;
  color: ${(props) => props.theme.colors.lightGrey};

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }
`;

export const StyledIcon = styled(Icon)`
  margin-top: 0.125rem;
  margin-left: 0.25rem;
`;
