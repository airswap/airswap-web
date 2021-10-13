import { MdDoneAll } from "react-icons/md";

import styled from "styled-components/macro";

import WalletProviderList from "../WalletProviderList/WalletProviderList";

export const Header = styled.div`
  margin-bottom: 1.875rem;
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
  height: 11.25rem;
  margin-top: -0.625rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.25rem;
  margin-bottom: 2.75rem;
`;

export const HugeTicks = styled(MdDoneAll)`
  font-size: 8rem;
  margin: 5rem auto 2px auto;
`;

export const Placeholder = styled.div`
  height: 5rem;
`;

export const StyledSwapWidget = styled.div`
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
