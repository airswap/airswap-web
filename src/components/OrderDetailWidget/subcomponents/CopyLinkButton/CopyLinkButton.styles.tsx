import styled from "styled-components/macro";

import { TextEllipsis } from "../../../../style/mixins";
import { LargePillButton } from "../../../../styled-components/Pill/Pill";

export const CopyLinkElement = styled(LargePillButton)`
  ${TextEllipsis};

  display: inline;
  line-height: 3;
  width: 100%;
  max-width: 15rem;
  padding-right: 1rem;

  &::selection {
    color: ${(props) => props.theme.colors.white};
    background: ${(props) => props.theme.colors.primary};
  }
`;
