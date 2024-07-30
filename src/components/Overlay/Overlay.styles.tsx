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
  isHidden: boolean;
  hasTitle: boolean;
};

type ScrollContainerProps = {
  $overflow?: boolean;
};

export const ScrollContainer = styled.div<ScrollContainerProps>`
  flex-grow: 99;
  width: 100%;
  height: 100%;
  max-height: calc(100% - 3.75rem);
  margin-block-start: 0.5rem;
  padding-inline-end: 0.5rem;
  padding-block-end: 1.5rem;
  overflow-x: hidden;
  overflow-y: ${(props) => (props.$overflow ? "scroll" : "hidden")};

  -webkit-mask-image: -webkit-gradient(
    linear,
    0 75%,
    0 100%,
    from(rgba(0, 0, 0, 1)),
    to(rgba(0, 0, 0, 0))
  );

  ${ScrollBarStyle}
`;

export const ContentContainer = styled(motion.div)`
  position: relative;
  height: calc(100% - 5.625rem);
  padding: 0 ${sizes.tradeContainerPadding};

  @media ${breakPoints.phoneOnly} {
    height: calc(100% - 3.625rem);
    padding: 0 ${sizes.tradeContainerMobilePadding};
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding-block: ${sizes.tradeContainerPadding} 1.25rem;
  padding-inline: ${sizes.tradeContainerPadding};
  transition: background ease-in-out 0.3s;

  @media ${breakPoints.phoneOnly} {
    padding: ${sizes.tradeContainerMobilePadding};
  }
`;

export const TitleSubContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-inline-start: 1rem;
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
  justify-self: flex-end;
  float: right;
`;

export const OverlayActionButton = styled(Button)`
  ${OverlayActionButtonStyle};
`;

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: ${(props) => (props.isHidden ? "none" : "visible")};
  z-index: 2;
  overflow: hidden;
  
  ${CloseButton} {
    transition: transform ${(props) =>
      props.isHidden
        ? "0.25s ease-in"
        : "0.75s cubic-bezier(0.12, 0.71, 0.36, 1)"};
    transform: translateY(${(props) => (props.isHidden ? "-5.25rem" : "0%")});

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
  
  ${StyledTitle} {
    opacity: ${(props) => (props.isHidden ? 0 : 1)};
    pointer-events: ${(props) => (props.isHidden ? "none" : "visible")};
  }

  ${StyledInfoSubHeading} {
    opacity: ${(props) => (props.isHidden ? 0 : 1)};
    pointer-events: ${(props) => (props.isHidden ? "none" : "visible")};
  }
}
`;
