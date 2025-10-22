import styled from "styled-components/macro";

import {
  InputOrButtonBorderStyle,
  TextEllipsis,
} from "../../../../../style/mixins";
import { CompactActionButton } from "../../../../../styled-components/CompactActionButton/CompactActionButton";
import AccountLink from "../../../../AccountLink/AccountLink";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 400;
`;

export const TokenImageAndNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  color: ${({ theme }) => theme.colors.white};
`;

export const TokenImage = styled.div<{ backgroundImage?: string }>`
  border-radius: 50%;
  min-width: 2rem;
  height: 2rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: ${({ backgroundImage }) =>
    backgroundImage ? `url(${backgroundImage})` : "none"};
  background-color: ${({ theme }) => theme.colors.grey};
`;

export const ItemLabel = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.lightGrey};
`;

export const Divider = styled.div`
  margin-block: 0.5rem;
  height: 1px;
  width: 100%;
  opacity: 0.75;
  background-color: ${({ theme }) => theme.colors.borderGrey};
`;

export const TokenName = styled.div`
  ${TextEllipsis};

  font-size: 1.125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
`;

export const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ItemValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  word-break: break-all;
`;

export const ItemSubContainer = styled.div`
  display: flex;
  flex-direction: column;

  &:last-child {
    ${ItemLabel},
    ${ItemValue} {
      justify-content: flex-end;
      text-align: right;
    }
  }
`;

export const ContractContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StyledActionButton = styled(CompactActionButton)`
  margin-block-start: 1rem;
  width: 100%;
  height: 2rem;
`;

export const TokenLink = styled(AccountLink)`
  ${InputOrButtonBorderStyle};

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: flex-end;
  margin-left: auto;
  border-radius: 50%;
  width: 2.375rem;
  height: 2.375rem;

  &:focus,
  &:hover {
    color: ${(props) => props.theme.colors.white};
    border-color: ${(props) => props.theme.colors.white};
  }
`;

export const ContractLink = styled(AccountLink)`
  translate: -0.25rem 0.0625rem;

  &:focus,
  &:hover {
    color: ${(props) => props.theme.colors.white};
  }
`;
