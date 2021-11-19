import styled from "styled-components/macro";

import {
  BorderlessButtonStyle,
  InputOrButtonBorderStyleType2,
  ScrollBarStyle,
} from "../../style/mixins";

type ContainerProps = {
  open: boolean;
};

export const Container = styled.div<ContainerProps>`
  position: absolute;
  display: grid;
  grid-template-rows: 5rem;
  width: 16rem;
  height: 17.25rem;
  top: 4rem;
  right: 13rem;
  transform: ${(props) => (props.open ? "translate(-11.5rem, 0)" : "0")};
  color: ${(props) => props.theme.colors.darkSubText};
  background-color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.black};
  border: ${(props) => props.theme.colors.borderGrey} 1px solid;
  border-radius: 0.5rem;
  padding: 1rem;
  z-index: 1000;
`;

export const ThemeContainer = styled.div`
  margin: 0.5rem 0 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 2.5rem;
`;

type ButtonStyleProps = {
  active: boolean;
};

export const ThemeButton = styled.button<ButtonStyleProps>`
  ${InputOrButtonBorderStyleType2};

  line-height: 1.5;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) =>
    props.active
      ? props.theme.name === "dark"
        ? props.theme.colors.white
        : props.theme.colors.primary
      : props.theme.colors.darkSubText};
  background-color: ${(props) =>
    props.active ? props.theme.colors.borderGrey : "transparent"};
`;

type LocaleContainerType = {
  $overflow: boolean;
};

export const LocaleContainer = styled.div<LocaleContainerType>`
  width: 100%;
  height: 100%;
  padding: 0.5rem 0 1rem;
  overflow-y: ${(props) => (props.$overflow ? "scroll" : "hidden")};
  flex-grow: 99;

  ${ScrollBarStyle}

  &::-webkit-scrollbar {
    background: ${(props) => props.theme.colors.black};
  }
`;

export const LocaleButton = styled.button<ButtonStyleProps>`
  ${BorderlessButtonStyle};

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 0.5rem 0 0.5rem 1rem;
  border-radius: 1px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  font-size: 0.875rem;
  color: ${(props) =>
    props.active
      ? props.theme.colors.alwaysWhite
      : props.theme.colors.darkSubText};
  background-color: ${(props) =>
    props.active ? props.theme.colors.borderGrey : "transparent"};

  &:hover,
  &:focus {
    color: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  }
`;
