import styled from "styled-components/macro";

import { sizes } from "../../style/sizes";
import { ScrollContainer } from "../Overlay/Overlay.styles";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 ${sizes.tradeContainerPadding} ${sizes.tradeContainerPadding};
`;

export const StyledScrollContainer = styled(ScrollContainer)`
  max-height: calc(100% - 3.125rem);
  overflow-y: ${(props) => (props.$overflow ? "scroll" : "hidden")};
`;

export const StyledErrorList = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.black};
`;

export const LegendDivider = styled.div`
  width: calc(100% - 4rem);
  height: 1px;
  background: ${(props) => props.theme.colors.borderGrey};
  align-self: center;
`;
