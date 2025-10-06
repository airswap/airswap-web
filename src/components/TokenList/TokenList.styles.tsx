import styled from "styled-components/macro";

import isActiveLanguageLogographic from "../../helpers/isActiveLanguageLogographic";
import { InputTextStyle } from "../../style/mixins";
import Icon from "../Icon/Icon";
import TextInput from "../TextInput/TextInput";
import { StyledInput } from "../TextInput/TextInput.styles";

export const ContentContainer = styled.div`
  position: relative;
  height: 100%;
  padding-block-end: 2rem;
`;

export const SizingContainer = styled.div`
  position: relative;
  height: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-block-start: 2rem;
  width: 100%;
  height: 100%;
  max-height: calc(100% - 5.75rem);
`;

export const SearchInput = styled(TextInput)`
  width: 100%;

  ${StyledInput} {
    ${InputTextStyle};

    border-radius: 0.5rem;
    padding-inline: 1.25rem;
    line-height: 3;
    font-size: 1.25rem;
    height: 3.5rem;
    background: transparent;
  }
`;

export const InactiveTitleContainer = styled.div`
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2px;
  background: transparent;
  color: #9e9e9e;
  padding: 1rem;
  font-size: 0.75rem;
  margin: 1rem 0;
`;

export const InactiveTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: ${() => (isActiveLanguageLogographic() ? "0.875rem" : "0.75rem")};
`;

export const InformationIcon = styled(Icon)`
  display: inline;
  margin-left: 0.25rem;
`;

export const TokensContainer = styled.div``;

export const ImportButton = styled.button`
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  justify-self: center;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};

  &:hover:not(:disabled) {
    background: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.white : theme.colors.primary};
    color: ${(props) => props.theme.colors.black};
    transition: 0.25s ease-in-out;
  }
`;
