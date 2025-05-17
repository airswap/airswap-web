import styled from "styled-components/macro";

import breakPoints from "../../../../../style/breakpoints";
import { InputOrButtonBorderStyle } from "../../../../../style/mixins";
import { fontWide } from "../../../../../style/themes";

export const Container = styled.div`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 400;
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
  word-break: break-all;
  color: ${({ theme }) => theme.colors.white};
`;

export const Amount = styled.div`
  word-break: break-all;
`;

export const ActionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;

  @media ${breakPoints.tabletLandscapeUp} {
    flex-direction: row;
    align-items: center;
  }
`;

export const ActionButton = styled.button`
  ${InputOrButtonBorderStyle};

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding-inline: 0.5rem;
  min-width: 5.125rem;
  height: 1.5625rem;
  font-family: ${fontWide};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.lightGrey};
  background: ${({ theme }) => theme.colors.darkGrey};
`;
