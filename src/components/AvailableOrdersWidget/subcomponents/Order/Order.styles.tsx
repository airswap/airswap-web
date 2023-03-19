import styled from "styled-components/macro";

import { fontMono } from "../../../../style/themes";
import { AvailableOrdersGrid } from "../../AvailableOrdersWidget.styles";

export const Container = styled.div`
  ${AvailableOrdersGrid};

  position: relative;
  border: 1px solid
    ${({ theme }) =>
      theme.name === "dark" ? theme.colors.black : theme.colors.alwaysWhite};
  border-top: 1px solid ${({ theme }) => theme.colors.borderGrey};
  align-items: center;
  height: 3rem;
  cursor: pointer;

  &:hover,
  &:focus,
  &:active {
    background: ${({ theme }) => theme.colors.borderGrey + "80"};
    border: 1px solid ${({ theme }) => theme.colors.lightGrey + "80"};
  }

  &:active {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Text = styled.div`
  position: relative;
  width: 75%;
  font-family: ${fontMono};
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  z-index: 2;
`;
