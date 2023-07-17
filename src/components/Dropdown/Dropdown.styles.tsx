import styled, { css } from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { InputOrButtonBorderStyle, TextEllipsis } from "../../style/mixins";
import Icon from "../Icon/Icon";

const ButtonStyle = css`
  ${InputOrButtonBorderStyle};

  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  width: 100%;
  height: var(--dropdown-button-height);
  padding: 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.black};

  @supports (-moz-appearance: none) {
    padding-top: 0.125rem;
  }
`;

export const ItemBackground = styled.div`
  ${ButtonStyle};

  transition: transform 0.2s cubic-bezier(0, 0.76, 0.44, 1.01);
  position: absolute;
  top: var(--dropdown-options-wrapper-padding);
  margin-top: -1px;
  width: calc(100% - var(--dropdown-options-wrapper-padding) * 2);
  pointer-events: none;
  background: ${({ theme }) => theme.colors.borderGrey};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Option = styled.button<{ isActive?: boolean; index?: number }>`
  ${ButtonStyle};

  position: relative;
  border-color: transparent;
  background: none;
  z-index: 1;

  &:hover,
  &:focus {
    z-index: 3;
  }

  &:hover:not(:focus) {
    border-color: transparent;
  }

  &:not(:first-child) {
    margin-top: -1px;
  }

  &:last-child {
    border-bottom-right-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }

  ${({ isActive, index }) =>
    isActive &&
    index !== undefined &&
    `
    z-index: 2;

    &:nth-child(${index + 1}) ~ ${ItemBackground} {
      transform: translateY(calc(${index} * var(--dropdown-button-height) - ${index}px));
    }
  `};
`;

export const SelectButtonText = styled.div<{ width?: number }>`
  ${TextEllipsis};

  width: ${(props) => `${props.width}px` || "auto"};
  text-align: left;
`;

export const DropdownButtonText = styled.div`
  ${TextEllipsis};

  text-align: left;
  width: 100%;
`;

export const SelectOptions = styled.div<{ activeIndex: number }>`
  transform: translateY(
    calc(
      ${(props) => -props.activeIndex} * var(--dropdown-button-height) -
        ${(props) => -props.activeIndex}px
    )
  );

  display: none;
  flex-direction: column;
  position: absolute;
  width: calc(var(--dropdown-options-wrapper-padding) * 2 + 100%);
  top: calc(var(--dropdown-options-wrapper-padding) * -1 - 2px);
  left: calc(var(--dropdown-options-wrapper-padding) * -1 - 1px);
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: 4px;
  margin-top: 1px;
  padding: var(--dropdown-options-wrapper-padding);
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.primaryLight};
  box-shadow: ${({ theme }) => theme.shadows.selectOptionsShadow};
  z-index: 1;
`;

const SelectStyle = css`
  ${InputOrButtonBorderStyle};
  ${ButtonStyle};

  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  padding-right: 0.5rem;

  &:focus + ${SelectOptions} {
    display: flex;
  }
`;

export const Select = styled.button`
  ${SelectStyle};
`;

export const NativeSelectWrapper = styled.div`
  position: relative;
`;

export const NativeSelectIcon = styled(Icon)`
  position: absolute;
  top: 0.25rem;
  right: 0.5625rem;
  pointer-events: none;
  z-index: 2;
`;

export const NativeSelect = styled.select`
  ${SelectStyle}
  ${TextEllipsis};

  appearance: none;
  padding-right: 2rem;
`;

export const Wrapper = styled.div`
  position: relative;

  --dropdown-button-height: 2rem;
  --dropdown-options-wrapper-padding: 0.5rem;

  ${NativeSelectWrapper} {
    display: none;
  }

  @media ${breakPoints.phoneOnly} {
    ${Select} {
      display: none;
    }

    ${NativeSelectWrapper} {
      display: block;
    }
  }
`;

export const Sizer = styled.div`
  ${ButtonStyle};

  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  width: auto;
  padding: 0;
  pointer-events: none;
  opacity: 0;
`;
