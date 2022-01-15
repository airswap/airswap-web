import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { sizes } from "../../style/sizes";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 0.25rem;
  margin: 0 ${sizes.pageMobilePadding};
  height: 30rem;
  width: 30rem;
  padding: ${sizes.tradeContainerPadding};
  background: ${(props) => props.theme.colors.black};
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.widgetGlow};
  transition: box-shadow 0.3s ease-in-out;
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media ${breakPoints.phoneOnly} {
    width: 100%;
    height: 24rem;
    margin: 0;
    padding: ${sizes.tradeContainerMobilePadding};
  }
`;

type StyledTradeContainerProps = {
  $isOpen?: boolean;
  $isConnected?: boolean;
};

export const StyledTradeContainer = styled.div<StyledTradeContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 24rem;

  ${Container} {
    box-shadow: ${(props) =>
      props.$isConnected
        ? props.theme.shadows.widgetGlow
        : props.theme.shadows.widgetGlowOff};
  }

  @media ${breakPoints.tabletPortraitUp} {
    transition: transform 0.3s ease-in-out;
    transform: ${(props) => (props.$isOpen ? "translate(-6.5rem, 0rem)" : "0")};
  }

  @media ${breakPoints.phoneOnly},
    (max-width: 68rem) and (max-height: 41.5rem) {
    margin-bottom: 1.5rem;
  }
`;
