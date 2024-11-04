import styled from "styled-components/macro";

import { fontWide } from "../../../style/themes";
import SwapInputs from "../../SwapInputs/SwapInputs";
import WalletProviderList from "../../WalletProviderList/WalletProviderList";
import DebugMenu from "./subcomponents/DebugMenu/DebugMenu";
import SwapWidgetHeader from "./subcomponents/SwapWidgetHeader/SwapWidgetHeader";

export const StyledHeader = styled(SwapWidgetHeader)`
  order: -2;
`;

export const WelcomeMessage = styled.h2`
  margin-block-start: 0.75rem;
  color: ${(props) => props.theme.colors.lightGrey};
  text-align: center;
  font-family: ${fontWide};
  font-size: 1.125rem;
`;

export const InfoContainer = styled.div<{ hasQuoteText: boolean }>`
  display: flex;
  justify-content: ${(props) =>
    props.hasQuoteText ? "space-between" : "center"};
  align-items: center;
  gap: 0.25rem;
  margin-block-start: 2rem;
  padding-inline: 1rem;
  text-align: center;
`;

export const StyledSwapInputs = styled(SwapInputs)`
  margin-block-start: 2rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 2rem;
`;

export const StyledSwapWidget = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
`;

export const StyledWalletProviderList = styled(WalletProviderList)``;

export const StyledDebugMenu = styled(DebugMenu)`
  margin-bottom: 1.5rem;
`;

export default StyledSwapWidget;
