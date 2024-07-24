import styled from "styled-components/macro";

import { TextEllipsis } from "../../../../../style/mixins";
import { fontMono, fontWide } from "../../../../../style/themes";
import { LargePillButtonStyle } from "../../../../../styled-components/Pill/Pill";
import IconButton from "../../../../IconButton/IconButton";

export const StyledIconButton = styled(IconButton)`
  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const Text = styled.div`
  ${TextEllipsis};

  max-width: 5rem;
`;

export const Rate = styled.div``;

export const Wrapper = styled.div<{ isButton: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  line-height: 1;
  font-family: ${fontWide};
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.875rem;
  ${({ isButton, theme }) =>
    isButton
      ? LargePillButtonStyle
      : `
      color: ${theme.colors.lightGrey};
      gap: 0.375rem;
      
      ${StyledIconButton} {
        margin-left: -0.25rem;
      }

      ${Rate} {
        font-family: ${fontMono};
        font-size: 0.875rem;
        font-weight: 500;
      }
    `};

  margin: ${({ isButton }) => (isButton ? "0 0.5rem" : "0")};
`;
