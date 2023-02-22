import { css } from "styled-components";
import styled from "styled-components/macro";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const MyOrdersGrid = css`
  display: grid;
  grid-template-columns: calc(33%) calc(33%) calc(33%);
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
