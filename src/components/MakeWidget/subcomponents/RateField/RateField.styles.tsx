import styled from "styled-components/macro";

import { fontMono } from "../../../../style/themes";
import { LargePillButtonStyle } from "../../../../styled-components/Pill/Pill";
import IconButton from "../../../IconButton/IconButton";

export const StyledIconButton = styled(IconButton)``;

export const Text = styled.div``;

export const RateBox = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0.25rem;
`;

export const Wrapper = styled.div<{ isButton: boolean }>`
  display: flex;
  align-items: center;
  width: fit-content;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.75rem;

  ${({ isButton, theme }) =>
    isButton
      ? LargePillButtonStyle
      : `
      color: ${theme.colors.lightGrey};
      gap: 0.375rem;
      
      ${StyledIconButton} {
        margin-left: -0.25rem;
      }

      ${RateBox} {
        border-radius: 0.125rem;
        border: 1px solid ${theme.colors.borderGrey};
        margin-left: 0;
        height: 2rem;
        padding: 0 0.5rem;
        font-family: ${fontMono};
        font-size: 0.875rem;
        font-weight: 500;
      }
    `};
`;
