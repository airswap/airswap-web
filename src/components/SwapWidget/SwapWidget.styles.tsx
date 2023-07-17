import styled from "styled-components/macro";

import WalletProviderList from "../WalletProviderList/WalletProviderList";

export const Header = styled.div`
  display: flex;
  margin-bottom: 2rem;
  width: 100%;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 2;
  margin: 1rem 0;
  max-height: 16rem;
  text-align: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-top: auto;
  justify-self: flex-end;
  gap: 1.25rem;
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

export default StyledSwapWidget;
