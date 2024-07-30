import styled from "styled-components/macro";

import isActiveLanguageLogographic from "../../helpers/isActiveLanguageLogographic";
import breakPoints from "../../style/breakpoints";
import { InputTextStyle } from "../../style/mixins";
import { sizes } from "../../style/sizes";
import { fontWide } from "../../style/themes";
import Icon from "../Icon/Icon";
import { ScrollContainer } from "../Overlay/Overlay.styles";
import TextInput from "../TextInput/TextInput";
import { StyledInput } from "../TextInput/TextInput.styles";

export const StyledScrollContainer = styled(ScrollContainer)`
  position: relative;
  margin-block-start: 0.75rem;
  max-height: calc(100% - 9.5rem);
  overflow-y: ${(props) => (props.$overflow ? "scroll" : "hidden")};
`;

export const ContentContainer = styled.div`
  position: relative;
  height: 100%;
  padding: 0 ${sizes.tradeContainerPadding} ${sizes.tradeContainerPadding};

  @media ${breakPoints.phoneOnly} {
    padding: 0 1.5rem ${sizes.tradeContainerMobilePadding};
  }
`;

export const SizingContainer = styled.div`
  position: relative;
  height: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const SearchInput = styled(TextInput)`
  width: 100%;

  ${StyledInput} {
    ${InputTextStyle};

    border-radius: 0.75rem;
    background: transparent;
  }
`;

export const TokenContainer = styled.div``;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 1.5rem;
  margin-block-start: 1rem;
  padding-inline: 0.875rem 1.5rem;

  @media ${breakPoints.phoneOnly} {
    padding-inline-end: 1.75rem;
  }
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
  text-align: center;
`;
