import { MdDoneAll } from "react-icons/md";

import styled from "styled-components/macro";

import WalletProviderList from "../WalletProviderList/WalletProviderList";

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const QuoteAndTimer = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 2;
  margin-bottom: 0.5rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-top: auto;
  justify-self: flex-end;
  gap: 1.25rem;
`;

export const HugeTicks = styled(MdDoneAll)`
  font-size: 8rem;
  margin: 1rem auto -4rem auto;
`;

export const StyledSwapWidget = styled.div`
  display: flex;
  flex-direction: column;
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
