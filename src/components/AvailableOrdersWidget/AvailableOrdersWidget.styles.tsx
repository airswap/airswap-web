import { css } from "styled-components";
import styled from "styled-components/macro";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const AvailableOrdersGrid = css`
  display: grid;
  grid-template-columns: repeat(3, calc((100% - 1rem) / 3));
  grid-column-gap: 1rem;
  width: 100%;
  padding: 0 1rem;
`;

export const InfoSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 2;
  margin-bottom: 0.5rem;
  text-align: center;
`;
