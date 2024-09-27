import styled, { css } from "styled-components/macro";

import { BorderlessButtonStyle } from "../../../../style/mixins";

export const ButtonStyle = css`
  ${BorderlessButtonStyle};

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-radius: 0.5rem;
  padding: 0.5rem;
  height: 3.5rem;
  font-size: 1.25rem;

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.darkBlue};
  }

  & + a,
  & + button {
    margin-top: 1rem;
  }
`;

export const StyledButton = styled.button`
  ${ButtonStyle}
`;

export const StyledLink = styled.a`
  ${ButtonStyle}
`;
export const ButtonIconContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 3rem;
  height: 100%;
`;

export const ButtonIcon = styled.img`
  width: 100%;
  height: auto;
`;

export const ButtonText = styled.h4`
  margin-left: 1rem;
  width: 100%;
  height: auto;
  font-weight: 600;
  text-align: left;
`;
