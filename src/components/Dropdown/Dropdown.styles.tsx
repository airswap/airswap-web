import styled, { css } from "styled-components/macro";

import { InputOrButtonBorderStyle } from "../../style/mixins";

const ButtonStyle = css`
  ${InputOrButtonBorderStyle};

  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 2rem;
  padding: 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.black};

  &:hover,
  &:active {
    z-index: 1;
  }
`;

export const Item = styled.button`
  ${ButtonStyle};

  margin-top: -1px;

  &:first-child {
    border-top: 0;
  }

  &:last-child {
    border-bottom-right-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }
`;

export const AbsoluteWrapper = styled.div`
  display: none;
  flex-direction: column;
  position: absolute;
  z-index: 1;
  width: 100%;
  margin-top: 1px;
`;

export const Current = styled.button`
  ${InputOrButtonBorderStyle};
  ${ButtonStyle};

  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;

  &:focus {
    border-bottom-right-radius: 0;

    & + ${AbsoluteWrapper} {
      display: flex;
    }
  }
`;

export const Wrapper = styled.div`
  position: relative;
`;
