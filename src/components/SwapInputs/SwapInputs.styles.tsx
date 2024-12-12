import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { InputOrButtonBorderStyle } from "../../style/mixins";
import Tooltip from "./subcomponents/Tooltip/Tooltip";

export const Container = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "inherit")};
  will-change: opacity, transform;
  transition: opacity 0.3s ease-in-out,
    transform 0.4s cubic-bezier(0.45, 0.22, 0, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`;

export const SwitchTokensButton = styled.button`
  ${InputOrButtonBorderStyle};

  position: absolute;
  right: calc(50% - 1rem);
  top: calc(50% - 1rem);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  aspect-ratio: 1;
  border-radius: 50%;
  color: ${(props) =>
    props.theme.name === "dark"
      ? props.theme.colors.lightGrey
      : props.theme.colors.darkGrey};
  background-color: ${(props) =>
    props.theme.name === "dark"
      ? props.theme.colors.darkGrey
      : props.theme.colors.white};
  z-index: 1;

  &:disabled {
    pointer-events: none;
  }

  @media ${breakPoints.phoneOnly} {
    right: calc(50% - 0.875rem);
    top: calc(50% - 0.875rem);
    width: 1.75rem;
  }
`;

export const MaxAmountInfoTooltip = styled(Tooltip)`
  position: absolute;
  right: 0;
  height: 0;

  @media ${breakPoints.tabletLandscapeUp} {
    height: 4.5rem;
  }
`;

export const BaseAmountErrorTooltip = styled(Tooltip)`
  position: absolute;
  right: 0;
`;

export const QuoteAmountErrorTooltip = styled(Tooltip)`
  position: absolute;
  right: 0;
  top: inherit;
  bottom: 0;
`;
