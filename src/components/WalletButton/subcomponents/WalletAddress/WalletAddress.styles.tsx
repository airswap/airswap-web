import Blockies from "react-blockies";

import styled from "styled-components";

export const StyledWalletAddress = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.theme.name === "dark" ? props.theme.colors.darkGrey : "#F4F4F4"};
`;

export const Button = styled.div`
  border: 0;
  margin: 0;
  padding: 0;
  background: none;
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
