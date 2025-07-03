import styled from "styled-components/macro";

import breakPoints from "../../../../../style/breakpoints";
import {
  InputOrButtonBorderStyle,
  TextEllipsis,
} from "../../../../../style/mixins";
import { fontWide } from "../../../../../style/themes";
import { CompactActionButton } from "../../../../../styled-components/CompactActionButton/CompactActionButton";
import { TooltipStyle } from "../../../../../styled-components/Tooltip/Tooltip";
import AccountLink from "../../../../AccountLink/AccountLink";

export const Container = styled.div`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  align-items: center;
  font-size: 1rem;
  font-weight: 400;

  @media ${breakPoints.tabletLandscapeUp} {
    font-size: 1.125rem;
  }

  @media ${breakPoints.desktopUp} {
    font-size: 1.25rem;
  }
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
  max-height: 3.375rem;
  word-break: break-all;
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`;

export const Amount = styled.div`
  word-break: break-all;
`;

export const ContractContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

export const StyledActionButton = styled(CompactActionButton)`
  @media ${breakPoints.phoneOnly} {
    display: none;
  }
`;

export const Tooltip = styled.div`
  display: none;

  ${TooltipStyle};
`;

export const TokenLink = styled(AccountLink)`
  display: none;
  position: relative;
  translate: -0.5rem 0.0625rem;

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }

  &:hover + ${Tooltip} {
    display: block;
  }

  @media ${breakPoints.tabletPortraitUp} {
    display: flex;
  }
`;
