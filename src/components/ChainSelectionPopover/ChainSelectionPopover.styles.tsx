import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { BorderlessButtonStyle } from "../../style/mixins";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 16rem;
  padding: 0.5rem 0;
  color: ${(props) => props.theme.colors.darkSubText};
  background-color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.black};
  border: ${(props) => props.theme.colors.borderGrey} 1px solid;
  border-radius: 0.5rem;
  z-index: 1000;
`;

export const NetworksContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0 0 0;
`;

type ButtonStyleProps = {
  $isActive: boolean;
};

export const NetworkButton = styled.button<ButtonStyleProps>`
  ${BorderlessButtonStyle};

  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0 0.5rem 1rem;
  border-radius: 1px;
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  font-size: 0.875rem;
  color: ${(props) =>
    props.$isActive
      ? props.theme.name === "dark"
        ? props.theme.colors.white
        : props.theme.colors.primary
      : props.theme.colors.darkSubText};
  background-color: ${(props) =>
    props.$isActive ? props.theme.colors.borderGrey : "transparent"};

  &:hover,
  &:focus {
    color: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  }
`;

export const NetworkIcon = styled.img`
  width: 1rem;
  height: auto;
  margin-right: 0.5rem;
`;
