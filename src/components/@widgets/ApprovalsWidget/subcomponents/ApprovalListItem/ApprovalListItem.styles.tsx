import styled from "styled-components/macro";

import { TextEllipsis } from "../../../../../style/mixins";

export const Container = styled.div`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
`;

export const TokenImageAndNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.white};
`;

export const TokenImage = styled.div<{ backgroundImage?: string }>`
  border-radius: 50%;
  min-width: 1.125rem;
  height: 1.125rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: ${({ backgroundImage }) =>
    backgroundImage ? `url(${backgroundImage})` : "none"};
  background-color: ${({ theme }) => theme.colors.grey};
`;

export const TokenName = styled.div`
  ${TextEllipsis};

  max-width: 4rem;
  color: ${({ theme }) => theme.colors.white};
`;

export const Amount = styled.div`
  word-break: break-all;
  font-size: 1.25rem;
  font-weight: 400;
`;
