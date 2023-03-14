import styled from "styled-components/macro";

import { ScrollBarStyle } from "../../../../style/mixins";
import AvailableOrdersListSortButtons from "../AvailableOrdersListSortButtons/AvailableOrdersListSortButtons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
`;

export const StyledAvailableOrdersListSortButtons = styled(
  AvailableOrdersListSortButtons
)<{
  width: number;
}>`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
`;

export const OrdersContainer = styled.div`
  ${ScrollBarStyle};

  margin-top: 0.5rem;
  width: calc(100% + 0.5rem);
  max-height: 17rem;
  padding-right: 0.5rem;
  overflow-y: auto;
  overflow-x: visible;
`;

const darkShadow =
  "linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 100%)";
const lightShadow =
  "linear-gradient(0deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 100%)";

export const Shadow = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  z-index: 2;
  background: ${({ theme }) =>
    theme.name === "dark" ? darkShadow : lightShadow};
  pointer-events: none;
`;
