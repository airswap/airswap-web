import styled, { css } from "styled-components/macro";

import { fontMono } from "../../../../style/themes";

export const RateFieldStyle = css`
  color: ${({ theme }) => theme.colors.lightGrey};
  text-transform: uppercase;
  font-size: 0.75rem;
`;

export const Text = styled.div`
  margin-top: -2px;
`;

export const Wrapper = styled.div`
  ${RateFieldStyle};
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: bold;

  & > .icon {
    border-color: transparent;

    &:hover {
      border-color: ${({ theme }) => theme.colors.lightGrey};
    }

    &:active {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const RateBox = styled.div`
  border-radius: 0.125rem;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  font-family: ${fontMono};
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
`;
