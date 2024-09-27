import styled from "styled-components/macro";

import isActiveLanguageLogographic from "../../helpers/isActiveLanguageLogographic";
import { InputTextStyle } from "../../style/mixins";
import { fontWide } from "../../style/themes";
import Icon from "../Icon/Icon";
import { ScrollContainer } from "../Overlay/Overlay.styles";
import TextInput from "../TextInput/TextInput";
import { StyledInput } from "../TextInput/TextInput.styles";

export const StyledScrollContainer = styled(ScrollContainer)`
  position: relative;
  margin-block-start: 0.625rem;
  margin-inline-start: -0.875rem;
  width: calc(100% + 3.25rem);
  max-height: 20rem;
  padding-inline: 0.875rem 2.25rem;
  padding-block-start: 0.125rem;
  overflow-y: auto;
`;

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

export const TokenContainer = styled.div``;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 1.5rem;
  margin-block-start: 2rem;
`;

export const LegendItem = styled.div`
  word-break: keep-all;
  font-family: ${fontWide};
  font-weight: 500;
  font-size: ${() => (isActiveLanguageLogographic() ? "0.875rem" : "1rem")};
  color: ${(props) => props.theme.colors.lightGrey};
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

export const NoResultsContainer = styled.div`
  margin-block-start: 1rem;
  text-align: center;
`;
