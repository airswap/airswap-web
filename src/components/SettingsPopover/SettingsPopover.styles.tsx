import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  display: grid;
  grid-template-rows: 5rem;
  width: 16rem;
  height: 17.25rem;
  top: 5.5rem;
  right: 0rem;
  color: ${(props) => props.theme.colors.darkSubText};
  background-color: ${(props) => props.theme.colors.darkGrey};
  border: ${(props) => props.theme.colors.borderGrey} 1px solid;
  border-radius: 0.5rem;
  padding: 1rem;
  z-index: 1000;
`;

export const ThemeContainer = styled.div`
  margin: 0.5rem 0 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 2.5rem;
`;

type ButtonStyleProps = {
  active: boolean;
};

export const ThemeButton = styled.button<ButtonStyleProps>`
  border: ${(props) => props.theme.colors.borderGrey} 1px solid;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) =>
    props.active ? props.theme.colors.white : props.theme.colors.darkSubText};
  background-color: ${(props) =>
    props.active ? props.theme.colors.borderGrey : "transparent"};
  line-height: 1.5rem;
  font-size: 0.875rem;

  &:hover,
  &:focus {
    outline: 0;
    background-color: ${(props) => props.theme.colors.borderGrey};
    color: ${(props) => props.theme.colors.white};
  }
`;

type LocaleContainerType = {
  overflow: boolean;
};

export const LocaleContainer = styled.div<LocaleContainerType>`
  flex-grow: 1;
  width: 100%;
  height: auto;
  margin: 0.5rem 0;
  overflow-y: ${(props) => (props.overflow ? "scroll" : "hidden")};

  flex-grow: 99;
  height: 100%;
  padding-bottom: 1rem;

  &::-webkit-scrollbar {
    width: 0.5rem;
    background: ${(props) => props.theme.colors.black};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.white};
    border-radius: 0.5rem;
  }
`;

export const LocaleButton = styled.button<ButtonStyleProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 0.5rem 0 0.5rem 1rem;
  border-radius: 1px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) =>
    props.active ? props.theme.colors.white : props.theme.colors.darkSubText};
  background-color: ${(props) =>
    props.active ? props.theme.colors.borderGrey : "transparent"};
  font-size: 0.875rem;

  &:hover,
  &:focus {
    outline: 0;
    border-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.white};
  }
`;
