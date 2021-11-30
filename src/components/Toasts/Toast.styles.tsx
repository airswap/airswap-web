import styled, { ThemeType } from "styled-components/macro";

import { InfoSubHeading } from "../Typography/Typography";

// Notice we are overriding background-color with !important
// this is necessary to override built-in styling of toasts
export const Container = styled.div`
  display: grid;
  grid-template-columns: 2.5rem auto 2.5rem;
  grid-gap: 1rem;
  align-items: center;
  width: 22.5rem;
  border-radius: 0.25rem !important;
  padding: 1rem;
  padding-right: 0.5rem;
  color: ${(props) => props.theme.colors.white};
  background: ${({ theme }) =>
    theme.name === "dark"
      ? theme.colors.darkGrey
      : theme.colors.black} !important;
`;

type IconContainerProps = {
  error?: boolean;
};

function getIconBackground(theme: ThemeType, error: boolean) {
  if (theme === "dark") {
    return error ? "rgba(255,0,0,0.17)" : "rgba(96,255,102,0.1)";
  }

  return error ? "rgba(235, 41, 41, 0.14)" : "rgba(14, 213, 141, 0.18)";
}

function getIconColor(theme: ThemeType, error: boolean) {
  if (theme === "dark") {
    return error ? "#FF0000" : "#60FF66";
  }

  return error ? "#FF6D64" : "#0ED58D";
}

// Notice we are overriding background and border-radius with !important
// this is necessary to override built-in styling of toasts
export const IconContainer = styled.div<IconContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  background: ${(props) =>
    getIconBackground(props.theme.name, !!props.error)} !important;
  border-radius: 50% !important;
  color: ${(props) => getIconColor(props.theme.name, !!props.error)};
`;

export const SwapAmounts = styled(InfoSubHeading)`
  font-size: 1rem;
`;

export const HiXContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const TextContainer = styled.div`
  display: block;
`;
