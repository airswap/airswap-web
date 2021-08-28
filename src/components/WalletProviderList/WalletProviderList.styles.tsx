import styled from "styled-components/macro";

export const StyledWalletProviderList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 0.5rem;
  height: 3.5rem;
  background: ${(props) => props.theme.colors.black};

  &:hover {
    background: ${(props) => props.theme.colors.darkGrey};
  }

  & + & {
    margin-top: 0.75em;
  }
`;

export const ButtonIconContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 3.5rem;
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
  text-transform: uppercase;
`;
