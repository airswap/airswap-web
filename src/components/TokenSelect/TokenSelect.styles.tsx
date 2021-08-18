import { MdKeyboardArrowDown } from "react-icons/md";

import styled, { css } from "styled-components/macro";

import {
  SelectItem,
  FormLabel,
  FormInput,
  Metadata,
} from "../Typography/Typography";

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const AmountAndDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-align: right;
`;

export const TokenSelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 5rem;
  padding: 1.25em;
  margin-bottom: 0.625rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2px;
  background-color: ${(props) =>
    props.theme.name === "dark"
      ? props.theme.colors.darkGrey
      : props.theme.colors.alwaysWhite};
`;

const fadeOutWhenInvisible = css<{ invisible: boolean }>`
  transition: opacity ease-in-out 0.3s;
  will-change: opacity;
  opacity: ${(props) => (props.invisible ? 0 : 1)};
`;

export const StyledLabel = styled(FormLabel)<{ invisible: boolean }>`
  ${fadeOutWhenInvisible}
`;

export const StyledSelectButtonContent = styled.span<{ emphasize: boolean }>`
  transition: transform ease-in-out 0.3s;
  will-change: transform;
  transform: ${(props) =>
    props.emphasize
      ? "translateY(-0.625rem) scale(1.111111)"
      : "translateY(0) scale(1)"};
`;

export const StyledDownArrow = styled(MdKeyboardArrowDown)<{
  invisible: boolean;
}>`
  ${fadeOutWhenInvisible}
`;

export const StyledSelectButton = styled.button`
  display: flex;
  flex-direction: column;
  margin-left: 0.9375rem;
  cursor: ${(props) => (props.disabled ? "initial" : "pointer")};
`;

export const StyledSelectItem = styled(SelectItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

export const AmountInput = styled(FormInput)<{ hasSubtext: boolean }>`
  padding-right: 0;
  margin-top: ${(props) => (props.hasSubtext ? "-0.75rem" : 0)};
  text-align: right;
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

export const PlaceholderTop = styled.div`
  height: 1.25rem;
  width: 100%;
  background-image: ${(props) => props.theme.colors.placeholderGradient};
`;

export const PlaceholderBottom = styled.div`
  height: 0.9375rem;
  width: 75%;
  background-image: ${(props) => props.theme.colors.placeholderGradient};
`;
