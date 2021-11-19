import styled from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../style/mixins";
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
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  padding: 0 ${sizes.tradeContainerPadding} ${sizes.tradeContainerPadding};
  background-color: ${(props) => props.theme.colors.black};
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

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1.875rem;
  padding: ${sizes.tradeContainerPadding} ${sizes.tradeContainerPadding} 0;
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
    ${InputOrButtonBorderStyleType2};
    border-radius: 2px;
    line-height: 2.25;
    padding: 0.25rem 0.625rem;
    font-size: 1rem;
    font-weight: 400;
    background: transparent;
    color: ${(props) => props.theme.colors.white};

    &::placeholder {
      color: ${(props) => props.theme.colors.lightGrey};
    }

    &:focus {
      border-color: ${(props) => props.theme.colors.primary};
    }
  }
`;

export const TokenContainer = styled.div``;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  min-height: 1.5rem;
`;

export const LegendItem = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.625rem;
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
  font-size: 0.75rem;
`;

export const InformationIcon = styled(Icon)`
  display: inline;
  margin-left: 0.25rem;
`;

export const NoResultsContainer = styled.div`
  text-align: center;
`;
