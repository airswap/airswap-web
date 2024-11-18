import { MdKeyboardArrowDown } from "react-icons/md";

import styled, { css, keyframes } from "styled-components/macro";

import isActiveLanguageLogographic from "../../helpers/isActiveLanguageLogographic";
import breakPoints from "../../style/breakpoints";
import {
  BorderlessButtonStyle,
  InputOrButtonBorderStyle,
  TextEllipsis,
} from "../../style/mixins";
import { sizes } from "../../style/sizes";
import { fontWide } from "../../style/themes";
import AccountLink from "../AccountLink/AccountLink";
import TokenLogo from "../TokenLogo/TokenLogo";
import StyledTokenLogo from "../TokenLogo/TokenLogo.styles";
import { SelectItem, FormLabel, FormInput } from "../Typography/Typography";
import TokenSelectBackground from "./subcomponents/TokenSelectBackground/TokenSelectBackground";
import {
  TokenSelectLeftBorderBackground,
  TokenSelectLeftGradientBackground,
  TokenSelectRightBorderBackground,
  TokenSelectRightGradientBackground,
} from "./subcomponents/TokenSelectBackground/TokenSelectBackground.styles";

const fadeOut = keyframes`
  from {
    opacity: 0.5;
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
  position: relative;
  width: 40%;
  height: 3.125rem;
  cursor: ${(props) => (props.disabled ? "initial" : "pointer")};
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};

  &:focus {
    outline: 0;
  }

  @media ${breakPoints.phoneOnly} {
    height: 2.75rem;
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
  border-radius: 0.25rem;
  font-family: ${fontWide};
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  background-color: ${(props) => props.theme.colors.darkBlue};
  color: ${(props) => props.theme.colors.lightGrey};
  opacity: 1;

  ${BorderlessButtonStyle}

  &:hover,
  &:focus {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.white};
    opacity: 1;
  }
`;

export const MaxButton = styled.button`
  ${MaxButtonStyle};

  width: ${() => (isActiveLanguageLogographic() ? "1.75rem" : "auto")};
  font-size: ${() => (isActiveLanguageLogographic() ? "0.75rem" : "0.6875rem")};
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
  border-radius: 0.5rem;
  width: 65%;
  height: 1rem;
  background: ${(props) => props.theme.colors.placeholder};
  animation: ${fadeOut} 0.35s ease-in-out infinite alternate;
`;

export const TokenLogoLeft = styled(TokenLogo)`
  ${quoteTransition};

  min-width: 3.125rem;
  aspect-ratio: 1;

  @media ${breakPoints.phoneOnly} {
    min-width: 2.5rem;
  }
`;

export const TokenLogoRight = styled(TokenLogo)`
  ${quoteTransition};

  min-width: 3rem;
  aspect-ratio: 1;
`;

export const StyledSelector = styled.div`
  ${quoteTransition};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.125rem;
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
  font-family: ${fontWide};
  font-weight: 700;
  gap: 0.375rem;
  max-width: 9rem;
  color: ${(props) =>
    props.theme.name === "dark"
      ? props.theme.colors.white
      : props.theme.colors.primary};

  @media ${breakPoints.phoneOnly} {
    max-width: 7rem;
  }
`;

export const StyledLabel = styled(FormLabel)`
  ${fontTransition};
  text-align: left;
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
  isLoading: boolean;
  isQuote: boolean;
  isAmountFocused: boolean;
  isTokenFocused: boolean;
  showTokenContractLink: boolean;
}>`
  position: relative;
  width: 100%;
  height: 6.25rem;
  border-radius: 0.75rem;

  &:first-of-type {
    margin-bottom: ${sizes.widgetGutter};
  }

  @media ${breakPoints.phoneOnly} {
    height: 5.75rem;
  }

  ${TokenSelectRightGradientBackground}, ${TokenSelectRightBorderBackground} {
    opacity: ${(props) => (props.isAmountFocused ? 1 : 0)};
  }

  ${TokenSelectLeftGradientBackground}, ${TokenSelectLeftBorderBackground} {
    opacity: ${(props) => (props.isTokenFocused ? 1 : 0)};
  }

  ${PlaceHolderBar} {
    ${(props) => (!props.isLoading ? "animation: none" : "")};
  }

  ${ContainingButton} ${StyledTokenLogo} {
    ${(props) => (props.showTokenContractLink ? "visibility: hidden" : "")};
  }

  ${TokenLogoLeft} {
    transform: ${(props) =>
      props.isQuote ? "translateX(-4.625rem)" : "translateX(0)"};
  }

  ${StyledSelector} {
    transform: ${(props) =>
      props.isQuote ? "translateX(-3.4rem)" : "translateX(0)"};
  }

  ${SubText},
  ${AmountInput},
  ${MaxButton},
  ${InfoLabel} {
    transform: ${(props) =>
      props.isQuote ? "translateX(0)" : "translateX(3.75rem)"};
  }

  ${TokenLogoRight} {
    transform: ${(props) =>
      props.isQuote ? "translateX(0)" : "translateX(4.5rem)"};
  }
`;

export const StyledTokenSelectBackground = styled(TokenSelectBackground)`
  position: absolute;
  top: 0;
  left: 0;
`;

const fadeOutWhenInvisible = css<{ $invisible: boolean }>`
  transition: opacity ease-in-out 0.3s;
  will-change: opacity;
  opacity: ${(props) => (props.$invisible ? 0 : 1)};
`;

export const StyledSelectButtonContent = styled.span`
  ${TextEllipsis};

  width: calc(100% - 1.125rem);
`;

export const StyledDownArrow = styled(MdKeyboardArrowDown)<{
  $invisible: boolean;
}>`
  ${fadeOutWhenInvisible};

  translate: 0 3px;
`;

export const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  width: 50%;

  &:first-child ${PlaceHolderBar} {
    transform: scaleX(-100%);
    height: 0.875rem;
  }
`;

export const TokenAccountButton = styled(AccountLink)`
  ${InputOrButtonBorderStyle};

  border-radius: 50%;
  margin-right: 0.5rem;
  position: relative;
  min-width: 1.625rem;
  max-width: 1.625rem;
  min-height: 1.625rem;
  max-height: 1.625rem;
`;

export const TokenSelectOverflowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  padding-inline: 1.5rem;
  overflow: hidden;
`;
