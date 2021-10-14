import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  display: grid;
  grid-template-rows: 6rem;
  width: 16rem;
  height: 18rem;
  top: 6rem;
  right: 2rem;
  background-color: ${(props) => props.theme.colors.darkGrey};
  border: ${(props) => props.theme.colors.borderGrey} 1px solid;
  border-radius: 1rem;
  padding: 1rem;
  z-index: 1000;
`;

const ThemeContainer = styled.div`
  margin: 0.5rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 3rem;
`;

type ButtonStyleProps = {
  active: boolean;
};

const ThemeButton = styled.button<ButtonStyleProps>`
  border: ${(props) => props.theme.colors.borderGrey} 1px solid;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  background-color: ${(props) =>
    props.active ? props.theme.colors.borderGrey : "transparent"};
  color: ${(props) =>
    props.active ? props.theme.colors.white : props.theme.colors.lightGrey};
  line-height: 1.5rem;

  &:hover,
  &:focus {
    outline: 0;
    border-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.white};
  }
`;

const LocaleContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  height: auto;
  margin: 0.25rem 0;
  overflow-y: scroll;
`;

const LocaleButton = styled.button<ButtonStyleProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 0.25rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) =>
    props.active ? props.theme.colors.white : props.theme.colors.lightGrey};
  background-color: ${(props) =>
    props.active ? props.theme.colors.borderGrey : "transparent"};
  line-height: 1.5rem;

  &:hover,
  &:focus {
    outline: 0;
    border-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.white};
  }
`;

export {
  Container,
  ThemeContainer,
  ThemeButton,
  LocaleContainer,
  LocaleButton,
};
