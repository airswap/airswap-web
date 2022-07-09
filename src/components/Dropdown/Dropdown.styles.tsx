import styled from "styled-components";

// theme, fonts, and dimensions are currently hardcoded
// needs to take in a prop with the relevant dimensions from the parent

export const Item = styled.div`
  display: none;
  position: relative;
  text-align: center;
  height: 25px;
  width: 100px;
  padding-left: 5px;

  &.selected {
    display: flex;
    background-color: black;
    border: 1px solid grey;
    border-right: none;
    align-items: center;
  }
`;

export const Arrow = styled.div`
  position: relative;
  border: 1px solid grey;
  border-radius: 0 10px 10px 0;
  border-left: none;
  height: 25px;
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  align-items: center;
`;

export const Selector = styled.div`
  display: block;
  cursor: pointer;
  position: relative;
  width: fit-content;
  height: fit-content;
  border-radius: 5px;
  z-index: 1;

  &.show > ${Item} {
    display: flex;
    align-items: center;
    color: blue;
  }
`;

export const Wrapper = styled.div`
  font-size: 0.6rem;
  font-weight: bold;
  color: white;
`;

export const AbsoluteWrapper = styled.div`
  background-color: black;
  position: absolute;
  display: flex;
  height: 25px;

  & > .show {
    border: 1px solid grey;
    border-radius: 0 10px 10px 0;
  }

  &.show > ${Selector} {
    background-color: black;
    border-radius: 0 0 5px 5px;
    border: 1px solid grey;
    overflow: hidden;
  }

  &.show > ${Selector} > ${Item} {
    display: flex;
    align-items: center;
  }

  &.show > ${Selector} > .selected {
    border: none;
  }

  &.show > ${Selector} > .category {
    background: grey;
    border-bottom: 1px solid grey;
  }

  &.show > ${Arrow} > .icon {
    color: black;
  }

  &.show > ${Arrow} {
    padding-left: 4px;
    color: black;
  }
`;
