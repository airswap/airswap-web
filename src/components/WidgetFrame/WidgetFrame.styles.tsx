import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { sizes } from "../../style/sizes";

export const WidgetFrameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 0.25rem;
  margin: 0 ${sizes.pageMobilePadding};
  width: ${sizes.widgetWidth};
  height: fit-content;
  min-height: ${sizes.widgetHeight};
  padding: ${sizes.tradeContainerPadding};

  @media ${breakPoints.phoneOnly} {
    width: 100%;
    min-height: ${sizes.widgetMobileSize};
    margin: 0;
    padding: ${sizes.tradeContainerMobilePadding};
  }
`;

type StyledTradeContainerProps = {
  $isConnected?: boolean;
  $isOverlayOpen?: boolean;
  $isOverflowing?: boolean;
};

export const Container = styled.div<StyledTradeContainerProps>`
  display: flex;
  align-items: ${({ $isOverflowing }) =>
    $isOverflowing ? "flex-start" : "center"};
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: ${sizes.widgetHeight};
  overflow-y: ${(props) => (props.$isOverlayOpen ? "auto" : "hidden")};

  @media ${breakPoints.phoneOnly}, ${breakPoints.shallowScreenOnly} {
    margin-bottom: 1.5rem;
  }

  @media ${breakPoints.phoneOnly} {
    margin-bottom: 0;
    min-height: ${sizes.widgetMobileSize};
  }
`;
