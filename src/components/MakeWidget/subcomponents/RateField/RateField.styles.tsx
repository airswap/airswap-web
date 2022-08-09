import styled, { css } from "styled-components/macro";

import { fontMono } from "../../../../style/themes";

export const Text = styled.div`
  margin-top: -2px;
`;

export const RateBox = styled.div`
  margin-top: -2px;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: white;
  gap: 0.125rem;

  & > .icon {
    border-color: transparent;
    color: ${({ theme }) => theme.colors.lightGrey};
  }

  &.active {
    color: ${({ theme }) => theme.colors.lightGrey};
    gap: 0.375rem;

    & > .icon {
      border-color: transparent;

      &:hover {
        border-color: ${({ theme }) => theme.colors.lightGrey};
      }

      &:active {
        border-color: ${({ theme }) => theme.colors.primary};
      }
    }

    & ${RateBox} {
      border-radius: 0.125rem;
      border: 1px solid ${({ theme }) => theme.colors.borderGrey};
      font-family: ${fontMono};
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      margin-top: 0;
    }
  }
  }
`;
