import { MdDoneAll } from "react-icons/md";

import styled from "styled-components/macro";

import Button from "../Button/Button";
import WalletProviderList from "../WalletProviderList/WalletProviderList";

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const QuoteAndTimer = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

export const BackButton = styled(Button)`
  flex: 1 0 0;
`;
export const SubmitButton = styled(Button)`
  flex: 2.33333333 0 0;
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

export const SwapIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  /* right: 3.75rem; */
  right: 14.125rem;
  margin-top: -1.5rem;
  transform: translateY(0.5rem);
  width: 1.5rem;
  height: 1.5rem;
  /* margin-top: -1rem; */
  /* margin-bottom: -0.875rem; */
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  background-color: ${(props) => props.theme.colors.black};
  font-size: 1rem;
  z-index: 1;
`;

export const HugeTicks = styled(MdDoneAll)`
  font-size: 8rem;
  margin: 5rem auto 2px auto;
`;

export const Placeholder = styled.div`
  height: 5rem;
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
