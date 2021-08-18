import styled, { DefaultTheme } from "styled-components/macro";

import { ButtonIntent, ButtonProps } from "./Button";

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
      return theme.colors.black;
    default:
      return theme.colors.primary;
  }
}

export const Text = styled.div`
  transition: opacity 0.3s ease-out;
`;

export const StyledButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justifyContent || "center"};
  width: 100%;
  height: 3.125rem;
  padding: 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 2px;
  border-style: ${(props) => (props.intent === "neutral" ? "solid" : "none")};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderGrey};
  /* Use blue text on a netral light mode button, otherwise white. */
  color: ${(props) =>
    props.intent === "neutral" && props.theme.name === "light"
      ? props.theme.colors.primary
      : props.theme.colors.alwaysWhite};
  background: ${(props) => getButtonBackground(props.theme, props.intent)};
  pointer-events: ${(props) => (props.disabled ? "none" : "visible")};
  cursor: ${(props) => (props.disabled ? "none" : "pointer")};

  ${Text} {
    margin-right: ${(props) => (props.loading ? "1rem" : 0)};
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  }
`;
