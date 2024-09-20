import styled, { css, DefaultTheme } from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { fontWide } from "../../style/themes";
import Icon from "../Icon/Icon";
import { ButtonIntent, ButtonJustifyContent } from "./Button";

function getButtonBackground(
  theme: DefaultTheme,
  intent?: ButtonIntent
): string {
  switch (intent) {
    case "destructive":
      return theme.colors.red;
    case "positive":
      return theme.colors.green;
    case "neutral":
      return theme.colors.neutral;
    default:
      return theme.colors.primary;
  }
}

function getButtonHoverBackground(
  theme: DefaultTheme,
  intent?: ButtonIntent
): string {
  switch (intent) {
    case "destructive":
      return theme.colors.red;
    case "positive":
      return theme.colors.green;
    case "neutral":
      return theme.colors.darkGrey;
    default:
      return theme.colors.primaryDark;
  }
}

function getButtonBorderColor(
  theme: DefaultTheme,
  intent?: ButtonIntent,
  disabled?: boolean
) {
  if (disabled) {
    return theme.colors.darkGrey;
  }

  return "transparent";
}

function getButtonHoverBorderColor(theme: DefaultTheme, intent?: ButtonIntent) {
  if (intent === "neutral") {
    return "transparent";
  }

  return theme.colors.primaryDark;
}

export const Text = styled.div`
  transition: opacity 0.3s ease-out;
`;

type StyledButtonProps = {
  disabled?: boolean;
  $loading?: boolean;
  intent?: ButtonIntent;
  justifyContent?: ButtonJustifyContent;
};

export const ButtonStyle = css<StyledButtonProps>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justifyContent || "center"};
  width: fit-content;
  height: 3rem;
  padding: 0 2rem;
  font-family: ${fontWide};
  font-size: 1.25rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 0.5rem;
  border-style: "solid";
  border-width: 1px;
  border-color: ${(props) =>
    getButtonBorderColor(props.theme, props.intent, props.disabled)};
  /* Use blue text on a netral light mode button, otherwise white. */
  color: ${(props) =>
    props.intent === "neutral" && props.theme.name === "light"
      ? props.theme.colors.primary
      : props.theme.colors.alwaysWhite};
  background: ${(props) => getButtonBackground(props.theme, props.intent)};
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};
  cursor: ${(props) => (props.disabled ? "none" : "pointer")};

  ${Text} {
    margin-right: ${(props) => (props.$loading ? "1rem" : 0)};
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  }

  &:focus,
  &:hover {
    outline: 0;
    background: ${(props) =>
      getButtonHoverBackground(props.theme, props.intent)};
    border-color: ${(props) =>
      getButtonHoverBorderColor(props.theme, props.intent)};
  }

  &:active {
    border-color: ${(props) => props.theme.colors.primary};
  }

  @media ${breakPoints.phoneOnly} {
    font-size: 1.125rem;
  }

  @supports (-moz-appearance: none) {
    padding-top: 0.125rem;
  }
`;

export const StyledButton = styled.button`
  ${ButtonStyle}
`;

export const StyledIcon = styled(Icon)`
  margin-left: 0.5rem;
`;
