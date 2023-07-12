import styled, { keyframes } from "styled-components/macro";
import { css } from "styled-components/macro";

import breakPoints from "../../../../style/breakpoints";
import { BorderlessButtonStyle } from "../../../../style/mixins";
import { fontMono } from "../../../../style/themes";
import Icon from "../../../Icon/Icon";
import TransactionLink from "../../subcomponents/TransactionLink/TransactionLink";

type ContainerProps = {
  disabled: boolean;
  showDeleteButton: boolean;
};

export const TokenNameContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
`;

export const TokenName = styled.h3`
  width: fit;
  text-align: left;
  line-height: 1.25;
  font-size: 1rem;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.darkGrey};

  @media ${breakPoints.phoneOnly} {
    line-height: calc(1 + (1 / 3));
    font-size: 0.75rem;
  }
`;

export const Balance = styled.div`
  font-family: ${fontMono};
  font-weight: 500;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.darkGrey};
`;

const scaleInAnimation = keyframes`
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
`;

export const DeleteIcon = styled(Icon)`
  margin-left: auto;
  padding: 0.25rem;
  color: ${(props) => props.theme.colors.lightGrey};

  transform: scale(0);
  animation: ${scaleInAnimation} 0.25s ease-out forwards;

  @media (prefers-reduced-motion: reduce) {
    transform: scale(1);
    animation: none;
  }
`;

export const TokenSymbolAndName = styled.div`
  display: flex;
  align-items: center;

  @media ${breakPoints.phoneOnly} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Container = styled.button<ContainerProps>`
  ${BorderlessButtonStyle};

  display: grid;
  grid-auto-flow: column;
  grid-template-columns: ${(props) =>
    props.showDeleteButton
      ? "1.25rem calc(100% - 7.5rem) 3.25rem"
      : "1.25rem 50% calc(50% - 4.5rem)"};
  grid-gap: 1rem;
  align-items: center;
  position: relative;
  width: 100%;
  height: 2rem;
  padding: 0.25rem 0;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:not(:first-of-type) {
    margin-top: 0.5rem;
  }

  &:hover {
    ${TokenName} {
      color: ${({ theme, disabled }) =>
        disabled
          ? theme.colors.lightGrey
          : theme.name === "dark"
          ? theme.colors.white
          : theme.colors.primary};
    }

    ${Balance} {
      color: ${({ theme }) =>
        theme.name === "dark" ? theme.colors.white : theme.colors.primary};
    }

    ${DeleteIcon} {
      color: ${(props) =>
        props.disabled
          ? props.theme.colors.lightGrey
          : props.theme.colors.white};
    }
  }

  @media ${breakPoints.phoneOnly} {
    grid-template-columns: ${(props) =>
      props.showDeleteButton
        ? "1.25rem calc(100% - 7.5rem) 3.25rem"
        : "1.25rem calc(50% - 2rem) calc(50% - 2.5rem)"};
    align-items: flex-start;
    height: 2.5rem;
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Symbol = styled.h3`
  margin-right: 1rem;
  width: 5rem;
  text-align: left;
  line-height: calc(1 + (1 / 3));
  font-size: 1.125rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 30%;

  @media ${breakPoints.phoneOnly} {
    margin-right: 0;
    line-height: 1;
    font-size: 1rem;
  }
`;

export const TooltipStyle = css`
  position: absolute;
  white-space: nowrap;
  top: 85%;
  left: 50%;
  z-index: 1;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2px;
  padding: 0.5rem;
  line-height: 1.2;
  font-size: 0.875rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.darkGrey};
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.primaryLight};
  filter: drop-shadow(${(props) => props.theme.shadows.tooltipGlow});
`;

export const Tooltip = styled.div`
  display: none;

  ${TooltipStyle};
`;

export const StyledIcon = styled(TransactionLink)`
  display: flex;
  position: relative;

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }

  &:hover + ${Tooltip} {
    display: block;
  }
`;
