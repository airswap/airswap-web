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
  hasOverflow: boolean;
  isHidden: boolean;
  showScrollbar: boolean;
  hasTitle: boolean;
};

type ScrollContainerProps = {
  $overflow?: boolean;
};

export const ScrollContainer = styled.div<ScrollContainerProps>`
  flex-grow: 99;
  width: 100%;
  height: 100%;
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

  ${ScrollBarStyle};
`;

export const ContentContainer = styled.div<{ isHidden: boolean }>`
  position: relative;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2rem;
  width: calc(100vw - 4rem);
  max-width: 38.75rem;
  height: fit-content;
  padding: 0 ${sizes.tradeContainerPadding};
  background: rgba(57, 122, 255, 0.11);
  transform: translateY(${(props) => (props.isHidden ? "100vh" : "0vh")});
  pointer-events: ${(props) => (props.isHidden ? "none" : "visible")};
  transition: transform ease-out 0.3s;
  @media ${breakPoints.phoneOnly} {
    padding: 0 ${sizes.tradeContainerMobilePadding};
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-block-end: 2rem;
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

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100svh;
  padding-block: 2rem;
  overflow-y: ${(props) => (props.showScrollbar ? "auto" : "hidden")};;
  pointer-events: ${(props) => (props.isHidden ? "none" : "visible")};
  background: ${(props) =>
    props.isHidden ? "rgba(0, 0, 0, 0);" : "rgba(0, 0, 0, 0.5)"};
  backdrop-filter: ${(props) => (props.isHidden ? "none" : "blur(25px)")};
  z-index: 10;
  transition: background ease-out 0.3s;
}
`;

export const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 3;
`;
