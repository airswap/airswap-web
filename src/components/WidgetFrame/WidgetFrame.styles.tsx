import styled from "styled-components/macro";

import { sizes } from "../../style/sizes";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 0.25rem;
  height: 30rem;
  width: 30rem;
  padding: ${sizes.tradeContainerPadding};
  background: ${(props) => props.theme.colors.black};
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.widgetGlow};
`;

export const StyledTradeContainer = styled.div`
  position: relative;
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
`;
