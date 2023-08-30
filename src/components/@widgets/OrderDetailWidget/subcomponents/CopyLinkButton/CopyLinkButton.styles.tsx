import styled from "styled-components/macro";

import {
  InputOrButtonBorderStyle,
  TextEllipsis,
} from "../../../../../style/mixins";
import Button from "../../../../Button/Button";

export const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
`;

export const CopyLinkElement = styled(Button)`
  ${InputOrButtonBorderStyle};
  ${TextEllipsis};

  display: inline;
  line-height: 3;
  width: 100%;
  max-width: 15rem;
  padding: 0 1rem;

  &::selection {
    color: ${(props) => props.theme.colors.white};
    background: ${(props) => props.theme.colors.primary};
  }
`;
