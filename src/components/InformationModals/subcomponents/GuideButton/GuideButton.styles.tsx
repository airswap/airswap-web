import styled from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";
import Icon from "../../../Icon/Icon";

export const StyledIcon = styled(Icon)`
  margin-bottom: 0.375rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkSubText : theme.colors.primary};
`;

export const Text = styled.div`
  font-size: 0.675rem;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 2;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkSubText : theme.colors.primary};
`;

export const GuideButtonContainer = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 1rem;
  width: 25%;
  height: 5.5rem;
  overflow: hidden;

  &:not(&:last-of-type):not(:focus):not(:hover) {
    border-right: 0;
  }

  &:first-of-type {
    border-top-left-radius: 0.1875rem;
    border-bottom-left-radius: 0.1875rem;
  }

  &:last-of-type {
    border-top-right-radius: 0.1875rem;
    border-bottom-right-radius: 0.1875rem;
  }

  ${InputOrButtonBorderStyleType2}

  &:hover,
  &:focus {
    z-index: 1;

    & + & {
      border-left: 0;
    }

    &:not(:last-of-type) {
      padding-right: calc(1rem - 1px);
    }
  }

  &:hover {
    ${StyledIcon} {
      color: ${({ theme }) =>
        theme.name === "dark" ? theme.colors.white : theme.colors.primary};
    }

    ${Text} {
      color: ${({ theme }) =>
        theme.name === "dark" ? theme.colors.white : theme.colors.primary};
    }
  }

  &:active {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;
