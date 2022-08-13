import styled from "styled-components/macro";

import isActiveLanguageLogographic from "../../helpers/isActiveLanguageLogographic";
import breakPoints from "../../style/breakpoints";
import { InputTextStyle } from "../../style/mixins";
import { sizes } from "../../style/sizes";
import Icon from "../Icon/Icon";
import { ScrollContainer } from "../Overlay/Overlay.styles";
import TextInput from "../TextInput/TextInput";
import { StyledInput } from "../TextInput/TextInput.styles";
import { Title } from "../Typography/Typography";

export const StyledScrollContainer = styled(ScrollContainer)`
  max-height: calc(100% - 7rem);
  overflow-y: ${(props) => (props.$overflow ? "scroll" : "hidden")};
`;

export const ContentContainer = styled.div`
  position: relative;
  height: 100%;
  padding: 0 ${sizes.tradeContainerPadding} ${sizes.tradeContainerPadding};
  background-color: ${(props) => props.theme.colors.black};

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

export const StyledTitle = styled(Title)`
  visibility: hidden;
`;

export const StyledLabel = styled.label`
  font-size: 1rem;
`;

export const SearchInput = styled(TextInput)`
  margin-bottom: 1.25rem;
  width: 100%;
  background-color: ${(props) => props.theme.colors.black};

  ${StyledInput} {
    ${InputTextStyle};

    border-radius: 2px;
    background: transparent;
  }
`;

export const TokenContainer = styled.div``;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  min-height: 1.5rem;
`;

export const LegendItem = styled.div`
  word-break: keep-all;
  text-transform: uppercase;
  font-weight: 700;
  font-size: ${() => (isActiveLanguageLogographic() ? "0.875rem" : "0.625rem")};
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const LegendDivider = styled.div`
  margin: 0 1rem;
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.borderGrey};
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
