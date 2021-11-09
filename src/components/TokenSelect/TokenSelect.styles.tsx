import { MdKeyboardArrowDown } from "react-icons/md";

import styled, { css, keyframes } from "styled-components/macro";

import { BorderlessButtonStyle } from "../../style/mixins";
import TokenLogo from "../TokenLogo/TokenLogo";
import {
  SelectItem,
  FormLabel,
  FormInput,
  Metadata,
} from "../Typography/Typography";

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.5rem;
`;

export const AmountAndDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  text-align: right;
`;

export const InputAndMaxButtonWrapper = styled.div`
  display: flex;
  min-width: 0;
  gap: 0.75rem;
`;

export const MaxButton = styled.button`
  position: relative;
  bottom: 1px;
  letter-spacing: 0.07rem;
  align-self: center;
  padding: 0.125rem;
  border-radius: 0.125rem;
  font-weight: 600;
  font-size: 0.5rem;
  line-height: 1;
  text-transform: uppercase;
  background-color: ${(props) => props.theme.colors.lightGrey};
  color: ${(props) => props.theme.colors.black};
  opacity: 0.6;

  ${BorderlessButtonStyle}

  &:hover,
  &:focus {
    background-color: ${(props) => props.theme.colors.white};
    opacity: 1;
  }
`;

const fadeInOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

export const PlaceHolderBar = styled.div`
  background-image: ${(props) => props.theme.colors.placeholderGradient};
  animation: ${fadeInOut} 0.35s ease-in-out infinite alternate;
`;

export const PlaceholderTop = styled(PlaceHolderBar)`
  height: 1.25rem;
  width: 100%;
`;

export const PlaceholderBottom = styled(PlaceHolderBar)`
  height: 0.9375rem;
  width: 75%;
  animation-delay: 0.1s;
`;

export const StyledTokenLogo = styled(TokenLogo)`
  transition: transform 0.25s ease-in-out;
  will-change: transform;
`;

export const StyledSelectButton = styled.button`
  transition: transform 0.25s ease-in-out;
  will-change: transform;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -0.125rem;
  margin-left: 0.9375rem;
  height: 100%;
  cursor: ${(props) => (props.disabled ? "initial" : "pointer")};
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};

  &:focus {
    outline: 0;
  }
`;

export const TokenSelectContainer = styled.div<{
  $isLoading: boolean;
  $isQuote: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 4.5rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2px;
  background-color: ${(props) =>
    props.theme.name === "dark"
      ? props.theme.colors.darkGrey
      : props.theme.colors.alwaysWhite};
  overflow: hidden;

  ${PlaceHolderBar} {
    ${(props) => (props.$isLoading ? "" : "animation: none;")}
  }

  ${StyledTokenLogo} {
    transform: ${(props) =>
      props.$isQuote ? "translateX(-3.6rem)" : "translateX(0)"};
  }
  
  ${StyledSelectButton} {
    transform: ${(props) =>
      props.$isQuote ? "translateX(-3.4rem)" : "translateX(0)"};
  }
}
`;

const fadeOutWhenInvisible = css<{ $invisible: boolean }>`
  transition: opacity ease-in-out 0.3s;
  will-change: opacity;
  opacity: ${(props) => (props.$invisible ? 0 : 1)};
`;

export const StyledLabel = styled(FormLabel)`
  text-align: left;
  text-transform: uppercase;
`;

export const StyledSelectButtonContent = styled.span``;

export const StyledDownArrow = styled(MdKeyboardArrowDown)<{
  $invisible: boolean;
}>`
  ${fadeOutWhenInvisible}
`;

export const StyledSelectItem = styled(SelectItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  line-height: 1;
  gap: 0.375rem;
`;

export const AmountInput = styled(FormInput)<{
  hasSubtext: boolean;
  disabled: boolean;
}>`
  padding-right: 0;
  margin-top: ${(props) => (props.hasSubtext ? "-0.75rem" : 0)};
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};
  text-align: right;

  &:focus {
    outline: 0;
  }
`;

export const AmountSubtext = styled(Metadata)`
  margin-top: -0.25rem;
`;

export const PlaceholderContainer = styled.div`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3125rem;
  max-width: 50%;
`;
