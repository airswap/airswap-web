import { motion } from "framer-motion";
import { css } from "styled-components";
import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { ScrollBarStyle } from "../../style/mixins";
import { sizes } from "../../style/sizes";
import CloseButton from "../../styled-components/CloseButton/CloseButton";
import Button from "../Button/Button";
import { InfoSubHeading } from "../Typography/Typography";
import { StyledH3 } from "../Typography/Typography.styles";

type ContainerProps = {
  isAnimating: boolean;
  isHidden: boolean;
  hasDynamicHeight: boolean;
  hasTitle: boolean;
  hasOverflow: boolean;
};

type ScrollContainerProps = {
  $overflow?: boolean;
};

export const ScrollContainer = styled.div<ScrollContainerProps>`
  display: flex;
  flex-direction: column;
  flex-grow: 99;
  width: 100%;
  height: 100%;
  margin-block-start: 0.5rem;
  padding-inline-end: 0.5rem;
  padding-block-end: 1.5rem;
  overflow-x: hidden;
  overflow-y: ${(props) => (props.$overflow ? "scroll" : "hidden")};

  ${(props) =>
    props.$overflow &&
    css`
      -webkit-mask-image: -webkit-gradient(
        linear,
        0 75%,
        0 100%,
        from(rgba(0, 0, 0, 1)),
        to(rgba(0, 0, 0, 0))
      );
    `}

  ${ScrollBarStyle};
`;

export const ContentContainer = styled(motion.div)`
  position: relative;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2rem;
  margin-block-end: 2rem;
  width: calc(100vw - 4rem);
  max-width: 38.75rem;
  height: fit-content;
  max-height: 47.5rem;
  min-height: 30rem;
  padding: 0 ${sizes.tradeContainerPadding};

  @media ${breakPoints.phoneOnly} {
    padding: 0 ${sizes.tradeContainerMobilePadding};
  }

  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 2rem;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.colors.darkBlue};
    filter: brightness(0.5);
    opacity: 0.75;
    pointer-events: none;
    z-index: -1;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-block-end: 1rem;
  padding-block-start: ${sizes.tradeContainerPadding};
  transition: background ease-in-out 0.3s;

  @media ${breakPoints.phoneOnly} {
    padding-block-start: ${sizes.tradeContainerMobilePadding};
  }
`;

export const TitleSubContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledTitle = styled(StyledH3)<{
  type: keyof JSX.IntrinsicElements;
  as?: keyof JSX.IntrinsicElements;
}>`
  min-height: 1.875rem;
  padding-right: 1rem;
  flex-grow: 2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity ease-in-out 0.3s;
  will-change: opacity;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const StyledInfoSubHeading = styled(InfoSubHeading)`
  margin-top: 0.5rem;
  transition: opacity ease-in-out 0.3s;
  will-change: opacity;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const OverlayActionButtonStyle = css`
  margin-top: 1rem;
  margin-inline: auto;
`;

export const OverlayActionButton = styled(Button)`
  ${OverlayActionButtonStyle};
`;

const containerDynamicHeightStyle = css`
  padding-block-start: 5.5rem;

  @media ${breakPoints.bigDesktopUp} {
    padding-block-start: 2rem;
  }

  @media ${breakPoints.phoneOnly} {
    padding-block-start: 4.25rem;
  }
`;

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.hasOverflow ? "flex-start" : "center")};;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${(props) => (props.hasDynamicHeight ? "auto" : "100%")};
  min-height: 100vh;
  min-height: 100svh;
  padding-block-start: 2rem;
  pointer-events: ${(props) => (props.isHidden ? "none" : "visible")};
  z-index: 20;
  overflow: ${(props) => (props.isAnimating ? "hidden" : "auto")};

  ${(props) => props.hasDynamicHeight && containerDynamicHeightStyle};
}
`;

export const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 3;
`;
