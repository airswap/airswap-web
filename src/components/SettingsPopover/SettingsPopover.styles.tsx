import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import {
  BorderlessButtonStyle,
  InputOrButtonBorderStyleType2,
  ScrollBarStyle,
} from "../../style/mixins";
import PopoverSection from "./subcomponents/PopoverSection/PopoverSection";

type ContainerProps = {
  isOpen: boolean;
};

export const Container = styled.div<ContainerProps>`
  position: absolute;
  display: grid;
  grid-template-rows: 5rem auto 5.125rem;
  width: 16rem;
  height: 24.125rem;
  top: 5rem;
  right: 3.75rem;
  padding-top: 0.5rem;
  transform: ${(props) => (props.isOpen ? "translate(-11.5rem, 0)" : "0")};
  color: ${(props) => props.theme.colors.darkSubText};
  background-color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.black};
  border: ${(props) => props.theme.colors.borderGrey} 1px solid;
  border-radius: 0.5rem;
  z-index: 1000;

  @media ${breakPoints.tabletPortraitUp} {
    right: 13.75rem;
  }

  @media ${breakPoints.phoneOnly} {
    top: 4rem;
    right: 0;
  }
`;

export const ThemeContainer = styled.div`
  margin: 0.5rem 0 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 2.5rem;
`;

type ButtonStyleProps = {
  $isActive: boolean;
};

export const ThemeButton = styled.button<ButtonStyleProps>`
  ${InputOrButtonBorderStyleType2};

  line-height: 1.5;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  color: ${(props) =>
    props.$isActive
      ? props.theme.name === "dark"
        ? props.theme.colors.white
        : props.theme.colors.primary
      : props.theme.colors.darkSubText};
  background-color: ${(props) =>
    props.$isActive ? props.theme.colors.borderGrey : "transparent"};
`;

type LocaleContainerType = {
  $overflow: boolean;
};

export const LocaleContainer = styled.div<LocaleContainerType>`
  width: 100%;
  height: calc(100% - 2rem);
  padding-top: 0.5rem;
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

export const BottomPopoverSection = styled(PopoverSection)`
  border-top: 1px solid ${(props) => props.theme.colors.borderGrey};
  padding-top: 1rem;
`;
