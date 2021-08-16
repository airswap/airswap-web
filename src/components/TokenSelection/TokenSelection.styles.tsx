import styled from "styled-components/macro";

import convertHexToRGBA from "../../helpers/transformHexToRgba";
import { sizes } from "../../style/sizes";
import Icon from "../Icon/Icon";
import IconButton from "../IconButton/IconButton";
import TextInput from "../TextInput/TextInput";
import { StyledInput } from "../TextInput/TextInput.styles";

type ContainerProps = {
  $overflow: boolean;
};

export const ScrollContainer = styled.div`
  flex-grow: 99;
  padding-bottom: ${sizes.tradeContainerPadding};

  &::-webkit-scrollbar {
    width: 0.5rem;
    background: ${(props) => props.theme.colors.black};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.white};
    border-radius: 0.5rem;
  }
`;

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: ${sizes.tradeContainerPadding} ${sizes.tradeContainerPadding} 0;
  background-color: ${(props) => props.theme.colors.black};

  ${ScrollContainer} {
    width: calc(100% + (${sizes.tradeContainerPadding} / 2));
    padding-right: calc(${sizes.tradeContainerPadding} / 2);
    overflow-x: hidden;
    overflow-y: ${(props) => (props.$overflow ? "scroll" : "hidden")};
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1.875rem;
`;

export const CloseButton = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};

  &:hover {
    border-color: ${(props) => convertHexToRGBA(props.theme.colors.white, 0.5)};
  }
`;

export const StyledLabel = styled.label`
  font-size: 1rem;
`;

export const SearchInput = styled(TextInput)`
  margin-bottom: 1.25rem;
  width: 100%;

  ${StyledInput} {
    border: 1px solid ${(props) => props.theme.colors.borderGrey};
    border-radius: 2px;
    line-height: 2.25;
    padding: 0.25rem 0.625rem;
    font-size: 0.875rem;
    background: transparent;
    color: #9e9e9e;

    &:focus {
      outline: none;
      border: 1px solid ${(props) => props.theme.colors.primary};
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
  background: ${(props) => props.theme.colors.borderGrey};
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
