import { NavLink } from "react-router-dom";

import styled from "styled-components/macro";

import { fontWide } from "../../../../../style/themes";

export const RadioContainer = styled(NavLink)`
  display: flex;
  align-items: center;
  width: 2.75rem;
  height: 1.75rem;
  border-radius: 2.875rem;
  padding-inline: 0.375rem;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const RadioCircle = styled.span`
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const Container = styled.div<{ disabled?: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  height: 4.4375rem;
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
  border-radius: 0.5rem;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  font-weight: 500;
  background-color: ${({ theme }) => theme.colors.darkGrey};

  ${RadioContainer} {
    background-color: ${({ theme, disabled }) =>
      disabled ? "rgba(121, 139, 173, 0.2)" : theme.colors.primary};
  }

  ${RadioCircle} {
    transform: ${({ disabled }) =>
      disabled ? "translateX(0)" : "translateX(1rem)"};
  }
`;

export const TextContainer = styled.span`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.span`
  font-size: 1rem;
  font-weight: 500;
  font-family: ${fontWide};
`;

export const Description = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  font-family: ${fontWide};
  color: ${({ theme }) => theme.colors.lightGrey};
`;
