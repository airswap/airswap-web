import styled from "styled-components/macro";

import { sizes } from "../../style/sizes";

export const StyledWalletProviderList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${sizes.tradeContainerPadding};
  background: ${(props) => props.theme.colors.black};
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1.875rem;
`;

export const StyledButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  padding: 1rem;
  height: 4.5rem;
  background: ${(props) => props.theme.colors.darkGrey};

  &:hover,
  &:focus {
    outline: 0;
    border-color: ${(props) => props.theme.colors.lightGrey};
  }

  & + & {
    margin-top: 0.5rem;
  }
`;

export const ButtonIconContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 3rem;
  height: 100%;
`;

export const ButtonIcon = styled.img`
  width: 100%;
  height: auto;
`;

export const ButtonText = styled.h4`
  margin-left: 1rem;
  width: 100%;
  height: auto;
  font-weight: 600;
  text-align: left;
`;
