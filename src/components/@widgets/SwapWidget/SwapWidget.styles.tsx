import styled from "styled-components/macro";

import SwapInputs from "../../SwapInputs/SwapInputs";
import WalletProviderList from "../../WalletProviderList/WalletProviderList";
import DebugMenu from "./subcomponents/DebugMenu/DebugMenu";
import SwapWidgetHeader from "./subcomponents/SwapWidgetHeader/SwapWidgetHeader";

export const StyledHeader = styled(SwapWidgetHeader)`
  order: -2;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  margin-block-start: 1rem;
  text-align: center;
  order: -1;
`;

export const StyledSwapInputs = styled(SwapInputs)`
  margin-block-start: 2rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 1.5rem;
`;

export const StyledSwapWidget = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
`;

export const StyledWalletProviderList = styled(WalletProviderList)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const StyledDebugMenu = styled(DebugMenu)`
  margin-bottom: 1.5rem;
`;

export default StyledSwapWidget;
