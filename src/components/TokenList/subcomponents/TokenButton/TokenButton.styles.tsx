import styled, { keyframes } from "styled-components/macro";

import { BorderlessButtonStyle } from "../../../../style/mixins";
import { fontMono } from "../../../../style/themes";
import Icon from "../../../Icon/Icon";

type ContainerProps = {
  disabled: boolean;
  showDeleteButton: boolean;
};

export const TokenNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

export const TokenName = styled.h3`
  width: 100%;
  text-align: left;
  line-height: 1;
  font-size: 1rem;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.darkGrey};
`;

export const Balance = styled.div`
  font-family: ${fontMono};
  font-weight: 500;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.darkGrey};
`;

const scaleInAnimation = keyframes`
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
`;

export const DeleteIcon = styled(Icon)`
  margin-left: auto;
  padding: 0.25rem;
  color: ${(props) => props.theme.colors.lightGrey};

  transform: scale(0);
  animation: ${scaleInAnimation} 0.25s ease-out forwards;

  @media (prefers-reduced-motion: reduce) {
    transform: scale(1);
    animation: none;
  }
`;

export const Container = styled.button<ContainerProps>`
  position: relative;
  width: 100%;
  padding: 0.5rem 0;
  display: grid;
  grid-auto-flow: column;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  grid-template-columns: ${(props) =>
    props.showDeleteButton
      ? "1.25rem 4rem calc(100% - 11.5rem) 3.25rem"
      : "1.25rem 4rem calc(50% - 4rem) calc(50% - 4.5rem)"};
  grid-gap: 1rem;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    ${TokenName} {
      color: ${({ theme, disabled }) =>
        disabled
          ? theme.colors.lightGrey
          : theme.name === "dark"
          ? theme.colors.white
          : theme.colors.primary};
    }

    ${Balance} {
      color: ${({ theme }) =>
        theme.name === "dark" ? theme.colors.white : theme.colors.primary};
    }

    ${DeleteIcon} {
      color: ${(props) =>
        props.disabled
          ? props.theme.colors.lightGrey
          : props.theme.colors.white};
    }
  }

  ${BorderlessButtonStyle}
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Symbol = styled.h3`
  text-align: left;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: calc(1 + (1 / 3));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
