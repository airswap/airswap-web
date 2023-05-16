import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
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
  grid-template-rows: 5rem auto 5.125rem;
  width: 16rem;
  height: 24.125rem;
  top: 5rem;
  right: 3.75rem;
  padding-top: 0.5rem;
  transform: ${(props) => (props.open ? "translate(-11.5rem, 0)" : "0")};
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

type ChainSelectionContainerType = {
  $overflow: boolean;
};

export const NetworksContainer = styled.div<ChainSelectionContainerType>`
  margin: 0.5rem 0 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 2.5rem;
`;

type ButtonStyleProps = {
  $isActive: boolean;
};

export const NetworkButton = styled.button<ButtonStyleProps>`
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
