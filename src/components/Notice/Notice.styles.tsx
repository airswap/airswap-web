import styled from "styled-components";

import Icon from "../Icon/Icon";

export const Container = styled.div`
  display: flex;
  gap: 1rem;
  margin-block-start: 1.75rem;
  padding: 1rem 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.colors.lightGrey};
  background: ${({ theme }) => theme.colors.darkGrey};
`;

export const Text = styled.p`
  color: inherit;

  &::selection {
    background: ${({ theme }) => theme.colors.darkBlue};
  }
`;

export const StyledIcon = styled(Icon)`
  margin-block-start: 0.125rem;
  color: inherit;
`;

export const CloseButton = styled.button`
  margin-block-start: 0.375rem;
  height: fit-content;
  color: inherit;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.white};
  }
`;
