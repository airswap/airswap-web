import styled, { css } from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";

export const ButtonStyle = css`
  ${InputOrButtonBorderStyleType2};

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 1rem;
  height: 4.5rem;
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.darkGrey : theme.colors.primaryLight};

  & + a,
  & + button {
    margin-top: 0.5rem;
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
