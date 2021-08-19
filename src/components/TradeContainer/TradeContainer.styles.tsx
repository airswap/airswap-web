import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { sizes } from "../../style/sizes";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 0.25rem;
  height: 32.5rem;
  width: 100%;
  padding: ${sizes.tradeContainerPadding};
  background: ${(props) => props.theme.colors.black};
  overflow: hidden;
`;

type StyledTradeContainerProps = {
  isOpen: boolean;
};

export const StyledTradeContainer = styled.div<StyledTradeContainerProps>`
  display: flex;
  box-sizing: border-box;
  border-radius: 0.5rem;
  margin: 0 auto;
  padding: 2.25rem;
  width: 100%;
  max-width: 34.5rem;
  background: url("${process.env.PUBLIC_URL}/images/bg.png");
  background-size: 100% 100%;

  transition: transform 0.3s ease-in-out;

  @media ${breakPoints.tabletLandscapeUp} {
    transform: translateX(${(props) => (props.isOpen ? 0 : "-16rem")});
  }

  @media (min-resolution: 144dpi) {
    background-image: url("${process.env.PUBLIC_URL}/images/bg-x2.png");
  }

  @media ${breakPoints.phoneOnly} {
    padding: 1.5rem;
  }

  @media ${breakPoints.tinyScreenOnly} {
    padding: 1.25rem;
  }
`;
