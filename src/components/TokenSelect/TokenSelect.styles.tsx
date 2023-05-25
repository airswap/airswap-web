import { MdKeyboardArrowDown } from "react-icons/md";

import styled, { css, keyframes } from "styled-components/macro";

import isActiveLanguageLogographic from "../../helpers/isActiveLanguageLogographic";
import { BorderlessButtonStyle } from "../../style/mixins";
import TokenLogo from "../TokenLogo/TokenLogo";
import { SelectItem, FormLabel, FormInput } from "../Typography/Typography";

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const quoteTransition = css`
  transition: transform 0.25s cubic-bezier(0.57, 0.01, 0.3, 1);
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const fontTransition = css`
  transition: font-size 0.25s ease-in-out;
  will-change: font-size;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ContainingButton = styled.button`
  display: flex;
  flex-direction: row;
  width: 40%;
  height: 2.5rem;
  cursor: ${(props) => (props.disabled ? "initial" : "pointer")};
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};

  &:focus {
    outline: 0;
  }
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
  align-items: center;
  width: 60%;
  min-width: 0;
  gap: 0.75rem;
`;

export const MaxButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  bottom: 1px;
  align-self: center;
  border-radius: 0.125rem;
  font-family: Verdana, sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1;
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

export const MaxButton = styled.button`
  ${MaxButtonStyle};

  width: ${() => (isActiveLanguageLogographic() ? "1.75rem" : "auto")};
  padding: 0.125rem;
  text-transform: uppercase;
  letter-spacing: ${() => (isActiveLanguageLogographic() ? 0 : "0.0625rem")};
  font-size: ${() => (isActiveLanguageLogographic() ? "0.75rem" : "0.5rem")};
`;

export const InfoLabel = styled.div`
  ${MaxButtonStyle};

  border-radius: 50%;
  text-align: center;
  min-width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

export const AmountInput = styled(FormInput)<{
  hasSubtext?: boolean;
  disabled: boolean;
}>`
  ${quoteTransition};

  padding-right: 0;
  margin-top: ${(props) => (props.hasSubtext ? "-0.375rem" : 0)};
  cursor: ${(props) => (props.disabled ? "inherit" : "text")};
  text-align: right;

  &:focus {
    outline: 0;

    &::placeholder {
      color: transparent;
    }
  }
`;

export const PlaceHolderBar = styled.div`
  width: 100%;
  height: 1.5rem;
  background-image: ${(props) => props.theme.colors.placeholderGradient};
  animation: ${fadeOut} 0.35s ease-in-out infinite alternate;
`;

export const TokenLogoLeft = styled(TokenLogo)`
  ${quoteTransition};
`;

export const TokenLogoRight = styled(TokenLogo)`
  ${quoteTransition};
`;

export const StyledSelector = styled.div`
  ${quoteTransition};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -0.125rem;
  margin-left: 0.9375rem;
  height: 100%;
`;

export const StyledSelectItem = styled(SelectItem)`
  ${fontTransition};
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  line-height: 1;
  gap: 0.375rem;
  color: ${(props) =>
    props.theme.name === "dark"
      ? props.theme.colors.white
      : props.theme.colors.primary};
`;

export const StyledLabel = styled(FormLabel)`
  ${fontTransition};
  text-align: left;
  text-transform: uppercase;
`;

export const SubText = styled.div`
  ${quoteTransition};

  line-height: 0.75;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.lightGrey};
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
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2px;
  background-color: ${(props) =>
    props.theme.name === "dark"
      ? props.theme.colors.darkGrey
      : props.theme.colors.primaryLight};
  overflow: hidden;

  &:first-of-type {
    margin-bottom: 0.5rem;
  }

  ${PlaceHolderBar} {
    ${(props) => (!props.$isLoading ? "animation: none" : "")};
  }

  ${TokenLogoLeft} {
    transform: ${(props) =>
      props.$isQuote ? "translateX(-3.6rem)" : "translateX(0)"};
  }

  ${StyledSelector} {
    transform: ${(props) =>
      props.$isQuote ? "translateX(-3.4rem)" : "translateX(0)"};
  }

  ${SubText},
  ${AmountInput},
  ${MaxButton},
  ${InfoLabel} {
    transform: ${(props) =>
      props.$isQuote ? "translateX(0)" : "translateX(2.75rem)"};
  }

  ${TokenLogoRight} {
    transform: ${(props) =>
      props.$isQuote ? "translateX(0)" : "translateX(3rem)"};
  }

  ${StyledLabel} {
    font-size: ${(props) => (props.$isQuote ? "0.625rem" : "0.75rem")};
  }

  ${StyledSelectItem} {
    font-size: ${(props) => (props.$isQuote ? "0.875rem" : "1.125rem")};
  }
`;

const fadeOutWhenInvisible = css<{ $invisible: boolean }>`
  transition: opacity ease-in-out 0.3s;
  will-change: opacity;
  opacity: ${(props) => (props.$invisible ? 0 : 1)};
`;

export const StyledSelectButtonContent = styled.span``;

export const StyledDownArrow = styled(MdKeyboardArrowDown)<{
  $invisible: boolean;
}>`
  ${fadeOutWhenInvisible}
`;

export const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;

  &:first-child ${PlaceHolderBar} {
    transform: scaleX(-100%);
    height: 0.875rem;
  }
`;
