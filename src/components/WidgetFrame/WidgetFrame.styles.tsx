import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { sizes } from "../../style/sizes";

export const WidgetFrameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 0.25rem;
  margin: 0 ${sizes.pageMobilePadding};
  width: ${sizes.widgetWidth};
  height: fit-content;
  padding: ${sizes.tradeContainerPadding};
  transition: box-shadow 0.3s ease-in-out;
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media ${breakPoints.phoneOnly} {
    width: 100%;
    margin: 0;
    padding: ${sizes.tradeContainerMobilePadding};
  }
`;

type StyledTradeContainerProps = {
  $isOpen?: boolean;
  $isConnected?: boolean;
  $isOverlayOpen?: boolean;
};

export const StyledWidgetFrame = styled.div<StyledTradeContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
  height: fit-content;
  overflow-y: ${(props) => (props.$isOverlayOpen ? "hidden" : "unset")};

  @media ${breakPoints.tabletPortraitUp} {
    transition: transform 0.3s ease-in-out;
    transform: ${(props) => (props.$isOpen ? "translate(-6.5rem, 0rem)" : "0")};
  }

  @media ${breakPoints.phoneOnly} {
    margin-bottom: 0;
  }
`;
