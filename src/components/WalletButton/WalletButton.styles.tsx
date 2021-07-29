import styled from "styled-components/macro";
import Blockies from "react-blockies";

export const Container = styled.div``;

export const StyledWalletButton = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
  justify-content: space-between;
  border: 1px solid
    ${(props) => (props.theme.name === "dark" ? "#282828" : "#ededed")};
  padding: 1rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.theme.name === "dark" ? "#151619" : "#F4F4F4"};
`;

export const BlockiesContainer = styled.div`
  position: relative;
`;

export const StyledBlockies = styled(Blockies)`
  border-radius: 50%;
  position: relative;
`;

export const GreenCircle = styled.div`
  position: absolute;
  background-color: #60ff66;
  border-radius: 50%;
  z-index: 5;
  width: 0.5rem;
  height: 0.5rem;
  top: 1rem;
  left: 1rem;
`;

export const WalletExtension = styled.div`
  position: absolute;
  width: 100%;
  z-index: 100;
  padding: 1rem;
  background-color: ${(props) =>
    props.theme.name === "dark" ? "#151619" : "#F4F4F4"};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

export const ExitButton = styled.button`
  margin-left: 4rem;
`;

export const TransactionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  // align-items: center;
  justify-content: center;
  width: 100%;
  height: 12rem;
`;

export const DisconnectButton = styled.button`
  border: 1px solid
    ${(props) => (props.theme.name === "dark" ? "#282828" : "#ededed")};
  padding: 1rem 3rem;
`;
