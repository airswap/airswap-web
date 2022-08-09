import styled from "styled-components/macro";

import { Pill, PillButton } from "../../../../styled-components/Pill/Pill";
import Icon from "../../../Icon/Icon";

export const InfoWrapper = styled(Pill)`
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const Button = styled(PillButton)`
  ${StyledIcon} {
    margin-left: 0.375rem;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.white};

    ${StyledIcon} {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;
