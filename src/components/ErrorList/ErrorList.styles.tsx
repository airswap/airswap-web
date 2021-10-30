import styled from "styled-components/macro";

import { sizes } from "../../style/sizes";
import Icon from "../Icon/Icon";
import { ScrollContainer } from "../Overlay/Overlay.styles";
import { SubText } from "../Typography/Typography";

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

export const StyledError = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 3rem;
  margin-top: 1.5rem;
`;

export const StyledErrorIcon = styled(Icon)`
  margin-right: 1.125rem;
`;

export const ErrorIconContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 0.3rem;
  position: relative;
  width: 3.75rem;
  height: 100%;
  path {
    fill: ${(props) =>
      props.theme.name === "light"
        ? props.theme.colors.primary
        : props.theme.colors.alwaysWhite};
  }
`;

export const ErrorTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: calc(100% - 3.75rem);
`;

export const StyledSubText = styled(SubText)`
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const LegendDivider = styled.div`
  width: calc(100% - 4rem);
  height: 1px;
  background: ${(props) => props.theme.colors.borderGrey};
  align-self: center;
`;
